// config/cors.js
module.exports = {
    // Development configuration
    development: {
        enabled: false,
        origins: [
        ],
        credentials: false,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: [],
        maxAge: 600 // 10 minutes
    },

    // Production configuration
    production: {
        enabled: true,
        origins: [
            'https://your-production-domain.com',
            'https://www.your-production-domain.com',
            'https://cdn.your-domain.com'
        ],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Total-Count'],
        maxAge: 86400 // 24 hours
    },

    // Testing configuration
    uat: {
        enabled: false // Disable CORS during tests
    }
};