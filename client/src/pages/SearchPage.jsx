import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { SearchSkeleton } from '../components/skeletons/Skeleton';
import { trainAPI, flightAPI, busAPI } from '../lib/api';
import { formatPrice, formatTime } from '../lib/utils';
import { SORT_OPTIONS, DEPARTURE_TIMES, TRAIN_CLASSES, FLIGHT_CLASSES, BUS_CLASSES, TRANSPORT_CONFIG } from '../lib/constants';
import { IoFilterOutline, IoSwapHorizontalOutline, IoStar, IoTimeOutline, IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoChevronForwardOutline, IoSearchOutline } from 'react-icons/io5';

const transportIcons = { train: IoTrainOutline, flight: IoAirplaneOutline, bus: IoBusOutline };

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function SearchPage({ type = 'train' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sort, setSort] = useState('rating_desc');
  const [departure, setDeparture] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const config = TRANSPORT_CONFIG[type];
  const Icon = transportIcons[type];
  const classOptions = type === 'train' ? TRAIN_CLASSES : type === 'flight' ? FLIGHT_CLASSES : BUS_CLASSES;

  useEffect(() => {
    if (from && to) fetchResults();
    else setLoading(false);
  }, [from, to, date, sort, departure, selectedClass]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = { from, to, sort, ...(date && { date }), ...(departure && { departure }), ...(selectedClass && { class: selectedClass }) };
      const apiMap = { train: trainAPI.search, flight: flightAPI.search, bus: busAPI.search };
      const res = await apiMap[type](params);
      const dataKey = type === 'train' ? 'trains' : type === 'flight' ? 'flights' : 'buses';
      setResults(res.data[dataKey] || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (item) => {
    const id = item.trainId || item.flightId || item.busId;
    navigate(`/book/${type}/${id}?date=${date}`);
  };

  const getItemName = (item) => item.name || item.airline || item.operator;
  const getItemNumber = (item) => item.trainNumber || item.flightNumber || item.busId;
  const getItemId = (item) => item.trainId || item.flightId || item.busId;
  const getSourceCity = (item) => item.source?.city;
  const getDestCity = (item) => item.destination?.city;
  const getSourceCode = (item) => item.source?.code || item.source?.terminal || '';
  const getDestCode = (item) => item.destination?.code || item.destination?.terminal || '';
  const getCheapestPrice = (item) => {
    if (!item.classes || item.classes.length === 0) return 0;
    return Math.min(...item.classes.map(c => c.price));
  };

  if (!from || !to) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <div className="glass-card p-12">
            <Icon size={64} className="mx-auto text-text-muted mb-4" />
            <h2 className="text-2xl font-display font-bold mb-3">Search {config.label}</h2>
            <p className="text-text-secondary mb-6">Use the search form on the homepage to find {config.label.toLowerCase()}</p>
            <Button onClick={() => navigate('/')}>Go to Search</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icon size={28} className={config.textColor} />
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              {from} <IoSwapHorizontalOutline className="inline text-text-muted" /> {to}
            </h1>
          </div>
          <p className="text-text-secondary">
            {loading ? 'Searching...' : `${pagination.total || 0} ${config.label.toLowerCase()} found`}
            {date && <span className="text-text-muted"> &middot; {date}</span>}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="glass-card p-5 space-y-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <IoFilterOutline /> Filters
              </h3>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Sort By</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-dark mt-2 text-sm">
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Class</label>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => setSelectedClass('')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedClass ? 'bg-primary-500/10 text-primary-400' : 'text-text-secondary hover:bg-white/5'}`}
                  >
                    All Classes
                  </button>
                  {classOptions.map(cls => (
                    <button
                      key={cls.value}
                      onClick={() => setSelectedClass(cls.value)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedClass === cls.value ? 'bg-primary-500/10 text-primary-400' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                      {cls.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Departure</label>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {DEPARTURE_TIMES.map(dt => (
                    <button
                      key={dt.value}
                      onClick={() => setDeparture(departure === dt.value ? '' : dt.value)}
                      className={`text-center text-xs px-2 py-2.5 rounded-lg transition-colors ${departure === dt.value ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-text-secondary hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="font-medium">{dt.label}</div>
                      <div className="mt-0.5 text-text-muted text-[10px]">{dt.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <IoFilterOutline className="mr-1.5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SearchSkeleton />
            ) : results.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <IoSearchOutline size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">No {config.label} Found</h3>
                <p className="text-text-secondary">Try a different route or adjust your filters</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div className="space-y-4" initial="initial" animate="animate" exit="exit">
                  {results.map((item, index) => (
                    <motion.div
                      key={getItemId(item)}
                      variants={cardVariants}
                      transition={{ delay: index * 0.05 }}
                      layout
                      whileHover={{ y: -2 }}
                      className="glass-card glass-card-hover p-5 sm:p-6 cursor-pointer group"
                      onClick={() => handleBook(item)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-text-primary group-hover:text-primary-400 transition-colors">
                            {getItemName(item)}
                          </h3>
                          <p className="text-sm text-text-muted mt-0.5">
                            {getItemNumber(item)} &middot; {item.duration}
                            {item.busType && <span> &middot; {item.busType}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <IoStar className="text-amber-400" />
                          <span className="text-text-primary font-medium">{item.rating?.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-center min-w-[70px]">
                          <p className="text-lg font-bold text-text-primary">{formatTime(item.departure)}</p>
                          <p className="text-xs text-text-muted">{getSourceCode(item)}</p>
                          <p className="text-xs text-text-secondary">{getSourceCity(item)}</p>
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-px bg-gradient-to-r from-primary-500/50 via-text-muted/20 to-primary-500/50" />
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs text-text-muted bg-dark-700 px-2">
                            {item.duration}
                          </div>
                        </div>
                        <div className="text-center min-w-[70px]">
                          <p className="text-lg font-bold text-text-primary">{formatTime(item.arrival)}</p>
                          <p className="text-xs text-text-muted">{getDestCode(item)}</p>
                          <p className="text-xs text-text-secondary">{getDestCity(item)}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.classes?.slice(0, 4).map(cls => (
                          <span key={cls.type} className={`text-xs px-2 py-1 rounded-md ${
                            cls.availableSeats > 0 ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
                          }`}>
                            {cls.name}: {cls.availableSeats > 0 ? `${cls.availableSeats} seats` : 'WL'}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div>
                          <span className="text-xs text-text-muted">Starting from</span>
                          <p className="text-xl font-bold text-gradient">{formatPrice(getCheapestPrice(item))}</p>
                        </div>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Book Now <IoChevronForwardOutline size={14} className="ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
