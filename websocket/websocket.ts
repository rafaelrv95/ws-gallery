type MessageListener = (message: string) => void;

const WebSocketConnection = {
  socket: null as WebSocket | null,
  messageListeners: [] as MessageListener[],

  connect(url: string, pair: {}): WebSocket {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        ws.send(JSON.stringify(pair));
      };

    ws.onmessage = (event) => {
        this.messageListeners.forEach((listener) => {
            listener(event.data);
          });
       
        console.log('ReceivedXX:', event.data);
      };
      ws.onclose = (event) => {
        console.log('Disconnected from WebSocket server');
        setTimeout(() => {
            this.socket = this.connect(url, pair);
          }, 2000);
      };
   
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);

      }


    this.socket = ws;
    return ws;
  },

  send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection not open.');
    }
  },

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  },

  addMessageListener(listener: MessageListener): void {
    this.messageListeners.push(listener);
  },

  removeMessageListener(listener: MessageListener): void {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  },
};

export default WebSocketConnection;