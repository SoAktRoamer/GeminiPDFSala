import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isReset) {
        await sendPasswordResetEmail(auth, email);
        setMessage(`We sent you a password change link to ${email}`);
        setIsReset(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Password or Email Incorrect');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in');
        setIsLogin(true);
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] bg-opacity-80 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl border border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors">
          <Icon name="X" className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isReset ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          {!isReset && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {isReset ? 'Get Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {!isReset && (
          <>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button 
                type="button" 
                onClick={() => setIsReset(true)} 
                className="text-slate-400 hover:text-indigo-400"
              >
                Forgot password?
              </button>
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-indigo-400 hover:underline"
              >
                {isLogin ? 'Create Account' : 'Sign In instead'}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button 
                onClick={handleGoogle}
                className="mt-4 w-full flex items-center justify-center space-x-2 bg-white text-slate-800 rounded-lg py-2 hover:bg-slate-100 transition-colors"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span className="font-medium text-slate-700">Google</span>
              </button>
            </div>
          </>
        )}
        
        {isReset && (
          <div className="mt-4 text-center text-sm">
            <button type="button" onClick={() => setIsReset(false)} className="text-indigo-400 hover:underline">
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
