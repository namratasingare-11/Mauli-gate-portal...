
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  Menu, 
  X,
  Library,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Role } from '../types';
import { FeedbackModal } from './FeedbackModal';
import { Calculator } from './Calculator';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/syllabus', label: 'Syllabus Tracker', icon: BookOpen },
  { path: '/materials', label: 'Digital Library', icon: Library },
  { path: '/exam', label: 'Mock Exams', icon: PenTool },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    storageService.logout();
    navigate('/login');
  };

  useEffect(() => {
    // Initial Load
    setCurrentLogo(storageService.getAppLogo());

    // Listen for logo changes
    const handleLogoChange = () => {
      setCurrentLogo(storageService.getAppLogo());
    };

    window.addEventListener('logo-change', handleLogoChange);
    return () => window.removeEventListener('logo-change', handleLogoChange);
  }, []);

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser?.role === Role.ADMIN;

  return (
    <div className="flex flex-col min-h-screen font-sans text-stone-900 bg-stone-50/50">
      {/* Feedback Modal */}
      {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
      
      {/* Floating Calculator */}
      <Calculator />

      {/* --- PREMIUM HEADER --- */}
      <header className="flex flex-col shadow-xl z-40 sticky top-0">
        
        {/* Tier 2: Brand Bar (Logo & Title) */}
        <div className="bg-white border-b border-stone-100 py-4 lg:py-6">
           <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
              <div className="flex items-center gap-6 cursor-pointer" onClick={() => navigate('/')}>
                 <div className="relative group">
                    <div className="absolute inset-0 bg-primary-200 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative p-1 rounded-full flex-shrink-0">
                      {currentLogo && <img src={currentLogo} alt="Mauli College Logo" className="w-16 h-16 lg:w-24 lg:h-24 object-contain" />}
                    </div>
                 </div>
                 <div>
                    <h1 className="text-3xl lg:text-5xl font-serif font-black tracking-tight text-primary-900 leading-none">
                      MAULI GATE
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="h-0.5 w-8 bg-primary-500"></span>
                      <p className="text-sm lg:text-base text-stone-500 font-bold tracking-[0.2em] uppercase">
                        Portal of Excellence
                      </p>
                    </div>
                 </div>
              </div>

              {/* Profile Snippet (Desktop) */}
              <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-stone-100">
                 <div className="text-right">
                    <p className="font-bold text-stone-900 leading-tight">{currentUser?.name}</p>
                    <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">{isAdmin ? 'Administrator' : 'Student'}</p>
                 </div>
                 <Link to="/profile" className="relative group">
                    <div className="h-12 w-12 rounded-full bg-stone-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden group-hover:ring-2 ring-primary-500 transition-all">
                       {currentUser?.avatar ? (
                         <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-lg font-serif font-bold text-stone-600">{currentUser?.name.charAt(0)}</span>
                       )}
                    </div>
                 </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? <X className="w-8 h-8"/> : <Menu className="w-8 h-8"/>}
              </button>
           </div>
        </div>

        {/* Tier 3: Navigation Bar (Sticky Gradient) - Lightened to remove "Black Line" look */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white shadow-lg hidden lg:block border-t border-primary-500">
           <div className="max-w-7xl mx-auto px-6">
              <nav className="flex items-center space-x-1">
                 {NAV_ITEMS.map((item) => {
                   const Icon = item.icon;
                   return (
                     <NavLink
                       key={item.path}
                       to={item.path}
                       className={({ isActive }: { isActive: boolean }) => `
                         flex items-center px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-4 
                         ${isActive 
                           ? 'bg-primary-800/30 border-white text-white shadow-inner' 
                           : 'border-transparent text-primary-50 hover:text-white hover:bg-white/10'
                         }
                       `}
                     >
                       <Icon className="w-4 h-4 mr-2.5 opacity-80" />
                       {item.label}
                     </NavLink>
                   );
                 })}
                 {isAdmin && (
                   <NavLink
                       to="/users"
                       className={({ isActive }: { isActive: boolean }) => `
                         flex items-center px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-4 
                         ${isActive 
                           ? 'bg-primary-800/30 border-white text-white shadow-inner' 
                           : 'border-transparent text-primary-50 hover:text-white hover:bg-white/10'
                         }
                       `}
                     >
                       <Users className="w-4 h-4 mr-2.5 opacity-80" />
                       Students
                     </NavLink>
                 )}
              </nav>
           </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full box-border pt-6 pb-12">
        {/* --- SIDEBAR (Mobile Only) --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-stone-900 text-stone-100 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out border-r border-stone-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full flex flex-col">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-800">
                <span className="font-serif font-bold text-xl">MAULI GATE</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-stone-800 rounded"><X/></button>
             </div>

             <nav className="space-y-2 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }: { isActive: boolean }) => `
                      group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg' 
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
              {isAdmin && (
                <NavLink
                    to="/users"
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }: { isActive: boolean }) => `
                      group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg' 
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center">
                          <Users className="w-5 h-5 mr-3" />
                          <span className="font-medium">User Management</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </>
                    )}
                  </NavLink>
              )}
            </nav>

            <div className="pt-6 border-t border-stone-800">
               <NavLink to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-800 transition-colors mb-2">
                  <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center font-bold">
                    {currentUser?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{currentUser?.name}</p>
                    <p className="text-xs text-stone-500">View Profile</p>
                  </div>
               </NavLink>
               <button 
                 onClick={handleLogout}
                 className="flex items-center w-full px-4 py-3 text-red-400 hover:text-white hover:bg-red-900/50 rounded-xl transition-colors font-medium"
               >
                 <LogOut className="w-5 h-5 mr-3" />
                 Sign Out
               </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 px-4 lg:px-6 w-full">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="bg-stone-900 text-stone-300 py-16 border-t-8 border-primary-700 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm relative z-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                 <div className="bg-white p-2 rounded-lg shadow-lg">
                    {currentLogo && <img src={currentLogo} alt="MCOET" className="w-12 h-12 object-contain" />}
                 </div>
                 <div>
                    <h3 className="text-white font-serif font-black text-2xl tracking-wide">MAULI GATE PORTAL</h3>
                    <p className="text-primary-400 text-xs font-bold uppercase tracking-widest">Excellence in Engineering</p>
                 </div>
              </div>
              <p className="opacity-70 leading-relaxed text-base max-w-md mb-6">
                MCOET, Khamgaon provides world-class digital infrastructure for GATE aspirants. This portal offers a comprehensive suite of mock tests, study materials, and tracking tools designed for success.
              </p>
              <div className="flex gap-4">
                 {/* Social Icons Placeholder */}
                 <div className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary-600 transition-colors cursor-pointer flex items-center justify-center"><Mail className="w-4 h-4"/></div>
                 <div className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary-600 transition-colors cursor-pointer flex items-center justify-center"><MapPin className="w-4 h-4"/></div>
                 <div className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary-600 transition-colors cursor-pointer flex items-center justify-center"><Phone className="w-4 h-4"/></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center"><span className="w-8 h-1 bg-primary-500 mr-3 rounded-full"></span>Quick Links</h3>
              <ul className="space-y-4 font-medium">
                <li><a href="#/exam" className="hover:text-primary-400 hover:translate-x-1 transition-all flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-primary-500"/> Mock Tests Series</a></li>
                <li><a href="#/materials" className="hover:text-primary-400 hover:translate-x-1 transition-all flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-primary-500"/> Digital Library</a></li>
                <li><a href="#/syllabus" className="hover:text-primary-400 hover:translate-x-1 transition-all flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-primary-500"/> Syllabus Tracker</a></li>
                <li><a href="#/profile" className="hover:text-primary-400 hover:translate-x-1 transition-all flex items-center"><ChevronRight className="w-3 h-3 mr-2 text-primary-500"/> User Profile</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center"><span className="w-8 h-1 bg-primary-500 mr-3 rounded-full"></span>Support</h3>
              <p className="opacity-70 text-sm mb-4">
                Facing technical issues? Our support team is available 24/7.
              </p>
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="group flex items-center text-white bg-primary-700 hover:bg-primary-600 px-5 py-3 rounded-lg transition-all shadow-lg hover:shadow-primary-600/20"
              >
                Feedback & Report
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8">
                 <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Admin Contact</p>
                 <p className="font-mono text-primary-300">admin@mcoet.mauligroup.org</p>
              </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-stone-800 text-center text-sm opacity-50 font-medium">
            &copy; {new Date().getFullYear()} Mauli Group of Institutions. All Rights Reserved. | Designed with precision.
         </div>
      </footer>
    </div>
  );
};
