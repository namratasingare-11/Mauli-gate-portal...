
import React, { useState } from 'react';
import { Card, Button } from './Common';
import { storageService } from '../services/storageService';
import { FeedbackType, Feedback } from '../types';
import { X, MessageSquare, Send } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [type, setType] = useState<FeedbackType>(FeedbackType.GENERAL);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const user = storageService.getCurrentUser();
    
    const feedback: Feedback = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous Student',
      type,
      message,
      date: new Date().toISOString()
    };

    storageService.addFeedback(feedback);
    setSubmitted(true);
    
    // Close after a short delay so user sees success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center animate-slide-up">
           <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
             <Send className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">Thank You!</h3>
           <p className="text-slate-600">Your feedback has been submitted successfully to the administration.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 animate-slide-up relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-full"
        >
          <X className="w-5 h-5"/>
        </button>

        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Feedback & Support</h3>
            <p className="text-sm text-slate-500">Report issues or share your suggestions.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Feedback Category</label>
             <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                value={type}
                onChange={e => setType(e.target.value as FeedbackType)}
             >
               {Object.values(FeedbackType).map(t => <option key={t} value={t}>{t}</option>)}
             </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Message</label>
            <textarea 
              rows={5}
              required
              placeholder="Please describe the issue or your suggestion in detail..."
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3 shadow-md">
              Submit Feedback
            </Button>
          </div>
          
          <p className="text-xs text-center text-slate-400 mt-4">
            Responses are monitored by the MCOET Admin team.
          </p>
        </form>
      </Card>
    </div>
  );
};
