
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/Common';
import { storageService } from '../services/storageService';
import { MaterialItem, MaterialType, Subject, Role } from '../types';
import { FileText, Video, Book, Youtube, ExternalLink, PlayCircle, FileCheck, Layers, Plus, X, Upload, Network, Share2 } from 'lucide-react';

export const StudyMaterial: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [activeTab, setActiveTab] = useState<MaterialType>(MaterialType.NOTE);
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  
  // Admin State
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MaterialItem>>({
    title: '',
    url: '',
    description: '',
    type: MaterialType.NOTE,
    subject: Subject.CSE
  });

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser?.role === Role.ADMIN;

  useEffect(() => {
    setMaterials(storageService.getMaterials());
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.url || !newItem.type || !newItem.subject) return;

    const material: MaterialItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: newItem.title!,
      url: newItem.url!,
      type: newItem.type!,
      subject: newItem.subject!,
      description: newItem.description || '',
      year: newItem.type === MaterialType.PAPER ? new Date().getFullYear() : undefined
    };

    storageService.addMaterial(material);
    setMaterials(storageService.getMaterials());
    setIsUploading(false);
    setNewItem({ title: '', url: '', description: '', type: MaterialType.NOTE, subject: Subject.CSE });
  };

  const filteredMaterials = materials.filter(item => {
    const matchesType = item.type === activeTab;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesType && matchesSubject;
  });

  const getTheme = (type: MaterialType) => {
    switch (type) {
      case MaterialType.NOTE: return { icon: FileText, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
      case MaterialType.VIDEO: return { icon: PlayCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
      case MaterialType.PAPER: return { icon: FileCheck, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
      case MaterialType.MIND_MAP: return { icon: Network, color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' };
      case MaterialType.FLOW_CHART: return { icon: Share2, color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' };
      default: return { icon: Layers, color: 'slate', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">MCOET Digital Library</h1>
          <p className="text-slate-500 mt-1">Access notes, video lectures, mind maps, and past papers.</p>
        </div>
        
        <div className="flex items-center space-x-3">
           {isAdmin && (
             <Button onClick={() => setIsUploading(true)} className="shadow-md">
               <Plus className="w-4 h-4 mr-2" /> Add Material
             </Button>
           )}
           <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
             <div className="px-2 text-slate-400">
               <Layers className="w-4 h-4" />
             </div>
             <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject | 'All')}
                className="form-select block w-full border-none bg-transparent focus:ring-0 text-sm font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                {Object.values(Subject).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
           </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold flex items-center">
                <Upload className="w-5 h-5 mr-2 text-primary-600" /> Upload Material
              </h3>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                   <select 
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                      value={newItem.type}
                      onChange={e => setNewItem({...newItem, type: e.target.value as MaterialType})}
                   >
                     {Object.values(MaterialType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                   <select 
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                      value={newItem.subject}
                      onChange={e => setNewItem({...newItem, subject: e.target.value as Subject})}
                   >
                     {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Thermodynamics Chapter 1"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resource URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  value={newItem.url}
                  onChange={e => setNewItem({...newItem, url: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Brief summary..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="outline" onClick={() => setIsUploading(false)}>Cancel</Button>
                <Button type="submit">Upload Material</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="overflow-x-auto pb-2">
        <div className="flex p-1 space-x-1 bg-slate-100/80 backdrop-blur-sm rounded-xl w-max">
          {[MaterialType.NOTE, MaterialType.VIDEO, MaterialType.MIND_MAP, MaterialType.FLOW_CHART, MaterialType.PAPER].map((type) => {
            const isActive = activeTab === type;
            const labels = {
              [MaterialType.NOTE]: 'Notes',
              [MaterialType.VIDEO]: 'Videos',
              [MaterialType.PAPER]: 'Papers',
              [MaterialType.MIND_MAP]: 'Mind Maps',
              [MaterialType.FLOW_CHART]: 'Flow Charts'
            };
            const Icons = {
              [MaterialType.NOTE]: FileText,
              [MaterialType.VIDEO]: Youtube,
              [MaterialType.PAPER]: Book,
              [MaterialType.MIND_MAP]: Network,
              [MaterialType.FLOW_CHART]: Share2
            };
            const Icon = Icons[type];
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`
                  flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'bg-white text-primary-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-primary-500' : ''}`} />
                {labels[type]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item, index) => {
          const theme = getTheme(item.type);
          const Icon = theme.icon;
          
          return (
            <Card 
              key={item.id} 
              className={`p-0 flex flex-col h-full overflow-hidden group border ${theme.border}`}
              onClick={() => window.open(item.url, '_blank')}
            >
               {/* Card Header visual */}
               <div className={`h-36 ${theme.bg} flex items-center justify-center relative overflow-hidden`}>
                 <div className={`absolute w-32 h-32 rounded-full ${theme.bg} brightness-95 -top-10 -right-10`}></div>
                 <div className={`absolute w-20 h-20 rounded-full ${theme.bg} brightness-95 bottom-2 left-10`}></div>
                 <Icon className={`w-12 h-12 ${theme.text} opacity-80 transform transition-transform group-hover:scale-110 duration-300`} />
                 {item.year && (
                   <div className="absolute top-3 right-3">
                     <Badge color="yellow">{item.year}</Badge>
                   </div>
                 )}
               </div>

               <div className="p-5 flex-1 flex flex-col">
                 <div className="mb-2">
                   <Badge color={theme.color as any}>{item.subject.split(' ')[0]}</Badge>
                 </div>
                 
                 <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                   {item.title}
                 </h3>
                 
                 <p className="text-slate-500 text-sm mb-4 flex-1 line-clamp-3">
                   {item.description || 'No description available.'}
                 </p>

                 <div className={`mt-auto flex items-center text-sm font-semibold ${theme.text} opacity-80 group-hover:opacity-100`}>
                   View Resource
                   <ExternalLink className="w-4 h-4 ml-2" />
                 </div>
               </div>
            </Card>
          )
        })}

        {filteredMaterials.length === 0 && (
          <div className="col-span-full py-16 text-center">
             <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
               <Layers className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No materials found</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-1">
               We couldn't find any {activeTab.toLowerCase()}s for the selected subject.
             </p>
             <Button 
               variant="outline" 
               className="mt-6"
               onClick={() => setSelectedSubject('All')}
             >
               Clear Filters
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};
