import React from 'react';
import { Document } from '../contexts/DocumentContext';

interface WorkflowDiagramProps {
  document: Document;
  theme: string;
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ document, theme }) => {
  const { workflowSteps } = document;

  if (!workflowSteps || workflowSteps.length === 0) {
    return (
      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <p>Kein Workflow-Diagramm verfügbar.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex flex-col items-center">
        {workflowSteps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`w-64 p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              } shadow-md`}
            >
              <p className="font-medium">{step}</p>
            </div>
            
            {index < workflowSteps.length - 1 && (
              <div className="h-8 w-0.5 bg-blue-500 my-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <p className="mt-8 text-sm text-center opacity-70">
        Hinweis: Dies ist eine vereinfachte Darstellung des Workflows. In einer vollständigen Implementierung würde hier ein interaktives Diagramm angezeigt werden.
      </p>
    </div>
  );
};

export default WorkflowDiagram;
