import { useCallback } from 'react';
import soundManager from '../utils/soundManager';

// Custom hook for easy sound integration in components
export const useSound = () => {
  const playSound = useCallback(async (soundName) => {
    await soundManager.initOnUserInteraction();
    soundManager.play(soundName);
  }, []);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playNavigate = useCallback(() => playSound('navigate'), [playSound]);
  const playSuccess = useCallback(() => playSound('success'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playHover = useCallback(() => playSound('hover'), [playSound]);
  const playGameAction = useCallback(() => playSound('gameAction'), [playSound]);
  const playToggle = useCallback(() => playSound('toggle'), [playSound]);

  return {
    playSound,
    playClick,
    playNavigate,
    playSuccess,
    playError,
    playHover,
    playGameAction,
    playToggle,
  };
};

export default useSound;