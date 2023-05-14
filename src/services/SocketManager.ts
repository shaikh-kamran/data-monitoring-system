import io from 'socket.io-client';

/**
 * Creates a socket connection with the server
 * @class
 */
class SocketManager {

    socketPort: number;
    socketURL: string;
    socket: any;
    dataManager: any;
    constructor(dataManager: any) {
        this.socketPort = 3000;
        this.dataManager = dataManager;
        this.socketURL = `${window.location.protocol}//${window.location.hostname}:${this.socketPort}`;
        this.socket = io(this.socketURL, {
            reconnection: true,
            reconnectionDelay: 1000,
            secure: false,
            transports: ['websocket'],
            path: '/socket'
        });
        this.setupListener();
    }

    /**
     * Sets up the socket io listener
     */
    setupListener() {
        this.socket.on("data", (data: any) => {
            this.dataManager.filterGridData(data);
        });
    }

    /**
     * @returns the socket id of the connection
     */
    getSocketId() {
        return this.socket.id;
    }

}

export default SocketManager;
