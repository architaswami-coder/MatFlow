// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Layers, ShieldCheck, Package, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Register new user
        await API.post('/auth/register', { name, email, password });
        
        // Log in after registration by passing object
        const result = await login({ email, password });
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      } else {
        // Sign in by passing object
        const result = await login({ email, password });
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Banner / Interactive Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-900 via-gray-950 to-blue-950 p-12 flex-col justify-between border-r border-gray-800/80 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-blue-400 tracking-tight">MatFlow ERP</h1>
            <p className="text-xs text-gray-400">Enterprise Resource Planning System</p>
          </div>
        </div>

        {/* Center Feature Highlights */}
        <div className="z-10 space-y-6 max-w-md">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Seamless Control Over Your <span className="text-blue-400">Inventory & Orders</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Manage raw materials, track real-time stock levels, and oversee fulfillment lifecycles securely in one unified platform.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-sm">
              <Package className="text-blue-400 mb-2" size={22} />
              <h3 className="text-xs font-semibold text-white">Live Tracking</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Instant updates on stock & orders</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="text-green-400 mb-2" size={22} />
              <h3 className="text-xs font-semibold text-white">Secure Access</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">JWT protected authentication</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} MatFlow ERP. All rights reserved.
        </div>
      </div>

      {/* Right Login / Register Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-gray-950">
        <div className="max-w-md w-full space-y-8 bg-gray-900/40 p-8 rounded-2xl border border-gray-800/80 shadow-2xl backdrop-blur-md">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex p-3 bg-blue-600/10 text-blue-400 rounded-xl mb-4 lg:hidden">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isSignUp ? 'Create an Account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isSignUp ? 'Enter your details to get started with MatFlow.' : 'Please enter your credentials to sign in.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition"
                  placeholder="admin@matflow.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-2 text-sm text-gray-400">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(''); }}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New user?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(''); }}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
