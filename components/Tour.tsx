import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

export interface TourStep {
  selector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

const Tour: React.FC<TourProps> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const step = steps[currentStep];

  useLayoutEffect(() => {
    if (!isOpen || !step) return;

    const updatePosition = () => {
      const element = document.querySelector(step.selector) as HTMLElement;
      if (element) {
        if (targetRef.current) {
            targetRef.current.classList.remove('tour-highlight');
        }
        element.classList.add('tour-highlight');
        targetRef.current = element;
        setTargetRect(element.getBoundingClientRect());
      } else {
        // If element not found, maybe move to next step or close tour.
        // For now, let's just nullify the rect.
        setTargetRect(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => {
        if(targetRef.current) {
            targetRef.current.classList.remove('tour-highlight');
        }
        window.removeEventListener('resize', updatePosition);
    };
  }, [currentStep, isOpen, step]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleClose = () => {
     if(targetRef.current) {
        targetRef.current.classList.remove('tour-highlight');
     }
     onClose();
  };

  if (!isOpen || !step || !targetRect) return null;
  
  const getTooltipPosition = () => {
    if (!targetRect || !tooltipRef.current) return {};
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const space = 15;

    let styles: React.CSSProperties = {};
    const position = step.position || 'bottom';

    switch(position) {
        case 'top':
            styles = {
                top: targetRect.top - tooltipHeight - space,
                left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
            };
            break;
        case 'bottom':
            styles = {
                top: targetRect.bottom + space,
                left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
            };
            break;
        case 'left':
            styles = {
                top: targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2),
                left: targetRect.left - tooltipWidth - space,
            };
            break;
        case 'right':
             styles = {
                top: targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2),
                left: targetRect.right + space,
            };
            break;
    }
    
    // Boundary checks
    if(styles.left < 0) styles.left = space;
    if(styles.top < 0) styles.top = space;
    if((styles.left as number) + tooltipWidth > window.innerWidth) styles.left = window.innerWidth - tooltipWidth - space;
    if((styles.top as number) + tooltipHeight > window.innerHeight) styles.top = window.innerHeight - tooltipHeight - space;

    return styles;
  }
  
  return (
    <div className="fixed inset-0 z-50">
       <style>{`
        .tour-highlight {
          position: relative;
          z-index: 10001;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255,255,255,0.7);
          border-radius: 4px;
          transition: box-shadow 0.3s ease-in-out;
        }
        .tour-tooltip {
          position: fixed;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          padding: 16px;
          max-width: 320px;
          z-index: 10002;
          transition: top 0.3s, left 0.3s;
        }
      `}</style>
      <div 
        ref={tooltipRef} 
        className="tour-tooltip"
        style={getTooltipPosition()}
      >
        <h3 className="font-bold text-lg mb-2 text-gray-800">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{currentStep + 1} / {steps.length}</span>
            <div>
                {currentStep > 0 && 
                    <button onClick={handlePrev} className="text-sm text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100">
                        Previous
                    </button>
                }
                <button 
                    onClick={handleNext} 
                    className="text-sm bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-blue-700"
                >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Tour;