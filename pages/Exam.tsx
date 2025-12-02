
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/Common';
import { storageService } from '../services/storageService';
import { Question, Subject, ExamResult, Role, Difficulty } from '../types';
import { BRANCH_TOPICS } from '../constants';
import { Timer, BrainCircuit, ChevronRight, BookOpen, Plus, Grid, Cpu, Activity, Truck, Zap, Radio, Globe, Book, Trophy, CheckCircle, XCircle, AlertCircle, ArrowLeft, RotateCcw, Filter, BarChart2, Target, Check, X as XIcon, PieChart as PieChartIcon, Info } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const safeUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const mulberry32 = (a: number) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

enum ExamView {
  BRANCH_SELECTION,
  SUBJECT_SELECTION,
  TEST_LIST,
  INSTRUCTIONS,
  EXAM_ACTIVE,
  RESULT,
  REVIEW,
  ADMIN_ADD_QUESTION
}

export const Exam: React.FC = () => {
  const [view, setView] = useState<ExamView>(ExamView.BRANCH_SELECTION);
  const [selectedBranch, setSelectedBranch] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedTestName, setSelectedTestName] = useState<string>('');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [questionStatus, setQuestionStatus] = useState<('visited' | 'not_visited' | 'answered')[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Review Mode State
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: Difficulty.MEDIUM, subject: Subject.CSE
  });

  const currentUser = storageService.getCurrentUser();
  const isAdmin = currentUser?.role === Role.ADMIN;

  useEffect(() => {
    let timer: any;
    if (view === ExamView.EXAM_ACTIVE && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeRemaining]);

  // Helpers
  const getSubjectIcon = (sub: Subject) => {
     switch(sub) {
        case Subject.CSE: return Cpu;
        case Subject.MECH: return Activity;
        case Subject.CIVIL: return Truck;
        case Subject.ELECTRICAL: return Zap;
        case Subject.ENTC: return Radio;
        case Subject.IT: return Globe;
        default: return Book;
     }
  }

  const generateDeterministicQuestions = (count: number, startIndex: number, seedStr: string): Question[] => {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) | 0;
    const random = mulberry32(seed);

    const generated: Question[] = [];
    
    // Concept pools for Full Syllabus
    const branchConcepts = {
       [Subject.CSE]: ['Paging', 'Scheduling', 'Normalization', 'TCP/IP', 'Trees', 'Graphs', 'Logic Gates'],
       [Subject.MECH]: ['Entropy', 'Stress', 'Fluid Dynamics', 'Gears', 'Turbines', 'Heat Exchangers'],
       [Subject.CIVIL]: ['Soil', 'Concrete', 'Traffic Flow', 'Beams', 'Hydraulics'],
       [Subject.ELECTRICAL]: ['Transformers', 'Motors', 'KCL/KVL', 'Flux', 'Inverters'],
       [Subject.ENTC]: ['Diodes', 'Signals', 'Modulation', 'Antennas', 'Op-Amps'],
       [Subject.IT]: ['Web', 'Databases', 'Networking', 'Software Engg', 'Security'],
       [Subject.GEN]: ['Logic', 'Math', 'Verbal']
    };

    // Determine the concept pool
    let pool: string[] = [];
    if (selectedTopic === 'Full Syllabus') {
        pool = branchConcepts[selectedBranch!] || branchConcepts[Subject.CSE];
    } else {
        // If a specific topic is selected, use it as the core concept
        pool = [
            selectedTopic, 
            `${selectedTopic} Fundamentals`, 
            `Advanced ${selectedTopic}`, 
            `${selectedTopic} Applications`,
            `${selectedTopic} Principles`
        ];
    }

    for (let i = 0; i < count; i++) {
      const qNum = startIndex + i + 1;
      const concept = pool[Math.floor(random() * pool.length)];
      
      generated.push({
        id: `gen_${seed}_${i}`,
        text: `[${selectedTestName}] Q${qNum}: Analyze the characteristics of ${concept} in the context of ${selectedTopic}. Which of the following statements is theoretically valid?`,
        options: [
           `The efficiency increases exponentially with load factor when ${concept} is optimized.`,
           `It remains invariant under standard operating conditions for ${selectedTopic}.`,
           `The derivative is inversely proportional to the input coefficient of ${concept}.`,
           `System stability depends entirely on external environmental variables regarding ${concept}.`
        ],
        correctAnswer: Math.floor(random() * 4),
        explanation: `Simulated Answer: The correct principle for ${concept} relies on conservation laws pertinent to ${selectedTopic}. Specifically, optimal performance is achieved when boundary conditions are met.`,
        subject: selectedBranch!,
        topic: selectedTopic,
        difficulty: Difficulty.MEDIUM
      });
    }
    return generated;
  };

  const startExam = () => {
    const allQuestions = storageService.getQuestions();
    let filteredQuestions = allQuestions.filter(q => q.subject === selectedBranch);
    
    if (selectedTopic !== 'Full Syllabus') {
      const lowerTopic = selectedTopic.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.topic.toLowerCase().includes(lowerTopic) || lowerTopic.includes(q.topic.toLowerCase())
      );
    }

    const isFinalExam = selectedTestName.includes('Final');
    const TARGET_QUESTION_COUNT = isFinalExam ? 20 : 10;
    let examQuestions = [...filteredQuestions];
    
    let seed = 0;
    const seedStr = selectedTestName + selectedTopic + selectedBranch;
    for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) | 0;
    const random = mulberry32(seed);

    examQuestions.sort(() => 0.5 - random());

    if (examQuestions.length < TARGET_QUESTION_COUNT) {
      const needed = TARGET_QUESTION_COUNT - examQuestions.length;
      const proceduralQs = generateDeterministicQuestions(needed, examQuestions.length, seedStr);
      examQuestions = [...examQuestions, ...proceduralQs];
    } else {
      examQuestions = examQuestions.slice(0, TARGET_QUESTION_COUNT);
    }

    setQuestions(examQuestions);
    setUserAnswers(new Array(examQuestions.length).fill(-1));
    const initialStatus = new Array(examQuestions.length).fill('not_visited');
    initialStatus[0] = 'visited';
    setQuestionStatus(initialStatus as any);
    setCurrentQuestionIndex(0);
    setTimeRemaining(examQuestions.length * (isFinalExam ? 180 : 120));
    setView(ExamView.EXAM_ACTIVE);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    const newStatus = [...questionStatus];
    newStatus[currentQuestionIndex] = 'answered';
    setQuestionStatus(newStatus);
  };

  const handleNavigateQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    if (questionStatus[index] === 'not_visited') {
      const newStatus = [...questionStatus];
      newStatus[index] = 'visited';
      setQuestionStatus(newStatus);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });

    const result: ExamResult = {
      id: safeUUID(),
      date: new Date().toISOString(),
      score: Math.round((correct / questions.length) * 100),
      totalQuestions: questions.length,
      correctAnswers: correct,
      subject: selectedBranch!,
      testName: `${selectedTestName} (${selectedTopic})`,
      timeTakenSeconds: (questions.length * (selectedTestName.includes('Final') ? 180 : 120)) - timeRemaining
    };
    
    storageService.saveResult(result);
    setView(ExamView.RESULT);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.text || !newQuestion.options || !newQuestion.explanation) return;
    const q: Question = {
      id: safeUUID(),
      text: newQuestion.text,
      options: newQuestion.options as string[],
      correctAnswer: newQuestion.correctAnswer!,
      explanation: newQuestion.explanation,
      subject: newQuestion.subject!,
      topic: newQuestion.topic || 'General',
      difficulty: newQuestion.difficulty!
    };
    storageService.addQuestion(q);
    alert('Question added successfully!');
    setNewQuestion({...newQuestion, text: '', options: ['', '', '', ''], explanation: ''});
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToReviewQuestion = (idx: number) => {
    const el = document.getElementById(`review-q-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const COLORS = ['#10B981', '#EF4444', '#94A3B8']; // Green, Red, Slate

  // --- VIEWS ---

  if (view === ExamView.BRANCH_SELECTION) {
    return (
      <div className="space-y-12 animate-fade-in max-w-7xl mx-auto py-8">
        <div className="text-center relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-stone-200 -z-10"></div>
          <span className="bg-stone-50 px-6 text-stone-500 font-bold uppercase tracking-widest text-sm">Select Your Engineering Stream</span>
          <h1 className="text-5xl font-serif font-black text-primary-900 mt-4 mb-2">Mock Test Series</h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">Comprehensive GATE simulation environment designed for MCOET students.</p>
          
          {isAdmin && (
            <div className="mt-8">
              <Button onClick={() => setView(ExamView.ADMIN_ADD_QUESTION)} variant="outline" className="border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Admin: Manage Question Bank
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {Object.values(Subject).filter(s => s !== Subject.GEN).map((subject) => {
            const Icon = getSubjectIcon(subject);
            return (
              <div 
                key={subject} 
                className="group relative bg-white rounded-2xl shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden border border-stone-100"
                onClick={() => { setSelectedBranch(subject); setView(ExamView.SUBJECT_SELECTION); }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
                <div className="p-8">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-600 text-white flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                      <Icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold text-stone-900 mb-2 group-hover:text-primary-700 transition-colors">{subject}</h3>
                   <p className="text-stone-500 font-medium mb-8">Access {BRANCH_TOPICS[subject]?.length || 5} Topic Modules</p>
                   
                   <div className="flex items-center text-primary-600 font-bold uppercase text-sm tracking-wide">
                      Select Branch <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === ExamView.EXAM_ACTIVE && questions.length > 0) {
    const question = questions[currentQuestionIndex];
    return (
      <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
        <div className="flex-1 flex flex-col h-full">
          {/* Header Strip */}
          <div className="bg-stone-800 text-white p-4 rounded-xl shadow-md mb-4 flex justify-between items-center">
             <div>
               <h2 className="text-xs font-bold text-primary-200 uppercase tracking-widest">{selectedTestName}</h2>
               <div className="flex items-center gap-2">
                 <Badge color="blue" className="bg-blue-900/50 text-blue-100 border-none">{question.subject}</Badge>
                 <span className="text-stone-400">|</span>
                 <p className="font-bold">Question {currentQuestionIndex + 1} of {questions.length}</p>
               </div>
             </div>
             <div className={`flex items-center px-5 py-3 rounded-lg font-mono font-bold text-xl shadow-inner border border-white/10 ${timeRemaining < 60 ? 'bg-red-900/50 text-red-200 animate-pulse' : 'bg-stone-900/50'}`}>
                <Timer className="w-5 h-5 mr-3 opacity-70" />
                {formatTime(timeRemaining)}
             </div>
          </div>

          {/* Question Paper */}
          <Card className="flex-1 flex flex-col relative overflow-hidden border-t-4 border-t-primary-600">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BrainCircuit className="w-64 h-64" />
             </div>
             
             <div className="p-8 overflow-y-auto flex-1 relative z-10">
                <div className="flex gap-2 mb-6">
                   <Badge color="slate" className="text-xs">Single Choice</Badge>
                   <Badge color="brown" className="text-xs">+1 Mark / -0.33 Neg</Badge>
                </div>
                
                <h3 className="text-2xl font-serif font-medium text-stone-900 mb-10 leading-relaxed max-w-4xl">
                   {question.text}
                </h3>

                <div className="grid gap-4 max-w-3xl">
                   {question.options.map((option, idx) => {
                      const isSelected = userAnswers[currentQuestionIndex] === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          className={`
                            relative group cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center
                            ${isSelected ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-stone-200 hover:border-primary-300 hover:bg-stone-50'}
                          `}
                        >
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold text-sm transition-colors ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-stone-300 text-stone-400 group-hover:border-primary-400'}`}>
                             {String.fromCharCode(65 + idx)}
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-stone-700'}`}>{option}</span>
                        </div>
                      )
                   })}
                </div>
             </div>

             <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center sticky bottom-0 z-20">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => handleNavigateQuestion(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}>
                     Previous
                  </Button>
                  <Button variant="secondary" onClick={() => {
                     const newStatus = [...questionStatus];
                     newStatus[currentQuestionIndex] = 'visited';
                     setQuestionStatus(newStatus);
                  }}>Mark for Review</Button>
                </div>
                <Button onClick={() => handleNavigateQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))} disabled={currentQuestionIndex === questions.length - 1}>
                   Save & Next
                </Button>
             </div>
          </Card>
        </div>

        {/* Side Palette */}
        <div className="lg:w-80 flex flex-col gap-4">
           <Card className="flex-1 p-0 flex flex-col overflow-hidden">
              <div className="p-4 bg-stone-100 border-b border-stone-200 font-bold text-stone-700 flex items-center">
                 <Grid className="w-4 h-4 mr-2"/> Question Palette
              </div>
              <div className="p-4 flex-1 overflow-y-auto bg-white">
                 <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, idx) => {
                       let statusClass = "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100";
                       if (currentQuestionIndex === idx) statusClass = "ring-2 ring-primary-500 border-primary-500 bg-white text-primary-700 font-bold z-10 transform scale-105";
                       else if (questionStatus[idx] === 'answered') statusClass = "bg-green-500 border-green-600 text-white shadow-sm";
                       else if (questionStatus[idx] === 'visited') statusClass = "bg-red-50 border-red-200 text-red-500";
                       
                       return (
                          <button key={idx} onClick={() => handleNavigateQuestion(idx)} className={`h-10 rounded-md border text-sm font-medium transition-all ${statusClass}`}>
                             {idx + 1}
                          </button>
                       )
                    })}
                 </div>
                 
                 <div className="mt-8 grid grid-cols-2 gap-2 text-xs font-medium text-stone-600">
                    <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Answered</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded-full mr-2"></span> Not Answered</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-white border border-primary-500 ring-1 ring-primary-500 rounded-full mr-2"></span> Current</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-stone-100 border border-stone-300 rounded-full mr-2"></span> Not Visited</div>
                 </div>
              </div>
           </Card>
           <Button variant="danger" className="w-full py-4 text-lg font-bold shadow-lg" onClick={handleSubmit}>Submit Test</Button>
        </div>
      </div>
    );
  }

  // Fallback for other views
  if (view === ExamView.SUBJECT_SELECTION) {
     const topics = BRANCH_TOPICS[selectedBranch!] || ['Full Syllabus'];
     return (
        <div className="max-w-4xl mx-auto py-10 animate-slide-up px-4">
           <Button variant="ghost" onClick={() => setView(ExamView.BRANCH_SELECTION)} className="mb-6">← Back to Streams</Button>
           <h2 className="text-3xl font-serif font-bold mb-8">Select Subject Module <span className="text-stone-400">/ {selectedBranch}</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map(topic => (
                 <Card key={topic} onClick={() => { setSelectedTopic(topic); setView(ExamView.TEST_LIST); }} className="p-6 cursor-pointer flex justify-between items-center group hover:border-primary-500 border-l-4 border-l-transparent transition-all">
                    <span className="font-bold text-lg group-hover:text-primary-700 transition-colors">{topic}</span>
                    <ChevronRight className="text-stone-300 group-hover:text-primary-500"/>
                 </Card>
              ))}
           </div>
        </div>
     );
  }

  if (view === ExamView.TEST_LIST) return (
     <div className="max-w-5xl mx-auto py-10 animate-fade-in px-4">
        <Button variant="ghost" onClick={() => setView(ExamView.SUBJECT_SELECTION)} className="mb-6">← Back to Subjects</Button>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-serif font-bold">{selectedTopic}</h2>
            <Badge color="brown" className="text-sm">Branch: {selectedBranch}</Badge>
        </div>
        <p className="text-stone-500 mb-8">Select a test from the available series. All tests are timed.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {Array.from({length: 10}).map((_, i) => (
              <Card key={i} onClick={() => { setSelectedTestName(`Mock Test ${i + 1}`); setQuestions([]); setCurrentQuestionIndex(0); setView(ExamView.INSTRUCTIONS); }} className="p-6 cursor-pointer hover:bg-primary-50 group border-t-4 border-t-stone-200 hover:border-t-primary-500">
                 <div className="text-4xl font-black text-stone-100 group-hover:text-primary-200 mb-2">{(i + 1).toString().padStart(2,'0')}</div>
                 <h3 className="font-bold text-lg group-hover:text-primary-800">Mock Test {i + 1}</h3>
                 <p className="text-xs text-stone-500">Standard Pattern</p>
              </Card>
           ))}
           <Card onClick={() => { setSelectedTestName('Final Grand Mock Test'); setQuestions([]); setCurrentQuestionIndex(0); setView(ExamView.INSTRUCTIONS); }} className="col-span-full md:col-span-2 bg-stone-900 text-white p-6 cursor-pointer flex items-center justify-between hover:bg-stone-800 border-none shadow-xl">
              <div>
                 <Badge color="yellow" className="mb-2">Full Length</Badge>
                 <h3 className="font-bold text-xl">Grand Final Exam</h3>
              </div>
              <BookOpen className="w-10 h-10 text-stone-600"/>
           </Card>
        </div>
     </div>
  );

  if (view === ExamView.INSTRUCTIONS) return (
     <div className="max-w-xl mx-auto py-16 animate-slide-up px-4">
        <Card className="p-8 text-center border-t-8 border-primary-600">
           <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
              <Zap className="w-10 h-10"/>
           </div>
           
           <h2 className="text-2xl font-bold mb-2">{selectedTestName}</h2>
           
           <div className="flex justify-center gap-2 mb-6 text-sm font-medium text-stone-500 bg-stone-50 py-2 rounded-lg">
             <span>{selectedBranch}</span>
             <span>•</span>
             <span className="text-primary-700">{selectedTopic}</span>
           </div>

           <p className="text-stone-500 mb-8 leading-relaxed">
             You are about to start a timed simulation. The questions have been curated for <strong>{selectedTopic}</strong>. Ensure you have a stable connection and no distractions.
           </p>
           
           <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={() => setView(ExamView.TEST_LIST)}>Cancel</Button>
              <Button className="flex-1 shadow-lg" onClick={startExam}>Start Test</Button>
           </div>
        </Card>
     </div>
  );

  if (view === ExamView.RESULT) {
      const correctCount = questions.reduce((acc, q, i) => userAnswers[i] === q.correctAnswer ? acc + 1 : acc, 0);
      const score = Math.round((correctCount / questions.length) * 100);
      const wrongCount = questions.reduce((acc, q, i) => userAnswers[i] !== q.correctAnswer && userAnswers[i] !== -1 ? acc + 1 : acc, 0);
      const skippedCount = questions.length - correctCount - wrongCount;
      
      const chartData = [
         { name: 'Correct', value: correctCount },
         { name: 'Incorrect', value: wrongCount },
         { name: 'Skipped', value: skippedCount },
      ];

      return (
         <div className="max-w-4xl mx-auto py-10 animate-fade-in text-center px-4">
            <Card className="p-10 mb-8 border-t-8 border-green-500 shadow-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-500"/>
                        <h2 className="text-3xl font-serif font-bold text-stone-900">Test Submitted</h2>
                     </div>
                     <p className="text-stone-500 mb-6">You have completed the <strong>{selectedTopic}</strong> mock exam.</p>
                     
                     <div className="text-6xl font-black text-primary-600 mb-2">{score}%</div>
                     <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-8">Final Score</p>
                     
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => setView(ExamView.REVIEW)} className="shadow-lg ring-2 ring-primary-200">
                           Review Answer Key
                        </Button>
                        <Button onClick={() => startExam()} variant="outline">Retake Test</Button>
                        <Button variant="ghost" onClick={() => setView(ExamView.TEST_LIST)}>Back to Menu</Button>
                     </div>
                  </div>
                  
                  <div className="h-64 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                           <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className="text-2xl font-bold text-stone-700">{questions.length}</span>
                        <span className="block text-xs text-stone-400">Questions</span>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      );
  }

  if (view === ExamView.REVIEW) {
      const correctCount = questions.filter((q, i) => userAnswers[i] === q.correctAnswer).length;
      const wrongCount = questions.filter((q, i) => userAnswers[i] !== q.correctAnswer && userAnswers[i] !== -1).length;
      const skippedCount = questions.filter((q, i) => userAnswers[i] === -1).length;
      const total = questions.length;

      const filteredQuestions = questions.map((q, i) => ({ ...q, originalIndex: i })).filter((q) => {
          const idx = q.originalIndex;
          if (reviewFilter === 'all') return true;
          if (reviewFilter === 'correct') return userAnswers[idx] === q.correctAnswer;
          if (reviewFilter === 'incorrect') return userAnswers[idx] !== q.correctAnswer && userAnswers[idx] !== -1;
          if (reviewFilter === 'skipped') return userAnswers[idx] === -1;
          return true;
      });

      return (
        <div className="max-w-7xl mx-auto py-10 px-4 animate-fade-in pb-20">
           {/* Header with Navigation */}
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                 <Button variant="ghost" onClick={() => setView(ExamView.RESULT)} className="mb-2 pl-0 hover:bg-transparent hover:text-primary-600">
                     <ArrowLeft className="w-4 h-4 mr-2"/> Back to Scorecard
                 </Button>
                 <h2 className="text-3xl font-serif font-bold text-stone-900">Detailed Solutions</h2>
              </div>
              
              {/* Filter Bar */}
              <div className="bg-white p-1.5 rounded-xl border border-stone-200 shadow-sm flex flex-wrap gap-1">
                 <button onClick={() => setReviewFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${reviewFilter === 'all' ? 'bg-stone-800 text-white shadow' : 'hover:bg-stone-100 text-stone-500'}`}>
                    All <span className="opacity-60 ml-1">{questions.length}</span>
                 </button>
                 <button onClick={() => setReviewFilter('correct')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${reviewFilter === 'correct' ? 'bg-green-600 text-white shadow' : 'hover:bg-green-50 text-green-600'}`}>
                    Correct <span className="opacity-60 ml-1">{correctCount}</span>
                 </button>
                 <button onClick={() => setReviewFilter('incorrect')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${reviewFilter === 'incorrect' ? 'bg-red-600 text-white shadow' : 'hover:bg-red-50 text-red-600'}`}>
                    Wrong <span className="opacity-60 ml-1">{wrongCount}</span>
                 </button>
                 <button onClick={() => setReviewFilter('skipped')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${reviewFilter === 'skipped' ? 'bg-stone-400 text-white shadow' : 'hover:bg-stone-100 text-stone-500'}`}>
                    Skipped <span className="opacity-60 ml-1">{skippedCount}</span>
                 </button>
              </div>
           </div>

           <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Questions */}
              <div className="flex-1 space-y-8">
                 {filteredQuestions.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-2xl border-2 border-dashed border-stone-200 text-stone-400">
                       <Filter className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                       <p className="text-lg font-medium">No questions found in this category.</p>
                       <p>Try changing the filter above.</p>
                    </div>
                 ) : (
                    filteredQuestions.map((q) => {
                        const idx = q.originalIndex;
                        const userAnswer = userAnswers[idx];
                        const isCorrect = userAnswer === q.correctAnswer;
                        const isSkipped = userAnswer === -1;
                        
                        let statusColor = "border-stone-200";
                        if(isSkipped) statusColor = "border-slate-300";
                        else if(isCorrect) statusColor = "border-green-500";
                        else statusColor = "border-red-500";

                        return (
                            <Card id={`review-q-${idx}`} key={q.id} className={`p-0 overflow-hidden shadow-md transition-all duration-500 scroll-mt-36`}>
                               {/* Question Header */}
                               <div className={`p-6 border-l-8 ${statusColor} bg-white`}>
                                   <div className="flex justify-between items-start mb-4">
                                       <div className="flex items-start gap-4">
                                           <div className="bg-stone-100 text-stone-600 font-black h-10 w-10 flex items-center justify-center rounded-lg text-sm shadow-inner">
                                             {idx + 1}
                                           </div>
                                           <div className="flex-1">
                                              <div className="flex gap-2 mb-2">
                                                 <Badge color="brown" className="text-[10px] tracking-wider uppercase">{q.topic}</Badge>
                                                 <Badge color="slate" className="text-[10px] tracking-wider uppercase">{q.difficulty}</Badge>
                                              </div>
                                              <h3 className="font-medium text-stone-900 text-lg leading-relaxed">{q.text}</h3>
                                           </div>
                                       </div>
                                       <div className="flex-shrink-0 ml-4">
                                           {isCorrect && <Badge color="green" className="px-3 py-1 text-xs">Correct Answer</Badge>}
                                           {!isCorrect && !isSkipped && <Badge color="red" className="px-3 py-1 text-xs">Wrong Answer</Badge>}
                                           {isSkipped && <Badge color="slate" className="px-3 py-1 text-xs">Not Attempted</Badge>}
                                       </div>
                                   </div>

                                   {/* Options Grid */}
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 pl-0 md:pl-14">
                                       {q.options.map((opt, optIdx) => {
                                           const isSelected = userAnswer === optIdx;
                                           const isThisCorrect = q.correctAnswer === optIdx;
                                           
                                           let optClass = "p-4 rounded-xl border-2 text-sm font-medium flex items-center justify-between relative overflow-hidden transition-all ";
                                           
                                           if (isThisCorrect) {
                                               optClass += "bg-green-50 border-green-500 text-green-900 shadow-md ring-1 ring-green-200 z-10";
                                           } else if (isSelected && !isThisCorrect) {
                                               optClass += "bg-red-50 border-red-500 text-red-900 shadow-sm";
                                           } else {
                                               optClass += "bg-white border-stone-100 text-stone-500 opacity-60 grayscale-[0.5]";
                                           }

                                           return (
                                               <div key={optIdx} className={optClass}>
                                                 <div className="flex items-center gap-3 relative z-10 w-[90%]">
                                                     <span className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${isThisCorrect ? 'bg-green-600 text-white border-green-600' : isSelected ? 'bg-red-600 text-white border-red-600' : 'bg-white border-stone-200 text-stone-400'}`}>
                                                         {String.fromCharCode(65 + optIdx)}
                                                     </span>
                                                     <span>{opt}</span>
                                                 </div>
                                                 <div className="flex items-center">
                                                   {isThisCorrect && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0"/>}
                                                   {isSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0"/>}
                                                 </div>
                                                 
                                                 {/* Explicit Text Labels */}
                                                 <div className="absolute top-1 right-2 text-[10px] font-bold uppercase tracking-widest opacity-80">
                                                   {isThisCorrect && <span className="text-green-700">Correct Answer</span>}
                                                   {isSelected && !isThisCorrect && <span className="text-red-700">Your Choice</span>}
                                                 </div>
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* Detailed Explanation */}
                               <div className="bg-stone-50 p-6 border-t border-stone-200">
                                   <div className="flex gap-4 items-start pl-0 md:pl-14">
                                      <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-sm text-primary-600">
                                         <BrainCircuit className="w-5 h-5"/>
                                      </div>
                                      <div>
                                          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Concept Explanation</h4>
                                          <p className="text-stone-600 text-sm leading-relaxed font-serif">
                                              {q.explanation}
                                          </p>
                                      </div>
                                   </div>
                               </div>
                            </Card>
                        );
                    })
                 )}
              </div>

              {/* Right Column: Palette & Stats */}
              <div className="lg:w-80 space-y-6">
                 {/* Performance Card */}
                 <Card className="p-6 bg-stone-900 text-white border-none shadow-xl sticky top-6 z-10">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-lg flex items-center"><Target className="w-5 h-5 mr-2 text-primary-400"/> Analysis</h3>
                       <div className="text-3xl font-black text-primary-400">{Math.round((correctCount / total) * 100)}%</div>
                    </div>
                    
                    <div className="h-40 mb-6">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                                data={[
                                   { name: 'Correct', value: correctCount },
                                   { name: 'Incorrect', value: wrongCount },
                                   { name: 'Skipped', value: skippedCount }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                             >
                                <Cell fill="#10B981" />
                                <Cell fill="#EF4444" />
                                <Cell fill="#94A3B8" />
                             </Pie>
                             <Tooltip contentStyle={{background: '#333', border:'none', color:'#fff', fontSize:'12px'}}/>
                          </PieChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="text-stone-400">Correct</span>
                          <span className="font-bold text-green-400">{correctCount}</span>
                       </div>
                       <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${(correctCount/total)*100}%` }}></div>
                       </div>
                       
                       <div className="flex justify-between text-sm">
                          <span className="text-stone-400">Incorrect</span>
                          <span className="font-bold text-red-400">{wrongCount}</span>
                       </div>
                       <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${(wrongCount/total)*100}%` }}></div>
                       </div>

                       <div className="flex justify-between text-sm">
                          <span className="text-stone-400">Skipped</span>
                          <span className="font-bold text-stone-300">{skippedCount}</span>
                       </div>
                    </div>
                 </Card>

                 {/* Question Palette */}
                 <Card className="p-0 flex flex-col overflow-hidden max-h-[60vh] sticky top-[24rem]">
                    <div className="p-4 bg-stone-100 border-b border-stone-200 font-bold text-stone-700 flex items-center text-sm">
                        <Grid className="w-4 h-4 mr-2"/> Quick Navigation
                    </div>
                    <div className="p-4 overflow-y-auto bg-white custom-scrollbar">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, idx) => {
                                const userAnswer = userAnswers[idx];
                                const isCorrect = userAnswer === questions[idx].correctAnswer;
                                const isSkipped = userAnswer === -1;
                                
                                let statusClass = "bg-stone-100 text-stone-400 border-stone-200"; // Skipped/Default
                                if (isCorrect) statusClass = "bg-green-100 text-green-700 border-green-300 font-bold";
                                else if (!isSkipped) statusClass = "bg-red-100 text-red-700 border-red-300 font-bold";
                                
                                return (
                                    <button 
                                      key={idx} 
                                      onClick={() => scrollToReviewQuestion(idx)} 
                                      className={`h-9 rounded border text-xs transition-all hover:scale-110 ${statusClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-400">
                           <Info className="w-3 h-3 mt-0.5"/>
                           <p>Click on any question number to instantly scroll to its detailed solution.</p>
                        </div>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      )
  }

  // Admin View
  if(view === ExamView.ADMIN_ADD_QUESTION) return (
     <div className="max-w-2xl mx-auto py-10 px-4">
        <Button variant="ghost" onClick={() => setView(ExamView.BRANCH_SELECTION)} className="mb-4">← Back</Button>
        <Card className="p-6">
           <h2 className="text-xl font-bold mb-4">Add New Question</h2>
           <form onSubmit={handleAddQuestion} className="space-y-4">
               <input type="text" placeholder="Question Text" className="w-full border p-2 rounded" value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} required/>
               <div className="grid grid-cols-2 gap-4">
                 {newQuestion.options?.map((opt, i) => (
                    <input key={i} type="text" placeholder={`Option ${i+1}`} className="w-full border p-2 rounded" value={opt} onChange={e => {
                        const newOpts = [...newQuestion.options!];
                        newOpts[i] = e.target.value;
                        setNewQuestion({...newQuestion, options: newOpts});
                    }} required/>
                 ))}
               </div>
               <select className="w-full border p-2 rounded" value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}>
                  {newQuestion.options?.map((_, i) => <option key={i} value={i}>Correct Answer: Option {i+1}</option>)}
               </select>
               <input type="text" placeholder="Explanation" className="w-full border p-2 rounded" value={newQuestion.explanation} onChange={e => setNewQuestion({...newQuestion, explanation: e.target.value})} required/>
               <Button type="submit">Save Question</Button>
           </form>
        </Card>
     </div>
  );

  return <div></div>;
};
