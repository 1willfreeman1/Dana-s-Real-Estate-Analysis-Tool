
import React, { useState } from 'react';
import { MapPinIcon } from './icons';

interface MapEmbedProps {
  address: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ address }) => {
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const apiKey = 'AIzaSyCi3ssyNg5XQFC8KWpD3TwmXkSbqJEEhOc';
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`;

  return (
    <div className="w-full h-full min-h-[250px] relative">
      <iframe
        title={`Map of ${address}`}
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
        onLoad={() => setMapStatus('loaded')}
        onError={() => {
          setMapStatus('failed');
        }}
      >
      </iframe>
      {mapStatus !== 'loaded' && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
          {mapStatus === 'loading' && (
            <>
              <MapPinIcon className="w-12 h-12 text-blue-500 animate-pulse" />
              <p className="text-gray-500 mt-2">Loading map...</p>
            </>
          )}
          {mapStatus === 'failed' && (
             <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
                <MapPinIcon className="w-16 h-16 text-gray-400 mb-4" />
                <p className="font-semibold text-gray-700">Map Could Not Load</p>
                <p className="text-sm text-red-600 mt-2 max-w-xs">The API key may be invalid or restricted.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapEmbed;
