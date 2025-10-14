import React, { useState, useEffect } from 'react';
import { AppState, ReportViewMode } from './types';
import InitialScreen from './components/InitialScreen';
import AnalysisVisualizer from './components/AnalysisVisualizer';
import ReportView from './components/ReportView';
import BatchAnalysisView from './components/BatchAnalysisView';
import BatchResultsView from './components/BatchResultsView';
import { BATCH_PROPERTIES, AI_DATA } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [selectedPropertyAddress, setSelectedPropertyAddress] = useState<string>(BATCH_PROPERTIES[0]);
  const [reportViewMode, setReportViewMode] = useState<ReportViewMode>(ReportViewMode.COMPARATIVE);
  const [usefulFields, setUsefulFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    // This is a fire-and-forget call to a hypothetical backend endpoint
    // to notify that the application has been run. In a real-world scenario,
    // this endpoint would be a secure, server-side function.
    // As there is no real backend, this will fail gracefully without
    // impacting the user experience.
    fetch('/api/notify-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: 'the.willfreeman@gmail.com',
        timestamp: new Date().toISOString(),
        event: 'App Initialized'
      })
    }).catch(error => {
      // We don't want to bother the user with this, so we'll just log it to the console.
      console.warn('App run notification simulation failed (as expected without a backend):', error);
    });
  }, []); // Empty dependency array ensures this runs only once on mount.


  const handleToggleUseful = (fieldLabel: string) => {
    setUsefulFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldLabel)) {
        newSet.delete(fieldLabel);
      } else {
        newSet.add(fieldLabel);
      }
      return newSet;
    });
  };

  const handleMarkAllUseful = () => {
    const newFields = AI_DATA.filter(field => field.isNew).map(field => field.label);
    setUsefulFields(new Set(newFields));
  };
  
  const handleUnmarkAllUseful = () => {
    setUsefulFields(new Set());
  };


  const handleGenerateReport = () => {
    setSelectedPropertyAddress(BATCH_PROPERTIES[0]);
    setAppState(AppState.ANALYZING);
  };

  const handleAnalysisComplete = () => {
    setAppState(AppState.REPORT);
  };

  const handleStartBatchAnalysis = () => {
    setAppState(AppState.BATCH_ANALYZING);
  };

  const handleBatchComplete = () => {
    setAppState(AppState.BATCH_RESULTS);
  };
  
  const handleReset = () => {
    setAppState(AppState.INITIAL);
    setUsefulFields(new Set());
  };

  const handleViewPropertyReport = (address: string) => {
    setSelectedPropertyAddress(address);
    setAppState(AppState.REPORT);
  }

  const handleSetReportViewMode = (mode: ReportViewMode) => {
    setReportViewMode(mode);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.INITIAL:
        return <InitialScreen onGenerate={handleGenerateReport} />;
      case AppState.ANALYZING:
        return <AnalysisVisualizer onComplete={handleAnalysisComplete} />;
      case AppState.REPORT:
        return <ReportView 
                    propertyAddress={selectedPropertyAddress} 
                    viewMode={reportViewMode}
                    onSetViewMode={handleSetReportViewMode}
                    onStartBatch={handleStartBatchAnalysis} 
                    onBack={handleReset}
                    usefulFields={usefulFields}
                    onToggleUseful={handleToggleUseful}
                    onMarkAll={handleMarkAllUseful}
                    onUnmarkAll={handleUnmarkAllUseful}
                />;
      case AppState.BATCH_ANALYZING:
        return <BatchAnalysisView onComplete={handleBatchComplete} />;
      case AppState.BATCH_RESULTS:
        return <BatchResultsView 
                    onBack={handleReset} 
                    onViewPropertyReport={handleViewPropertyReport}
                    viewMode={reportViewMode}
                    onSetViewMode={handleSetReportViewMode}
                />;
      default:
        return <InitialScreen onGenerate={handleGenerateReport} />;
    }
  };

  return <div className="App">{renderContent()}</div>;
};

export default App;
