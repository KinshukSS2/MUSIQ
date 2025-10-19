import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import soundManager from '../../utils/soundManager';

const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    // Just sync the initial state - don't initialize audio yet
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const handleToggle = async () => {
    // Initialize sound manager if not already done
    await soundManager.initOnUserInteraction();
    
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className="group relative p-3 bg-black border-2 border-[#FFFB00] rounded-full hover:bg-[#FFFB00] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_#FFFB00] hover:scale-110"
        title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
      >
        {soundEnabled ? (
          <Volume2 
            size={24} 
            className="text-[#FFFB00] group-hover:text-black drop-shadow-[0_0_5px_#FFFB00] group-hover:drop-shadow-none transition-all duration-300" 
          />
        ) : (
          <VolumeX 
            size={24} 
            className="text-gray-500 group-hover:text-black transition-all duration-300" 
          />
        )}
        
        {/* Pulsing ring when sound is enabled */}
        {soundEnabled && (
          <div className="absolute inset-0 border-2 border-[#FFFB00] rounded-full animate-ping opacity-20"></div>
        )}
        
        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black border border-[#FFFB00] text-[#FFFB00] text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        </span>
      </button>
    </div>
  );
};

export default SoundToggle;