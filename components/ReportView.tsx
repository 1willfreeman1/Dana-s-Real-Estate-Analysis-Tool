
// FIX: Implemented the ReportView component to resolve multiple "Cannot find name" and "is not a module" errors.
// The original file content was a placeholder text. This component now renders the detailed property analysis report.
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ReportField, ReportViewMode } from '../types';
import { TEAM_DATA, AI_DATA } from '../constants';
import Tooltip from './Tooltip';
import MapEmbed from './MapEmbed';
import PrintModal from './PrintModal';
import { CheckCircleIcon } from './icons';
import Tour, { TourStep } from './Tour';

interface ReportViewProps {
    propertyAddress: string;
    viewMode: ReportViewMode;
    onSetViewMode: (mode: ReportViewMode) => void;
    onStartBatch: () => void;
    onBack: () => void;
    usefulFields: Set<string>;
    onToggleUseful: (fieldLabel: string) => void;
    onMarkAll: () => void;
    onUnmarkAll: () => void;
}

const tourSteps: TourStep[] = [
  {
    selector: '#ai-summary-card',
    title: 'AI Executive Summary',
    content: 'Welcome. Gemini analyzes all data points to give you a concise overview, saving reading time and highlighting key takeaways immediately.',
  },
  {
    selector: '#view-mode-buttons',
    title: 'Dynamic View Modes',
    content: 'Switch views to suit your needs. "Comparative" mode is powerful, showing your team\'s data versus new AI-discovered insights side-by-side.',
    position: 'bottom',
  },
  {
    selector: '#manual-data-card',
    title: 'Your Team\'s Data',
    content: 'This card shows the data your team typically collects. The AI has already cross-referenced these points for accuracy.',
  },
  {
    selector: '#ai-insights-card',
    title: 'AI-Discovered Insights',
    content: 'Here is your competitive advantage. The AI uncovers critical data you might miss, like local crime rates or planned infrastructure.',
  },
  {
    selector: '#ai-insights-card .tour-new-badge',
    title: '"NEW" Badges',
    content: 'Look for these badges. They flag completely new information, providing a deeper, more comprehensive property profile.',
    position: 'left',
  },
  {
    selector: '#ai-insights-card .tour-useful-checkbox',
    title: 'Mark What\'s Useful',
    content: 'Your feedback is valuable. Marking impactful insights helps train the AI to prioritize what\'s most crucial for your workflow.',
     position: 'right',
  },
  {
    selector: '#run-batch-button',
    title: 'Run Batch Analysis',
    content: 'Ready for more? Analyze an entire portfolio of properties in minutes, not hours. Click "Finish" to explore the report.',
    position: 'left',
  }
];


