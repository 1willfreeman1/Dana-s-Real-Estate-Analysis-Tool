import React, { useState, useEffect } from 'react';
import { MapPinIcon } from './icons';

interface MapEmbedProps {
  address: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ address }) => {
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');
  // FIX: Switched to the official Google Maps Embed API and included the API key from environment variables.
  // This is a more robust method that prevents common loading issues in sandboxed environments.
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`;

  useEffect(() => {
    // Reset status when the address prop changes, in case we are viewing a different report.
    setMapStatus('loading');
  }, [address]);

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
        onError={() => setMapStatus('failed')}
      >
      </iframe>

      {/* Status Overlay: This covers the iframe until it successfully loads, providing a clean user experience. */}
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
                <p className="font-semibold text-gray-700">Map Currently Unavailable</p>
                <p className="text-sm text-gray-600">{address}</p>
                <p className="text-xs text-gray-500 mt-2">(Could not load live map data)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapEmbed;