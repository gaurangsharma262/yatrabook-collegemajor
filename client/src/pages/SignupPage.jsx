import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome aboard!');
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
              className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4"
            >
              <span className="text-2xl font-display font-bold text-white">+</span>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-text-primary">Create Account</h1>
            <p className="text-sm text-text-secondary mt-2">Join YatraBook and start exploring India</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Gaurav Sharma" value={form.name} onChange={updateField('name')} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={updateField('email')} required />
            <Input label="Phone (optional)" placeholder="9876543210" value={form.phone} onChange={updateField('phone')} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={updateField('password')} required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Login</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
