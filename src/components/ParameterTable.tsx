import React from 'react';
import { Parameter } from '../contexts/DocumentContext';

interface ParameterTableProps {
  parameters: Parameter[];
  theme: string;
}

const ParameterTable: React.FC<ParameterTableProps> = ({ parameters, theme }) => {
  if (parameters.length === 0) {
    return (
      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <p>Keine Parameter gefunden.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${
        theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
      } rounded-lg overflow-hidden`}>
        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Datentyp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Beschreibung
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Erforderlich
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Typ
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {parameters.map((param, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {param.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {param.dataType}
              </td>
              <td className="px-6 py-4 text-sm">
                {param.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {param.isRequired ? 'Ja' : 'Nein'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {param.isInput && param.isOutput ? 'Ein-/Ausgabe' : param.isInput ? 'Eingabe' : 'Ausgabe'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParameterTable;
