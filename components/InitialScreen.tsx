import React, { useState } from 'react';
import { DATA_SOURCES } from '../constants';
import { ArrowDownIcon, ArrowUpIcon } from './icons';

interface InitialScreenProps {
  onGenerate: () => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onGenerate }) => {
  const [address, setAddress] = useState("12 Elmwood Drive, Berwick");
  const [openSourceId, setOpenSourceId] = useState<string | null>(null);

  const handleToggleSource = (id: string) => {
    setOpenSourceId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-white p-4 py-8">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-700">Real Estate Analysis Tool</h1>
          <p className="text-sm text-gray-500">Commissioned for Ms. Dana Sziklay — by Victor H. Torres (Praxis AI)</p>
        </header>

        <main className="w-full bg-gray-50 p-8 rounded-lg shadow-md">
          <label htmlFor="address" className="block text-sm text-gray-600 mb-2 text-center">
            Dana asked for a practical, time-saving property review. Enter an address and Generate Report.
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            rows={2}
          />
          <button
            onClick={onGenerate}
            className="w-full mt-6 bg-[#007BFF] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            Generate Report
          </button>
        </main>

        <section className="mt-10">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
            How We Generate Your Report
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Our AI synthesizes data from multiple industry-standard sources to provide a comprehensive analysis. Click each source to learn more.
          </p>
          <div className="space-y-2">
            {DATA_SOURCES.map(source => {
              const isOpen = openSourceId === source.id;
              return (
                <div key={source.id} className={`border rounded-lg transition-all duration-300 ${isOpen ? 'bg-gray-50 border-gray-300' : 'border-gray-200'}`}>
                  <button
                    onClick={() => handleToggleSource(source.id)}
                    className="w-full flex justify-between items-center p-3 text-left focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`source-content-${source.id}`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-4 flex-shrink-0">{source.logo}</div>
                      <span className="font-medium text-gray-800">{source.name}</span>
                    </div>
                    {isOpen ? <ArrowUpIcon className="w-5 h-5 text-gray-500" /> : <ArrowDownIcon className="w-5 h-5 text-gray-500" />}
                  </button>
                  <div
                    id={`source-content-${source.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48' : 'max-h-0'}`}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 ml-14">
                        {source.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InitialScreen;