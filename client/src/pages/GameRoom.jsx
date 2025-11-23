import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import ColorThief from "colorthief";
import Navbar from "../components/common/Navbar";


const GameRoom = () => {
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [guess, setGuess] = useState("");
  const [chat, setChat] = useState([]);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hintRevealed, setHintRevealed] = useState({
    movie: false,
    composer: false,
    cover: false,
    aiHint: "",
  });
  const [players, setPlayers] = useState([]);
  const [voteCounts, setVoteCounts] = useState({
    movie: 0,
    composer: 0,
    ai: 0,
  });
  const [_loadingNext, setLoadingNext] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hintsUsed, setHintsUsed] = useState({
    movie: false,
    composer: false,
    ai: false,
  });
  const [_currentSongDetails, setCurrentSongDetails] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isFirstRound, setIsFirstRound] = useState(true);

  const audioRef = useRef(null);
  const blobCanvasRef = useRef(null);
  const blobsRef = useRef([]);
  const animationRef = useRef(null);
  const targetColorsRef = useRef([
    [255, 251, 0],
    [78, 78, 78],
    [40, 40, 40],
    [255, 200, 0],
  ]);
  const currentColorsRef = useRef([
    [255, 251, 0],
    [78, 78, 78],
    [40, 40, 40],
    [255, 200, 0],
  ]);
  const chatEndRef = useRef(null);
  const gameStartedRef = useRef(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const room = JSON.parse(localStorage.getItem("room"));
  const roomCode = room?.code;

  class Blob {
    constructor(x, y, radius, colorIndex, speed, drift) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.colorIndex = colorIndex;
      this.speed = speed;
      this.angle = Math.random() * Math.PI * 2;
      this.drift = drift;
      this.alpha = 0.7 + Math.random() * 0.3;
    }

    update(canvas) {
      this.angle += this.drift;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      if (this.x < -this.radius) this.x = canvas.width + this.radius;
      if (this.x > canvas.width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = canvas.height + this.radius;
      if (this.y > canvas.height + this.radius) this.y = -this.radius;
    }

    draw(ctx) {
      const [r, g, b] =
        currentColorsRef.current[
          this.colorIndex % currentColorsRef.current.length
        ];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initBlobCanvas = useCallback(() => {
    const canvas = blobCanvasRef.current;
    if (!canvas) return () => {};

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();

    const generateBlobs = () => {
      if (blobsRef.current.length > 0) return;

      const blobCount = 65 + Math.floor(Math.random() * 16);

      for (let i = 0; i < blobCount; i++) {
        blobsRef.current.push(
          new Blob(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20 + Math.random() * 100,
            i % targetColorsRef.current.length,
            0.3 + Math.random() * 0.7,
            (Math.random() - 0.5) * 0.02
          )
        );
      }
    };

    const updateColors = () => {
      if (!currentColorsRef.current || !targetColorsRef.current) return;
      
      for (let i = 0; i < currentColorsRef.current.length; i++) {
        if (!currentColorsRef.current[i] || !targetColorsRef.current[i]) continue;
        
        for (let j = 0; j < 3; j++) {
          currentColorsRef.current[i][j] +=
            (targetColorsRef.current[i][j] - currentColorsRef.current[i][j]) *
            0.1;
          if (
            Math.abs(
              currentColorsRef.current[i][j] - targetColorsRef.current[i][j]
            ) < 1
          ) {
            currentColorsRef.current[i][j] = targetColorsRef.current[i][j];
          }
        }
      }
    };

    const animate = () => {
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateColors();
      blobsRef.current.forEach((blob) => {
        blob.update(canvas);
        blob.draw(ctx);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      blobsRef.current.forEach((blob) => {
        blob.x = Math.max(
          blob.radius,
          Math.min(canvas.width - blob.radius, blob.x)
        );
        blob.y = Math.max(
          blob.radius,
          Math.min(canvas.height - blob.radius, blob.y)
        );
      });
    };

    generateBlobs();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractAlbumColors = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 4);
        targetColorsRef.current = palette;
      } catch (err) {
        console.error("Color extraction failed:", err);
      }
    };

    img.onerror = () => {
      console.error("Failed to load album image");
    };
  };

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [chat]);

  const handlePlayFirstSong = () => {
    if (audioRef.current && song) {
      audioRef.current.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=0&end=${timer}`;
      setShowPlayButton(false);
      setIsFirstRound(false);
    }
  };

  useEffect(() => {
    const cleanupBlobCanvas = initBlobCanvas();

    socket.on("start-round", ({ song, round, duration, players }) => {
      setSong(song);
      setCurrentSongDetails(song);
      setRound(round);
      setTimer(duration);
      setChat([]);
      setHintRevealed({
        movie: false,
        composer: false,
        cover: false,
        aiHint: "",
      });
      setVoteCounts({ movie: 0, composer: 0, ai: 0 });
      setPlayers(players || []);
      setLoadingNext(false);
      setCorrectGuess(false);
      setRoundEnded(false);
      setCountdown(3);

      if (isFirstRound) {
        setShowPlayButton(true);
      }

      if (song.cover) {
        extractAlbumColors(song.cover);
      }

      if (!gameStartedRef.current) {
        gameStartedRef.current = true;
      }
    });

    socket.on("preload-next-song", ({ song, duration }) => {
      if (audioRef.current) {
        audioRef.current.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=0&end=${duration+3}`;
      }
    });

    socket.on("room-updated", ({ players, hintsUsed: serverHintsUsed }) => {
      setPlayers(players);
      if (serverHintsUsed) {
        setHintsUsed(serverHintsUsed);
      }
    });

    socket.on("new-guess", ({ user, text, correct }) => {
      setChat((prev) => [...prev, { user, text, correct }]);
    });

    socket.on("correct-guess", ({ user: guesser }) => {
      const isCurrentUser = guesser.uid === user.uid;
      const guesserName = guesser.name || guesser.displayName || 'Someone';
      setChat((prev) => [
        ...prev,
        { system: true, type: "crct-guess", text: `✅ ${guesserName} guessed it right!` },
      ]);

      if (isCurrentUser) {
        setCorrectGuess(true);
        setHintRevealed((prev) => ({
          ...prev,
          movie: true,
          composer: true,
          cover: true,
        }));
      }
    });

    socket.on("reveal-hint", ({ hintType, aiHint }) => {
      if (hintType === "movie") {
        setHintRevealed((prev) => ({
          ...prev,
          movie: true,
          cover: true,
        }));
        setHintsUsed((prev) => ({ ...prev, movie: true }));
      } else if (hintType === "composer") {
        setHintRevealed((prev) => ({
          ...prev,
          composer: true,
        }));
        setHintsUsed((prev) => ({ ...prev, composer: true }));
      } else if (hintType === "ai" && aiHint) {
        setHintRevealed((prev) => ({
          ...prev,
          aiHint,
        }));
        setHintsUsed((prev) => ({ ...prev, ai: true }));
        setChat((prev) => [
          ...prev,
          {
            system: true,
            type: "ai-hint",
            text: (
              <span className="flex items-center gap-1">
                <img
                  src="/AI-p.png"
                  alt="AI"
                  className="w-4 h-4 inline-block"
                />
                <span>IS.AI: {aiHint}</span>
              </span>
            ),
          },
        ]);        
      }
    });

    socket.on("hint-vote-count", ({ hintType, votes }) => {
      setVoteCounts((prev) => ({ ...prev, [hintType]: votes }));
    });

    socket.on("game-over", ({ leaderboard }) => {
      setGameOver(true);
      setLeaderboard(leaderboard);
    });

    socket.on("loading-next-round", () => {
      setLoadingNext(true);
    });

    socket.on("round-ended", () => {
      setRoundEnded(true);
      setHintRevealed((prev) => ({
        ...prev,
        movie: true,
        composer: true,
        cover: true,
      }));

      let counter = 3;
      setCountdown(counter);
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    });

    return () => {
      socket.off("start-round");
      socket.off("room-updated");
      socket.off("new-guess");
      socket.off("correct-guess");
      socket.off("reveal-hint");
      socket.off("hint-vote-count");
      socket.off("game-over");
      socket.off("loading-next-round");
      socket.off("round-ended");
      socket.emit("leave-room", { roomCode, user });
      cleanupBlobCanvas();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, user, isFirstRound]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !roundEnded) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, roundEnded]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() && !correctGuess && !roundEnded) {
      socket.emit("submit-guess", {
        roomCode,
        user,
        text: guess.trim(),
      });
      setGuess("");
    }
  };

  const handleVote = (type) => {
    if (!hintsUsed[type] && !roundEnded) {
      socket.emit("vote-hint", { roomCode, uid: user.uid, hintType: type });
    }
  };

  const LoadingOverlay = ({ text = "Starting Game..." }) => {
    const [movingBlobs, setMovingBlobs] = useState([]);
    const rafRef = useRef(null);

    useEffect(() => {
      const blobs = [];
      const numBlobs = Math.floor(Math.random() * 70) + 20;
      for (let i = 0; i < numBlobs; i++) {
        const size = Math.random() * 160 + 180;
        const speedX = (Math.random() * 2 - 1) * 6.5;
        const speedY = (Math.random() * 2 - 1) * 6.5;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.05 + 0.07;
        blobs.push({ id: i, size, x, y, speedX, speedY, opacity, color: "#FFFB00" });
      }
      setMovingBlobs(blobs);

      const animate = () => {
        setMovingBlobs((prev) =>
          prev.map((b) => {
            let x = b.x + b.speedX;
            let y = b.y + b.speedY;
            if (x < 0 || x > window.innerWidth - b.size) b.speedX *= -1, (x = b.x + b.speedX);
            if (y < 0 || y > window.innerHeight - b.size) b.speedY *= -1, (y = b.y + b.speedY);
            return { ...b, x, y };
          })
        );
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
      return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }, []);

    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-silkscreen relative overflow-hidden">
        {movingBlobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              left: `${blob.x}px`,
              top: `${blob.y}px`,
              backgroundColor: blob.color,
              opacity: blob.opacity,
            }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#FFFB00] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-white">{text}</h2>
        </div>
      </div>
    );
  };

  if (!song) {
    return <LoadingOverlay text="Starting Game..." />;
  }

  if (gameOver) {
    return (
      <div className="h-screen bg-black text-white relative overflow-hidden">
        {/* Retro Grid Background */}
        <div className="absolute inset-0">
          <div className="retro-grid"></div>
        </div>
        
        <Navbar />

        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-4rem)] px-4">
          <h1 className="text-4xl font-silkscreen mb-8 text-[#FFFB00] tracking-[0.3em]">GAME OVER!</h1>

          <div className="border-2 border-[#FFFB00] p-8 bg-transparent w-full max-w-md">
            <h2 className="text-xl mb-6 text-[#FFFB00] font-silkscreen text-center tracking-[0.2em]">
              FINAL LEADERBOARD
            </h2>
            
            <div className="space-y-3">
              {leaderboard.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFFB00] rounded-full flex items-center justify-center text-black font-bold font-silkscreen text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <span className={`font-silkscreen text-base tracking-wide ${p.uid === user.uid ? "text-[#FFFB00]" : "text-white"}`}>
                        {(p.name || p.displayName || 'Player').toUpperCase()}
                      </span>
                      {p.uid === user.uid && (
                        <div className="text-xs text-[#FFFB00] font-silkscreen tracking-wide">(YOU)</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FFFB00] font-bold text-lg font-silkscreen">{p.score}</div>
                    <div className="text-xs text-gray-400 font-silkscreen">POINTS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-6">
            <button
              onClick={() => navigate('/landing')}
              className="border-2 border-[#FFFB00] text-[#FFFB00] font-bold py-3 px-6 hover:bg-[#FFFB00] hover:text-black transition-all duration-300 font-silkscreen tracking-[0.1em] text-sm hover:scale-105"
            >
              GO TO HOME
            </button>
            <button
              onClick={() => navigate('/create-room')}
              className="bg-[#FFFB00] text-black font-bold py-3 px-6 hover:bg-yellow-300 transition-all duration-300 font-silkscreen tracking-[0.1em] text-sm hover:scale-105"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>

        <style jsx>{`
          .retro-grid {
            background-image: 
              linear-gradient(rgba(136, 134, 9, 0.05) 1px, transparent 25px),
              linear-gradient(90deg, rgba(255, 251, 0, 0.05) 1px, transparent 25px);
            background-size: 40px 40px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            animation: grid-move 30s linear infinite;
          }
          
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white pt-5.5 flex overflow-hidden font-montserrat">
      <div className="w-1/4 h-full mr-0.5 ml-2 mt-3 mb-3 leaderboard-container p-6 flex flex-col rounded-[20px] shadow-2xl overflow-hidden">
        <div className="mb-8">
          <h2 className="font-silkscreen text-[#FFFB00] text-xl mb-4 glow-yellow flex items-center gap-2">
            LEADERBOARD 
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
            {players
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((p, i) => (
                <div
                  key={p.uid}
                  className="leaderboard-item p-4 rounded-lg relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FFFB00] to-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {i + 1}
                        </div>
                        {i < 3 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3">
                            {i === 0 && <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>}
                            {i === 1 && <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                            {i === 2 && <div className="w-3 h-3 bg-orange-600 rounded-full"></div>}
                          </div>
                        )}
                      </div>
                      <span
                        className={`font-silkscreen text-sm ${
                          p.uid === user.uid ? "text-[#FFFB00] font-bold" : "text-white"
                        }`}
                      >
                        {p.name || p.displayName || 'Player'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFFB00] font-bold text-lg">
                        {p.score || 0}
                      </span>
                      <span className="text-xs text-gray-400">pts</span>
                    </div>
                  </div>
                  {p.uid === user.uid && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFFB00] to-[#FFD700] rounded-r"></div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center space-x-2 pl-3 mb-4">
            <img src="/AI.png" alt="AI Icon" className="w-8 h-8" />
            <h2 className="font-silkscreen text-[#FFFB00] text-xl glow-yellow">
              IS.AI
            </h2>
          </div>

          <div className="space-y-3 leaderboard-container p-4 rounded-lg shadow-inner">
            {["movie", "composer", "ai"].map((type) => {
              const icons = {
                movie: "/film.png",
                composer: "/music.png",
                ai: "/AI.png",
              };
              const labels = {
                movie: "REVEAL MOVIE NAME",
                composer: "REVEAL ARTIST NAME",
                ai: "ASK AI FOR HINT",
              };

              return (
                <button
                  key={type}
                  onClick={() => handleVote(type)}
                  disabled={hintsUsed[type] || roundEnded}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 font-medium ${
                    voteCounts[type] > 0
                      ? "bg-[#FFFB00] text-black font-bold"
                      : hintsUsed[type] || roundEnded
                      ? "bg-gray-700 cursor-not-allowed opacity-50 text-gray-400"
                      : "leaderboard-item hover:shadow-lg text-white hover:text-[#FFFB00]"
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <img
                      src={icons[type]}
                      alt={`${type} icon`}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{labels[type]}</span>
                  </span>
                  {voteCounts[type] > 0 && (
                    <span className="text-xs px-2 py-1 bg-black text-[#FFFB00] rounded-full font-bold border border-[#FFFB00]">
                      {voteCounts[type]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-2/4 h-full mr-2.5 ml-2.5 mt-3 mb-3 flex flex-col rounded-[20px] items-center justify-center relative overflow-hidden">
        <canvas
          ref={blobCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-0 opacity-70 mix-blend-screen"
          style={{ filter: "blur(90px)" }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          {showPlayButton && (
<div className="absolute inset-0 flex items-center justify-center z-20">
  <button
    onClick={handlePlayFirstSong}
    className="mt-[40px] bg-[#FFFB00] hover:bg-[#FFFB00CC] text-black px-4 py-2 rounded-md text-[10px] font-bold shadow-[0_0_10px_3px_rgba(255,251,0,0.4)] transition-all"
  >
    PLAY SONG
  </button>
</div>
)}

          <div className="bg-[#000000AA]/45 px-6 py-2 rounded-md mb-6">
            <h2 className="text-[#FFFB00] text-xl font-bold">
              {roundEnded
                ? `Round Over - Next in ${countdown}s`
                : `Round ${round} - ${timer}s left`}
            </h2>
          </div>


<div
  className={`bg-[#2D2D2D]/45 p-4 rounded-lg mb-5 transition-all duration-500 text-center ${
    roundEnded ? "" : "filter blur-md"
  }`}
>
  <div className="flex justify-center items-center space-x-2 text-[#FFFB00]">
    <img src="/film.png" alt="Movie" className="w-4 h-4" />
    <span>
      {roundEnded ? `${song.song}` : "Hidden"}
      {/* {roundEnded && (
        <span className="text-white italic">{song.movie}</span>
      )} */}
    </span>
  </div>
</div>

          <div className="relative mb-8 group">
            <div
              className={`absolute inset-0 transition-all rounded-md duration-500 ${
                hintRevealed.cover ? "opacity-0" : "opacity-100 blur-xl"
              }`}
            >
              <img
                src={song?.cover || "/logo.png"}
                className="w-[180px] h-[180px] object-cover grayscale"
                alt="Blurred cover"
              />
            </div>
            <img
              src={song?.cover || "/logo.png"}
              alt="Album cover"
              crossOrigin="anonymous"
              className={`w-[180px] h-[180px] object-cover shadow-2xl rounded-md transition-all duration-500 ${
                hintRevealed.cover ? "grayscale-0 blur-0" : "grayscale blur-md"
              }`}
            />
            <div className="absolute inset-0 border-2 border-white rounded-md opacity-60 pointer-events-none" />
          </div>

          <div className="w-full max-w-md space-y-3">
            <div
              className={`bg-[#2D2D2D]/45 p-4 rounded-lg transition-all duration-500 ${
                hintRevealed.movie ? "" : "filter blur-md"
              }`}
            >
              <div className="flex items-center space-x-2 text-[#FFFB00]">
                <img src="/film.png" alt="Movie" className="w-4 h-4" />
<span>
  {hintRevealed.movie
    ? song.movie
        .replace(/\s*[--]?\s*\(.*?(original motion picture soundtrack|ost|from.*?)\)/gi, "") // remove entire (Original Motion Picture Soundtrack)
        .replace(/\s*[--]?\s*(original motion picture soundtrack|ost|from.*)/gi, "") // fallback for non-parentheses versions
        .replace(/\s*\)+$/, "") // remove leftover closing parenthesis
        .trim()
    : "Hidden"}
</span>


              </div>
            </div>

            <div
              className={`bg-[#2D2D2D]/45 p-4 rounded-lg transition-all duration-500 ${
                hintRevealed.composer ? "" : "filter blur-md"
              }`}
            >
              <div className="flex items-center space-x-2 text-white">
                <img src="/music.png" alt="Composer" className="w-4 h-4" />
                <span>{hintRevealed.composer ? song?.composer : "Hidden"}</span>
              </div>
            </div>
            {hintRevealed.aiHint && (
              <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-400/30">
                <div className="flex items-center space-x-2 text-purple-300 italic text-sm">
                  <img src="/AI-p.png" alt="AI Hint" className="w-4 h-4" />
                  <span>{hintRevealed.aiHint}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-1/4 h-full mr-2 ml-0.5 mt-3 mb-3 leaderboard-container p-6 flex flex-col rounded-[20px] shadow-2xl overflow-hidden">
        <h2 className="font-silkscreen text-[#FFFB00] text-xl mb-4 border-b border-[#FFFB00] border-opacity-30 pb-2 glow-yellow flex items-center gap-2">
          GUESS — BOX
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar">
          {chat.map((message, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg transition-all duration-300 ${
                message.system
                ? message.type === "crct-guess"
                  ? "text-green-300 font-bold border border-green-400 bg-green-900 bg-opacity-40 shadow-lg animate-pulse"             
                    : message.type === "ai-hint"
                    ? "text-purple-300 italic leaderboard-item border-purple-400"
                    : "text-gray-400 italic bg-gray-800 bg-opacity-50"
                  : message.correct
                  ? "text-green-300 font-bold leaderboard-item border-green-400 bg-green-900 bg-opacity-20"
                  : "leaderboard-item text-white"
              }`}
            >
              {message.system
                ? message.text
                : (
                  <span>
                    <span className="font-silkscreen text-[#FFFB00]">{message.user?.name || message.user?.displayName || 'Player'}:</span>
                    <span className="ml-2">{message.text}</span>
                  </span>
                )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleGuessSubmit} className="mt-auto">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={correctGuess ? "✅ Correct!" : "Guess the song..."}
            disabled={correctGuess || roundEnded}
            className="w-full bg-black bg-opacity-50 text-white px-4 py-3 rounded-xl border-2 border-[#FFFB00] border-opacity-60 mb-3 focus:outline-none focus:border-[#FFFB00] focus:border-opacity-100 focus:shadow-lg transition-all backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={correctGuess || roundEnded}
            className={`w-full bg-[#FFFB00] text-black font-bold py-3 rounded-xl transition-all font-silkscreen ${
              correctGuess || roundEnded
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-300 hover:shadow-lg hover:scale-105"
            }`}
          >
            {correctGuess ? "GUESSED!" : "SUBMIT"}
          </button>
        </form>
      </div>
      
      {/* Hidden iframe for audio playback */}
      <iframe
        ref={audioRef}
        width="0"
        height="0"
        src="/logo.png"
        style={{ display: 'none' }}
        allow="autoplay"
      />
    </div>
  );
};

export default GameRoom;