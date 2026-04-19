// Indian cities for search autocomplete
export const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kochi', 'Goa', 'Patna', 'Bhopal', 'Indore',
  'Nagpur', 'Varanasi', 'Agra', 'Chandigarh', 'Coimbatore',
  'Trivandrum', 'Madurai', 'Visakhapatnam', 'Mysore', 'Udaipur',
  'Jodhpur', 'Dehradun', 'Mangalore', 'Amritsar', 'Ranchi',
  'Bhubaneswar', 'Guwahati', 'Raipur', 'Surat', 'Nashik',
  'Pondicherry', 'Shirdi', 'Manali', 'Haridwar', 'Tirupati',
  'Jammu', 'Gorakhpur', 'Prayagraj', 'Kanpur', 'Salem',
  'Rajkot', 'Vadodara', 'Vijayawada', 'Siliguri', 'Digha',
];

// Train class types
export const TRAIN_CLASSES = [
  { value: '1A', label: 'First AC (1A)' },
  { value: '2A', label: 'Second AC (2A)' },
  { value: '3A', label: 'Third AC (3A)' },
  { value: 'SL', label: 'Sleeper (SL)' },
  { value: 'CC', label: 'Chair Car (CC)' },
  { value: '2S', label: 'Second Sitting (2S)' },
];

// Flight class types
export const FLIGHT_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

// Bus class types
export const BUS_CLASSES = [
  { value: 'seater', label: 'Seater' },
  { value: 'semi_sleeper', label: 'Semi-Sleeper' },
  { value: 'sleeper', label: 'Sleeper' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'duration_asc', label: 'Duration: Shortest' },
  { value: 'duration_desc', label: 'Duration: Longest' },
  { value: 'departure_asc', label: 'Departure: Earliest' },
  { value: 'departure_desc', label: 'Departure: Latest' },
];

// Departure time filters
export const DEPARTURE_TIMES = [
  { value: 'morning', label: 'Morning', time: '4 AM - 12 PM' },
  { value: 'afternoon', label: 'Afternoon', time: '12 PM - 5 PM' },
  { value: 'evening', label: 'Evening', time: '5 PM - 9 PM' },
  { value: 'night', label: 'Night', time: '9 PM - 4 AM' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
  { value: 'card', label: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay' },
  { value: 'netbanking', label: 'Net Banking', description: 'All major banks' },
  { value: 'wallet', label: 'Wallet', description: 'Paytm, Amazon Pay' },
];

// Transport type configuration
export const TRANSPORT_CONFIG = {
  train: {
    label: 'Trains',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  flight: {
    label: 'Flights',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
  },
  bus: {
    label: 'Buses',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
};
