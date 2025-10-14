import React, { useState, useEffect } from 'react';
import { DATA_SOURCES, ANALYSIS_STEPS } from '../constants';
import { AnalysisStep, LogoStatus } from '../types';
import DataSourceLogo from './DataSourceLogo';
import { MapPinIcon, CheckCircleIcon } from './icons';

interface AnalysisVisualizerProps {
  onComplete: () => void;
}

const AnalysisVisualizer: React.FC<AnalysisVisualizerProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(-1);
  const [logoStatuses, setLogoStatuses] = useState<Record<string, LogoStatus>>(() =>
    Object.fromEntries(DATA_SOURCES.map(source => [source.id, LogoStatus.PENDING]))
  );
  const [subStepStatus, setSubStepStatus] = useState<'active' | 'complete'>('active');

  useEffect(() => {
    const totalSteps = ANALYSIS_STEPS.length;
    if (stepIndex === totalSteps) {
      setTimeout(() => {
        onComplete();
      }, 2000);
      return;
    }

    const stepTimer = setTimeout(() => {
      setStepIndex(prev => prev + 1);
      setSubStepStatus('active');
    }, stepIndex === -1 ? 500 : 900); // Initial delay, then step interval

    return () => clearTimeout(stepTimer);
  }, [stepIndex, onComplete]);

  useEffect(() => {
    if (stepIndex >= 0 && stepIndex < ANALYSIS_STEPS.length) {
      const currentStep = ANALYSIS_STEPS[stepIndex];
      const prevStep = stepIndex > 0 ? ANALYSIS_STEPS[stepIndex - 1] : null;

      setLogoStatuses(prev => {
        const newStatuses = { ...prev };
        if (prevStep) {
          newStatuses[prevStep.sourceId] = LogoStatus.COMPLETE;
        }
        newStatuses[currentStep.sourceId] = LogoStatus.ACTIVE;
        return newStatuses;
      });

      const completionTimer = setTimeout(() => {
        setSubStepStatus('complete');
      }, 800);

      return () => clearTimeout(completionTimer);
    } else if (stepIndex === ANALYSIS_STEPS.length) {
        const prevStep = ANALYSIS_STEPS[stepIndex - 1];
        if(prevStep) {
            setLogoStatuses(prev => ({ ...prev, [prevStep.sourceId]: LogoStatus.COMPLETE }));
        }
    }
  }, [stepIndex]);

  const currentStep = stepIndex >= 0 && stepIndex < ANALYSIS_STEPS.length ? ANALYSIS_STEPS[stepIndex] : null;
  const progressPercentage = stepIndex >= 0 ? ((stepIndex + 1) / ANALYSIS_STEPS.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col transition-opacity duration-500 animate-fadeIn p-4">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full mb-4">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Panel: Map Pin */}
        <div className="w-full md:w-1/3 flex items-center justify-center">
          <MapPinIcon className="w-48 h-48 text-blue-400 animate-pulse" />
        </div>

        {/* Right Panel: Logo Grid */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg">
            {DATA_SOURCES.map(source => (
              <DataSourceLogo
                key={source.id}
                source={source}
                status={logoStatuses[source.id]}
                latency={ANALYSIS_STEPS.find(step => step.sourceId === source.id && step.latency)?.latency}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Narrative Bar */}
      <div className="w-full bg-gray-800 p-4 rounded-lg mt-4 min-h-[100px] flex items-center justify-center">
        {currentStep ? (
          <div className="text-center" key={stepIndex}>
            <div className="flex items-center justify-center text-lg font-semibold text-white animate-fadeInUp">
              {subStepStatus === 'active' 
                ? <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                : <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
              }
              <h2>{currentStep.action}</h2>
            </div>
            <p className="text-sm text-gray-300 mt-1 animate-fadeInUp" style={{animationDelay: '100ms'}}>{currentStep.purpose}</p>
            {subStepStatus === 'complete' && (
              <p className="text-sm text-green-400 mt-1 animate-fadeInUp" style={{animationDelay: '200ms'}}>{currentStep.result}</p>
            )}
          </div>
        ) : (
             <p className="text-gray-400">Initializing analysis...</p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AnalysisVisualizer;