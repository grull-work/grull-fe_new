const BAPI = process.env.REACT_APP_BACKEND;

// WebSocket configuration
const getWebSocketUrl = (clientId) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
        // Use secure WebSocket in production
        return `wss://api.dev.grull.tech/ws/${clientId}`;
    } else {
        // Use local WebSocket in development
        return `ws://localhost:8000/ws/${clientId}`;
    }
};

export { getWebSocketUrl };
export default BAPI;