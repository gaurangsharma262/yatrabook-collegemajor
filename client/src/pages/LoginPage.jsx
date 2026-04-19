import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen bg-mesh">
      <div className="w-full max-w-md px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4"
            >
              <span className="text-3xl font-display font-bold text-white">Y</span>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-text-primary">Welcome Back</h1>
            <p className="text-sm text-text-secondary mt-2">Login to your YatraBook account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Login</Button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10"
          >
            <p className="text-xs text-text-muted text-center">
              Demo: <span className="text-primary-400">demo@yatrabook.com</span> / <span className="text-primary-400">demo123456</span>
            </p>
          </motion.div>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
