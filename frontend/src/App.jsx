import { Layout } from './components/Layout'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { AppProvider, useAppContext } from './context/AppContext'

function AppContent() {
  const { activePage } = useAppContext();

  const renderPage = () => {
    if (activePage === 'home') return <Home />;
    if (activePage === 'catalog') return <Catalog />;
    if (activePage.startsWith('profile')) return <Profile initialTab={activePage} />;
    return <Home />;
  };

  return (
    <Layout>
      {renderPage()}
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
