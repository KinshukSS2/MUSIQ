import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import soundManager from '../utils/soundManager';

const TipTheDev = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const tipAmounts = [
    { amount: 50, label: '₹50', desc: 'Coffee ☕' },
    { amount: 100, label: '₹100', desc: 'Pizza Slice 🍕' },
    { amount: 250, label: '₹250', desc: 'Meal 🍽️' },
    { amount: 500, label: '₹500', desc: 'Grocery 🛒' },
    { amount: 1000, label: '₹1000', desc: 'Big Support 💪' },
    { amount: 2500, label: '₹2500', desc: 'Super Fan 🌟' }
  ];

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
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="retro-grid"></div>
          <div className="glow-effect"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8">
            <div className="text-6xl md:text-8xl font-bold text-yellow-400 animate-pulse retro-text">
              🎉 THANK YOU! 🎉
            </div>
            <div className="text-2xl md:text-3xl text-green-400 retro-text">
              Payment Successful!
            </div>
            <div className="text-lg text-white">
              Your support helps keep MusIQ awesome! 🎵
            </div>
            <div className="text-yellow-400 animate-bounce">
              Redirecting to About page in 5 seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Retro Background */}
      <div className="absolute inset-0">
        <div className="retro-grid"></div>
        <div className="glow-effect"></div>
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-6 retro-text animate-glow">
              💰 TIP THE DEV 💰
            </h1>
            <p className="text-xl md:text-2xl text-green-400 mb-4 retro-text">
              Support MusIQ Development
            </p>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Help Kinshuk build more awesome features for MusIQ! 🎮🎵
            </p>
          </div>

          {/* Main Container */}
          <div className="bg-gray-900 bg-opacity-80 border-2 border-yellow-400 rounded-lg p-8 backdrop-blur-sm glow-container">
            
            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center retro-text">
                Choose Your Support Level
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {tipAmounts.map((tip) => (
                  <button
                    key={tip.amount}
                    onClick={() => handleAmountSelect(tip.amount)}
                    className={`p-4 border-2 rounded-lg transition-all retro-button ${
                      selectedAmount === tip.amount
                        ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-400'
                        : 'border-green-400 hover:border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                    }`}
                  >
                    <div className="text-xl font-bold">{tip.label}</div>
                    <div className="text-sm text-gray-300">{tip.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center retro-text">
                Or Enter Custom Amount
              </h3>
              <div className="flex justify-center">
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-black border-2 border-green-400 rounded-lg text-white text-xl text-center focus:border-yellow-400 focus:outline-none retro-input"
                    maxLength="5"
                  />
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="text-center space-y-4">
              <button 
                onClick={handlePayment}
                disabled={!selectedAmount && !customAmount}
                className="px-8 py-4 bg-yellow-400 text-black font-bold text-xl rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed retro-button-primary"
              >
                💳 PAY NOW 💳
              </button>
              
              <div className="text-center">
                <button 
                  onClick={handleBackClick}
                  className="text-green-400 hover:text-yellow-400 transition-colors retro-text"
                >
                  ← Back to About
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Retro Styling */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        .retro-text {
          font-family: 'Orbitron', monospace;
          letter-spacing: 2px;
        }
        
        .retro-grid {
          background-image: 
            linear-gradient(rgba(255, 251, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 251, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: grid-move 20s linear infinite;
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .glow-effect {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 251, 0, 0.1) 0%,
            rgba(0, 255, 0, 0.05) 50%,
            transparent 100%
          );
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: glow-pulse 4s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .animate-glow {
          text-shadow: 
            0 0 10px #FFFB00,
            0 0 20px #FFFB00,
            0 0 30px #FFFB00;
          animation: text-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes text-glow {
          from {
            text-shadow: 
              0 0 10px #FFFB00,
              0 0 20px #FFFB00,
              0 0 30px #FFFB00;
          }
          to {
            text-shadow: 
              0 0 20px #FFFB00,
              0 0 30px #FFFB00,
              0 0 40px #FFFB00;
          }
        }
        
        .glow-container {
          box-shadow: 
            0 0 20px rgba(255, 251, 0, 0.3),
            inset 0 0 20px rgba(255, 251, 0, 0.1);
        }
        
        .retro-button {
          position: relative;
          overflow: hidden;
          font-family: 'Orbitron', monospace;
          font-weight: 700;
        }
        
        .retro-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 251, 0, 0.2),
            transparent
          );
          transition: left 0.5s;
        }
        
        .retro-button:hover::before {
          left: 100%;
        }
        
        .retro-button-primary {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          box-shadow: 
            0 0 15px rgba(255, 251, 0, 0.5),
            inset 0 0 15px rgba(255, 251, 0, 0.1);
          animation: button-pulse 2s ease-in-out infinite;
        }
        
        @keyframes button-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 15px rgba(255, 251, 0, 0.5),
              inset 0 0 15px rgba(255, 251, 0, 0.1);
          }
          50% { 
            box-shadow: 
              0 0 25px rgba(255, 251, 0, 0.8),
              inset 0 0 25px rgba(255, 251, 0, 0.2);
          }
        }
        
        .retro-input {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
        }
        
        .retro-input:focus {
          box-shadow: 
            0 0 15px rgba(255, 251, 0, 0.5),
            inset 0 0 15px rgba(255, 251, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default TipTheDev;