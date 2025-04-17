
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, BarChart } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C]/90 backdrop-blur-md border-t border-white/10">
      <div className="max-w-lg mx-auto flex items-center justify-around py-4">
        {/* Left Button - Resilience Journey */}
        <button 
          onClick={() => navigate('/journey')}
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/journey' ? 'text-white' : 'text-[#999]'}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs">Explorar</span>
        </button>

        {/* Center Button - Home */}
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center space-y-1 -mt-8 relative`}
        >
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center bg-white
            ${location.pathname === '/' ? 'shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}
          `}>
            <div className="w-14 h-14 bg-[#00B383] rounded-full flex items-center justify-center">
              <Home className="h-7 w-7 text-white" />
            </div>
          </div>
          <span className={`text-xs ${location.pathname === '/' ? 'text-white' : 'text-[#999]'}`}>Home</span>
        </button>

        {/* Right Button - BOLT Score */}
        <button 
          onClick={() => navigate('/bolt')}
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/bolt' ? 'text-white' : 'text-[#999]'}`}
        >
          <BarChart className="h-6 w-6" />
          <span className="text-xs">Mídete</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
