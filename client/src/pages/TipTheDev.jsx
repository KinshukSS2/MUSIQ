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
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_9WJjPkmjqCy5Pz",
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
      <div className="min-h-screen bg-black text-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="retro-grid"></div>
          <div className="glow-effect"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8 bg-white p-12 rounded-2xl shadow-2xl border-4 border-[#FFFB00]">
            <div className="text-6xl md:text-8xl font-bold text-[#FFFB00] animate-bounce coffee-title">
              ☕ THANK YOU! ☕
            </div>
            <div className="text-2xl md:text-3xl text-black coffee-subtitle font-bold">
              Coffee Purchased Successfully!
            </div>
            <div className="text-lg text-gray-700 coffee-text">
              Your support keeps the code brewing! ☕💻
            </div>
            <div className="text-[#FFFB00] animate-pulse coffee-text font-semibold">
              Redirecting to About page in 5 seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-black relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0">
        <div className="retro-grid"></div>
        <div className="glow-effect"></div>
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src="/coffee-icon.svg" alt="Coffee" className="w-16 h-16 md:w-20 md:h-20" />
              <h1 className="text-5xl md:text-7xl font-bold text-[#FFFB00] coffee-title-cursive">
                Buy me a coffee
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white mb-4 coffee-subtitle font-semibold">
              Support MusIQ Development
            </p>
            <div className="bg-[#FFFB00] p-4 rounded-lg inline-block">
              {/* <p className="text-lg text-black font-medium coffee-text animate-pulse">
                ☕ Help Kinshuk build more awesome features for MusIQ! 🎮🎵
              </p> */}
            </div>
          </div>

          {/* Main Container */}
          <div className="bg-gray-900 bg-opacity-95 border-2 border-[#FFFB00] border-opacity-60 rounded-2xl p-8 shadow-2xl coffee-container backdrop-blur-sm">
            
            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#FFFB00] mb-6 text-center coffee-subtitle">
                ☕ Choose Your Coffee Size
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {tipAmounts.map((tip, index) => (
                  <button
                    key={tip.amount}
                    onClick={() => handleAmountSelect(tip.amount)}
                    className={`p-6 border-2 rounded-xl transition-all coffee-button relative ${
                      selectedAmount === tip.amount
                        ? 'border-[#FFFB00] bg-[#FFFB00] bg-opacity-20 text-[#FFFB00] shadow-lg transform scale-105'
                        : 'border-gray-600 bg-gray-800 bg-opacity-50 hover:border-[#FFFB00] hover:bg-[#FFFB00] hover:bg-opacity-10 text-white hover:text-[#FFFB00]'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">☕</div>
                      <div className="text-xl font-bold coffee-subtitle">{tip.label}</div>
                      <div className="text-sm text-gray-400 coffee-text">{tip.desc}</div>
                    </div>
                    {selectedAmount === tip.amount && (
                      <div className="absolute -top-2 -right-2 bg-[#FFFB00] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#FFFB00] mb-4 text-center coffee-subtitle">
                ☕ Or Choose Custom Amount
              </h3>
              <div className="flex justify-center">
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FFFB00] text-xl font-bold">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0"
                    className="w-full pl-10 pr-6 py-4 bg-gray-800 bg-opacity-80 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 text-xl text-center focus:border-[#FFFB00] focus:outline-none coffee-input font-semibold"
                    maxLength="5"
                  />
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="text-center space-y-6">
              <button 
                onClick={handlePayment}
                disabled={!selectedAmount && !customAmount}
                className="px-12 py-4 bg-[#FFFB00] text-black font-bold text-xl rounded-xl hover:bg-yellow-300 hover:text-black border-2 border-[#FFFB00] transition-all disabled:opacity-50 disabled:cursor-not-allowed coffee-pay-button flex items-center justify-center gap-3 mx-auto"
              >
                ☕ <span>Buy me a coffee</span> ☕
              </button>
              
              <div className="text-center">
                <button 
                  onClick={handleBackClick}
                  className="group relative bg-gray-800 bg-opacity-80 border-2 border-[#FFFB00] text-[#FFFB00] font-bold px-6 py-3 rounded-xl hover:bg-[#FFFB00] hover:text-black transition-all duration-300 font-silkscreen text-lg hover:scale-105 hover:shadow-lg"
                  title="Back to About"
                >
                  <span className="flex items-center gap-2">
                    ← <span className="group-hover:hidden">BACK</span>
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ← TO ABOUT PAGE
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Dancing+Script:wght@400;500;600;700&family=Kaushan+Script&display=swap');
        
        .coffee-title-cursive {
          font-family: 'Kaushan Script', cursive;
          font-weight: 400;
          letter-spacing: 1px;
          text-shadow: 
            0 0 10px rgba(255, 251, 0, 0.8),
            0 0 20px rgba(255, 251, 0, 0.6),
            0 0 30px rgba(255, 251, 0, 0.4),
            2px 2px 4px rgba(0, 0, 0, 0.8);
          filter: drop-shadow(0 0 8px rgba(255, 251, 0, 0.7));
        }
        
        .coffee-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          letter-spacing: -1px;
          text-shadow: 
            0 0 10px rgba(255, 251, 0, 0.8),
            0 0 20px rgba(255, 251, 0, 0.6),
            2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .coffee-subtitle {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-shadow: 
            0 0 8px rgba(255, 251, 0, 0.5),
            1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .coffee-text {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          letter-spacing: 0.2px;
        }
        
        .coffee-pattern {
          background-image: 
            radial-gradient(circle at 25px 25px, rgba(255, 251, 0, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(255, 251, 0, 0.05) 1px, transparent 1px);
          background-size: 100px 100px, 50px 50px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: float 20s ease-in-out infinite;
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .coffee-container {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 251, 0, 0.1);
        }
        
        .coffee-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 40%, rgba(255, 251, 0, 0.02) 50%, transparent 60%);
          animation: shimmer 12s ease-in-out infinite;
          pointer-events: none;
        }
        
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(0%) translateY(0%) rotate(45deg); }
        }
        
        .coffee-button {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .coffee-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 251, 0, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .coffee-button:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .coffee-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 251, 0, 0.2);
        }
        
        .coffee-pay-button {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: 0 4px 15px rgba(255, 251, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .coffee-pay-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }
        
        .coffee-pay-button:hover::before {
          left: 100%;
        }
        
        .coffee-pay-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(255, 251, 0, 0.5);
        }
        
        .coffee-input {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
        }
        
        .coffee-input:focus {
          box-shadow: 
            0 4px 20px rgba(255, 251, 0, 0.2),
            0 0 0 2px rgba(255, 251, 0, 0.3);
          transform: translateY(-1px);
          background-color: rgba(31, 41, 55, 0.9);
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        /* Coffee Cup Animation */
        @keyframes steam {
          0%, 100% { opacity: 0.6; transform: translateY(0px) scale(1); }
          50% { opacity: 1; transform: translateY(-10px) scale(1.1); }
        }
        
        .coffee-steam {
          animation: steam 2s ease-in-out infinite;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .coffee-container {
            padding: 1.5rem;
            margin: 0 1rem;
          }
          
          .coffee-input {
            width: 250px;
          }
          
          .coffee-button {
            padding: 1rem;
          }
          
          .coffee-pay-button {
            width: 100%;
            max-width: 300px;
          }
        }
        
        /* Coffee bounce animation */
        @keyframes coffee-bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .coffee-icon:hover {
          animation: coffee-bounce 1s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default TipTheDev;