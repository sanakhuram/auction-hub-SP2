export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_BASE = import.meta.env.VITE_API_BASE;

export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_AUCTION = `${API_BASE}/auction`;
export const API_AUCTION_LISTINGS = `${API_AUCTION}/listings`;
export const API_AUCTION_PROFILES = `${API_AUCTION}/profiles`;

console.log('🔵 API_KEY:', API_KEY);
console.log('🔵 API_BASE:', API_BASE);
console.log('🔵 API_AUCTION_LISTINGS:', API_AUCTION_LISTINGS);
