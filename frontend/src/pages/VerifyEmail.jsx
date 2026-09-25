import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { MailCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [inputToken, setInputToken] = useState(token || '');
  const [inputEmail, setInputEmail] = useState(email || '');
  const [status, setStatus] = useState(token ? 'verifying' : 'idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (token && email) {
      handleVerify(token, email);
    }
  }, [token, email]);

  const handleVerify = async (tok, em) => {
    setLoading(true);
    setStatus('verifying');
    try {
      const res = await authService.verifyEmail({ token: tok, email: em });
      setStatus('success');
      setMessage(res.message || 'College email verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification token invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputToken || !inputEmail) return;
    handleVerify(inputToken, inputEmail);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5">
          <MailCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          College Email Verification
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          To maintain an authentic student community, all members verify their campus institutional email.
        </p>

        {status === 'verifying' && (
          <div className="py-6 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-medium text-slate-700">Verifying student credentials...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
              {message}
            </div>
            <Link to="/login">
              <Button size="lg" icon={ArrowRight} className="w-full">
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm mb-6 flex items-start gap-2 text-left">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{message}</span>
            </div>
          </div>
        )}

        {status !== 'success' && status !== 'verifying' && (
          <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
            <Input
              label="College Email"
              type="email"
              placeholder="e.g. student1@college.edu"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
            <Input
              label="Verification Token / Code"
              placeholder="Paste code from console or email"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="md"
              isLoading={loading}
              className="w-full mt-2"
            >
              Verify My Account
            </Button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400">
          Already verified?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
