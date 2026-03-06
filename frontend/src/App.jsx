import { Layout } from './components/Layout'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { AppProvider, useAppContext } from './context/AppContext'

function AppContent() {
  const { activePage } = useAppContext();

  return (
    <Layout>
      {activePage === 'home' ? <Home /> : <Catalog />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
