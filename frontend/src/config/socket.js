import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectID) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }
    
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectID: projectID
        }
    });

    socketInstance.on('connect', () => {
        console.log('Socket connected successfully');
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.warn("Socket is not initialized yet");
    }
}

export const sendMessage = (event, data) => {
    if (socketInstance && socketInstance.connected) {
        socketInstance.emit(event, data);
    } else {
        console.warn("Socket is not connected yet");
    }
};
  