import { Layout } from './components/Layout'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { ProductDetails } from './pages/ProductDetails'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AppProvider, useAppContext } from './context/AppContext'

function AppContent() {
  const { activePage } = useAppContext();

  const renderPage = () => {
    if (activePage === 'home') return <Home />;
    if (activePage === 'catalog') return <Catalog />;
    if (activePage === 'product-details') return <ProductDetails />;
    if (activePage === 'login') return <Login />;
    if (activePage === 'register') return <Register />;
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
