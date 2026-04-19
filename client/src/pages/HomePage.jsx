import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { INDIAN_CITIES, TRANSPORT_CONFIG } from '../lib/constants';
import { getTomorrowString } from '../lib/utils';
import { IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoSearchOutline, IoSwapHorizontalOutline, IoSparklesOutline, IoMapOutline, IoFlashOutline, IoShieldCheckmarkOutline, IoTimeOutline, IoStarOutline } from 'react-icons/io5';

const transportIcons = { train: IoTrainOutline, flight: IoAirplaneOutline, bus: IoBusOutline };

const containerVariants = {
  animate: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('train');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(getTomorrowString());
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    const type = activeTab === 'train' ? 'trains' : activeTab === 'flight' ? 'flights' : 'buses';
    navigate(`/${type}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  const handleCityInput = (value, setter, setSuggestions) => {
    setter(value);
    if (value.length > 0) {
      const matches = INDIAN_CITIES.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const swapCities = () => { setFrom(to); setTo(from); };

  const features = [
    { icon: IoTrainOutline, title: 'Train Booking', desc: 'IRCTC-like experience with real Indian railway data across 30+ routes', gradient: 'from-blue-500 to-cyan-500' },
    { icon: IoAirplaneOutline, title: 'Flight Booking', desc: 'Compare airlines and find the best deals across domestic routes', gradient: 'from-purple-500 to-pink-500' },
    { icon: IoBusOutline, title: 'Bus Booking', desc: 'Comfortable inter-city bus travel with 70+ operators listed', gradient: 'from-emerald-500 to-teal-500' },
    { icon: IoSparklesOutline, title: 'Smart Recommendations', desc: 'Find cheapest and fastest routes across all transport modes', gradient: 'from-amber-500 to-orange-500' },
    { icon: IoMapOutline, title: 'Multi-City Planner', desc: 'Plan complex itineraries across multiple cities seamlessly', gradient: 'from-rose-500 to-red-500' },
    { icon: IoFlashOutline, title: 'Instant Booking', desc: 'Book in seconds with PNR confirmation and seat assignment', gradient: 'from-indigo-500 to-violet-500' },
  ];

  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai', price: '745', type: 'train' },
    { from: 'Bangalore', to: 'Chennai', price: '499', type: 'bus' },
    { from: 'Mumbai', to: 'Goa', price: '2,499', type: 'flight' },
    { from: 'Delhi', to: 'Jaipur', price: '450', type: 'bus' },
    { from: 'Kolkata', to: 'Delhi', price: '3,299', type: 'flight' },
    { from: 'Chennai', to: 'Hyderabad', price: '620', type: 'train' },
  ];

  return (
    <PageWrapper>
      <div className="bg-mesh grain">
        {/* Hero Section */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80"
              alt=""
              className="w-full h-full object-cover opacity-[0.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-900" />
          </div>

          {/* Animated Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-20 right-[15%] w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[120px]"
              animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-accent-500/6 rounded-full blur-[120px]"
              animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-16">
            <motion.div variants={containerVariants} initial="initial" animate="animate" className="text-center mb-14">
              <motion.div variants={itemVariants} className="mb-5">
                <span className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-medium">
                  <IoSparklesOutline size={14} /> India's Smart Travel Platform
                </span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 leading-tight tracking-tight">
                Book Your Next
                <br />
                <span className="text-gradient">Adventure</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                Search across trains, flights, and buses. Find the cheapest and fastest routes with intelligent recommendations.
              </motion.p>
            </motion.div>

            {/* Search Card */}
            <motion.div variants={itemVariants} initial="initial" animate="animate" className="max-w-4xl mx-auto">
              <div className="glass-card p-6 sm:p-8">
                {/* Transport Tabs */}
                <div className="flex gap-2 mb-6">
                  {Object.entries(TRANSPORT_CONFIG).map(([key, config]) => {
                    const Icon = transportIcons[key];
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeTab === key
                            ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{config.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* From */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">From</label>
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => handleCityInput(e.target.value, setFrom, setFromSuggestions)}
                        onBlur={() => setTimeout(() => setFromSuggestions([]), 200)}
                        placeholder="City or Station"
                        className="input-dark"
                        required
                      />
                      {fromSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 glass-card p-1 z-20">
                          {fromSuggestions.map(city => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => { setFrom(city); setFromSuggestions([]); }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-text-primary"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Swap */}
                    <div className="hidden lg:flex items-end justify-center pb-3 -mx-4">
                      <motion.button
                        type="button"
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={swapCities}
                        className="p-2 rounded-full bg-dark-600 border border-white/10 text-text-secondary hover:text-primary-400 transition-colors"
                      >
                        <IoSwapHorizontalOutline size={18} />
                      </motion.button>
                    </div>

                    {/* To */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">To</label>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => handleCityInput(e.target.value, setTo, setToSuggestions)}
                        onBlur={() => setTimeout(() => setToSuggestions([]), 200)}
                        placeholder="City or Station"
                        className="input-dark"
                        required
                      />
                      {toSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 glass-card p-1 z-20">
                          {toSuggestions.map(city => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => { setTo(city); setToSuggestions([]); }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-text-primary"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={getTomorrowString()}
                        className="input-dark"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px]">
                      <IoSearchOutline size={18} className="mr-2" />
                      Search {TRANSPORT_CONFIG[activeTab]?.label}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-white/5">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '30+', label: 'Train Routes' },
              { value: '25+', label: 'Flight Routes' },
              { value: '70+', label: 'Bus Services' },
              { value: '50+', label: 'Cities Covered' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl font-display font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-text-muted mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Why <span className="text-gradient">YatraBook</span>?
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Everything you need for seamless travel booking across India
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card glass-card-hover p-6"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Travel Images Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { src: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&q=80', label: 'Indian Railways', sub: 'Connecting cities coast to coast' },
                { src: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&q=80', label: 'Domestic Flights', sub: 'Fastest way to travel India' },
                { src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', label: 'Inter-City Buses', sub: 'Comfortable overnight journeys' },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer h-64"
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-display font-bold text-white">{img.label}</h3>
                    <p className="text-sm text-white/70 mt-1">{img.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Popular <span className="text-gradient-accent">Routes</span>
              </h2>
              <p className="text-text-secondary">Most booked routes across India</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularRoutes.map((route, i) => {
                const Icon = transportIcons[route.type];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card p-5 cursor-pointer group"
                    onClick={() => {
                      setFrom(route.from);
                      setTo(route.to);
                      setActiveTab(route.type);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${TRANSPORT_CONFIG[route.type]?.color} flex items-center justify-center`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary group-hover:text-primary-400 transition-colors">
                            {route.from} → {route.to}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">Starting from</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gradient">₹{route.price}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 sm:p-14 border-gradient"
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ready to explore <span className="text-gradient">India</span>?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Create your account and start booking trains, flights, and buses in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/trains">
                  <Button variant="secondary" size="lg">Browse Trains</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
