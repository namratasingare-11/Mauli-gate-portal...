
import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Badge } from '../components/Common';
import { storageService } from '../services/storageService';
import { SyllabusItem, Subject } from '../types';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

export const Syllabus: React.FC = () => {
  const [items, setItems] = useState<SyllabusItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.CSE);

  useEffect(() => {
    setItems(storageService.getSyllabus());
  }, []);

  const handleToggle = (id: string) => {
    const updated = storageService.toggleSyllabusItem(id);
    setItems(updated);
  };

  const handleAdd = () => {
    if (!newItemText.trim()) return;
    const newItem: SyllabusItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      subject: selectedSubject,
      topic: newItemText,
      completed: false
    };
    const updated = storageService.addSyllabusItem(newItem);
    setItems(updated);
    setNewItemText('');
  };

  const filteredItems = items.filter(item => item.subject === selectedSubject);
  const completedCount = filteredItems.filter(i => i.completed).length;
  const progress = filteredItems.length ? (completedCount / filteredItems.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Syllabus Tracker</h1>
          <p className="text-slate-500">Keep track of topics you have covered.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject)}
            className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
          >
            {Object.values(Subject).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-slate-700">{selectedSubject} Progress</span>
          <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
        <p className="text-xs text-slate-400 mt-2">{completedCount} of {filteredItems.length} topics completed</p>
      </Card>

      {/* Topics List */}
      <div className="grid gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="p-4 flex items-center justify-between transition-shadow hover:shadow-md">
             <div className="flex items-center space-x-3 cursor-pointer flex-1" onClick={() => handleToggle(item.id)}>
                {item.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                )}
                <span className={`text-base ${item.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {item.topic}
                </span>
             </div>
             <div>
                <Badge color={item.completed ? "green" : "slate"}>
                  {item.completed ? "Done" : "Pending"}
                </Badge>
             </div>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <p>No topics added for this subject yet.</p>
          </div>
        )}
      </div>

      {/* Add New Item */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a new topic..."
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border p-2"
          />
          <Button onClick={handleAdd} disabled={!newItemText.trim()}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </Card>
    </div>
  );
};
