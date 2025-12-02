
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, GripHorizontal, Calculator as CalcIcon, Divide, Hash } from 'lucide-react';
import { Card } from './Common';

export const Calculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 500 });
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleInput = (val: string) => {
    setDisplay(prev => (prev === '0' ? val : prev + val));
  };

  const handleClear = () => setDisplay('0');
  
  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const calculate = () => {
    try {
      // Safety replacement for standard math symbols
      let expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/√/g, 'Math.sqrt');
      
      // Handle scientific functions
      expression = expression
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');

      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + expression)();
      setDisplay(String(Math.round(result * 100000000) / 100000000));
    } catch (e) {
      setDisplay('Error');
      setTimeout(handleClear, 1500);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-700 hover:bg-primary-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center"
        title="Open Scientific Calculator"
      >
        <CalcIcon className="w-6 h-6" />
      </button>
    );
  }

  const btnClass = "h-10 text-sm font-bold rounded hover:bg-stone-100 active:bg-stone-200 transition-colors border border-stone-200 text-stone-700";
  const opClass = "h-10 text-sm font-bold rounded bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-200";

  return (
    <div 
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 w-80 animate-fade-in shadow-2xl"
    >
      <Card className="p-0 overflow-hidden border-2 border-primary-800/20 bg-stone-50">
        {/* Header - Draggable */}
        <div 
          onMouseDown={handleMouseDown}
          className="bg-primary-900 text-white p-2 flex justify-between items-center cursor-move select-none"
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-wider">Scientific Calculator</span>
          </div>
          <div className="flex items-center gap-1">
             <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded"><Minus className="w-4 h-4"/></button>
             <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsOpen(false)} className="hover:bg-red-600 p-1 rounded"><X className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Display */}
        <div className="p-4 bg-stone-900 text-right">
           <div className="text-stone-400 text-xs h-4 overflow-hidden mb-1 font-mono"></div>
           <input 
             type="text" 
             readOnly 
             value={display} 
             className="w-full bg-transparent text-3xl font-mono text-white text-right focus:outline-none"
           />
        </div>

        {/* Keypad */}
        <div className="p-2 grid grid-cols-5 gap-1.5 bg-stone-100">
           {/* Row 1 */}
           <button onClick={handleClear} className="col-span-2 h-9 text-xs font-bold rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200">AC</button>
           <button onClick={handleBackspace} className="h-9 text-xs font-bold rounded bg-red-50 text-red-700 border border-red-200">DEL</button>
           <button onClick={() => handleInput('(')} className={btnClass}>(</button>
           <button onClick={() => handleInput(')')} className={btnClass}>)</button>
           
           {/* Row 2 */}
           <button onClick={() => handleInput('sin(')} className={btnClass}>sin</button>
           <button onClick={() => handleInput('cos(')} className={btnClass}>cos</button>
           <button onClick={() => handleInput('tan(')} className={btnClass}>tan</button>
           <button onClick={() => handleInput('π')} className={btnClass}>π</button>
           <button onClick={() => handleInput('e')} className={btnClass}>e</button>

           {/* Row 3 */}
           <button onClick={() => handleInput('^')} className={btnClass}>x^y</button>
           <button onClick={() => handleInput('log(')} className={btnClass}>log</button>
           <button onClick={() => handleInput('ln(')} className={btnClass}>ln</button>
           <button onClick={() => handleInput('√(')} className={btnClass}>√</button>
           <button onClick={() => handleInput('÷')} className={opClass}>÷</button>

           {/* Row 4 */}
           <button onClick={() => handleInput('7')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">7</button>
           <button onClick={() => handleInput('8')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">8</button>
           <button onClick={() => handleInput('9')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">9</button>
           <button onClick={() => setMemory(0)} className={btnClass}>MC</button>
           <button onClick={() => handleInput('×')} className={opClass}>×</button>

           {/* Row 5 */}
           <button onClick={() => handleInput('4')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">4</button>
           <button onClick={() => handleInput('5')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">5</button>
           <button onClick={() => handleInput('6')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">6</button>
           <button onClick={() => setMemory(Number(display))} className={btnClass}>MS</button>
           <button onClick={() => handleInput('-')} className={opClass}>-</button>

           {/* Row 6 */}
           <button onClick={() => handleInput('1')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">1</button>
           <button onClick={() => handleInput('2')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">2</button>
           <button onClick={() => handleInput('3')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">3</button>
           <button onClick={() => setDisplay(String(memory))} className={btnClass}>MR</button>
           <button onClick={() => handleInput('+')} className={opClass}>+</button>

           {/* Row 7 */}
           <button onClick={() => handleInput('0')} className="col-span-2 h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">0</button>
           <button onClick={() => handleInput('.')} className="h-10 text-lg font-bold bg-white border border-stone-200 rounded hover:bg-stone-50">.</button>
           <button onClick={calculate} className="col-span-2 h-10 text-lg font-bold bg-primary-600 text-white rounded shadow-sm hover:bg-primary-700">=</button>
        </div>
      </Card>
    </div>
  );
};
