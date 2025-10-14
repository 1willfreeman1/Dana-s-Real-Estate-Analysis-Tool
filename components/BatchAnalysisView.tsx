// FIX: Created the BatchAnalysisView component to resolve the "is not a module" and other related errors.
// This component simulates the batch analysis process for multiple properties.
import React, { useState, useEffect } from 'react';
import { BATCH_PROPERTIES } from '../constants';
import { CheckCircleIcon } from './icons';

interface BatchAnalysisViewProps {
  onComplete: () => void;
}

const BatchAnalysisView: React.FC<BatchAnalysisViewProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalProperties = BATCH_PROPERTIES.length;

  useEffect(() => {
    if (currentIndex >= totalProperties) {
      setTimeout(onComplete, 1500); // Wait a bit before transitioning
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 400); // Simulate analysis time per property

    return () => clearTimeout(timer);
  }, [currentIndex, totalProperties, onComplete]);

  const progressPercentage = (currentIndex / totalProperties) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Running Batch Analysis</h1>
        <p className="text-gray-400 mb-6">Analyzing {totalProperties} properties to generate a comparative report...</p>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-700 rounded-full mb-6">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Property List */}
        <div className="bg-gray-800 rounded-lg p-6 text-left max-h-[60vh] overflow-y-auto">
          {BATCH_PROPERTIES.map((address, index) => (
            <div 
              key={address} 
              className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${
                index < currentIndex ? 'text-green-400' : 
                index === currentIndex ? 'bg-blue-500/20 text-white' : 'text-gray-500'
              }`}
            >
              <span className="font-mono text-sm">{address}</span>
              {index < currentIndex ? (
                <div className="flex items-center text-green-400">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span>Complete</span>
                </div>
              ) : index === currentIndex ? (
                <div className="flex items-center text-blue-300">
                   <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <span className="text-gray-600">Pending</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-gray-500 mt-6">
          {currentIndex >= totalProperties 
            ? 'Finalizing report...' 
            : `Analyzing property ${currentIndex + 1} of ${totalProperties}...`}
        </p>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BatchAnalysisView;
