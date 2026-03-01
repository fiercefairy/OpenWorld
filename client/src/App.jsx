import { Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Home, Brain, Info } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AIProviders from './pages/AIProviders';

function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to OpenWorld</h1>
      <p className="text-gray-400">Built with PortOS Stack</p>
    </div>
  );
}

function About() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-gray-400">Express + React + Vite + Tailwind + AI Provider Integration</p>
    </div>
  );
}

export default function App() {
  const [navOpen, setNavOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-app-bg text-white">
      {/* Collapsible sidebar */}
      <nav className={`${navOpen ? 'w-48' : 'w-12'} bg-app-card border-r border-app-border transition-all duration-200 flex flex-col`}>
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="p-3 hover:bg-app-border"
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex flex-col gap-1 p-2">
          <Link to="/" className={`flex items-center gap-2 p-2 rounded hover:bg-app-border ${location.pathname === '/' ? 'bg-app-accent/20 text-app-accent' : ''}`}>
            <Home size={18} />
            {navOpen && <span>Home</span>}
          </Link>
          <Link to="/providers" className={`flex items-center gap-2 p-2 rounded hover:bg-app-border ${location.pathname === '/providers' ? 'bg-app-accent/20 text-app-accent' : ''}`}>
            <Brain size={18} />
            {navOpen && <span>AI Providers</span>}
          </Link>
          <Link to="/about" className={`flex items-center gap-2 p-2 rounded hover:bg-app-border ${location.pathname === '/about' ? 'bg-app-accent/20 text-app-accent' : ''}`}>
            <Info size={18} />
            {navOpen && <span>About</span>}
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/providers" element={<AIProviders />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
