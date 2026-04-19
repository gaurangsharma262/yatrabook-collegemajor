/**
 * Format price to Indian Rupees
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format time (24h to 12h)
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

/**
 * Get date string for input fields (YYYY-MM-DD)
 */
export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get tomorrow's date string
 */
export const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateString(tomorrow);
};

/**
 * Truncate text
 */
export const truncate = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Get relative time string
 */
export const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const colors = {
    confirmed: 'badge-success',
    waitlisted: 'badge-warning',
    cancelled: 'badge-danger',
    success: 'badge-success',
    pending: 'badge-warning',
    failed: 'badge-danger',
  };
  return colors[status] || 'badge-primary';
};

/**
 * Generate a random color based on string (for avatars)
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
