
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import { storageService } from '../services/storageService';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true });
  const [error, setError] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  
  useEffect(() => {
    storageService.init();
    setCurrentLogo(storageService.getAppLogo());
    const user = storageService.getCurrentUser();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const email = formData.email.trim();
      const password = formData.password.trim();

      const user = storageService.findUserByEmail(email);
      
      if (!user) {
        setError('User not found. Please check your email or register.');
        return;
      }
      
      if (user.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      storageService.setCurrentUser(user, formData.rememberMe);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-stone-50">
      
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 text-white overflow-hidden flex-col justify-between p-12">
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-stone-900 to-primary-950 animate-gradient-xy z-0"></div>
        
        {/* Parallax Floating Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           {/* Grid Overlay */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           
           {/* Floating Orbs */}
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-600 rounded-full blur-[100px] opacity-30 animate-float"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-stone-700 rounded-full blur-[120px] opacity-30 animate-float-delayed"></div>
           <div className="absolute top-[40%] left-[20%] w-32 h-32 bg-primary-400 rounded-full blur-[50px] opacity-20 animate-pulse-slow"></div>
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
             Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">Excellence</span> in Engineering.
           </h2>
           <p className="text-lg text-primary-100/90 leading-relaxed mb-8 font-medium">
             Access the official portal for mock exams, syllabus tracking, and the digital library. Designed exclusively for MCOET aspirants.
           </p>
           <div className="flex gap-2">
              <div className="h-1.5 w-16 bg-primary-500 rounded-full shadow-glow"></div>
              <div className="h-1.5 w-4 bg-white/30 rounded-full"></div>
              <div className="h-1.5 w-4 bg-white/30 rounded-full"></div>
           </div>
        </div>

        <div className="relative z-10 text-xs text-stone-400 font-mono">
           &copy; {new Date().getFullYear()} Mauli College of Engineering & Technology
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
               <h2 className="text-3xl font-bold text-stone-900">Welcome Back</h2>
               <p className="mt-2 text-stone-500">Please enter your credentials to access your dashboard.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1">
                    Email Address
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
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={e => setFormData({...formData, rememberMe: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-600 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-bold text-primary-700 hover:text-primary-900 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full text-base py-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                Sign In
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 rounded-xl bg-white border border-stone-200 p-4 text-xs text-stone-500 shadow-sm">
                 <p className="font-bold mb-2 uppercase tracking-wide text-stone-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Quick Demo Access
                 </p>
                 <div className="space-y-2">
                   <div 
                     className="flex justify-between items-center bg-stone-50 p-2 rounded border border-stone-100 cursor-pointer hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-all group"
                     onClick={() => { setFormData({ ...formData, email: 'student@mcoet.mauligroup.org', password: 'pass123' }) }}
                   >
                      <span><span className="font-bold">Student:</span> student@mcoet.mauligroup.org</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                   </div>
                   <div 
                     className="flex justify-between items-center bg-stone-50 p-2 rounded border border-stone-100 cursor-pointer hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-all group"
                     onClick={() => { setFormData({ ...formData, email: 'admin@mcoet.mauligroup.org', password: 'admin' }) }}
                   >
                      <span><span className="font-bold">Admin:</span> admin@mcoet.mauligroup.org</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                   </div>
                 </div>
              </div>
            </form>

            <div className="mt-8 text-center">
               <p className="text-stone-500">
                 Don't have an account?{' '}
                 <Link to="/signup" className="font-bold text-primary-700 hover:text-primary-900 transition-colors">
                   Register Now
                 </Link>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
