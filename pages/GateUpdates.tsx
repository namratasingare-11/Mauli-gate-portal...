import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/Common';
import { Calendar, History, ExternalLink, AlertCircle, CheckCircle, Clock, Building2 } from 'lucide-react';

export const GateUpdates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');

  // Static Data for GATE History (Last 10 Years)
  const gateHistory = [
    { year: 2024, institute: 'IISc Bangalore', highlight: 'Introduced Data Science & AI (DA) Paper.' },
    { year: 2023, institute: 'IIT Kanpur', highlight: 'No new papers. Standard pattern maintained.' },
    { year: 2022, institute: 'IIT Kharagpur', highlight: 'Two new papers: Geomatics & Naval Architecture.' },
    { year: 2021, institute: 'IIT Bombay', highlight: 'Introduced ES (Environmental) & XH (Humanities) papers.' },
    { year: 2020, institute: 'IIT Delhi', highlight: 'Biomedical Engineering paper added.' },
    { year: 2019, institute: 'IIT Madras', highlight: 'Statistics paper added.' },
    { year: 2018, institute: 'IIT Guwahati', highlight: 'Virtual Calculator interface updated.' },
    { year: 2017, institute: 'IIT Roorkee', highlight: 'International centers added in 6 countries.' },
    { year: 2016, institute: 'IISc Bangalore', highlight: 'Online virtual calculator introduced for the first time.' },
    { year: 2015, institute: 'IIT Kanpur', highlight: 'Last year where physical calculators were partially allowed.' },
  ];

  // Static Data for Upcoming Schedule (Simulation)
  const upcomingEvents = [
    { 
      date: 'Aug 30, 2024', 
      title: 'Registration Opens', 
      status: 'completed', 
      description: 'Online application portal opens for all candidates.' 
    },
    { 
      date: 'Oct 12, 2024', 
      title: 'Registration Closes', 
      status: 'completed', 
      description: 'Last date to submit applications with regular fees.' 
    },
    { 
      date: 'Jan 03, 2025', 
      title: 'Admit Card Release', 
      status: 'pending', 
      description: 'Candidates can download Hall Tickets from GOAPS.' 
    },
    { 
      date: 'Feb 1-9, 2025', 
      title: 'GATE 2025 Examination', 
      status: 'pending', 
      description: 'Examination days for various papers (Forenoon/Afternoon sessions).' 
    },
    { 
      date: 'Mar 16, 2025', 
      title: 'Result Declaration', 
      status: 'pending', 
      description: 'Official scorecards made available for download.' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="relative bg-white p-8 rounded-3xl shadow-soft border border-stone-100 overflow-hidden">
         <div className="absolute right-0 top-0 w-64 h-64 bg-primary-50 rounded-bl-full opacity-50 -z-10"></div>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <Badge color="brown" className="mb-3">Official Updates</Badge>
               <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 mb-2">GATE Examination Hub</h1>
               <p className="text-stone-500 text-lg max-w-xl">
                 Stay informed with the latest schedules, notifications, and historical analysis of the Graduate Aptitude Test in Engineering.
               </p>
            </div>
            <div className="hidden md:block">
               <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-lg text-center min-w-[150px]">
                  <p className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-1">Next Exam</p>
                  <p className="text-3xl font-black font-mono">2025</p>
                  <p className="text-xs text-primary-300 font-bold mt-1">IIT Roorkee</p>
               </div>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center md:justify-start">
         <div className="bg-stone-200/50 p-1.5 rounded-xl inline-flex space-x-2">
            <button 
               onClick={() => setActiveTab('upcoming')}
               className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-primary-800 shadow-sm' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200'}`}
            >
               Upcoming Schedule
            </button>
            <button 
               onClick={() => setActiveTab('archive')}
               className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-white text-primary-800 shadow-sm' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200'}`}
            >
               Last 10 Years
            </button>
         </div>
      </div>

      {/* Content Area */}
      {activeTab === 'upcoming' ? (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Column */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="p-8">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                     <Calendar className="w-5 h-5 mr-2 text-primary-600"/> Important Dates (2025)
                  </h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
                     {upcomingEvents.map((event, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                           {/* Icon Dot */}
                           <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${event.status === 'completed' ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-stone-200 text-stone-300'}`}>
                              {event.status === 'completed' ? <CheckCircle className="w-5 h-5"/> : <Clock className="w-5 h-5"/>}
                           </div>
                           
                           {/* Content Box */}
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex flex-col gap-1">
                                 <time className="font-mono text-xs font-bold text-primary-600 uppercase tracking-wider">{event.date}</time>
                                 <h4 className="font-bold text-stone-800 text-lg">{event.title}</h4>
                                 <p className="text-stone-500 text-sm">{event.description}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
               <Card className="p-6 bg-gradient-to-br from-primary-900 to-stone-900 text-white">
                  <AlertCircle className="w-8 h-8 mb-4 text-primary-300"/>
                  <h3 className="text-lg font-bold mb-2">Official Notification</h3>
                  <p className="text-stone-300 text-sm mb-6 leading-relaxed">
                     The organizing institute for GATE 2025 is <strong>IIT Roorkee</strong>. Please verify all dates on the official GOAPS portal regularly.
                  </p>
                  <Button variant="glass" className="w-full justify-between group" onClick={() => window.open('https://gate.iitk.ac.in', '_blank')}>
                     Visit Official Website <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </Button>
               </Card>

               <Card className="p-6">
                  <h3 className="font-bold text-stone-900 mb-4">Exam Pattern Quick View</h3>
                  <ul className="space-y-3 text-sm text-stone-600">
                     <li className="flex justify-between border-b border-stone-100 pb-2">
                        <span>Total Marks</span>
                        <span className="font-bold">100</span>
                     </li>
                     <li className="flex justify-between border-b border-stone-100 pb-2">
                        <span>Duration</span>
                        <span className="font-bold">3 Hours</span>
                     </li>
                     <li className="flex justify-between border-b border-stone-100 pb-2">
                        <span>General Aptitude</span>
                        <span className="font-bold">15 Marks</span>
                     </li>
                     <li className="flex justify-between border-b border-stone-100 pb-2">
                        <span>Subject Questions</span>
                        <span className="font-bold">85 Marks</span>
                     </li>
                  </ul>
               </Card>
            </div>
         </div>
      ) : (
         <Card className="p-0 overflow-hidden shadow-md animate-slide-up">
            <div className="p-6 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
               <div>
                  <h3 className="text-xl font-bold text-stone-900 flex items-center">
                     <History className="w-5 h-5 mr-2 text-primary-600"/> Decade Archive
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">Record of organizing institutes and key changes (2015-2024)</p>
               </div>
               <Building2 className="w-10 h-10 text-stone-200"/>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-white border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                        <th className="p-4 w-24">Year</th>
                        <th className="p-4 w-64">Organizing Institute</th>
                        <th className="p-4">Key Highlights / Changes</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                     {gateHistory.map((record) => (
                        <tr key={record.year} className="hover:bg-primary-50/50 transition-colors group">
                           <td className="p-4 font-mono font-bold text-stone-900">{record.year}</td>
                           <td className="p-4 font-medium text-primary-800">{record.institute}</td>
                           <td className="p-4 text-stone-600 text-sm group-hover:text-stone-900">{record.highlight}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      )}
    </div>
  );
};