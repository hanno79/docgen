import React, { useState } from 'react';
import { Function } from '../contexts/DocumentContext';

interface FunctionListProps {
  functions: Function[];
  theme: string;
}

const FunctionList: React.FC<FunctionListProps> = ({ functions, theme }) => {
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);

  if (functions.length === 0) {
    return (
      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <p>Keine Funktionen gefunden.</p>
      </div>
    );
  }

  const toggleFunction = (functionName: string) => {
    if (expandedFunction === functionName) {
      setExpandedFunction(null);
    } else {
      setExpandedFunction(functionName);
    }
  };

  return (
    <div className="space-y-4">
      {functions.map((func, index) => (
        <div 
          key={index} 
          className={`rounded-lg overflow-hidden border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div 
            className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            onClick={() => toggleFunction(func.name)}
          >
            <div>
              <span className="font-mono font-medium">{func.name}</span>
              <span className="text-sm ml-2 opacity-70">{func.codeLocation}</span>
            </div>
            <span>{expandedFunction === func.name ? '▲' : '▼'}</span>
          </div>
          
          {expandedFunction === func.name && (
            <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="mb-3">{func.description || 'Keine Beschreibung verfügbar.'}</p>
              
              <h4 className="font-medium mb-2">Rückgabetyp</h4>
              <p className="mb-3 font-mono">{func.returnType || 'void'}</p>
              
              <h4 className="font-medium mb-2">Parameter</h4>
              {func.parameters.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {func.parameters.map((param, paramIndex) => (
                    <li key={paramIndex}>
                      <span className="font-mono">{param.name}</span>
                      {param.dataType && <span className="opacity-70"> ({param.dataType})</span>}
                      {param.description && <span>: {param.description}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Keine Parameter</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FunctionList;
