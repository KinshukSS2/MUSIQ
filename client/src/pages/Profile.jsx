import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // Music Player State
  const [currentTrack, setCurrentTrack] = useState({
    name: "Loading...",
    artist: "Please wait",
    duration: 0,
    preview_url: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("hindi");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    { code: "hindi", label: "Hindi", market: "IN" },
    { code: "english", label: "English", market: "US" },
    { code: "punjabi", label: "Punjabi", market: "IN" },
    { code: "tamil", label: "Tamil", market: "IN" },
    { code: "telugu", label: "Telugu", market: "IN" },
    { code: "bengali", label: "Bengali", market: "IN" },
    { code: "korean", label: "K-Pop", market: "KR" },
    { code: "spanish", label: "Spanish", market: "ES" }
  ];

  // Random data matching the screenshot
  const userStats = {
    stat1: 50,
    stat2: 24,
    stat3: 50,
    stat4: "1.5m"
  };

  // Fetch random track based on language
  const fetchRandomTrack = async (language = selectedLanguage) => {
    try {
      // Get access token from your server
      const tokenResponse = await fetch('/api/spotify/token');
      const { access_token } = await tokenResponse.json();

      const languageQueries = {
        hindi: "genre:bollywood OR genre:indian OR hindi",
        english: "genre:pop OR genre:rock",
        punjabi: "punjabi OR bhangra",
        tamil: "tamil OR kollywood",
        telugu: "telugu OR tollywood",
        bengali: "bengali OR rabindrasangeet",
        korean: "genre:k-pop OR korean",
        spanish: "genre:latin OR spanish"
      };

      const query = languageQueries[language] || languageQueries.hindi;
      const market = languages.find(lang => lang.code === language)?.market || "IN";
      
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=${market}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }
      );

      const data = await searchResponse.json();
      
      if (data.tracks && data.tracks.items.length > 0) {
        // Filter tracks with preview URLs
        const tracksWithPreview = data.tracks.items.filter(track => track.preview_url);
        
        if (tracksWithPreview.length > 0) {
          const randomTrack = tracksWithPreview[Math.floor(Math.random() * tracksWithPreview.length)];
          setCurrentTrack({
            name: randomTrack.name,
            artist: randomTrack.artists[0].name,
            duration: 30, // Preview is 30 seconds
            preview_url: randomTrack.preview_url
          });
        }
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      setCurrentTrack({
        name: `Random ${languages.find(l => l.code === language)?.label || 'Hindi'} Song`,
        artist: "Demo Artist",
        duration: 30,
        preview_url: null
      });
    }
  };

  // Audio controls
  const togglePlay = () => {
    if (audioRef.current && currentTrack.preview_url) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = () => {
    fetchRandomTrack();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Update current time
  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => setCurrentTime(audioRef.current.currentTime || 0);
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime);
        }
      };
    }
  }, [currentTrack]);

  // Load initial track
  useEffect(() => {
    fetchRandomTrack();
  }, [selectedLanguage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen text-white font-silkscreen relative" style={{
      backgroundImage: 'url(/profilebackground.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      imageRendering: 'pixelated'
    }}>
      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>
      
      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center px-6 py-3">
        <div className="text-[#FFFB00] font-bold text-lg">MUSIQ PROFILE</div>
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
                
                {/* Hidden Audio Element */}
                {currentTrack.preview_url && (
                  <audio 
                    ref={audioRef} 
                    src={currentTrack.preview_url} 
                    onLoadedData={() => console.log('Audio loaded')}
                  />
                )}
                
                {/* Music Player Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Track Info with Language Selector */}
                  <div className="flex justify-between items-start">
                    <div className="bg-black/80 backdrop-blur-sm rounded px-3 py-2 flex-1 mr-2">
                      <div className="text-[#FFFB00] text-xs font-bold">NOW PLAYING</div>
                      <div className="text-yellow-300 text-xs font-bold truncate">{currentTrack.name}</div>
                      <div className="text-gray-300 text-xs truncate">{currentTrack.artist}</div>
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
                  
                  {/* Progress Bar */}
                  <div className="bg-black/80 backdrop-blur-sm rounded p-3 mx-auto w-4/5">
                    <div className="flex justify-between text-[#FFFB00] text-xs mb-2 font-bold">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2 shadow-inner">
                      <div 
                        className="bg-[#FFFB00] h-2 rounded-full shadow-[0_0_10px_#FFFB00] transition-all"
                        style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={skipTrack}
                      className="w-10 h-10 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-lg hover:scale-110 font-bold"
                    >
                      ⏮
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={!currentTrack.preview_url}
                      className={`w-12 h-12 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_20px_#FFFB00] text-xl hover:scale-110 font-bold ${
                        !currentTrack.preview_url ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button 
                      onClick={skipTrack}
                      className="w-10 h-10 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-lg hover:scale-110 font-bold"
                    >
                      ⏭
                    </button>
                  </div>
                </div>
                
                {/* Volume Control */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
                  <span className="text-[#FFFB00] text-sm font-bold">VOL</span>
                  <div className="bg-gray-700 rounded-full h-2 w-24 shadow-inner">
                    <div className="bg-[#FFFB00] h-2 rounded-full w-3/4 shadow-[0_0_8px_#FFFB00]"></div>
                  </div>
                  <span className="text-[#FFFB00] text-sm font-bold">75%</span>
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
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default Profile;