import { Layout } from './components/Layout'
import { Catalog } from './pages/Catalog'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <Layout>
        <Catalog />
      </Layout>
    </AppProvider>
  )
}

export default App
