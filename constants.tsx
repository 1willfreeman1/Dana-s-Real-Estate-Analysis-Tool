import React from 'react';
import type { AnalysisStep, DataSource, ReportField } from './types';
import { ABSLogo, CoreLogicLogo, CouncilLogo, FEMALogo, GoogleMapsLogo, GreatSchoolsLogo, WalkScoreLogo, ZillowLogo } from './components/icons';

export const DATA_SOURCES: DataSource[] = [
  { id: 'Google Maps', name: 'Google Maps', logo: <GoogleMapsLogo />, description: 'Provides geographic data, including coordinates, access routes, and travel times.' },
  { id: 'CoreLogic', name: 'CoreLogic', logo: <CoreLogicLogo />, description: 'Official property records, ownership details, sales history, and internet availability.' },
  { id: 'Zillow', name: 'Zillow', logo: <ZillowLogo />, description: 'Market data including property value estimates (AVM) and historical listings.' },
  { id: 'GreatSchools', name: 'GreatSchools', logo: <GreatSchoolsLogo />, description: 'Ratings and information for nearby primary and secondary schools.' },
  { id: 'Walk Score', name: 'Walk Score', logo: <WalkScoreLogo />, description: 'Calculates walkability, transit access, and bikeability for any address.' },
  { id: 'ABS/Census', name: 'ABS/Census', logo: <ABSLogo />, description: 'Demographic data, including population statistics and median income levels.' },
  { id: 'FEMA/Environment', name: 'FEMA/Environment', logo: <FEMALogo />, description: 'Assesses environmental risks such as flood zones and bushfire-prone areas.' },
  { id: 'Local Council API', name: 'Local Council API', logo: <CouncilLogo />, description: 'Provides local data on zoning, crime rates, and planned infrastructure projects.' },
];

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { action: "Authenticating API session with CoreLogic", purpose: "To verify official property records and confirm lot/title accuracy.", result: "✔ Session Authenticated", sourceId: 'CoreLogic', latency: 480 },
  { action: "Verifying property record", purpose: "To confirm official parcel details your admin would normally check.", result: "✔ Verified: Lot 45123", sourceId: 'CoreLogic' },
  { action: "Geocoding address via Google Maps", purpose: "To pinpoint the exact location and geographic coordinates.", result: "✔ Geocoded: Lat -38.024, Lon 145.356", sourceId: 'Google Maps', latency: 310 },
  { action: "Identifying main access routes", purpose: "To map nearest highways and primary roads for accessibility analysis.", result: "✔ Access routes identified", sourceId: 'Google Maps' },
  { action: "Fetching nearby schools & ratings", purpose: "To retrieve local school data for family suitability assessment.", result: "✔ School data retrieved", sourceId: 'GreatSchools', latency: 620 },
  { action: "Calculating Walk Score & Transit Score", purpose: "To evaluate pedestrian-friendliness and public transit access.", result: "✔ Calculated: Walk Score 78", sourceId: 'Walk Score', latency: 550 },
  { action: "Retrieving area demographics", purpose: "To extract demographic context and local income levels for market profiling.", result: "✔ Retrieved: Median Income $102,000", sourceId: 'ABS/Census', latency: 710 },
  { action: "Checking environmental risks", purpose: "To assess flood, bushfire, and other environmental risk indicators.", result: "✔ Risk factors assessed", sourceId: 'FEMA/Environment', latency: 490 },
  { action: "Synthesizing data with Praxis AI", purpose: "To compile all data points into a concise executive summary.", result: "✔ Synthesis complete", sourceId: 'Local Council API', latency: 250 },
];

