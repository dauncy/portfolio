export const getBackendURL = () => {
  if (BACKEND_URL !== undefined && typeof BACKEND_URL === 'string') {
    return BACKEND_URL;
  }
  if (process !== undefined) {
    return ''
  }
}