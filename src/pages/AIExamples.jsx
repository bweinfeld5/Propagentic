import React from 'react';
import MaintenanceClassifier from '../components/ai/MaintenanceClassifier';
import PropertyDescriptionGenerator from '../components/ai/PropertyDescriptionGenerator';
import AIConfigurationPanel from '../components/ai/AIConfigurationPanel';

const AIExamples = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-propagentic-teal">
          PropAgentic AI Features
        </h1>
        
        <AIConfigurationPanel />
        
        <div className="mb-12">
          <PropertyDescriptionGenerator />
        </div>
        
        <div className="mb-12">
          <MaintenanceClassifier />
        </div>
      </div>
    </div>
  );
};

export default AIExamples; 