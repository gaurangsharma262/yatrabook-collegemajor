import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { trainAPI, flightAPI, busAPI, bookingAPI } from '../lib/api';
import { formatPrice, formatTime, getTomorrowString } from '../lib/utils';
import { PAYMENT_METHODS, TRANSPORT_CONFIG } from '../lib/constants';
import { useAuth } from '../features/auth/AuthContext';
import { IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoCheckmarkCircleOutline, IoCardOutline, IoPhonePortraitOutline, IoBusinessOutline, IoWalletOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PrintTicket from '../components/PrintTicket';

const transportIcons = { train: IoTrainOutline, flight: IoAirplaneOutline, bus: IoBusOutline };
const paymentIcons = { upi: IoPhonePortraitOutline, card: IoCardOutline, netbanking: IoBusinessOutline, wallet: IoWalletOutline };

export default function BookingPage() {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'male' }]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const travelDate = searchParams.get('date') || getTomorrowString();
  const config = TRANSPORT_CONFIG[type];
  const Icon = transportIcons[type];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    fetchTransport();
  }, [id, type]);

  const fetchTransport = async () => {
    try {
      const apiMap = { train: trainAPI.getById, flight: flightAPI.getById, bus: busAPI.getById };
      const res = await apiMap[type](id);
      setTransport(res.data);
    } catch (err) {
      toast.error('Transport not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return toast.error('Maximum 6 passengers');
    setPassengers([...passengers, { name: '', age: '', gender: 'male' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleBook = async () => {
    for (const p of passengers) {
      if (!p.name || !p.age) {
        toast.error('Please fill all passenger details');
        return;
      }
    }
    setBookingLoading(true);
    try {
      const res = await bookingAPI.create({
        type, travelId: id, travelDate,
        class: selectedClass.type,
        passengers: passengers.map(p => ({ ...p, age: parseInt(p.age) })),
        paymentMethod,
      });
      setBooking(res.data);
      setStep(4);
      toast.success('Booking confirmed!');
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const totalAmount = selectedClass ? selectedClass.price * passengers.length : 0;
  const steps = ['Class', 'Passengers', 'Payment', 'Done'];

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <div className="glass-card p-8 animate-pulse space-y-6">
            <div className="h-8 bg-dark-600 rounded w-1/2" />
            <div className="h-4 bg-dark-600 rounded w-1/3" />
            <div className="h-40 bg-dark-600 rounded" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  const transportName = transport?.name || transport?.airline || transport?.operator;
  const transportNumber = transport?.trainNumber || transport?.flightNumber || transport?.busId;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-12 pt-20">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: step > i + 1 ? 'rgb(0, 212, 170)' : step === i + 1 ? 'rgb(102, 126, 234)' : 'rgb(42, 42, 69)',
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              >
                {step > i + 1 ? <IoCheckmarkCircleOutline size={18} /> : i + 1}
              </motion.div>
              <span className={`text-sm hidden sm:inline ${step === i + 1 ? 'text-text-primary' : 'text-text-muted'}`}>{label}</span>
              {i < 3 && <div className="w-8 h-px bg-white/10 hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* Transport Info Card */}
        <motion.div layout className="glass-card p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config?.color} flex items-center justify-center`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">{transportName}</h2>
              <p className="text-sm text-text-muted">{transportNumber} &middot; {travelDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
              <p className="font-bold text-text-primary">{formatTime(transport?.departure)}</p>
              <p className="text-xs text-text-muted">{transport?.source?.city}</p>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 to-primary-500/50" />
            <div className="text-center">
              <p className="font-bold text-text-primary">{formatTime(transport?.arrival)}</p>
              <p className="text-xs text-text-muted">{transport?.destination?.city}</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Class Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Select Class</h3>
                <div className="space-y-3">
                  {transport?.classes?.map(cls => (
                    <motion.button
                      key={cls.type}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setSelectedClass(cls); setStep(2); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedClass?.type === cls.type
                          ? 'bg-primary-500/10 border-primary-500/30'
                          : 'bg-dark-700/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-text-primary">{cls.name}</p>
                          <p className="text-sm text-text-muted mt-0.5">
                            {cls.availableSeats > 0
                              ? <span className="text-success">{cls.availableSeats} seats available</span>
                              : <span className="text-warning">Waitlist (WL/{cls.waitlistCount || 0})</span>
                            }
                          </p>
                        </div>
                        <p className="text-xl font-bold text-gradient">{formatPrice(cls.price)}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Passengers */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-semibold">Passenger Details</h3>
                  <Button variant="ghost" size="sm" onClick={addPassenger}>+ Add</Button>
                </div>
                <div className="space-y-4">
                  {passengers.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-dark-700/50 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-text-secondary">Passenger {i + 1}</span>
                        {passengers.length > 1 && (
                          <button onClick={() => removePassenger(i)} className="text-xs text-danger hover:text-danger/80">Remove</button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input placeholder="Full Name" value={p.name} onChange={(e) => updatePassenger(i, 'name', e.target.value)} />
                        <Input type="number" placeholder="Age" value={p.age} onChange={(e) => updatePassenger(i, 'age', e.target.value)} />
                        <select value={p.gender} onChange={(e) => updatePassenger(i, 'gender', e.target.value)} className="input-dark text-sm">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">Total: {passengers.length} passenger(s)</p>
                    <p className="text-xl font-bold text-gradient">{formatPrice(totalAmount)}</p>
                  </div>
                  <Button onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(pm => {
                    const PayIcon = paymentIcons[pm.value] || IoCardOutline;
                    return (
                      <motion.button
                        key={pm.value}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setPaymentMethod(pm.value)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          paymentMethod === pm.value ? 'bg-primary-500/10 border-primary-500/30' : 'bg-dark-700/50 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <PayIcon size={24} className="text-primary-400" />
                          <div>
                            <p className="font-semibold text-text-primary">{pm.label}</p>
                            <p className="text-xs text-text-muted">{pm.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-dark-700/50 border border-white/5 mb-6">
                  <h4 className="font-semibold text-sm text-text-secondary mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Class</span><span>{selectedClass?.name}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Passengers</span><span>{passengers.length}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Price per person</span><span>{formatPrice(selectedClass?.price)}</span></div>
                    <hr className="border-white/5" />
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-gradient">{formatPrice(totalAmount)}</span></div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button loading={bookingLoading} onClick={handleBook} size="lg">
                    Pay {formatPrice(totalAmount)}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && booking && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="glass-card p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                  <div className="w-20 h-20 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-4">
                    <IoCheckmarkCircleOutline size={48} className="text-success" />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Booking Confirmed!</h2>
                <p className="text-text-secondary mb-6">Your booking has been confirmed successfully</p>

                <div className="text-left glass p-5 rounded-xl space-y-3 mb-6">
                  <div className="flex justify-between"><span className="text-text-muted">Booking ID</span><span className="font-mono font-bold text-primary-400">{booking.bookingId}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">PNR</span><span className="font-mono font-bold">{booking.pnr}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Status</span><span className={booking.bookingStatus === 'confirmed' ? 'text-success' : 'text-warning'}>{booking.bookingStatus.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Amount</span><span className="text-gradient font-bold">{formatPrice(booking.totalAmount)}</span></div>
                </div>

                <div className="flex justify-center gap-4 flex-wrap">
                  <Button onClick={() => navigate('/dashboard/bookings')}>View Bookings</Button>
                  <PrintTicket booking={booking} transport={transport} type={type} travelDate={travelDate} selectedClass={selectedClass} passengers={passengers} />
                  <Button variant="secondary" onClick={() => navigate('/')}>Home</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