export const TEAM_DATA: ReportField[] = [
    { label: "Distance to CBD (km)", value: "42 km", source: "manual/admin", category: "Location" },
    { label: "Municipality", value: "City of Casey", source: "manual/admin", category: "Location" },
    { label: "Nearby schools (name + distance)", value: "Berwick Primary (1.2km), Nossal High (2.5km)", source: "manual/admin", category: "Education" },
    { label: "Nearby train station(s) (name + distance)", value: "Berwick Station (2.1km)", source: "manual/admin", category: "Transport" },
    { label: "Main access routes", value: "Princes Freeway (M1), Clyde Road", source: "manual/admin", category: "Transport" },
    { label: "Nearby shopping centers (name + distance)", value: "Eden Rise Village (1.5km), Westfield Fountain Gate (5km)", source: "manual/admin", category: "Amenities" },
    { label: "Nearby parks (name + distance)", value: "Wilson Botanic Park (3km), Berwick Springs Park (4km)", source: "manual/admin", category: "Amenities" },
    { label: "Nearby clinics (name + distance)", value: "St John of God Berwick Hospital (2.8km)", source: "manual/admin", category: "Amenities" },
    { label: "Key business parks (name + distance)", value: "Casey Corporate Centre (3.5km)", source: "manual/admin", category: "Infrastructure" },
];

export const AI_DATA: ReportField[] = [
    { label: "Walkability Score", value: "78 / 100 (Very Walkable)", source: "Walk Score", tooltip: "Why it matters: A high score indicates most errands can be accomplished on foot, a key lifestyle feature.", category: "Lifestyle" },
    { label: "Transit Score / Bikeability", value: "55 (Good Transit) / 68 (Bikeable)", source: "Walk Score", tooltip: "Why it matters: Measures access to public transport and bike-friendly infrastructure, impacting commute options.", category: "Lifestyle" },
    { label: "Median income (Area)", value: "$102,000 p.a.", source: "ABS/Census", tooltip: "Why it matters: Provides context on the local economic profile and purchasing power of the community.", category: "Demographics" },
    { label: "Crime rate (Area)", value: "Low (32 incidents per 1,000 residents)", source: "Local Council API", tooltip: "Why it matters: A key indicator for safety and residential desirability.", isNew: true, category: "Demographics" },
    { label: "Internet (NBN availability)", value: "FTTP (Fibre to the Premises) Available", source: "CoreLogic", tooltip: "Why it matters: High-speed internet is a critical utility for modern households and businesses.", category: "Utilities" },
    { label: "Flood risk", value: "Low", source: "FEMA/Environment", tooltip: "Why it matters: Assesses potential for property damage and impacts insurance premiums.", category: "Risk Assessment" },
    { label: "Bushfire risk", value: "Moderate (BAL-12.5 Zone)", source: "FEMA/Environment", tooltip: "Why it matters: Indicates proximity to fire-prone vegetation and potential building requirements.", category: "Risk Assessment" },
    { label: "Time to CBD by car (Peak)", value: "65-90 minutes", source: "Google Maps", tooltip: "Why it matters: A realistic commute time is a major factor for prospective residents.", category: "Transport" },
    { label: "Time to CBD by public transport", value: "75 minutes (Train + Walk)", source: "Google Maps", tooltip: "Why it matters: Shows the viability of non-car commuting options.", category: "Transport" },
    { label: "Property value estimate (Range)", value: "$850,000 - $920,000", source: "Zillow", tooltip: "Why it matters: An automated valuation model (AVM) provides an immediate financial baseline.", isNew: true, category: "Valuation" },
    { label: "Zoning type", value: "General Residential Zone (GRZ1)", source: "Local Council API", tooltip: "Why it matters: Defines what can be built on the land, affecting development potential.", category: "Zoning & Development" },
    { label: "Planned infrastructure projects", value: "Clyde Road Upgrade (2025)", source: "Local Council API", tooltip: "Why it matters: Future projects can significantly improve access and property values.", isNew: true, category: "Infrastructure" },
];

export const BATCH_PROPERTIES: string[] = [
    "12 Elmwood Drive, Berwick",
    "9 Pine Street, Beaconsfield",
    "21 Cedar Avenue, Narre Warren South",
    "7 Birch Road, Hampton Park",
    "14 Ash Grove, Lyndhurst",
    "3 Elm Street, Clyde North",
    "18 Maple Lane, Cranbourne",
    "25 Oak Drive, Dandenong North",
    "5 Willow Street, Pakenham",
    "11 Fir Court, Narre Warren",
];