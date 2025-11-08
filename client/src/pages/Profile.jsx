import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

const Profile = () => {
  const _audioRef = useRef(null);
  const { user, isGuest, guestName, guestAvatar } = useContext(AuthContext);

  // Get user data from localStorage as fallback
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const userName = localStorage.getItem("userName");

  // Music Player State
  const [currentTrack, setCurrentTrack] = useState({
    name: "Loading...",
    artist: "Please wait",
    movie: "",
    videoId: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoplayEnabled, _setAutoplayEnabled] = useState(true);

  const languages = [
    { code: "all", label: "All Songs" },
    { code: "hindi", label: "Hindi" },
    { code: "english", label: "English" },
    { code: "tamil", label: "Tamil" },
    { code: "korean", label: "K-Pop" },
    { code: "spanish", label: "Spanish" }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const _playerStats = {
    stat1: "24",
    stat2: "89%", 
    stat3: "156",
    stat4: "1.5m"
  };

  // Fetch random track from database
  const fetchRandomTrack = useCallback(async (language = selectedLanguage, shouldAutoplay = autoplayEnabled) => {
    setIsLoading(true);
    try {
      console.log('Fetching random song from database...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/song/random`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched song from database:', data.song);
        
        if (data.song) {
          setCurrentTrack({
            name: data.song.song,
            artist: data.song.composer || "Unknown Artist",
            movie: data.song.movie || "",
            videoId: data.song.videoId
          });
          console.log('Set track with videoId:', data.song.videoId);
          
          // Auto-start playing if requested
          if (shouldAutoplay) {
            setTimeout(() => {
              const iframe = document.getElementById('youtube-player');
              if (iframe && data.song.videoId) {
                iframe.src = `https://www.youtube.com/embed/${data.song.videoId}?autoplay=1&enablejsapi=1`;
                setIsPlaying(true);
              }
            }, 500);
          }
          return; // Exit early if we successfully got a song from database
        }
      } else {
        console.log('No songs in database, using demo tracks');
      }
      
    } catch (error) {
      console.log('Database fetch failed, using demo tracks:', error.message);
    }
      
    // Fallback with demo tracks organized by language - All tested and working
      const demoTracksByLanguage = {
        all: [
          { name: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2", videoId: "Umqb9KENgmk" },
          { name: "Shape of You", artist: "Ed Sheeran", movie: "Single", videoId: "JGwWNGJdvx8" },
          { name: "Despacito", artist: "Luis Fonsi", movie: "Single", videoId: "kJQP7kiw5Fk" },
          { name: "Channa Mereya", artist: "Arijit Singh", movie: "Ae Dil Hai Mushkil", videoId: "bzSTpdcs-EI" },
          { name: "Rowdy Baby", artist: "Dhanush", movie: "Maari 2", videoId: "x6Q7c9RyMzk" },
        ],
        hindi: [
          { name: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2", videoId: "Umqb9KENgmk" },
          { name: "Channa Mereya", artist: "Arijit Singh", movie: "Ae Dil Hai Mushkil", videoId: "bzSTpdcs-EI" },
          { name: "Bekhayali", artist: "Sachet Tandon", movie: "Kabir Singh", videoId: "VOLKJJvfAbg" },
          { name: "Dil Diyan Gallan", artist: "Atif Aslam", movie: "Tiger Zinda Hai", videoId: "SAcpESN_Fk4" }
          
       
        ],
        english: [
          { name: "Shape of You", artist: "Ed Sheeran", movie: "Single", videoId: "JGwWNGJdvx8" },
          { name: "Blinding Lights", artist: "The Weeknd", movie: "Single", videoId: "4NRXx6U8ABQ" },
          { name: "Perfect", artist: "Ed Sheeran", movie: "Single", videoId: "2Vv-BfVoq4g" },
          { name: "Someone You Loved", artist: "Lewis Capaldi", movie: "Single", videoId: "zABLecsR5UE" },
          { name: "Bad Habits", artist: "Ed Sheeran", movie: "Single", videoId: "orJSJGHjBLI" },
          { name: "Watermelon Sugar", artist: "Harry Styles", movie: "Single", videoId: "E07s5ZYygMg" }
        ],
        tamil: [
          { name: "Rowdy Baby", artist: "Dhanush", movie: "Maari 2", videoId: "x6Q7c9RyMzk" },
          { name: "Enjoy Enjaami", artist: "Dhee", movie: "Single", videoId: "eYq7WapuDLU" },
          { name: "Kolaveri Di", artist: "Dhanush", movie: "3", videoId: "YR12Z8f1Dh8" }
        ],
    
        korean: [
          { name: "Dynamite", artist: "BTS", movie: "Single", videoId: "gdZLi9oWNZg" },
          { name: "Gangnam Style", artist: "PSY", movie: "Single", videoId: "9bZkp7q19f0" },
          { name: "How You Like That", artist: "BLACKPINK", movie: "Single", videoId: "ioNng23DkIM" },
          { name: "DNA", artist: "BTS", movie: "Single", videoId: "MBdVXkSdhwU" },
          { name: "Kill This Love", artist: "BLACKPINK", movie: "Single", videoId: "2S24-y0Ij3Y" },
          { name: "Butter", artist: "BTS", movie: "Single", videoId: "WMweEpGlu_U" }
        ],
        spanish: [
          { name: "Despacito", artist: "Luis Fonsi", movie: "Single", videoId: "kJQP7kiw5Fk" },
          { name: "Macarena", artist: "Los Del Rio", movie: "Single", videoId: "zWaymcVmJ-A" },
          { name: "Bailando", artist: "Enrique Iglesias", movie: "Single", videoId: "NUsoVlDFqZg" },
          { name: "Havana", artist: "Camila Cabello", movie: "Single", videoId: "HCjNJDNzw8Y" },
          { name: "Con Altura", artist: "Rosalia", movie: "Single", videoId: "p7bfOZek9t4" },
          { name: "La Tortura", artist: "Shakira", movie: "Single", videoId: "DkFJE8ZdeG8" }
        ]
      };
      
      const selectedTracks = demoTracksByLanguage[language] || demoTracksByLanguage.hindi;
      const randomDemo = selectedTracks[Math.floor(Math.random() * selectedTracks.length)];
      setCurrentTrack(randomDemo);
      console.log(`Using ${language} demo track:`, randomDemo.name);
      
      // Auto-start playing if requested
      if (shouldAutoplay) {
        setTimeout(() => {
          const iframe = document.getElementById('youtube-player');
          if (iframe && randomDemo.videoId) {
            iframe.src = `https://www.youtube.com/embed/${randomDemo.videoId}?autoplay=1&enablejsapi=1`;
            setIsPlaying(true);
          }
        }, 500);
      }
    
    setIsLoading(false);
  }, [selectedLanguage, autoplayEnabled]);

  // Audio controls using YouTube embed (same as GameRoom)
  const togglePlay = () => {
    if (currentTrack.videoId) {
      const iframe = document.getElementById('youtube-player');
      if (iframe) {
        if (isPlaying) {
          // Stop the video by reloading iframe without autoplay
          iframe.src = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1`;
          setIsPlaying(false);
        } else {
          // Start playing with autoplay
          iframe.src = `https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1&enablejsapi=1`;
          setIsPlaying(true);
        }
      }
    } else {
      alert('No song available to play');
    }
  };

  const skipTrack = () => {
    // Stop current track
    const iframe = document.getElementById('youtube-player');
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1`;
    }
    setIsPlaying(false);
    
    // Fetch new track with autoplay
    fetchRandomTrack(selectedLanguage, autoplayEnabled);
  };

  // Handle song end and autoplay next
  const _handleSongEnd = () => {
    if (autoplayEnabled) {
      console.log("Song ended, playing next track...");
      fetchRandomTrack(selectedLanguage, true);
    } else {
      setIsPlaying(false);
    }
  };

  // YouTube API event listener for song end detection
  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API loaded');
      };
    }

    // Set up periodic check for video end (fallback method)
    const checkVideoEnd = setInterval(() => {
      const iframe = document.getElementById('youtube-player');
      if (iframe && isPlaying && autoplayEnabled) {
        // Try to get video duration and current time (this is a simplified approach)
        // In a real implementation, you'd use YouTube API's onStateChange event
        // For now, we'll use a timeout-based approach as fallback
      }
    }, 1000);

    return () => clearInterval(checkVideoEnd);
  }, [isPlaying, autoplayEnabled]);

  // Load initial track with autoplay
  useEffect(() => {
    fetchRandomTrack(selectedLanguage, true);
  }, [fetchRandomTrack, selectedLanguage]);

  return (
    <div><Navbar/>
    <div className="h-screen text-white font-silkscreen relative overflow-hidden" style={{
      backgroundImage: 'url(/profilebackground.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: '1700px 1700px',
      imageRendering: 'pixelated',
      backgroundAttachment: 'fixed'
    }}>
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 251, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 251, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          animation: 'gridFloat 20s ease-in-out infinite'
        }}></div>
      </div>

      {/* Retro scanlines effect */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%)',
        backgroundSize: '100% 4px',
        animation: 'scanlines 0.1s linear infinite'
      }}></div>

      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black/75 z-0"></div>
      
      {/* Top Bar */}
      {/* <div className="relative z-10 flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="MusIQ" className="w-8 h-8" />
          <div className="font-bold text-lg">
            <span className="text-white">MUS</span><span className="text-[#FFFB00]">IQ</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate("/landing")}
            className="w-6 h-6 bg-[#FFFB00] rounded flex items-center justify-center hover:bg-yellow-300 transition-colors text-black font-bold"
          >×</button>
        </div>
      </div> */}

      <div className="relative z-10 flex h-full">
        {/* Left Column - Larger and Full Height */}
        <div className="w-96 p-8 space-y-6 flex flex-col">
          {/* Profile Section - Larger */}
          <div className="text-center">
            <img 
              src={
                user?.photoURL || 
                (isGuest && guestAvatar ? `/avatars/${guestAvatar}.png` : "/pfp.png")
              }
              alt="Profile Avatar" 
              className="w-40 h-40 rounded-full mx-auto object-cover profile-glow"
              style={{
                border: '4px solid #FFFB00',
                filter: 'brightness(1.1) contrast(1.2)'
              }}
            />
            <h2 className="text-2xl font-bold text-[#FFFB00] mt-4 mb-2">
              {user?.name || user?.displayName || user?.email?.split('@')[0] || guestName || userData?.name || userName || "Guest Player"}
            </h2>
            <p className="text-gray-400 text-sm">Level 47 • {user?.name || user?.displayName || user?.email?.split('@')[0] || guestName || userData?.name || userName || "Music Enthusiast"}</p>
          </div>

          {/* Music Player - Cassette at top position */}
          <div>
            <div className="relative">
              <img 
                src="/cassette.png" 
                alt="Retro Cassette Player" 
                className="w-full h-auto pixelated opacity-90 rounded-lg"
              />
              
              {/* Hidden YouTube Player */}
              {currentTrack.videoId && (
                <iframe
                  id="youtube-player"
                  src={`https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1`}
                  style={{ display: 'none' }}
                  allow="autoplay; encrypted-media"
                />
              )}
              
              {/* Music Info Overlay - positioned to show cassette clearly */}
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mx-8 mt-6 max-w-[200px]">
                  <div className="text-center mb-2">
                    <div className="text-[#FFFB00] font-bold text-xs mb-1 truncate">
                      {isLoading ? "Loading..." : currentTrack.name}
                    </div>
                    <div className="text-gray-300 text-xs truncate">
                      {currentTrack.artist}
                    </div>
                    {currentTrack.movie && (
                      <div className="text-gray-400 text-xs truncate">
                        {currentTrack.movie}
                      </div>
                    )}
                  </div>
                  
                  {/* Control Buttons - smaller and less intrusive */}
                  <div className="flex justify-center space-x-2 mb-2">
                    <button 
                      onClick={skipTrack}
                      disabled={isLoading}
                      className={`w-6 h-6 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_10px_#FFFB00] text-xs hover:scale-110 font-bold ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ⏮
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={!currentTrack.videoId || isLoading}
                      className={`w-8 h-8 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-sm hover:scale-110 font-bold ${
                        (!currentTrack.videoId || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button 
                      onClick={skipTrack}
                      disabled={isLoading}
                      className={`w-6 h-6 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_10px_#FFFB00] text-xs hover:scale-110 font-bold ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ⏭
                    </button>
                  </div>

                  {/* Language Dropdown - smaller */}
                  <div className="relative flex justify-center">
                    <button 
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="bg-[#FFFB00] text-black px-2 py-1 rounded text-xs font-bold hover:bg-yellow-300 transition-colors"
                    >
                      {languages.find(l => l.code === selectedLanguage)?.label} ▼
                    </button>
                    
                    {showLanguageDropdown && (
                      <div className="absolute bottom-full mb-2 bg-black/60 backdrop-blur-sm rounded border border-[#FFFB00] z-50 min-w-[120px]">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              setSelectedLanguage(language.code);
                              setShowLanguageDropdown(false);
                              fetchRandomTrack(language.code, autoplayEnabled);
                            }}
                            className={`block w-full text-left px-3 py-2 text-xs hover:bg-[#FFFB00] hover:text-black transition-colors ${
                              selectedLanguage === language.code ? 'text-[#FFFB00] font-bold' : 'text-white'
                            }`}
                          >
                            {language.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats and Achievements - Grouped closer */}
          <div className="space-y-3">
            {/* Quick Stats Card - Smaller */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded border-l-4 border-[#FFFB00]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#FFFB00] font-bold text-base">Quick Stats</h3>
                <span className="text-gray-400">▼</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Games Played:</span>
                  <span className="text-white font-bold">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-[#FFFB00] font-bold">84%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Streak:</span>
                  <span className="text-[#FFFB00] font-bold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Score:</span>
                  <span className="text-[#FFFB00] font-bold">15,247</span>
                </div>
              </div>
            </div>

            {/* Achievements Card - Smaller */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded border-l-4 border-[#FFFB00]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[#FFFB00] text-lg">🏆</span>
                  <span className="text-[#FFFB00] font-bold text-base">Achievements</span>
                </div>
                <span className="text-gray-400">▼</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-gray-800/60 p-3 rounded text-center">
                  <div className="text-lg mb-1">🎵</div>
                  <div className="text-xs text-[#FFFB00] font-bold">Music Expert</div>
                </div>
                <div className="bg-gray-800/60 p-3 rounded text-center">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs text-[#FFFB00] font-bold">Speed Demon</div>
                </div>
                <div className="bg-gray-800/60 p-3 rounded text-center">
                  <div className="text-lg mb-1">🔥</div>
                  <div className="text-xs text-[#FFFB00] font-bold">Streak Master</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Full Height Layout */}
        <div className="flex-1 p-8 flex flex-col justify-between h-full">
          {/* Header - Larger */}
          <div>
            <h1 className="text-5xl font-bold text-[#FFFB00] mb-3">Track Tracker</h1>
            <br></br>

            
          </div>

          {/* Stats Row - Larger */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gray-800/60 p-6 rounded text-center">
              <div className="text-[#FFFB00] text-sm mb-2 font-bold">SONGS PLAYED</div>
              <div className="text-white text-3xl font-bold">247</div>
            </div>
            <div className="bg-gray-800/60 p-6 rounded text-center">
              <div className="text-[#FFFB00] text-sm mb-2 font-bold">WIN RATE</div>
              <div className="text-white text-3xl font-bold">84%</div>
            </div>
            <div className="bg-gray-800/60 p-6 rounded text-center">
              <div className="text-[#FFFB00] text-sm mb-2 font-bold">AVG TIME</div>
              <div className="text-white text-3xl font-bold">8.2s</div>
            </div>
            <div className="bg-gray-800/60 p-6 rounded text-center">
              <div className="text-[#FFFB00] text-sm mb-2 font-bold">LEVEL</div>
              <div className="text-white text-3xl font-bold">4</div>
            </div>
          </div>

          {/* Skills Section - Larger and Centered */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#FFFB00] mb-8 text-center">Musical Skills</h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xl mb-4 font-bold">
                  <span className="text-white">Music Knowledge</span>
                  <span className="text-[#FFFB00]">89/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-8 shadow-inner">
                  <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-8 rounded-full transition-all duration-1000 w-[89%] shadow-[0_0_20px_#FFFB00]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xl mb-4 font-bold">
                  <span className="text-white">Quick Recognition</span>
                  <span className="text-[#FFFB00]">76/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-8 shadow-inner">
                  <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-8 rounded-full transition-all duration-1000 w-[76%] shadow-[0_0_20px_#FFFB00]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xl mb-4 font-bold">
                  <span className="text-white">Genre Master</span>
                  <span className="text-[#FFFB00]">63/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-8 shadow-inner">
                  <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-8 rounded-full transition-all duration-1000 w-[63%] shadow-[0_0_20px_#FFFB00]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xl mb-4 font-bold">
                  <span className="text-white">Streak Builder</span>
                  <span className="text-[#FFFB00]">92/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-8 shadow-inner">
                  <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-8 rounded-full transition-all duration-1000 w-[92%] shadow-[0_0_20px_#FFFB00]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx="true">{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        @keyframes gridFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px #FFFB00, 0 0 40px #FFFB00; }
          50% { box-shadow: 0 0 30px #FFFB00, 0 0 60px #FFFB00; }
        }
        
        @keyframes profile-glow {
          0% {
            box-shadow: 0 0 20px rgba(255, 251, 0, 0.6), 0 0 30px rgba(255, 251, 0, 0.4), 0 0 40px rgba(255, 251, 0, 0.2);
            transform: scale(1);
          }
          100% {
            box-shadow: 0 0 30px rgba(255, 251, 0, 0.8), 0 0 40px rgba(255, 251, 0, 0.6), 0 0 50px rgba(255, 251, 0, 0.4);
            transform: scale(1.02);
          }
        }
        
        .profile-glow {
          animation: profile-glow 2s ease-in-out infinite alternate;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
    </div>
  );
};
export default Profile;