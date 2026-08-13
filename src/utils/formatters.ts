export const formatCurrency = (amount: number, currency: string = 'MXN'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
};

export const getDaysLeftUntil = (dateStr?: string): { days: number; text: string; isExpired: boolean; isUrgent: boolean } => {
  if (!dateStr) return { days: 0, text: 'Sin fecha fin', isExpired: false, isUrgent: false };
  try {
    const target = new Date(dateStr);
    // Set target to end of that day
    target.setHours(23, 59, 59, 999);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
      return { days: 0, text: 'Oferta finalizada', isExpired: true, isUrgent: false };
    }
    if (days === 0 || days === 1) {
      return { days, text: '¡Vence hoy!', isExpired: false, isUrgent: true };
    }
    if (days <= 3) {
      return { days, text: `¡Quedan ${days} días!`, isExpired: false, isUrgent: true };
    }
    return { days, text: `Vence en ${days} días`, isExpired: false, isUrgent: false };
  } catch {
    return { days: 0, text: dateStr, isExpired: false, isUrgent: false };
  }
};

export const formatUnitCost = (price: number, quantity: number, measure: string): string => {
  if (!quantity || quantity <= 0) return formatCurrency(price);
  const cost = price / quantity;
  return `${formatCurrency(cost)} / ${measure}`;
};
