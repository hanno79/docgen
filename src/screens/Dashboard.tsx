import React, { useState } from 'react'
import { useDocumentContext, Document } from '../contexts/DocumentContext'
import { useTheme } from '../hooks/useTheme'
import { useRouter } from '../components/Router'
import { Plus, Search, FileText, Trash2, Edit, Eye, Calendar, User, Code, Filter } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { documents, deleteDocument, setCurrentDocument } = useDocumentContext()
  const { theme } = useTheme()
  const { navigate } = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLanguage, setFilterLanguage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const languages = ['all', ...Array.from(new Set(documents.map(doc => doc.language)))]

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLanguage = filterLanguage === 'all' || doc.language === filterLanguage
      return matchesSearch && matchesLanguage
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.metadata.updatedAt.getTime() - b.metadata.updatedAt.getTime()
          : b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime()
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      }
    })

  const handleCreateNew = () => {
    navigate('/editor')
  }

  const handleEdit = (doc: Document) => {
    setCurrentDocument(doc)
    navigate(`/editor/${doc.id}`)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Sind Sie sicher, dass Sie dieses Dokument löschen möchten?')) {
      deleteDocument(id)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ihre Dokumentationen</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Verwalten Sie Ihre GIS-Skript-Dokumentationen
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Neu erstellen
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            placeholder="Dokumente durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-md border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className={`px-4 py-2 rounded-md border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang === 'all' ? 'Alle Sprachen' : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded ${
                sortBy === 'date'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              Datum
            </button>
            <button
              onClick={() => setSortBy('title')}
              className={`px-3 py-1 rounded ${
                sortBy === 'title'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              Titel
            </button>
          </div>
          <button
            onClick={toggleSortOrder}
            className={`p-2 rounded ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className={`text-center py-16 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Keine Dokumente gefunden</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {searchTerm || filterLanguage !== 'all'
              ? 'Versuchen Sie, Ihre Suche oder Filter anzupassen'
              : 'Erstellen Sie Ihre erste Dokumentation, indem Sie auf "Neu erstellen" klicken'}
          </p>
          {(searchTerm || filterLanguage !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterLanguage('all')
              }}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleEdit(doc)}
              className={`rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className={`p-5 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b'}`}>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-2 truncate" title={doc.title}>
                    {doc.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(doc)
                      }}
                      className={`p-1.5 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      title="Bearbeiten"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      className={`p-1.5 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'
                      }`}
                      title="Löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-1 mb-3">
                  <Code size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doc.language.charAt(0).toUpperCase() + doc.language.slice(1)}
                  </span>
                </div>
                <p className={`text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {doc.description || 'Keine Beschreibung vorhanden'}
                </p>
              </div>
              <div className={`px-5 py-3 ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'} text-sm`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(doc.metadata.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {doc.metadata.author}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
