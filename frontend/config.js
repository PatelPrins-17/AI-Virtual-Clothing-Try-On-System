// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5002',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/api/auth/register',
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout',
            PROFILE: '/api/auth/profile',
            UPDATE_PROFILE: '/api/auth/update-profile',
            CHANGE_PASSWORD: '/api/auth/change-password'
        },
        CLOTHING: '/api/clothing',
        UPLOAD: '/api/upload',
        TRYON: '/api/tryon'
    }
};

// Helper function to get full URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
