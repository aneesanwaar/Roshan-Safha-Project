import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import FormsPage from './pages/FormsPage';

function GalleryPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold">Gallery</h2>
      <p className="text-slate-500 text-sm mt-2">Gallery module coming up next...</p>
    </div>
  );
}

function AnnouncementsPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold">Announcements</h2>
      <p className="text-slate-500 text-sm mt-2">Announcements feed coming up next...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/gallery" element={<GalleryPlaceholder />} />
            <Route path="/announcements" element={<AnnouncementsPlaceholder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;