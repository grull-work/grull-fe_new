// Utility functions
import dayjs from 'dayjs';

export const formatDate = (date, format = 'DD MMM YYYY') => {
  return dayjs(date).format(format);
};

export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};
