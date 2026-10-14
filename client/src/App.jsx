import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Collections from './pages/Collections'
import HowToOrder from './pages/HowToOrder'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminContent from './pages/admin/AdminContent'
import AdminCollections from './pages/admin/AdminCollections'
import AdminAccount from './pages/admin/AdminAccount'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/how-to-order" element={<HowToOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/collections"
            element={
              <ProtectedRoute>
                <AdminCollections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/account"
            element={
              <ProtectedRoute>
                <AdminAccount />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
