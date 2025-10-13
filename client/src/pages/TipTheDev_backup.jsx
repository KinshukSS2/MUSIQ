import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import soundManager from '../utils/soundManager';

const TipTheDev = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const tipAmounts = [
    { amount: 50, label: '₹50', desc: 'Coffee ☕' },
    { amount: 100, label: '₹100', desc: 'Pizza Slice 🍕' },
    { amount: 250, label: '₹250', desc: 'Meal 🍽️' },
    { amount: 500, label: '₹500', desc: 'Grocery 🛒' },
    { amount: 1000, label: '₹1000', desc: 'Big Support 💪' },
    { amount: 2500, label: '₹2500', desc: 'Super Fan 🌟' }
  ];

  // Animated header text
  useEffect(() => {
    const text = "💰 TIP THE DEV 💰";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setAnimatedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        // Add glitch effect after text completion
        setTimeout(() => setGlitchEffect(true), 500);
        setTimeout(() => setGlitchEffect(false), 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleAmountSelect = async (amount) => {
    await soundManager.init();
    soundManager.play('click');
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && parseInt(value) <= 50000) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    
    if (!amount || amount < 10) {
      await soundManager.init();
      soundManager.play('error');
      alert('Please select or enter an amount (minimum ₹10)');
      return;
    }

    await soundManager.init();
    soundManager.play('gameAction');

    const res = await initializeRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: "rzp_test_9WJjPkmjqCy5Pz",
      amount: amount * 100,
      currency: "INR",
      name: "MusIQ - Tip the Dev",
      description: `Thanks for supporting MusIQ development! 🎵`,
      image: "/logo.png",
      handler: function (response) {
        handlePaymentSuccess(response, amount);
      },
      prefill: {
        name: "Music Lover",
        email: "fan@musiq.game",
      },
      notes: {
        project: "MusIQ Game",
        type: "Developer Tip"
      },
      theme: {
        color: "#FFFB00",
      },
      modal: {
        ondismiss: function() {
          soundManager.play('error');
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentSuccess = async (response, amount) => {
    await soundManager.init();
    soundManager.play('success');
    
    setShowThankYou(true);
    
    // Add celebration effect
    setTimeout(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
    }, 500);

    // Auto redirect after 5 seconds
    setTimeout(() => {
      navigate('/about');
    }, 5000);
  };

  const handleBackClick = async () => {
    await soundManager.init();
    soundManager.play('navigate');
    navigate('/about');
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-green-900/20 to-purple-900/20">
          <div className="scanlines"></div>
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-6">
          <div className={`pixel-font text-6xl md:text-8xl text-yellow-400 victory-pulse ${glitchEffect ? 'glitch-effect' : ''}`}>
            🎉 VICTORY! 🎉
          </div>
          <div className="cyber-font text-3xl md:text-4xl text-green-400 typewriter">
            THANK YOU FOR SUPPORTING MUSIQ!
          </div>
          <div className="space-y-4">
            <div className="pixel-font text-2xl text-white">
              Your contribution helps keep the music playing! 🎵
            </div>
            <div className="cyber-font text-lg text-gray-300">
              You are now part of the MusIQ Hall of Fame! ⭐
            </div>
          </div>
          <div className="coin-shower">
            {Array.from({length: 50}).map((_, i) => (
              <div key={i} className={`coin-fall coin-${i % 5}`}>🪙</div>
            ))}
          </div>
          <div className="cyber-font text-yellow-400 text-lg animate-pulse">
            Redirecting to About page in 5 seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="arcade-background"></div>
        <div className="scanlines"></div>
        <div className="screen-flicker"></div>
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className={`pixel-font text-6xl md:text-8xl text-yellow-400 mb-6 arcade-glow ${glitchEffect ? 'glitch-effect' : ''}`}>
              {animatedText}
            </div>
            <div className="cyber-font text-xl md:text-2xl text-green-400 mb-4">
              SUPPORT THE MUSIQ ARCADE DEVELOPMENT
            </div>
            <div className="pixel-font text-lg text-white max-w-2xl mx-auto leading-relaxed">
              Help Kinshuk build more epic gaming features! 🎮
            </div>
          </div>

          {/* Main Content */}
          <div className="arcade-container">
            <div className="arcade-corners">
              <div className="corner-decoration top-left"></div>
              <div className="corner-decoration top-right"></div>
              <div className="corner-decoration bottom-left"></div>
              <div className="corner-decoration bottom-right"></div>
            </div>
            
            <div className="arcade-content">
              <div className="pixel-font text-3xl text-center text-yellow-400 mb-8 arcade-title">
                🪙 INSERT COINS 🪙
              </div>
              
              {/* Tip Amount Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {tipAmounts.map((tip, index) => (
                  <button
                    key={tip.amount}
                    onClick={() => handleAmountSelect(tip.amount)}
                    className={`arcade-tip-button ${selectedAmount === tip.amount ? 'selected' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="pixel-font text-2xl text-yellow-400 mb-2">
                      {tip.label}
                    </div>
                    <div className="cyber-font text-sm text-green-400">
                      {tip.desc}
                    </div>
                    {selectedAmount === tip.amount && (
                      <div className="selected-glow"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-8">
                <div className="pixel-font text-xl text-yellow-400 mb-4 text-center">
                  OR ENTER CUSTOM AMOUNT:
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 pixel-font text-2xl text-yellow-400">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="0"
                      className="arcade-input pixel-font text-2xl pl-12 pr-6 py-4 text-center"
                      maxLength="5"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={handlePayment}
                  className="arcade-pay-button pixel-font text-xl"
                  disabled={!selectedAmount && !customAmount}
                >
                  💰 PROCESS PAYMENT 💰
                </button>
                
                <button 
                  onClick={handleBackClick}
                  className="arcade-back-button cyber-font text-lg"
                >
                  ← BACK TO ABOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 2px;
        }
        
        .cyber-font {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .arcade-background {
          background: 
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              rgba(255, 251, 0, 0.03) 100px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 98px,
              rgba(255, 251, 0, 0.03) 100px
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 251, 0, 0.1) 0%,
              rgba(0, 0, 0, 0.9) 100%
            );
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 251, 0, 0.05) 2px,
            rgba(255, 251, 0, 0.05) 4px
          );
          pointer-events: none;
          animation: scanlines-move 3s linear infinite;
        }
        
        @keyframes scanlines-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        .screen-flicker {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 251, 0, 0.02);
          animation: screen-flicker 0.1s linear infinite;
          pointer-events: none;
        }
        
        @keyframes screen-flicker {
          0%, 98% { opacity: 1; }
          99%, 100% { opacity: 0.98; }
        }
        
        .arcade-glow {
          text-shadow: 
            0 0 10px #FFFB00,
            0 0 20px #FFFB00,
            0 0 30px #FFFB00,
            0 0 40px #FFFB00;
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            text-shadow: 
              0 0 10px #FFFB00,
              0 0 20px #FFFB00,
              0 0 30px #FFFB00,
              0 0 40px #FFFB00;
          }
          50% { 
            text-shadow: 
              0 0 20px #FFFB00,
              0 0 30px #FFFB00,
              0 0 40px #FFFB00,
              0 0 50px #FFFB00;
          }
        }
        
        .glitch-effect {
          animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        .arcade-container {
          background: 
            radial-gradient(ellipse at center, rgba(255, 251, 0, 0.08) 0%, rgba(0, 0, 0, 0.9) 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255, 251, 0, 0.02) 40px,
              rgba(255, 251, 0, 0.02) 42px
            );
          border: 3px solid #FFFB00;
          box-shadow: 
            0 0 30px rgba(255, 251, 0, 0.3),
            inset 0 0 30px rgba(255, 251, 0, 0.1),
            inset 0 0 0 5px rgba(0, 0, 0, 0.8);
          border-radius: 20px;
          position: relative;
          padding: 3rem;
        }
        
        .arcade-corners {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .corner-decoration {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid #FFFB00;
        }
        
        .corner-decoration.top-left {
          top: 15px;
          left: 15px;
          border-right: none;
          border-bottom: none;
        }
        
        .corner-decoration.top-right {
          top: 15px;
          right: 15px;
          border-left: none;
          border-bottom: none;
        }
        
        .corner-decoration.bottom-left {
          bottom: 15px;
          left: 15px;
          border-right: none;
          border-top: none;
        }
        
        .corner-decoration.bottom-right {
          bottom: 15px;
          right: 15px;
          border-left: none;
          border-top: none;
        }
        
        .arcade-content {
          position: relative;
          z-index: 2;
        }
        
        .arcade-title {
          animation: title-flash 2s ease-in-out infinite;
        }
        
        @keyframes title-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .arcade-tip-button {
          background: 
            linear-gradient(45deg, #1a1a1a, #2a2a2a),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(255, 251, 0, 0.1) 1px,
              rgba(255, 251, 0, 0.1) 2px
            );
          border: 2px solid #333;
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 
            inset 0 0 10px rgba(255, 251, 0, 0.1),
            0 0 10px rgba(0, 0, 0, 0.8);
          animation: button-entry 0.6s ease-out forwards;
          transform: translateY(20px);
          opacity: 0;
        }
        
        @keyframes button-entry {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .arcade-tip-button:hover {
          border-color: #FFFB00;
          box-shadow: 
            0 0 20px rgba(255, 251, 0, 0.4),
            inset 0 0 20px rgba(255, 251, 0, 0.2);
          transform: translateY(-5px);
        }
        
        .arcade-tip-button.selected {
          background: 
            linear-gradient(45deg, #FFFB00, #FFD700),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.1) 1px,
              rgba(0, 0, 0, 0.1) 2px
            );
          color: black;
          border-color: #FFFB00;
          box-shadow: 
            0 0 25px rgba(255, 251, 0, 0.6),
            inset 0 0 15px rgba(255, 215, 0, 0.3);
          animation: selected-pulse 1s ease-in-out infinite;
        }
        
        @keyframes selected-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 25px rgba(255, 251, 0, 0.6),
              inset 0 0 15px rgba(255, 215, 0, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 35px rgba(255, 251, 0, 0.8),
              inset 0 0 25px rgba(255, 215, 0, 0.5);
          }
        }
        
        .selected-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255, 251, 0, 0.2), transparent 70%);
          border-radius: 15px;
          animation: glow-rotate 3s linear infinite;
        }
        
        @keyframes glow-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .arcade-input {
          background: 
            rgba(255, 251, 0, 0.1),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(255, 251, 0, 0.05) 20px,
              rgba(255, 251, 0, 0.05) 22px
            );
          border: 3px solid #333;
          border-radius: 15px;
          color: #FFFB00;
          width: 250px;
          transition: all 0.3s ease;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
        }
        
        .arcade-input:focus {
          outline: none;
          border-color: #FFFB00;
          box-shadow: 
            0 0 20px rgba(255, 251, 0, 0.4),
            inset 0 0 20px rgba(255, 251, 0, 0.1);
          background: rgba(255, 251, 0, 0.15);
        }
        
        .arcade-pay-button {
          background: linear-gradient(45deg, #FFFB00, #FFD700);
          color: #000;
          border: none;
          border-radius: 15px;
          padding: 1rem 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: pay-pulse 2s ease-in-out infinite;
          box-shadow: 
            0 0 20px rgba(255, 251, 0, 0.5),
            inset 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        @keyframes pay-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 
              0 0 20px rgba(255, 251, 0, 0.5),
              inset 0 0 10px rgba(255, 215, 0, 0.3);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 
              0 0 30px rgba(255, 251, 0, 0.7),
              inset 0 0 15px rgba(255, 215, 0, 0.5);
          }
        }
        
        .arcade-pay-button:hover {
          transform: scale(1.05);
          box-shadow: 
            0 0 40px rgba(255, 251, 0, 0.8),
            inset 0 0 20px rgba(255, 215, 0, 0.6);
          animation: none;
        }
        
        .arcade-pay-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
        }
        
        .arcade-back-button {
          background: transparent;
          color: #FFFB00;
          border: 2px solid #FFFB00;
          border-radius: 15px;
          padding: 1rem 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .arcade-back-button:hover {
          background: rgba(255, 251, 0, 0.1);
          box-shadow: 0 0 20px rgba(255, 251, 0, 0.3);
        }
        
        .victory-pulse {
          animation: victory-pulse 1s ease-in-out infinite;
        }
        
        @keyframes victory-pulse {
          0%, 100% { 
            transform: scale(1);
            text-shadow: 0 0 30px #FFFB00;
          }
          50% { 
            transform: scale(1.05);
            text-shadow: 0 0 50px #FFFB00, 0 0 70px #FFFB00;
          }
        }
        
        .coin-shower {
          position: relative;
          height: 100px;
          overflow: hidden;
        }
        
        .coin-fall {
          position: absolute;
          font-size: 2rem;
          animation: coin-fall 3s ease-in-out infinite;
        }
        
        @keyframes coin-fall {
          0% { 
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .coin-0 { left: 10%; animation-delay: 0s; }
        .coin-1 { left: 20%; animation-delay: 0.1s; }
        .coin-2 { left: 30%; animation-delay: 0.2s; }
        .coin-3 { left: 40%; animation-delay: 0.3s; }
        .coin-4 { left: 50%; animation-delay: 0.4s; }
        
        /* Responsive */
        @media (max-width: 768px) {
          .arcade-container {
            padding: 1.5rem;
          }
          
          .arcade-input {
            width: 200px;
          }
          
          .arcade-tip-button {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TipTheDev;