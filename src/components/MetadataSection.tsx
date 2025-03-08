import React from 'react';
import { Document } from '../contexts/DocumentContext';

interface MetadataSectionProps {
  document: Document;
  theme: string;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ document, theme }) => {
  const { metadata } = document;
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className={`px-6 py-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className="text-lg font-medium">Dokumentinformationen</h3>
      </div>
      
      <div className={`px-6 py-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <dt className="text-sm font-medium opacity-70">Version</dt>
            <dd className="mt-1">{metadata.version}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium opacity-70">Sprache</dt>
            <dd className="mt-1">{document.language}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium opacity-70">Erstellt am</dt>
            <dd className="mt-1">{formatDate(metadata.createdAt)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium opacity-70">Zuletzt aktualisiert</dt>
            <dd className="mt-1">{formatDate(metadata.updatedAt)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium opacity-70">Autor</dt>
            <dd className="mt-1">{metadata.author}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium opacity-70">Status</dt>
            <dd className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                document.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {document.isPublished ? 'Veröffentlicht' : 'Entwurf'}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default MetadataSection;