const ViewModeButtons: React.FC<{
    currentMode: ReportViewMode;
    onSetMode: (mode: ReportViewMode) => void;
}> = ({ currentMode, onSetMode }) => {
    const modes = [
        { key: ReportViewMode.QUICK, label: 'Quick' },
        { key: ReportViewMode.FULL, label: 'Full' },
        { key: ReportViewMode.COMPARATIVE, label: 'Comparative' },
    ];
    return (
        <div className="flex items-center space-x-2 bg-gray-200 rounded-lg p-1">
            {modes.map(mode => (
                <button 
                    key={mode.key}
                    onClick={() => onSetMode(mode.key)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        currentMode === mode.key
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
};

const FieldRow: React.FC<{field: ReportField}> = ({ field }) => (
    <div key={field.label} className="flex justify-between items-start border-b border-gray-100 py-2">
      <dt className="text-gray-600 flex items-center">
        {field.label}
        {field.isNew && <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">NEW</span>}
        {field.tooltip && (
          <Tooltip text={field.tooltip}>
            <svg className="w-4 h-4 ml-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          </Tooltip>
        )}
      </dt>
      <dd className="text-gray-900 font-medium text-right">{field.value}</dd>
    </div>
);


const ReportView: React.FC<ReportViewProps> = ({
  propertyAddress,
  viewMode,
  onSetViewMode,
  onStartBatch,
  onBack,
  usefulFields,
  onToggleUseful,
  onMarkAll,
  onUnmarkAll,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState('');
  const [isTourOpen, setIsTourOpen] = useState(false);


  useEffect(() => {
    const tourSeen = localStorage.getItem('hasSeenReportTour');
    if (!tourSeen) {
      // Use a small timeout to ensure the DOM is ready for the tour
      setTimeout(() => setIsTourOpen(true), 500);
    }
  }, []);

  const handleCloseTour = () => {
    localStorage.setItem('hasSeenReportTour', 'true');
    setIsTourOpen(false);
  };


  useEffect(() => {
    const generateSummary = async () => {
      setIsLoadingSummary(true);
      setSummaryError('');

      try {
        const apiKey = 'AIzaSyCi3ssyNg5XQFC8KWpD3TwmXkSbqJEEhOc';
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const allData = [...TEAM_DATA, ...AI_DATA];
        const dataSummary = allData.map(d => `${d.label}: ${d.value}`).join('; ');
        const prompt = `Based on the following data points for a property at "${propertyAddress}" (${dataSummary}), write a short, 2-3 line abstract paragraph describing the area's character and potential. Focus on themes like lifestyle, risk, and investment profile.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // FIX: Access the generated text directly from the `text` property of the response.
        setSummary(response.text);
      } catch (e) {
        console.error("Error generating summary:", e);
        if (e instanceof Error) {
            setSummaryError(e.message);
        } else {
            setSummaryError('An unknown error occurred while generating the summary.');
        }
      } finally {
        setIsLoadingSummary(false);
      }
    };
    generateSummary();
  }, [propertyAddress]);


  const newFieldCount = AI_DATA.filter(field => field.isNew).length;
  const usefulCount = usefulFields.size;
  const allNewMarked = usefulCount === newFieldCount;

  const groupedCombinedData = useMemo(() => {
    const allData = [...TEAM_DATA, ...AI_DATA];
    // FIX: The initial value for `reduce` was an empty object `{}`, which caused TypeScript to infer `groupedCombinedData` as `unknown`. Explicitly typing the initial accumulator as `Record<string, ReportField[]>` ensures the correct type is inferred, resolving the error on `.map`.
    return allData.reduce((acc, field) => {
        const category = field.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(field);
        return acc;
    // FIX: Explicitly type the initial accumulator for the `reduce` function to prevent TypeScript from inferring `groupedCombinedData` as `unknown`. This resolves the "Property 'map' does not exist" error on the `fields` variable.
    }, {} as Record<string, ReportField[]>);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Tour steps={tourSteps} isOpen={isTourOpen} onClose={handleCloseTour} />
      {isPrinting && <PrintModal onClose={() => setIsPrinting(false)} />}
      <div id="print-area" className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print-hide">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{propertyAddress}</h1>
            <p className="text-gray-600">Single Property Executive Report</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <div id="view-mode-buttons" className="hidden sm:flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">View Mode</span>
                <ViewModeButtons currentMode={viewMode} onSetMode={onSetViewMode} />
            </div>
            <button onClick={() => setIsPrinting(true)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                Print
            </button>
            <button id="run-batch-button" onClick={onStartBatch} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Run Batch
            </button>
             <button onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                Back
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div id="ai-summary-card" className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">AI Executive Summary</h2>
                {isLoadingSummary ? (
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                ) : summaryError ? (
                    <p className="text-sm text-red-600">{summaryError}</p>
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
                )}
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden map-section">
               <MapEmbed address={propertyAddress} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {viewMode === ReportViewMode.COMPARATIVE && (
                <>
                    <div id="manual-data-card" className="bg-white shadow-md rounded-lg p-6 team-data-section">
                        <div className="flex items-center mb-4">
                            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-800">Manual Data Points (Confirmed by AI)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        {TEAM_DATA.map(field => (
                            <div key={field.label} className="flex justify-between items-start border-b border-gray-100 py-2">
                                <dt className="text-gray-600">{field.label}</dt>
                                <dd className="text-gray-900 font-medium text-right">{field.value}</dd>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div id="ai-insights-card" className="bg-white shadow-md rounded-lg p-6 ai-data-section ring-2 ring-blue-200 ring-offset-2">
                        <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Additional Insights Discovered by AI</h2>
                            <p className="text-sm text-gray-500">New data points found automatically. Mark the ones you find useful.</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            <CheckCircleIcon className="w-5 h-5 mr-1.5" />
                            <span>{usefulCount} / {newFieldCount} Fields Marked as Useful</span>
                            </div>
                            <button 
                                onClick={allNewMarked ? onUnmarkAll : onMarkAll} 
                                className="text-xs text-blue-600 hover:underline mt-1.5"
                            >
                                {allNewMarked ? 'Unmark All' : 'Mark All New'}
                            </button>
                        </div>
                        </div>
                        <div className="space-y-1">
                        {AI_DATA.map(field => (
                            <div 
                            key={field.label}
                            className={`flex justify-between items-center p-2 rounded-md transition-colors ${field.isNew ? 'hover:bg-blue-50' : ''}`}
                            >
                            <div className="flex items-center text-sm">
                                {field.isNew && (
                                <button onClick={() => onToggleUseful(field.label)} className={`mr-3 p-1 ${field.label === 'Crime rate (Area)' ? 'tour-useful-checkbox' : ''}`}>
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${usefulFields.has(field.label) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                        {usefulFields.has(field.label) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </button>
                                )}
                                <dt className={`text-gray-600 flex items-center ${!field.isNew ? 'pl-9' : ''}`}>
                                {field.label}
                                {field.tooltip && (
                                <Tooltip text={field.tooltip}>
                                    <svg className="w-4 h-4 ml-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                </Tooltip>
                                )}
                                {field.isNew && <span className={`ml-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ${field.label === 'Crime rate (Area)' ? 'tour-new-badge' : ''}`}>NEW</span>}
                                </dt>
                            </div>
                            <dd className="text-gray-900 font-medium text-right text-sm">{field.value}</dd>
                            </div>
                        ))}
                        </div>
                    </div>
                </>
            )}

            {viewMode === ReportViewMode.QUICK && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Key AI Insights</h2>
                    <p className="text-sm text-gray-500 mb-4">A summary of the most impactful new data points discovered by the AI.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        {AI_DATA.filter(field => field.isNew).map(field => <FieldRow key={field.label} field={field} />)}
                    </div>
                </div>
            )}

            {viewMode === ReportViewMode.FULL && (
                 <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Combined Property Data</h2>
                    <p className="text-sm text-gray-500 mb-4">A unified view of all available data points for a comprehensive analysis.</p>
                    <div className="space-y-4">
                        {Object.entries(groupedCombinedData).map(([category, fields]) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pb-1 border-b-2 border-gray-200 mb-2">{category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                    {fields.map(field => <FieldRow key={field.label} field={field} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportView;
