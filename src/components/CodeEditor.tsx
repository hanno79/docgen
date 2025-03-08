import React from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  theme: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, theme, readOnly = false }) => {
  // Einfache Implementierung eines Code-Editors
  // In einer vollständigen Implementierung würde hier eine Bibliothek wie Monaco Editor oder CodeMirror verwendet werden
  
  return (
    <div className={`rounded-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-96 p-4 font-mono text-sm ${
          theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
        } focus:outline-none`}
        placeholder={`Geben Sie Ihren ${language.toUpperCase()}-Code hier ein...`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CodeEditor;
