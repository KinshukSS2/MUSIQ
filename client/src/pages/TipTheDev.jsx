import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import soundManager from '../utils/soundManager';

const TipTheDev = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const tipAmounts = [
    { amount: 50, label: '₹50' },
    { amount: 100, label: '₹100' },
    { amount: 250, label: '₹250' },
    { amount: 500, label: '₹500' },
    { amount: 1000, label: '₹1000' },
    { amount: 2500, label: '₹2500' }
  ];

  const wheelAmounts = [25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000];

  const getTotalAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const handleSpinWheel = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    await soundManager.init();
    soundManager.play('click');
    
    const randomIndex = Math.floor(Math.random() * wheelAmounts.length);
    const selectedWheelAmount = wheelAmounts[randomIndex];
    
    // Calculate rotation (16 segments, 360/16 = 22.5 degrees per segment)
    const segmentAngle = 360 / wheelAmounts.length;
    const targetRotation = wheelRotation + 1440 + (randomIndex * segmentAngle); // 4 full spins + target
    
    setWheelRotation(targetRotation);
    
    setTimeout(() => {
      setSelectedAmount(selectedWheelAmount);
      setCustomAmount('');
      setIsSpinning(false);
      soundManager.play('success');
    }, 3000);
  };

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
      
      {/* Left Arrow Button */}
      <button 
        onClick={handleBackClick}
        className="fixed top-24 left-6 z-20 bg-gray-800 bg-opacity-80 border-2 border-[#FFFB00] text-[#FFFB00] font-bold p-3 rounded-xl hover:bg-[#FFFB00] hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg"
        title="Back to About"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src="/coffee-icon.svg" alt="Coffee" className="w-16 h-16 md:w-20 md:h-20" />
              <h1 className="text-4xl md:text-6xl font-bold text-[#FFFB00] font-silkscreen coffee-title-silkscreen">
                BUY ME A COFFEE
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white mb-4 font-silkscreen font-semibold tracking-wide">
              SUPPORT MUSIQ DEVELOPMENT
            </p>
          </div>

          {/* Main Container - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Donation Options */}
            <div className="bg-gray-900 bg-opacity-95 border-2 border-[#FFFB00] border-opacity-60 rounded-2xl p-6 shadow-2xl coffee-container backdrop-blur-sm">
              
              {/* Amount Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {tipAmounts.map((tip, index) => (
                    <button
                      key={tip.amount}
                      onClick={() => handleAmountSelect(tip.amount)}
                      className={`p-4 border-2 rounded-xl transition-all coffee-button relative ${
                        selectedAmount === tip.amount
                          ? 'border-[#FFFB00] bg-[#FFFB00] text-black shadow-lg transform scale-105'
                          : 'border-gray-600 bg-gray-800 bg-opacity-50 hover:border-[#FFFB00] hover:bg-gray-700 text-white hover:text-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">☕</div>
                        <div className="text-sm font-bold font-silkscreen">{tip.label}</div>
                      </div>
                      {selectedAmount === tip.amount && (
                        <div className="absolute -top-2 -right-2 bg-[#FFFB00] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold font-silkscreen">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Amount Display - Now Editable */}
              <div className="mb-6">
                <div className="bg-black bg-opacity-50 border border-[#FFFB00] rounded-lg p-4 text-center">
                  <h4 className="text-sm font-silkscreen text-[#FFFB00] mb-2">TOTAL AMOUNT</h4>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FFFB00] text-xl font-bold font-silkscreen">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={getTotalAmount()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && parseInt(value) <= 50000) {
                          setCustomAmount(value);
                          setSelectedAmount(null);
                        }
                      }}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2 bg-transparent text-[#FFFB00] text-2xl font-bold font-silkscreen text-center focus:outline-none border-none"
                      maxLength="5"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="text-center">
                <button 
                  onClick={handlePayment}
                  disabled={!selectedAmount && !customAmount}
                  className="w-full px-8 py-3 bg-[#FFFB00] text-black font-bold text-md rounded-xl hover:bg-yellow-300 hover:text-black border-2 border-[#FFFB00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-silkscreen tracking-wide"
                >
                  BUY ME A COFFEE
                </button>
              </div>
            </div>

            {/* Right Side - Spin the Wheel */}
            <div className="bg-gray-900 bg-opacity-95 border-2 border-[#FFFB00] border-opacity-60 rounded-2xl p-6 shadow-2xl coffee-container backdrop-blur-sm flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-[#FFFB00] mb-6 text-center font-silkscreen tracking-wide">
                FEELING LUCKY? SPIN THE WHEEL!
              </h3>
              
              {/* Wheel Container */}
              <div className="relative mb-6">
                <div className="relative w-72 h-72 mx-auto">
                  {/* Wheel */}
                  <div 
                    className={`w-full h-full rounded-full border-4 border-[#FFFB00] relative overflow-hidden transition-transform duration-3000 ease-out ${isSpinning ? 'animate-spin-slow' : ''}`}
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    {wheelAmounts.map((amount, index) => {
                      const angle = (360 / wheelAmounts.length) * index;
                      const isEven = index % 2 === 0;
                      return (
                        <div
                          key={amount}
                          className={`absolute w-full h-full ${isEven ? 'bg-[#FFFB00]' : 'bg-gray-800'} opacity-80`}
                          style={{
                            transform: `rotate(${angle}deg)`,
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((360 / wheelAmounts.length) * Math.PI / 180)}% ${50 - 50 * Math.sin((360 / wheelAmounts.length) * Math.PI / 180)}%)`
                          }}
                        >
                          <div 
                            className={`absolute top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold font-silkscreen ${isEven ? 'text-black' : 'text-[#FFFB00]'}`}
                            style={{ transform: `rotate(${(360 / wheelAmounts.length) / 2}deg)` }}
                          >
                            ₹{amount}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#FFFB00]"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className={`px-8 py-3 bg-[#FFFB00] text-black font-bold text-md rounded-xl border-2 border-[#FFFB00] transition-all font-silkscreen tracking-wide ${
                  isSpinning 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-yellow-300 hover:scale-105'
                }`}
              >
                {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
              </button>
              
              <p className="text-xs text-gray-400 font-silkscreen mt-3 text-center">
                LET THE WHEEL DECIDE YOUR DONATION!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Dancing+Script:wght@400;500;600;700&family=Kaushan+Script&display=swap');
        
        .coffee-title-silkscreen {
          font-family: 'Silkscreen', sans-serif;
          font-weight: 400;
          letter-spacing: 2px;
          text-shadow: 
            0 0 3px rgba(255, 251, 0, 0.4),
            0 0 6px rgba(255, 251, 0, 0.2),
            2px 2px 4px rgba(0, 0, 0, 0.8);
          filter: drop-shadow(0 0 2px rgba(255, 251, 0, 0.3));
        }
        
        /* Wheel Animation */
        .duration-3000 {
          transition-duration: 3s;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s ease-out;
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