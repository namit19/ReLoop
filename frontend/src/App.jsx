import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top automatically when navigating between pages
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <FavoritesProvider>
            <div className="flex flex-col min-h-screen bg-surface-bg text-zinc-900 font-sans">
              <ScrollToTop />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/create-listing"
                    element={
                      <ProtectedRoute>
                        <CreateListingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-listing/:id"
                    element={
                      <ProtectedRoute>
                        <EditListingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FavoritesProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
