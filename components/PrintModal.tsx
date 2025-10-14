import React, { useState } from 'react';

interface PrintModalProps {
  onClose: () => void;
}

type PrintOption = 'full' | 'ai_only';

const PrintModal: React.FC<PrintModalProps> = ({ onClose }) => {
  const [printOption, setPrintOption] = useState<PrintOption>('full');

  const handlePrint = () => {
    document.body.classList.remove('print-hide-team-data', 'print-hide-ai-data');

    if (printOption === 'ai_only') {
      document.body.classList.add('print-hide-team-data');
    }
    
    // It's generally better to hide the interactive map on print
    document.body.classList.add('print-hide-map');

    window.print();

    // Clean up classes after print dialog is closed (or printing is done)
    setTimeout(() => {
        document.body.classList.remove('print-hide-team-data', 'print-hide-ai-data', 'print-hide-map');
    }, 500);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print-hide">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Print Report Options</h2>
        <p className="text-sm text-gray-600 mb-6">Choose which sections of the report you would like to include in the printout.</p>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="print-option" 
                value="full" 
                checked={printOption === 'full'}
                onChange={() => setPrintOption('full')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Full Report</span>
                <span className="block text-xs text-gray-500">Includes Team Data and all AI Discoveries.</span>
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="print-option" 
                value="ai_only" 
                checked={printOption === 'ai_only'}
                onChange={() => setPrintOption('ai_only')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3">
                <span className="block text-sm font-medium text-gray-900">AI Discoveries Only</span>
                <span className="block text-xs text-gray-500">Focuses on the new insights found by the AI.</span>
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;