import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { RouterProvider } from './components/Router'
import Layout from './components/Layout'
import AuthScreen from './screens/AuthScreen'
import Dashboard from './screens/Dashboard'
import DocumentEditor from './screens/DocumentEditor'
import { Routes, Route, Navigate } from './components/Router'
import { useAuth } from './hooks/useAuth'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <RouterProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<AuthScreen />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editor/:id?" 
                  element={
                    <ProtectedRoute>
                      <DocumentEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </RouterProvider>
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
