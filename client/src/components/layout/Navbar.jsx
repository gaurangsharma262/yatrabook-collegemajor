import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../features/auth/AuthContext';
import { IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoMenuOutline, IoCloseOutline, IoPersonCircleOutline, IoLogOutOutline, IoGridOutline } from 'react-icons/io5';

const navLinks = [
  { to: '/trains', label: 'Trains', icon: IoTrainOutline },
  { to: '/flights', label: 'Flights', icon: IoAirplaneOutline },
  { to: '/buses', label: 'Buses', icon: IoBusOutline },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-shadow duration-500">
              <span className="text-white font-display font-bold text-lg">Y</span>
            </div>
            <span className="font-display font-bold text-lg text-text-primary group-hover:text-gradient transition-all duration-300">
              YatraBook
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300"
                >
                  <IoGridOutline size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition-all duration-300"
                >
                  <IoLogOutOutline size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm !px-5 !py-2">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              <hr className="border-white/5" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5">
                    <IoGridOutline size={18} /> Dashboard
                  </Link>
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-danger w-full text-left">
                    <IoLogOutOutline size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm">Login</Link>
                  <Link to="/signup" className="btn-primary flex-1 text-center text-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
