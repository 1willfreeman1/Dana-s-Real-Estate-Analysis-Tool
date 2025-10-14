import React, { useState, useMemo } from 'react';
import { BATCH_PROPERTIES, AI_DATA } from '../constants';
import { ReportViewMode } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface BatchResultsViewProps {
    onBack: () => void;
    onViewPropertyReport: (address: string) => void;
    viewMode: ReportViewMode;
    onSetViewMode: (mode: ReportViewMode) => void;
}

// Create some mock data for variety in the table
const generateMockResults = () => {
    const walkScore = AI_DATA.find(d => d.label === "Walkability Score")?.value.split(' ')[0] || "78";
    const valueEstimate = AI_DATA.find(d => d.label === "Property value estimate (Range)")?.value.replace(/[\$,]/g, '').split(' - ');
    const lowVal = parseInt(valueEstimate?.[0] || '850000');
    
    return BATCH_PROPERTIES.map((address, index) => {
        const seed = index * 0.1;
        return {
            address,
            newFieldsCount: Math.floor(Math.random() * 5) + 1, // 1 to 5 new fields
            walkScore: Math.floor(parseInt(walkScore) - 10 + (Math.random() * 20)),
            value: lowVal + (seed * 50000) - 25000,
            floodRisk: Math.random() > 0.8 ? 'Medium' : 'Low',
            bushfireRisk: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Moderate' : 'Low'),
            zoning: ['GRZ1', 'NRZ3', 'RGZ1'][index % 3],
        }
    });
};

const mockResults = generateMockResults();

type MockResult = ReturnType<typeof generateMockResults>[0];
type SortKey = keyof MockResult;

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


const BatchResultsView: React.FC<BatchResultsViewProps> = ({ 
    onBack, 
    onViewPropertyReport,
    viewMode,
    onSetViewMode 
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: 'address', direction: 'ascending' });

  const sortedAndFilteredResults = useMemo(() => {
    let results = [...mockResults];
    
    if (filterText) {
      results = results.filter(p => p.address.toLowerCase().includes(filterText.toLowerCase()));
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return results;
  }, [filterText, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleExport = () => {
    const dataToExport = sortedAndFilteredResults.map(item => ({
        'Property Address': item.address,
        '# New Fields': item.newFieldsCount,
        'Walk Score': item.walkScore,
        'Value Est.': item.value,
        'Flood Risk': item.floodRisk,
        'Bushfire Risk': item.bushfireRisk,
        'Zoning': item.zoning,
    }));
    const worksheet = (window as any).XLSX.utils.json_to_sheet(dataToExport);
    const workbook = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Results");
    (window as any).XLSX.writeFile(workbook, "Batch_Analysis_Results.xlsx");
  };

  const SortableHeader: React.FC<{ sortKey: SortKey, children: React.ReactNode }> = ({ sortKey, children }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(sortKey)}>
        <div className="flex items-center">
            {children}
            {isSorted && (sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />)}
        </div>
      </th>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch Executive Report</h1>
            <p className="text-gray-600">Dashboard for {BATCH_PROPERTIES.length} analyzed properties.</p>
          </div>
          <div className="flex items-center space-x-2">
             <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">View Mode</span>
                <ViewModeButtons currentMode={viewMode} onSetMode={onSetViewMode} />
            </div>
            <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Export Excel
            </button>
            <button onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                Back to Start
            </button>
          </div>
        </header>

        <div className="mb-4">
            <input
                type="text"
                placeholder="Filter by address..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm"
            />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader sortKey="address">Property Address</SortableHeader>
                  <SortableHeader sortKey="newFieldsCount"># New Fields</SortableHeader>
                  <SortableHeader sortKey="value">Value Est.</SortableHeader>
                  {viewMode !== ReportViewMode.QUICK && (
                    <>
                        <SortableHeader sortKey="walkScore">Walk Score</SortableHeader>
                        <SortableHeader sortKey="floodRisk">Flood Risk</SortableHeader>
                        <SortableHeader sortKey="bushfireRisk">Bushfire Risk</SortableHeader>
                        <SortableHeader sortKey="zoning">Zoning</SortableHeader>
                    </>
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View Report</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredResults.map((property) => (
                  <tr key={property.address} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.address}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center transition-colors ${
                        viewMode === ReportViewMode.COMPARATIVE 
                        ? 'bg-blue-100 text-blue-800 font-bold' 
                        : 'text-gray-500 font-semibold'
                    }`}>
                        {property.newFieldsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`$${property.value.toLocaleString()}`}</td>
                    {viewMode !== ReportViewMode.QUICK && (
                        <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.walkScore}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                property.floodRisk === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {property.floodRisk}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                property.bushfireRisk === 'Low' ? 'bg-green-100 text-green-800' : 
                                property.bushfireRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {property.bushfireRisk}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.zoning}</td>
                        </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onViewPropertyReport(property.address)} className="text-blue-600 hover:text-blue-900">
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchResultsView;