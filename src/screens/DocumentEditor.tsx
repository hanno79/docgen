import React, { useState, useEffect, useRef } from 'react'
import { useDocumentContext, Document } from '../contexts/DocumentContext'
import { useTheme } from '../hooks/useTheme'
import { useRouter } from '../components/Router'
import { 
  Save, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Code, 
  Settings, 
  Info, 
  List, 
  GitBranch, 
  Package, 
  Layers,
  Upload,
  Trash2,
  Play
} from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import ParameterTable from '../components/ParameterTable'
import FunctionList from '../components/FunctionList'
import WorkflowDiagram from '../components/WorkflowDiagram'
import MetadataSection from '../components/MetadataSection'

const DocumentEditor: React.FC = () => {
  const { currentDocument, getDocumentById, createDocument, saveDocument, generateDocumentation } = useDocumentContext()
  const { theme } = useTheme()
  const { navigate, currentPath } = useRouter()
  
  const [activeTab, setActiveTab] = useState<string>('documentation')
  const [code, setCode] = useState<string>('')
  const [language, setLanguage] = useState<string>('python')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [document, setDocument] = useState<Document | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Extract document ID from URL if present
  const documentId = currentPath.split('/').pop()
  
  useEffect(() => {
    if (documentId && documentId !== 'editor') {
      const doc = getDocumentById(documentId)
      if (doc) {
        setDocument(doc)
        setCode(doc.code)
        setLanguage(doc.language)
        setTitle(doc.title)
        setDescription(doc.description)
      } else {
        navigate('/editor')
      }
    } else {
      setDocument(null)
      setCode('')
      setLanguage('python')
      setTitle('')
      setDescription('')
    }
  }, [documentId, getDocumentById, navigate])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    detectLanguage(newCode)
  }

  const detectLanguage = (codeText: string) => {
    // Simple language detection based on file content
    if (!codeText.trim()) {
      setDetectedLanguage(null)
      return
    }
    
    // Check for Python indicators
    if (codeText.includes('import arcpy') || 
        codeText.includes('def ') || 
        codeText.includes('import ') && codeText.includes(':') ||
        codeText.match(/^#.*python/i)) {
      setDetectedLanguage('python')
      setLanguage('python')
      return
    }
    
    // Check for JavaScript indicators
    if (codeText.includes('function ') || 
        codeText.includes('const ') || 
        codeText.includes('let ') ||
        codeText.includes('var ') ||
        codeText.includes('=>') ||
        codeText.match(/^\/\/.*javascript/i)) {
      setDetectedLanguage('javascript')
      setLanguage('javascript')
      return
    }
    
    // Check for R indicators
    if (codeText.includes('<-') || 
        codeText.match(/library\([^\)]+\)/) ||
        codeText.match(/^#.*\bR\b/i)) {
      setDetectedLanguage('r')
      setLanguage('r')
      return
    }
    
    // Check for SQL indicators
    if (codeText.match(/SELECT .* FROM/i) || 
        codeText.match(/CREATE TABLE/i) ||
        codeText.match(/INSERT INTO/i) ||
        codeText.match(/^--.*SQL/i)) {
      setDetectedLanguage('sql')
      setLanguage('sql')
      return
    }
    
    // Default to Python if no clear indicators
    setDetectedLanguage(null)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Bitte geben Sie einen Titel für Ihr Dokument ein')
      return
    }

    setIsSaving(true)
    
    try {
      if (document) {
        // Update existing document
        const updatedDoc = {
          ...document,
          title,
          description,
          code,
          language,
        }
        saveDocument(updatedDoc)
        setDocument(updatedDoc)
      } else {
        // Create new document
        const newDoc = createDocument(code, language, title)
        setDocument(newDoc)
        navigate(`/editor/${newDoc.id}`)
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error)
      alert('Fehler beim Speichern des Dokuments')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    if (!document) return
    
    const docContent = JSON.stringify(document, null, 2)
    const blob = new Blob([docContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${document.title.replace(/\s+/g, '_')}_dokumentation.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    if (!document) return
    
    const docContent = JSON.stringify(document, null, 2)
    navigator.clipboard.writeText(docContent)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(err => {
        console.error('Fehler beim Kopieren:', err)
      })
  }

  const handleGenerateDocumentation = () => {
    if (!code) {
      alert('Bitte geben Sie zuerst Code ein')
      return
    }
    
    setIsGenerating(true)
    
    try {
      const parsedInfo = generateDocumentation(code, language)
      
      if (document) {
        // Update existing document with parsed info
        const updatedDoc = {
          ...document,
          ...parsedInfo,
          title: title || 'Unbenanntes Dokument',
          code,
          language,
        }
        saveDocument(updatedDoc)
        setDocument(updatedDoc)
      } else {
        // Create new document with parsed info
        const newDoc = createDocument(code, language, title || 'Unbenanntes Dokument')
        setDocument(newDoc)
        navigate(`/editor/${newDoc.id}`)
      }
    } catch (error) {
      console.error('Fehler bei der Dokumentationsgenerierung:', error)
      alert('Fehler bei der Dokumentationsgenerierung')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearCode = () => {
    if (code && !window.confirm('Möchten Sie wirklich den gesamten Code löschen?')) {
      return
    }
    setCode('')
    setDetectedLanguage(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Detect language from file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (fileExtension) {
      switch (fileExtension) {
        case 'py':
          setLanguage('python')
          break
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
          setLanguage('javascript')
          break
        case 'r':
          setLanguage('r')
          break
        case 'sql':
          setLanguage('sql')
          break
      }
    }
    
    // Read file content
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCode(content)
      detectLanguage(content)
      
      // Try to extract title from filename
      const fileName = file.name.split('.')[0]
      if (fileName && !title) {
        setTitle(fileName.replace(/_/g, ' ').replace(/-/g, ' '))
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const renderDocumentationContent = () => {
    if (!document) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText size={48} className="mb-4 opacity-50" />
          <p className="text-lg text-center">
            Bitte laden Sie ein GIS-Skript hoch oder fügen Sie Code ein und klicken Sie auf "Dokumentation generieren"
          </p>
        </div>
      )
    }

    switch (activeTab) {
      case 'documentation':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Skript-Beschreibung</h2>
              <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p>{document.description || 'Keine Beschreibung vorhanden'}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Parameter</h2>
              <ParameterTable parameters={document.parameters} theme={theme} />
            </div>
          </div>
        )
      
      case 'functions':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Funktionen und Tools</h2>
            <FunctionList functions={document.functions} theme={theme} />
          </div>
        )
      
      case 'workflow':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Workflow-Diagramm</h2>
            <WorkflowDiagram document={document} theme={theme} />
          </div>
        )
      
      case 'code':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Original-Code</h2>
            <div className={`rounded-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <CodeEditor 
                code={document.code} 
                language={document.language} 
                onChange={() => {}} 
                theme={theme}
                readOnly={true}
              />
            </div>
          </div>
        )
      
      case 'metadata':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Metadaten</h2>
            <MetadataSection document={document} theme={theme} />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className={`mr-4 p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            } transition-colors`}
            aria-label="Zurück zum Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {document ? `Bearbeiten: ${document.title}` : 'Neue Dokumentation erstellen'}
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {document 
                ? `Zuletzt aktualisiert: ${document.metadata.updatedAt.toLocaleString()}`
                : 'Laden Sie Ihr GIS-Skript hoch, um Dokumentation zu generieren'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateDocumentation}
            disabled={!code || isGenerating}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
            } text-white transition-colors flex items-center ${(!code || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generiere...
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Dokumentation generieren
              </>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !code}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors flex items-center ${
              (isSaving || !code) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Speichern...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Speichern
              </>
            )}
          </button>
          
          {document && (
            <>
              <button
                onClick={handleExport}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors flex items-center`}
              >
                <Download size={18} className="mr-2" />
                Exportieren
              </button>
              
              <button
                onClick={handleCopyToClipboard}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors flex items-center`}
              >
                {isCopied ? (
                  <>
                    <Check size={18} className="mr-2" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" />
                    Kopieren
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Code Editor */}
        <div className={`rounded-lg overflow-hidden border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">GIS-Skript</h2>
            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".py,.js,.jsx,.ts,.tsx,.r,.sql"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={triggerFileUpload}
                className={`p-2 rounded-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-100'
                } transition-colors flex items-center`}
                title="Datei hochladen"
              >
                <Upload size={18} />
              </button>
              <button
                onClick={handleClearCode}
                className={`p-2 rounded-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-100'
                } transition-colors flex items-center`}
                title="Code löschen"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Dokumenttitel
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Geben Sie einen Dokumenttitel ein"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-1">
                  Sprache {detectedLanguage && <span className="text-xs text-green-500">(erkannt)</span>}
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className={`px-4 py-2 rounded-md border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="r">R</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Beschreibung
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Geben Sie eine Beschreibung für dieses Skript ein"
                rows={3}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            <div className="flex-1 min-h-[400px]">
              <label className="block text-sm font-medium mb-1">
                Code
              </label>
              <CodeEditor 
                code={code} 
                language={language} 
                onChange={handleCodeChange} 
                theme={theme}
              />
            </div>
          </div>
        </div>
        
        {/* Right Panel - Documentation Preview */}
        <div className={`rounded-lg overflow-hidden border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex overflow-x-auto border-b border-gray-700">
            <button
              onClick={() => setActiveTab('documentation')}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === 'documentation'
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Info size={18} className="mr-2" />
              Dokumentation
            </button>
            
            <button
              onClick={() => setActiveTab('functions')}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === 'functions'
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package size={18} className="mr-2" />
              Funktionen
            </button>
            
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === 'workflow'
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Layers size={18} className="mr-2" />
              Workflow
            </button>
            
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === 'code'
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText size={18} className="mr-2" />
              Original-Code
            </button>
            
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === 'metadata'
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings size={18} className="mr-2" />
              Metadaten
            </button>
          </div>
          
          <div className="p-6 h-full overflow-y-auto">
            {renderDocumentationContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
