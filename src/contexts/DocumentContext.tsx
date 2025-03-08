import React, { createContext, useContext, useState, useEffect } from 'react'
import { parseGisScript } from '../utils/scriptParser'

export interface Parameter {
  name: string
  dataType: string
  description: string
  constraints: string[]
  isRequired: boolean
  isInput: boolean
  isOutput: boolean
  codeLocation?: string
}

export interface Function {
  name: string
  description: string
  parameters: Parameter[]
  returnType: string
  codeLocation: string
}

export interface DocumentMetadata {
  version: string
  createdAt: Date
  updatedAt: Date
  author: string
  authorId: string
}

export interface Document {
  id: string
  title: string
  language: string
  code: string
  description: string
  parameters: Parameter[]
  functions: Function[]
  workflowSteps: string[]
  metadata: DocumentMetadata
  isPublished: boolean
}

interface DocumentContextType {
  documents: Document[]
  currentDocument: Document | null
  setCurrentDocument: (doc: Document | null) => void
  createDocument: (code: string, language: string, title: string) => Document
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  getDocumentById: (id: string) => Document | undefined
  generateDocumentation: (code: string, language: string) => Partial<Document>
  saveDocument: (document: Document) => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)

  useEffect(() => {
    // Load documents from localStorage
    const savedDocs = localStorage.getItem('gis_documents')
    if (savedDocs) {
      try {
        const parsedDocs = JSON.parse(savedDocs)
        // Convert string dates back to Date objects
        const docsWithDates = parsedDocs.map((doc: any) => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            createdAt: new Date(doc.metadata.createdAt),
            updatedAt: new Date(doc.metadata.updatedAt)
          }
        }))
        setDocuments(docsWithDates)
      } catch (error) {
        console.error('Failed to parse saved documents:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save documents to localStorage whenever they change
    if (documents.length > 0) {
      localStorage.setItem('gis_documents', JSON.stringify(documents))
    }
  }, [documents])

  const generateDocumentation = (code: string, language: string): Partial<Document> => {
    return parseGisScript(code, language)
  }

  const createDocument = (code: string, language: string, title: string): Document => {
    const parsedInfo = parseGisScript(code, language)
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    const newDoc: Document = {
      id: Date.now().toString(),
      title: title || 'Untitled Document',
      language,
      code,
      description: parsedInfo.description || '',
      parameters: parsedInfo.parameters || [],
      functions: parsedInfo.functions || [],
      workflowSteps: parsedInfo.workflowSteps || [],
      metadata: {
        version: '1.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: user.name || 'Anonymous',
        authorId: user.id || 'unknown'
      },
      isPublished: false
    }
    
    setDocuments(prev => [...prev, newDoc])
    return newDoc
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { 
              ...doc, 
              ...updates, 
              metadata: { 
                ...doc.metadata, 
                updatedAt: new Date() 
              } 
            } 
          : doc
      )
    )
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
    if (currentDocument?.id === id) {
      setCurrentDocument(null)
    }
  }

  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id)
  }

  const saveDocument = (document: Document) => {
    const existingDoc = documents.find(doc => doc.id === document.id)
    
    if (existingDoc) {
      updateDocument(document.id, document)
    } else {
      setDocuments(prev => [...prev, {
        ...document,
        metadata: {
          ...document.metadata,
          updatedAt: new Date()
        }
      }])
    }
  }

  return (
    <DocumentContext.Provider value={{
      documents,
      currentDocument,
      setCurrentDocument,
      createDocument,
      updateDocument,
      deleteDocument,
      getDocumentById,
      generateDocumentation,
      saveDocument
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export const useDocumentContext = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider')
  }
  return context
}
