import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

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
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const languages = [
    { code: "all", label: "All Songs" },
    { code: "hindi", label: "Hindi" },
    { code: "english", label: "English" },
    { code: "punjabi", label: "Punjabi" },
    { code: "tamil", label: "Tamil" },
    { code: "telugu", label: "Telugu" },
    { code: "malayalam", label: "Malayalam" },
    { code: "bengali", label: "Bengali" },
    { code: "korean", label: "K-Pop" },
    { code: "spanish", label: "Spanish" }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Random data matching the screenshot
  const userStats = {
    stat1: 50,
    stat2: 24,
    stat3: 50,
    stat4: "1.5m"
  };

  // Fetch random track from database
  const fetchRandomTrack = async (language = selectedLanguage, shouldAutoplay = autoplayEnabled) => {
    setIsLoading(true);
    try {
      console.log('Fetching random song from database...');
      
      const response = await fetch('http://localhost:5000/api/song/random');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch song: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched song:', data.song);
      
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
      }
      
    } catch (error) {
      console.error('Error fetching track:', error);
      
      // Fallback with demo tracks organized by language - All tested and working
      const demoTracksByLanguage = {
        all: [
          { name: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2", videoId: "Umqb9KENgmk" },
          { name: "Shape of You", artist: "Ed Sheeran", movie: "Single", videoId: "JGwWNGJdvx8" },
          { name: "Laung Laachi", artist: "Mannat Noor", movie: "Laung Laachi", videoId: "KaLxjDFQsVw" },
          { name: "Despacito", artist: "Luis Fonsi", movie: "Single", videoId: "kJQP7kiw5Fk" }
        ],
        hindi: [
          { name: "Tum Hi Ho", artist: "Arijit Singh", movie: "Aashiqui 2", videoId: "Umqb9KENgmk" },
          { name: "Kesariya", artist: "Arijit Singh", movie: "Brahmastra", videoId: "FVOZaRwq54E" },
          { name: "Apna Bana Le", artist: "Arijit Singh", movie: "Bhediya", videoId: "3haEIhUk47s" },
          { name: "Tera Ban Jaunga", artist: "Akhil Sachdeva", movie: "Kabir Singh", videoId: "1eWdbMBYlH4" },
          { name: "Raataan Lambiyan", artist: "Tanishk Bagchi", movie: "Shershaah", videoId: "tpDVfjhKqVo" },
          { name: "Mann Mera", artist: "Gajendra Verma", movie: "Table No. 21", videoId: "bSrHNshZdT0" }
        ],
        english: [
          { name: "Shape of You", artist: "Ed Sheeran", movie: "Single", videoId: "JGwWNGJdvx8" },
          { name: "Blinding Lights", artist: "The Weeknd", movie: "Single", videoId: "4NRXx6U8ABQ" },
          { name: "Perfect", artist: "Ed Sheeran", movie: "Single", videoId: "2Vv-BfVoq4g" },
          { name: "Someone You Loved", artist: "Lewis Capaldi", movie: "Single", videoId: "zABLecsR5UE" },
          { name: "Bad Habits", artist: "Ed Sheeran", movie: "Single", videoId: "orJSJGHjBLI" },
          { name: "Watermelon Sugar", artist: "Harry Styles", movie: "Single", videoId: "E07s5ZYygMg" }
        ],
        punjabi: [
          { name: "Laung Laachi", artist: "Mannat Noor", movie: "Laung Laachi", videoId: "KaLxjDFQsVw" },
          { name: "Brown Munde", artist: "AP Dhillon", movie: "Single", videoId: "VNs_cCtdbPc" },
          { name: "Excuses", artist: "AP Dhillon", movie: "Single", videoId: "qOyYnyiiI20" },
          { name: "Insane", artist: "AP Dhillon", movie: "Single", videoId: "7WBvonuTXUY" },
          { name: "295", artist: "Sidhu Moose Wala", movie: "Single", videoId: "YPgGzlB57EM" },
          { name: "Bambiha Bole", artist: "Sidhu Moose Wala", movie: "Single", videoId: "Rn3EFBKjCDY" }
        ],
        tamil: [
          { name: "Vaathi Coming", artist: "Anirudh", movie: "Master", videoId: "DOMcaWxLxe8" },
          { name: "Rowdy Baby", artist: "Dhanush", movie: "Maari 2", videoId: "x6Q7c9RyMzk" },
          { name: "Arabic Kuthu", artist: "Anirudh", movie: "Beast", videoId: "fiAWLyFWGmE" },
          { name: "Enjoy Enjaami", artist: "Dhee", movie: "Single", videoId: "eYq7WapuDLU" },
          { name: "Oo Antava", artist: "Indravathi Chauhan", movie: "Pushpa", videoId: "geRLS9sLW2E" },
          { name: "Naatu Naatu", artist: "Rahul Sipligunj", movie: "RRR", videoId: "WDBfwsODGB0" }
        ],
        telugu: [
          { name: "Butta Bomma", artist: "Armaan Malik", movie: "Ala Vaikuntapuramlo", videoId: "JjVXngPaZGY" },
          { name: "Ramuloo Ramulaa", artist: "Anurag Kulkarni", movie: "Ala Vaikuntapuramlo", videoId: "BddP6PYo2gs" },
          { name: "Samajavaragamana", artist: "Sid Sriram", movie: "Ala Vaikuntapuramlo", videoId: "HiqE15Z12rk" },
          { name: "Naatu Naatu", artist: "Rahul Sipligunj", movie: "RRR", videoId: "WDBfwsODGB0" },
          { name: "Oo Antava", artist: "Indravathi Chauhan", movie: "Pushpa", videoId: "geRLS9sLW2E" },
          { name: "Srivalli", artist: "Javed Ali", movie: "Pushpa", videoId: "9sOyJ-bKehE" }
        ],
        malayalam: [
          { name: "Malare", artist: "Vijay Yesudas", movie: "Premam", videoId: "CJrVZCbKxsE" },
          { name: "Pathivaayi Njan", artist: "Shaan Rahman", movie: "Bangalore Days", videoId: "EqgFGQ1gkug" },
          { name: "Mukkathe Penne", artist: "Vineeth Sreenivasan", movie: "Ennu Ninte Moideen", videoId: "yFsA0xwHP88" },
          { name: "Varaha Roopam", artist: "Vishnu Shyam", movie: "Kantara", videoId: "5F3pkyNykz8" },
          { name: "Jimikki Kammal", artist: "Ranjith Unni", movie: "Velipadinte Pusthakam", videoId: "d7sQp8kzIkQ" },
          { name: "Darshana", artist: "Sharreth", movie: "Oru Vadakkan Selfie", videoId: "y67x1Hb2J2o" }
        ],
        bengali: [
          { name: "Tomake Chai", artist: "Arijit Singh", movie: "Gangster", videoId: "FGlGpwKXqN8" },
          { name: "Ek Din", artist: "Anupam Roy", movie: "Autograph", videoId: "4vXZge3VhfQ" },
          { name: "Amake Amar Moto", artist: "Anupam Roy", movie: "Autograph", videoId: "Q9FxJhHTJOQ" },
          { name: "Egiye De", artist: "Anupam Roy", movie: "Single", videoId: "tHcyJNAx8R8" },
          { name: "Chokher Bali", artist: "Shreya Ghoshal", movie: "Choker Bali", videoId: "dPLJpffGDbc" },
          { name: "Mon Majhi Re", artist: "Arijit Singh", movie: "Boss", videoId: "5rJOCUxGEaY" }
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
    }
    setIsLoading(false);
  };

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
  const handleSongEnd = () => {
    if (autoplayEnabled) {
      console.log("Song ended, playing next track...");
      fetchRandomTrack(selectedLanguage, true);
    } else {
      setIsPlaying(false);
    }
  };

  // Auto-advance to next song after typical duration (3-4 minutes)
  useEffect(() => {
    let songTimer;
    
    if (isPlaying && autoplayEnabled && currentTrack.videoId) {
      // Set timer for 4 minutes (240 seconds) - typical song length
      songTimer = setTimeout(() => {
        console.log("Song timeout reached, playing next track...");
        handleSongEnd();
      }, 240000); // 4 minutes
    }

    return () => {
      if (songTimer) {
        clearTimeout(songTimer);
      }
    };
  }, [isPlaying, currentTrack.videoId, autoplayEnabled, selectedLanguage]);

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
  }, []);

  // Load initial track with autoplay
  useEffect(() => {
    fetchRandomTrack(selectedLanguage, true);
  }, []);

  return (
    <div className="min-h-screen text-white font-silkscreen relative overflow-hidden" style={{
      backgroundImage: 'url(/profilebackground.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      imageRendering: 'pixelated'
    }}>
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 251, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 251, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
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
      <div className="relative z-10 flex justify-between items-center px-6 py-3">
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
          >−</button>
          <button 
            onClick={() => navigate("/landing")}
            className="w-6 h-6 bg-[#FFFB00] rounded flex items-center justify-center hover:bg-yellow-300 transition-colors text-black font-bold"
          >×</button>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-60px)]">
        {/* Left Column */}
        <div className="w-80 p-6 space-y-6">
          {/* Profile Section */}
          <div className="relative">
            <img 
              src="/glowing-avatar.png" 
              alt="Profile Avatar" 
              className="w-32 h-32 rounded-full shadow-[0_0_30px_#FFFB00,0_0_60px_#FFFB00,0_0_90px_#FFFB00] pixelated mx-auto"
              style={{
                imageRendering: 'pixelated',
                filter: 'brightness(1.2) contrast(1.3)'
              }}
            />
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded border-l-4 border-[#FFFB00]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[#FFFB00] font-bold text-sm">Quick Stats</h3>
              <span className="text-gray-400">▼</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Games Played:</span>
                <span className="text-white font-bold">127</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-[#FFFB00] font-bold">84%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current Streak:</span>
                <span className="text-[#FFFB00] font-bold">12</span>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded border-l-4 border-[#FFFB00]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#FFFB00]">🏆</span>
                <span className="text-[#FFFB00] font-bold text-sm">Achievements</span>
              </div>
              <span className="text-gray-400">▼</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-gray-800/60 p-2 rounded text-center">
                <div className="text-lg">🎵</div>
                <div className="text-xs text-[#FFFB00]">Music Expert</div>
              </div>
              <div className="bg-gray-800/60 p-2 rounded text-center">
                <div className="text-lg">⚡</div>
                <div className="text-xs text-[#FFFB00]">Speed Demon</div>
              </div>
              <div className="bg-gray-800/60 p-2 rounded text-center">
                <div className="text-lg">🔥</div>
                <div className="text-xs text-[#FFFB00]">Streak Master</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded border-l-4 border-[#FFFB00]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[#FFFB00] font-bold text-sm">Recent Activity</h3>
              <span className="text-gray-400">▼</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Won "Pop Hits" room</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-[#FFFB00] rounded-full"></div>
                <span className="text-gray-300">12-game win streak</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Leveled up to 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#FFFB00] mb-2">Music Guessing</h1>
            <p className="text-gray-400 text-sm">Level 4 Music Enthusiast • Kinshuk's Gaming Profile</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/60 p-4 rounded text-center">
              <div className="text-[#FFFB00] text-xs mb-1">SONGS PLAYED</div>
              <div className="text-white text-2xl font-bold">247</div>
            </div>
            <div className="bg-gray-800/60 p-4 rounded text-center">
              <div className="text-[#FFFB00] text-xs mb-1">WIN RATE</div>
              <div className="text-white text-2xl font-bold">84%</div>
            </div>
            <div className="bg-gray-800/60 p-4 rounded text-center">
              <div className="text-[#FFFB00] text-xs mb-1">AVG TIME</div>
              <div className="text-white text-2xl font-bold">8.2s</div>
            </div>
            <div className="bg-gray-800/60 p-4 rounded text-center">
              <div className="text-[#FFFB00] text-xs mb-1">LEVEL</div>
              <div className="text-white text-2xl font-bold">4</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Skills Progress */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#FFFB00] font-bold text-xl">Skills Progress</h2>
                <button className="text-[#FFFB00] text-xl hover:text-yellow-300">+</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-lg mb-3 font-bold">
                    <span className="text-white">Music Knowledge</span>
                    <span className="text-[#FFFB00]">89/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-6 shadow-inner">
                    <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-6 rounded-full transition-all duration-1000 w-[89%] shadow-[0_0_15px_#FFFB00]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-lg mb-3 font-bold">
                    <span className="text-white">Quick Recognition</span>
                    <span className="text-[#FFFB00]">76/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-6 shadow-inner">
                    <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-6 rounded-full transition-all duration-1000 w-[76%] shadow-[0_0_15px_#FFFB00]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-lg mb-3 font-bold">
                    <span className="text-white">Genre Master</span>
                    <span className="text-[#FFFB00]">63/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-6 shadow-inner">
                    <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-6 rounded-full transition-all duration-1000 w-[63%] shadow-[0_0_15px_#FFFB00]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-lg mb-3 font-bold">
                    <span className="text-white">Streak Builder</span>
                    <span className="text-[#FFFB00]">92/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-6 shadow-inner">
                    <div className="bg-gradient-to-r from-[#FFFB00] to-yellow-300 h-6 rounded-full transition-all duration-1000 w-[92%] shadow-[0_0_15px_#FFFB00]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Music Player */}
            <div>
              <div className="relative">
                <img 
                  src="/cassette.png" 
                  alt="Retro Cassette Player" 
                  className="w-full h-auto pixelated opacity-90"
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
                
                {/* Music Player Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Track Info with Language Selector */}
                  <div className="flex justify-between items-start">
                    <div className="bg-black/80 backdrop-blur-sm rounded px-3 py-2 flex-1 mr-2">
                      <div className="text-[#FFFB00] text-xs font-bold">NOW PLAYING</div>
                      <div className="text-yellow-300 text-xs font-bold truncate">
                        {isLoading ? "Loading..." : currentTrack.name}
                      </div>
                      <div className="text-gray-300 text-xs truncate">
                        {isLoading ? "Please wait" : currentTrack.artist}
                      </div>
                      {currentTrack.movie && (
                        <div className="text-gray-400 text-xs truncate">
                          From: {currentTrack.movie}
                        </div>
                      )}
                    </div>
                    
                    {/* Language Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="bg-[#FFFB00] text-black px-2 py-1 rounded text-xs font-bold hover:bg-yellow-300 transition-colors"
                      >
                        {languages.find(l => l.code === selectedLanguage)?.label} ▼
                      </button>
                      
                      {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-sm rounded border border-[#FFFB00] z-50 min-w-[100px]">
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => {
                                setSelectedLanguage(language.code);
                                setShowLanguageDropdown(false);
                                fetchRandomTrack(language.code, autoplayEnabled); // Fetch song in selected language with autoplay
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
                  
                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={skipTrack}
                      disabled={isLoading}
                      className={`w-10 h-10 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-lg hover:scale-110 font-bold ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ⏮
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={!currentTrack.videoId || isLoading}
                      className={`w-12 h-12 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_20px_#FFFB00] text-xl hover:scale-110 font-bold ${
                        (!currentTrack.videoId || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button 
                      onClick={skipTrack}
                      disabled={isLoading}
                      className={`w-10 h-10 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-lg hover:scale-110 font-bold ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ⏭
                    </button>
                  </div>
                </div>
                
                {/* Song Status Indicator */}
                <div className="absolute bottom-2 left-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentTrack.videoId ? 'bg-green-400 shadow-[0_0_10px_#00ff00]' : 'bg-red-400 shadow-[0_0_10px_#ff0000]'
                  }`}></div>
                </div>
                
                {/* Checkered Pattern */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#FFFB00] rounded shadow-[0_0_15px_#FFFB00]" style={{
                  backgroundImage: `
                    linear-gradient(45deg, black 25%, transparent 25%), 
                    linear-gradient(-45deg, black 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, black 75%), 
                    linear-gradient(-45deg, transparent 75%, black 75%)
                  `,
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                }}></div>
              </div>
            </div>
          </div>

          {/* Gaming Zone Section */}
          <div className="mt-8 bg-gray-900/80 backdrop-blur-sm p-6 rounded border border-[#FFFB00]/30">
            <div className="flex items-center mb-4">
              <span className="text-[#FFFB00] text-2xl mr-3">🎮</span>
              <h3 className="text-white font-bold text-xl">Gaming Zone</h3>
            </div>
            
            {/* Retro Game Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/50 p-4 rounded border border-[#FFFB00]/20">
                <div className="text-[#FFFB00] text-xs font-bold mb-2">🏆 CHAMPIONSHIP</div>
                <div className="text-white text-lg font-bold">Rank #47</div>
                <div className="text-gray-400 text-xs">Global Leaderboard</div>
              </div>
              <div className="bg-black/50 p-4 rounded border border-[#FFFB00]/20">
                <div className="text-[#FFFB00] text-xs font-bold mb-2">⚡ REACTION TIME</div>
                <div className="text-white text-lg font-bold">2.3s</div>
                <div className="text-gray-400 text-xs">Average Response</div>
              </div>
              <div className="bg-black/50 p-4 rounded border border-[#FFFB00]/20">
                <div className="text-[#FFFB00] text-xs font-bold mb-2">🎵 MUSIC GENRES</div>
                <div className="text-white text-lg font-bold">127</div>
                <div className="text-gray-400 text-xs">Songs Mastered</div>
              </div>
              <div className="bg-black/50 p-4 rounded border border-[#FFFB00]/20">
                <div className="text-[#FFFB00] text-xs font-bold mb-2">🔥 DAILY STREAK</div>
                <div className="text-white text-lg font-bold">15 Days</div>
                <div className="text-gray-400 text-xs">Current Run</div>
              </div>
            </div>

            {/* Retro Badges */}
            <div className="mb-6">
              <h4 className="text-[#FFFB00] font-bold mb-3 text-sm">🎖️ RETRO BADGES</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gradient-to-b from-[#FFFB00] to-yellow-600 p-3 rounded text-center shadow-[0_0_15px_#FFFB00]">
                  <div className="text-black text-lg font-bold">🎵</div>
                  <div className="text-black text-xs font-bold">MELODY</div>
                </div>
                <div className="bg-gradient-to-b from-green-400 to-green-600 p-3 rounded text-center shadow-[0_0_15px_green]">
                  <div className="text-black text-lg font-bold">⚡</div>
                  <div className="text-black text-xs font-bold">SPEED</div>
                </div>
                <div className="bg-gradient-to-b from-purple-400 to-purple-600 p-3 rounded text-center shadow-[0_0_15px_purple]">
                  <div className="text-white text-lg font-bold">👑</div>
                  <div className="text-white text-xs font-bold">LEGEND</div>
                </div>
                <div className="bg-gradient-to-b from-red-400 to-red-600 p-3 rounded text-center shadow-[0_0_15px_red]">
                  <div className="text-white text-lg font-bold">🔥</div>
                  <div className="text-white text-xs font-bold">STREAK</div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#FFFB00] font-bold text-sm">LEVEL 47 MUSIC MASTER</span>
                <span className="text-white text-sm">2,847 / 3,000 XP</span>
              </div>
              <div className="bg-gray-800 rounded-full h-4 shadow-inner">
                <div className="bg-gradient-to-r from-[#FFFB00] via-yellow-400 to-[#FFFB00] h-4 rounded-full transition-all duration-1000 w-[95%] shadow-[0_0_15px_#FFFB00] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h4 className="text-[#FFFB00] font-bold mb-3 text-sm">📊 RECENT ACTIVITIES</h4>
              <div className="space-y-2">
                <div className="flex justify-between bg-black/30 p-2 rounded">
                  <span className="text-white text-xs">🎵 Guessed "Bohemian Rhapsody"</span>
                  <span className="text-[#FFFB00] text-xs">+50 XP</span>
                </div>
                <div className="flex justify-between bg-black/30 p-2 rounded">
                  <span className="text-white text-xs">🏆 Won multiplayer match</span>
                  <span className="text-[#FFFB00] text-xs">+125 XP</span>
                </div>
                <div className="flex justify-between bg-black/30 p-2 rounded">
                  <span className="text-white text-xs">⚡ 15-song streak achieved</span>
                  <span className="text-[#FFFB00] text-xs">+200 XP</span>
                </div>
                <div className="flex justify-between bg-black/30 p-2 rounded">
                  <span className="text-white text-xs">🎖️ New badge earned: Speed Demon</span>
                  <span className="text-[#FFFB00] text-xs">+100 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Profile;