export const sanitizeDate = (date: Date): string => {
  return date.toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
};

export const currentYear = () => {
  return new Date().getFullYear();
}
