import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Default demo credentials (can be wired to backend later)
      if (email === 'admin@roshansafha.org' && password === 'admin123') {
        localStorage.setItem('rs_admin_token', 'mock_jwt_token_roshan_safha_2026');
        navigate('/admin');
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img 
            src={logoImg} 
            alt="Roshan Safha Logo" 
            className="h-12 w-auto mx-auto object-contain rounded-xl"
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Portal Login</h1>
          <p className="text-xs text-slate-500">Restricted area for authorized administrators only.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-slate-600 mb-1">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@roshansafha.org" 
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In to Portal <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Demo credentials: <strong className="text-slate-600">admin@roshansafha.org</strong> / <strong className="text-slate-600">admin123</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;