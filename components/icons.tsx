import React from 'react';

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.242 12.082 12.082 0 003.06-7.397A12.082 12.082 0 0012 2.5a12.082 12.082 0 00-10.08 9.176 12.082 12.082 0 003.06 7.396 16.975 16.975 0 005.16 4.242zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.103 3.104-1.48-1.481a.75.75 0 10-1.06 1.061l2 2a.75.75 0 001.06 0l3.643-3.643z" clipRule="evenodd" />
  </svg>
);

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

export const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


const BaseLogo: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`w-full h-full flex items-center justify-center font-bold text-white rounded-md ${className}`}>
        {children}
    </div>
);

export const GoogleMapsLogo: React.FC = () => <BaseLogo className="bg-[#4285F4]">G</BaseLogo>;
export const CoreLogicLogo: React.FC = () => <BaseLogo className="bg-[#003DA5]">CL</BaseLogo>;
export const ZillowLogo: React.FC = () => <BaseLogo className="bg-[#006AFF]">Z</BaseLogo>;
export const GreatSchoolsLogo: React.FC = () => <BaseLogo className="bg-[#00A5B5]">GS</BaseLogo>;
export const WalkScoreLogo: React.FC = () => <BaseLogo className="bg-[#00A600]">WS</BaseLogo>;
export const ABSLogo: React.FC = () => <BaseLogo className="bg-[#2B4C6F]">ABS</BaseLogo>;
export const FEMALogo: React.FC = () => <BaseLogo className="bg-[#0033A1]">FEMA</BaseLogo>;
export const CouncilLogo: React.FC = () => <BaseLogo className="bg-[#6D6E71]">LC</BaseLogo>;