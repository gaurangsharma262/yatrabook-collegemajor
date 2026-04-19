import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { useAuth } from '../features/auth/AuthContext';
import { bookingAPI, userAPI } from '../lib/api';
import { formatPrice, formatDate, formatTime, getStatusColor, getInitials, stringToColor, timeAgo } from '../lib/utils';
import { TRANSPORT_CONFIG } from '../lib/constants';
import { IoTicketOutline, IoTimeOutline, IoPersonOutline, IoSearchOutline, IoTrashOutline, IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoCheckmarkCircleOutline, IoHourglassOutline, IoCloseCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const transportIcons = { train: IoTrainOutline, flight: IoAirplaneOutline, bus: IoBusOutline };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, searchesRes] = await Promise.all([
        bookingAPI.getAll({ limit: 20 }),
        userAPI.getRecentSearches().catch(() => ({ data: [] })),
      ]);
      setBookings(bookingsRes.data?.bookings || []);
      setRecentSearches(searchesRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(bookingId, 'Cancelled by user');
      toast.success('Booking cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Cancellation failed');
    }
  };

  const handleClearSearches = async () => {
    try {
      await userAPI.clearRecentSearches();
      setRecentSearches([]);
      toast.success('Recent searches cleared');
    } catch (err) {
      toast.error('Failed to clear searches');
    }
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: IoTicketOutline, color: 'text-primary-400' },
    { label: 'Confirmed', value: bookings.filter(b => b.bookingStatus === 'confirmed').length, icon: IoCheckmarkCircleOutline, color: 'text-success' },
    { label: 'Waitlisted', value: bookings.filter(b => b.bookingStatus === 'waitlisted').length, icon: IoHourglassOutline, color: 'text-warning' },
    { label: 'Cancelled', value: bookings.filter(b => b.bookingStatus === 'cancelled').length, icon: IoCloseCircleOutline, color: 'text-danger' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white shadow-glow"
              style={{ backgroundColor: stringToColor(user?.name || '') }}
            >
              {getInitials(user?.name)}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-display font-bold text-text-primary">{user?.name}</h1>
              <p className="text-text-secondary">{user?.email}</p>
              {user?.phone && <p className="text-text-muted text-sm mt-1">{user.phone}</p>}
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <StatIcon size={24} className={`mx-auto ${stat.color}`} />
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'bookings', label: 'My Bookings', icon: IoTicketOutline },
            { key: 'searches', label: 'Recent Searches', icon: IoSearchOutline },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <TabIcon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card p-6 animate-pulse">
                      <div className="h-5 bg-dark-600 rounded w-1/3 mb-3" />
                      <div className="h-4 bg-dark-600 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <IoTicketOutline size={48} className="mx-auto text-text-muted mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">No Bookings Yet</h3>
                  <p className="text-text-secondary mb-6">Start exploring India by booking your first trip!</p>
                  <Link to="/"><Button>Search Now</Button></Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b, i) => {
                    const TransportIcon = transportIcons[b.type] || IoTrainOutline;
                    return (
                      <motion.div
                        key={b.bookingId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${TRANSPORT_CONFIG[b.type]?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                              <TransportIcon size={20} className="text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-text-primary">{b.travelName}</h3>
                              <p className="text-xs text-text-muted">{b.travelNumber} &middot; {formatDate(b.travelDate)}</p>
                            </div>
                          </div>
                          <span className={getStatusColor(b.bookingStatus)}>
                            {b.bookingStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-sm"><span className="font-semibold">{formatTime(b.departure)}</span> <span className="text-text-muted">{b.source?.city}</span></div>
                          <div className="flex-1 h-px bg-white/10" />
                          <div className="text-sm"><span className="font-semibold">{formatTime(b.arrival)}</span> <span className="text-text-muted">{b.destination?.city}</span></div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                          <div className="flex gap-4 text-xs text-text-muted">
                            <span>PNR: <span className="font-mono text-text-primary">{b.pnr}</span></span>
                            <span>{b.passengers?.length} passenger(s)</span>
                            <span>{b.className}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gradient">{formatPrice(b.totalAmount)}</span>
                            {b.bookingStatus !== 'cancelled' && (
                              <Button variant="ghost" size="sm" onClick={() => handleCancel(b.bookingId)} className="!text-danger hover:!bg-danger/10">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'searches' && (
            <motion.div key="searches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {recentSearches.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <IoSearchOutline size={48} className="mx-auto text-text-muted mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">No Recent Searches</h3>
                  <p className="text-text-secondary">Your search history will appear here</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <Button variant="ghost" size="sm" onClick={handleClearSearches} className="!text-danger">
                      <IoTrashOutline className="mr-1" /> Clear All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentSearches.map((s, i) => {
                      const SearchIcon = transportIcons[s.type] || IoTrainOutline;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="glass-card p-4 cursor-pointer"
                          onClick={() => navigate(`/${s.type}s?from=${s.from}&to=${s.to}`)}
                        >
                          <div className="flex items-center gap-3">
                            <SearchIcon size={20} className={TRANSPORT_CONFIG[s.type]?.textColor} />
                            <div>
                              <p className="font-semibold text-text-primary text-sm">{s.from} → {s.to}</p>
                              <p className="text-xs text-text-muted">{timeAgo(s.searchedAt)}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
