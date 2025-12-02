
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import { storageService } from '../services/storageService';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { User, Role } from '../types';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');

  useEffect(() => {
    setCurrentLogo(storageService.getAppLogo());
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (storageService.findUserByEmail(formData.email)) {
      setError("Email already registered in the system.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: Role.USER,
      joinedDate: new Date().toISOString()
    };

    storageService.addUser(newUser);
    storageService.setCurrentUser(newUser, true);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex font-sans bg-stone-50">
      
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 text-white overflow-hidden flex-col justify-between p-12">
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-bl from-stone-900 via-primary-900 to-stone-800 opacity-95 z-0 animate-gradient-xy"></div>
        
        {/* Parallax Floating Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           {/* Grid Overlay */}
           <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           {/* Floating Geometric Shapes */}
           <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] border border-white/10 rounded-full animate-float opacity-40"></div>
           <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] border-2 border-primary-500/20 rounded-full animate-float-delayed"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-[60px] animate-pulse-slow"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
           <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg">
                {currentLogo && <img src={currentLogo} alt="Mauli Logo" className="w-16 h-16 object-contain" />}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-wide text-white drop-shadow-md">MAULI GROUP</h1>
                <p className="text-primary-200 text-sm font-bold uppercase tracking-widest">Institutions of Engineering</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 max-w-lg animate-slide-up">
           <h2 className="text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
             Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-white">Community</span> of Achievers.
           </h2>
           <p className="text-lg text-primary-100/90 leading-relaxed mb-8 font-medium">
             Create your profile today to track your progress, access unlimited study materials, and take realistic mock tests.
           </p>
        </div>

        <div className="relative z-10 text-xs text-stone-400 font-mono">
           Mauli College of Engineering & Technology
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-24 relative bg-stone-50/50">
         {/* Mobile Logo Header */}
         <div className="lg:hidden mb-8 text-center animate-fade-in">
             {currentLogo && <img src={currentLogo} alt="Mauli Logo" className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-md" />}
             <h2 className="text-xl font-serif font-bold text-primary-900">MAULI GATE PORTAL</h2>
         </div>

         <div className="w-full max-w-md space-y-8 animate-slide-up">
            <div className="text-center lg:text-left">
               <h2 className="text-3xl font-bold text-stone-900">Create Account</h2>
               <p className="mt-2 text-stone-500">Begin your journey to GATE success.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:shadow-md"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1">
                    College Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:shadow-md"
                      placeholder="student@mcoet.mauligroup.org"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:shadow-md"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-stone-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-stone-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm hover:shadow-md"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                   <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full text-base py-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                Create Account
              </Button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-stone-500">
                 Already have an account?{' '}
                 <Link to="/login" className="font-bold text-primary-700 hover:text-primary-900 transition-colors">
                   Sign In
                 </Link>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
