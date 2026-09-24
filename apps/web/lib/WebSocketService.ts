import { io, Socket } from "socket.io-client";

class WebSocketService {
    private socket: Socket | null = null;
    private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map();

    connect(url: string) : Socket {
        if(this.socket?.connected) return this.socket;

        this.socket = io(url,{
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        this.socket.on(
            'connect', 
            () => console.log(`---Connected to WebSocket ${this.socket?.id} ---`)
        );

        this.socket.on(
            'disconnet',
            () => console.log(`---Disconnected from WebSocket ${this.socket?.id} ---`)
        );

        this.socket.on(
            'connect_error',
            (error) => console.log(`---WebSocket connection error: ${error} ---`)
        );

        return this.socket;
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
        this.eventListeners.clear();
    }

    on(event: string, callback: (...args: any[]) => void) {

        if(!this.eventListeners.has(event)) 
            this.eventListeners.set(event, new Set());
        
        this.eventListeners.get(event)?.add(callback);
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        if(callback) {
            this.eventListeners.get(event)?.delete(callback);
            this.socket?.off(event, callback);
        } else {

            const listeners = this.eventListeners.get(event);

            if(listeners) {
                listeners.forEach(Listener => this.socket?.off(event, Listener))
            }

            listeners?.clear();
        }
    }

    emit = (event: string , data?: any): Socket | undefined => this.socket?.emit(event, data);

    getSocket = (): Socket | null => this.socket;
    
    isConnected = (): boolean => this.socket?.connected || false;

}

const webSocketService = new WebSocketService();

export default webSocketService;