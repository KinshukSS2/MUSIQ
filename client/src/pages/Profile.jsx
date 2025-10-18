import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Random data matching the screenshot
  const userStats = {
    stat1: 50,
    stat2: 24,
    stat3: 50,
    stat4: "1.5m"
  };

  const challenges = [
    { name: "1Challenge", progress: 43, total: 110 },
    { name: "1Challenge", progress: 24, total: 30 },
    { name: "3Progress", progress: 33, total: 70 }
  ];

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
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">Music Knowledge</span>
                    <span className="text-gray-400">89/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3">
                    <div className="bg-[#FFFB00] h-3 rounded-full transition-all duration-1000 w-[89%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">Quick Recognition</span>
                    <span className="text-gray-400">76/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3">
                    <div className="bg-[#FFFB00] h-3 rounded-full transition-all duration-1000 w-[76%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">Genre Master</span>
                    <span className="text-gray-400">63/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3">
                    <div className="bg-[#FFFB00] h-3 rounded-full transition-all duration-1000 w-[63%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">Streak Builder</span>
                    <span className="text-gray-400">92/100</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3">
                    <div className="bg-[#FFFB00] h-3 rounded-full transition-all duration-1000 w-[92%]"></div>
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
                
                {/* Music Player Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Track Info */}
                  <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-2 w-fit">
                    <div className="text-[#FFFB00] text-xs font-bold">NOW PLAYING</div>
                    <div className="text-yellow-300 text-xs">BEATS & VIBES</div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="bg-black/70 backdrop-blur-sm rounded p-3 mx-auto w-4/5">
                    <div className="flex justify-between text-[#FFFB00] text-xs mb-2">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-1">
                      <div className="bg-[#FFFB00] h-1 rounded-full w-1/3 shadow-[0_0_8px_#FFFB00]"></div>
                    </div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-3">
                    <button className="w-8 h-8 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_10px_#FFFB00] text-sm hover:scale-110">
                      ⏮
                    </button>
                    <button className="w-10 h-10 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_15px_#FFFB00] text-lg hover:scale-110">
                      ⏸
                    </button>
                    <button className="w-8 h-8 bg-[#FFFB00] text-black rounded flex items-center justify-center hover:bg-yellow-300 transition-all shadow-[0_0_10px_#FFFB00] text-sm hover:scale-110">
                      ⏭
                    </button>
                  </div>
                </div>
                
                {/* Volume Control */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                  <span className="text-[#FFFB00] text-xs">VOL</span>
                  <div className="bg-gray-700 rounded-full h-1 w-20">
                    <div className="bg-[#FFFB00] h-1 rounded-full w-3/4 shadow-[0_0_5px_#FFFB00]"></div>
                  </div>
                  <span className="text-[#FFFB00] text-xs">75%</span>
                </div>
                
                {/* Checkered Pattern */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-[#FFFB00] rounded" style={{
                  backgroundImage: `
                    linear-gradient(45deg, black 25%, transparent 25%), 
                    linear-gradient(-45deg, black 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, black 75%), 
                    linear-gradient(-45deg, transparent 75%, black 75%)
                  `,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
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