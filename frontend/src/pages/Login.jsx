import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import authService from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both your college email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword({ email: forgotEmail });
      setForgotSuccess(res.message || 'Password reset link sent to your college inbox!');
    } catch (err) {
      setError('Could not process password reset request.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#050713] relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform border border-white/15">
              <GraduationCap className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
            Welcome back to Campus
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Sign in with your verified college credentials
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#080B18]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="College Email"
              type="email"
              placeholder="e.g. student1@college.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              helperText="Official university/college email format"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#CBD5E1]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-[#050713] text-blue-600 focus:ring-blue-500/40 h-4 w-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotSuccess('');
                }}
                className="font-semibold text-[#60A5FA] hover:text-[#93C5FD]"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Sign In to Network
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-2 text-center">
              Quick Demo Accounts (1-Click Fill)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('student1@college.edu', 'password123')}
                className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-[#60A5FA] hover:bg-blue-500/20 font-semibold border border-blue-500/20 text-center transition-colors"
              >
                Student 1 (Aarav)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('student2@college.edu', 'password123')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-[#A78BFA] hover:bg-purple-500/20 font-semibold border border-purple-500/20 text-center transition-colors"
              >
                Student 2 (Priya)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('student3@college.edu', 'password123')}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-[#38BDF8] hover:bg-cyan-500/20 font-semibold border border-cyan-500/20 text-center transition-colors"
              >
                Student 3 (Rohan)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@college.edu', 'password123')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-semibold border border-amber-500/20 text-center transition-colors"
              >
                Admin (Console)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#60A5FA] hover:text-[#93C5FD]">
              Create Student Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Campus Account Password"
      >
        {forgotSuccess ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Check Your Email</h4>
            <p className="text-xs text-[#94A3B8]">{forgotSuccess}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
              className="mt-5"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-[#94A3B8]">
              Enter your registered college email address and we'll dispatch password recovery steps.
            </p>
            <Input
              label="College Email"
              type="email"
              placeholder="e.g. yourname@college.edu"
              icon={Mail}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={forgotLoading}
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
