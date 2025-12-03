import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, Badge, Link } from '../components/Common';
import { storageService } from '../services/storageService';
import { ExamResult, UserStats, Announcement, Role, Question, TodoItem } from '../types';
import { Trophy, Clock, Target, Calendar, Megaphone, Bell, Plus, ShieldCheck, X, Lightbulb, Award, CheckSquare, Trash2, ArrowRight } from 'lucide-react';

const StatBox: React.FC<{ title: string; value: string; icon: any; color: string; subtext?: string }> = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-primary-200 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
    <Card className="p-6 relative overflow-hidden border-none h-full flex flex-col justify-between group-hover:-translate-y-2 transition-transform duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:scale-175 transition-transform duration-500 origin-top-right ${color === 'primary' ? 'text-primary-800' : 'text-slate-800'}`}>
        <Icon className="w-24 h-24" />
      </div>
      
      <div className="relative z-10 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br from-white to-stone-50 text-primary-700`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">{value}</h3>
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">{title}</p>
        {subtext && <p className="text-xs text-stone-400 mt-1">{subtext}</p>}
      </div>
    </Card>
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);
  const [showDailyResult, setShowDailyResult] = useState(false);
  
  // Todo
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Admin State
  const [isPosting, setIsPosting] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'info' as 'info' | 'alert' | 'success' });

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser?.role === Role.ADMIN;

  useEffect(() => {
    setStats(storageService.getStats());
    setResults(storageService.getResults());
    setAnnouncements(storageService.getAnnouncements());
    setTodos(storageService.getTodos());

    // Deterministic Question
    const today = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const questions = storageService.getQuestions();
    const index = seed % questions.length;
    setDailyQuestion(questions[index]);
  }, []);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) return;
    const announcement: Announcement = {
      id: crypto.randomUUID(),
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      type: newAnnouncement.type,
      date: new Date().toISOString()
    };
    storageService.addAnnouncement(announcement);
    setAnnouncements(storageService.getAnnouncements());
    setIsPosting(false);
    setNewAnnouncement({ title: '', message: '', type: 'info' });
  };

  const handleDailyAnswer = (idx: number) => {
    if (showDailyResult) return;
    setDailyAnswer(idx);
    setShowDailyResult(true);
  };

  const addTodo = () => {
    if(!newTodo.trim()) return;
    const items = storageService.addTodo(newTodo);
    setTodos(items);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const items = storageService.toggleTodo(id);
    setTodos(items);
  };

  const deleteTodo = (id: string) => {
    const items = storageService.deleteTodo(id);
    setTodos(items);
  };

  if (!stats) return <div className="p-12 text-center text-stone-500 font-serif text-lg">Initializing Dashboard...</div>;

  const recentPerformance = results.slice(-5).map((r, i) => ({
    name: `T${i + 1}`,
    score: r.score,
    fullTest: r.testName
  }));

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* --- HERO SECTION --- */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-900 text-white min-h-[220px] flex items-center">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#8D6E63" />
              <circle cx="90" cy="20" r="15" fill="#5D4037" />
              <circle cx="10" cy="80" r="20" fill="#795548" />
           </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-primary-900 to-primary-800 opacity-90"></div>
        
        <div className="relative z-10 px-8 md:px-12 py-8 w-full flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex-1">
              <Badge color="yellow" className="mb-3">Academic Session 2024-25</Badge>
              <h1 className="text-3xl md:text-5xl font-serif font-black mb-2 leading-tight">
                Welcome back, {currentUser?.name.split(' ')[0]}
              </h1>
              <p className="text-primary-100 text-lg opacity-90 max-w-xl">
                {isAdmin ? 'Manage announcements, users, and digital library from your command center.' : 'Your path to GATE success continues here. Resume your practice or explore new topics.'}
              </p>
           </div>
           
           <div className="hidden md:block">
              <Link to={isAdmin ? '/users' : '/exam'}>
                <button className="bg-white text-primary-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-primary-50 transition-all transform hover:scale-105 flex items-center">
                   {isAdmin ? 'Manage Users' : 'Resume Practice'} <ArrowRight className="ml-2 w-5 h-5"/>
                </button>
              </Link>
           </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="flex gap-4 overflow-x-auto pb-2">
           <Button onClick={() => setIsPosting(true)} className="flex-shrink-0 shadow-lg" icon={Megaphone}>Post Notice</Button>
           <Link to="/materials"><Button variant="secondary" className="flex-shrink-0 bg-white" icon={Plus}>Manage Library</Button></Link>
           <Link to="/users"><Button variant="secondary" className="flex-shrink-0 bg-white" icon={ShieldCheck}>Student Database</Button></Link>
        </div>
      )}

      {/* Announcement Modal */}
      {isPosting && isAdmin && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-serif font-bold text-primary-900">Create Official Notice</h3>
                 <button onClick={() => setIsPosting(false)} className="p-2 hover:bg-stone-100 rounded-full"><X className="w-5 h-5 text-stone-500"/></button>
              </div>
              <form onSubmit={handlePostAnnouncement} className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Notice Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border-2 border-stone-200 rounded-xl p-3 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={newAnnouncement.title}
                      onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Content</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full border-2 border-stone-200 rounded-xl p-3 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      value={newAnnouncement.message}
                      onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Priority</label>
                    <div className="flex gap-4">
                       {['info', 'alert', 'success'].map(type => (
                          <label key={type} className={`flex-1 p-3 border-2 rounded-xl cursor-pointer text-center capitalize font-bold transition-all ${newAnnouncement.type === type ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                             <input type="radio" className="hidden" name="type" checked={newAnnouncement.type === type} onChange={() => setNewAnnouncement({...newAnnouncement, type: type as any})}/>
                             {type}
                          </label>
                       ))}
                    </div>
                 </div>
                 <Button type="submit" size="lg" className="w-full">Publish Notice</Button>
              </form>
           </Card>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox title="Tests Completed" value={stats.testsTaken.toString()} icon={Trophy} color="primary" subtext="Lifetime Mock Exams" />
        <StatBox title="Average Score" value={`${stats.averageScore}%`} icon={Target} color="primary" subtext="Across all subjects" />
        <StatBox title="Study Hours" value={`${stats.hoursStudied}+`} icon={Clock} color="primary" subtext="Estimated dedication" />
        <StatBox title="Current Streak" value={`${stats.streakDays} Days`} icon={Calendar} color="primary" subtext="Keep it up!" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Question of the Day */}
            {dailyQuestion && (
              <Card className="p-0 border-none overflow-hidden ring-1 ring-stone-200">
                 <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4 text-white flex justify-between items-center shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-white opacity-20"><Lightbulb className="w-32 h-32"/></div>
                    <div className="flex items-center gap-3 relative z-10">
                       <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Lightbulb className="w-6 h-6"/></div>
                       <h3 className="font-serif font-bold text-xl">Question of the Day</h3>
                    </div>
                    <Badge color="brown" className="relative z-10 bg-white/20 text-white border-white/30">{dailyQuestion.subject}</Badge>
                 </div>
                 <div className="p-8">
                   <p className="text-xl font-medium text-stone-800 mb-8 leading-relaxed font-serif">{dailyQuestion.text}</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dailyQuestion.options.map((opt, idx) => {
                         let btnClass = "text-left p-4 rounded-xl border-2 transition-all font-medium relative overflow-hidden";
                         if (showDailyResult) {
                            if (idx === dailyQuestion.correctAnswer) btnClass = "bg-green-50 border-green-500 text-green-900";
                            else if (idx === dailyAnswer && idx !== dailyQuestion.correctAnswer) btnClass = "bg-red-50 border-red-300 text-red-900";
                            else btnClass = "bg-stone-50 border-stone-100 text-stone-400";
                         } else {
                            btnClass += " border-stone-100 hover:border-primary-400 hover:bg-stone-50 text-stone-600";
                         }
                         return (
                            <button key={idx} onClick={() => handleDailyAnswer(idx)} disabled={showDailyResult} className={btnClass}>
                               <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span> {opt}
                            </button>
                         )
                      })}
                   </div>
                   {showDailyResult && (
                      <div className="mt-6 p-5 bg-stone-50 rounded-xl border-l-4 border-primary-500 text-stone-700 leading-relaxed animate-fade-in">
                         <strong className="block text-primary-900 mb-1">Concept Explanation:</strong>
                         {dailyQuestion.explanation}
                      </div>
                   )}
                 </div>
              </Card>
            )}

            {/* Performance Chart */}
            <Card className="p-8">
              <div className="flex justify-between items-end mb-8">
                 <div>
                   <h3 className="text-xl font-serif font-bold text-stone-900">Academic Trajectory</h3>
                   <p className="text-stone-500 text-sm">Last 5 Mock Examination Results</p>
                 </div>
                 {recentPerformance.length > 0 && (
                   <div className="text-right">
                     <p className="text-3xl font-bold text-primary-600">{recentPerformance[recentPerformance.length - 1].score}%</p>
                     <p className="text-xs uppercase font-bold text-stone-400">Latest Score</p>
                   </div>
                 )}
              </div>
              <div className="h-80 w-full">
                {recentPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recentPerformance}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8D6E63" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8D6E63" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                      <XAxis dataKey="name" stroke="#a8a29e" tick={{fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#a8a29e" tick={{fontSize: 12}} domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} 
                        itemStyle={{ color: '#5D4037', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#5D4037" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{r: 6, strokeWidth: 0}} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                    <Target className="w-12 h-12 mb-2 opacity-20"/>
                    <p className="font-bold">No data available yet</p>
                    <p className="text-sm">Complete a mock test to see your graph.</p>
                  </div>
                )}
              </div>
            </Card>
         </div>

         {/* Right Sidebar */}
         <div className="lg:col-span-1 space-y-8">
            
            {/* Notices Board */}
            <Card className="p-0 overflow-hidden h-[400px] flex flex-col shadow-lg border-stone-200">
               <div className="p-5 bg-white border-b border-stone-100 flex justify-between items-center z-10 relative">
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center">
                    <Bell className="w-5 h-5 mr-3 text-primary-600" /> Notice Board
                  </h3>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               </div>
               
               <div className="p-0 overflow-y-auto flex-1 bg-stone-50/50">
                  {announcements.map((ann, i) => (
                    <div key={ann.id} className={`p-5 border-b border-stone-100 hover:bg-white transition-colors ${i === 0 ? 'bg-white' : ''}`}>
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary-50 px-2 py-1 rounded">
                            {new Date(ann.date).toLocaleDateString()}
                          </span>
                          {ann.type === 'alert' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                       </div>
                       <h4 className="font-bold text-stone-800 text-sm mb-2 leading-snug">{ann.title}</h4>
                       <p className="text-xs text-stone-500 leading-relaxed">{ann.message}</p>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="h-full flex items-center justify-center text-stone-400 text-sm italic">All caught up!</div>
                  )}
               </div>
            </Card>

            {/* Study Planner (To-Do) */}
            <Card className="p-6">
               <div className="flex items-center mb-6">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg mr-3">
                     <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">Study Planner</h3>
                    <p className="text-xs text-stone-500">Track your preparation tasks</p>
                  </div>
               </div>

               <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Add task (e.g., Revise Math)..."
                    className="flex-1 text-sm border-stone-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTodo()}
                  />
                  <button onClick={addTodo} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors">
                     <Plus className="w-4 h-4" />
                  </button>
               </div>

               <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {todos.map(todo => (
                     <div key={todo.id} className="group flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 hover:border-emerald-200 hover:bg-white transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <button onClick={() => toggleTodo(todo.id)} className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 text-transparent hover:border-emerald-400'}`}>
                              <CheckSquare className="w-3 h-3" />
                           </button>
                           <span className={`text-sm truncate ${todo.completed ? 'text-stone-400 line-through' : 'text-stone-700 font-medium'}`}>{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo.id)} className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
                  {todos.length === 0 && <p className="text-center text-xs text-stone-400 italic py-4">No active tasks.</p>}
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
};