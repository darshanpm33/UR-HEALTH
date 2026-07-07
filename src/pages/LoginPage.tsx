import React, { useState } from 'react';
import { Activity, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      {/* Left Pane - Orange Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 flex-col justify-between p-16 text-white relative overflow-hidden">
        
        {/* Subtle background glow/noise could go here, but omitted for simplicity */}
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/10">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">UrHealth</span>
        </div>

        {/* Main Typography */}
        <div className="z-10 relative">
          <h1 className="text-6xl font-black mb-4 tracking-tighter leading-[1.1]">
            Seconds Matter.<br />
            <span className="text-white/80 font-semibold italic opacity-90">Your Access Counts.</span>
          </h1>
          <p className="text-white/90 text-lg max-w-md leading-relaxed mt-6 mb-12">
            The world's most advanced emergency orchestration platform.
            <br className="hidden md:block" />
            Role-based access for hospitals, ambulances, and patients.
          </p>
          
          {/* Avatar Group */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-4">
              {/* Dummy Avatars */}
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-gray-200" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=1)', backgroundSize: 'cover' }}></div>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-gray-300" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=2)', backgroundSize: 'cover' }}></div>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-gray-400" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=3)', backgroundSize: 'cover' }}></div>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-gray-500" style={{ backgroundImage: 'url(https://i.pravatar.cc/100?img=4)', backgroundSize: 'cover' }}></div>
            </div>
            <span className="text-sm font-medium text-white/90">Joined by 2,400+ Command Centers</span>
          </div>
        </div>
        
        {/* Placeholder for the bottom left to balance layout */}
        <div className="h-8"></div>
      </div>

      {/* Right Pane - White Card Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-10 sm:p-12 border border-gray-100">
          
          {/* Form Header */}
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Access Portal</h2>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
              SECURE GATEWAY • TLS 1.3 ENCRYPTION
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm font-medium bg-gray-50/50 focus:bg-white"
                  placeholder="hospital_1"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm font-medium bg-gray-50/50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-orange-600 bg-white border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all mt-8"
            >
              Secure Login
            </button>
          </form>

          {/* Footer Area */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-[10px] font-bold text-green-700 tracking-wide uppercase">Enterprise Grade Identity Protection</span>
            </div>
            
            <p className="text-xs text-gray-500 font-medium">
              New to the network? <a href="#" className="font-bold text-orange-600 hover:text-orange-500">Initialize Account</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
