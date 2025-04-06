/**
 * @fileoverview WebSocket client for real-time communication with the backend.
 */

// TODO: Replace with actual environment variable or configuration
const WEBSOCKET_URL = "ws://localhost:8000/ws"; // Example URL

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 5000; // 5 seconds
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  constructor(url: string = WEBSOCKET_URL) {
    this.url = url;
    console.log(`WebSocketClient initialized for URL: ${this.url}`);
  }

  public connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected.");
      return;
    }

    console.log(`Attempting to connect to ${this.url}...`);
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
      this.reconnectAttempts = 0; // Reset on successful connection attempt initiation
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log("WebSocket connection opened successfully.", event);
      this.reconnectAttempts = 0; // Reset on successful open
      // TODO: Implement logic on successful connection (e.g., send initial message)
    };

    this.ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const message = JSON.parse(event.data);
        // TODO: Implement message handling logic based on message type/content
        this.handleIncomingMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message or handle it:", error);
      }
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error occurred:", event);
      // Errors might lead to a close event, reconnect logic is handled in onclose
    };

    this.ws.onclose = (event) => {
      console.log(
        `WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`,
      );
      this.ws = null; // Ensure the instance is nullified
      // TODO: Implement more sophisticated close handling (e.g., notify UI)
      this.handleReconnect();
    };
  }

  private handleIncomingMessage(message: unknown): void {
    console.log("Received raw message:", message);
    try {
      // Placeholder for actual message processing
      console.log("Processing message:", message);
      // Example:
      // if (message.type === 'training_update') {
      //   // Update UI state
      // } else if (message.type === 'error_report') {
      //   // Display error to user
      // }
    } catch (error) {
      console.error("Failed to parse WebSocket message or handle it:", error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect in ${
          this.reconnectInterval / 1000
        } seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error(
        `WebSocket reconnection failed after ${this.maxReconnectAttempts} attempts.`,
      );
      // TODO: Notify the user or system about the persistent connection failure
    }
  }

  public sendMessage(message: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        console.log("WebSocket message sent:", message);
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
      }
    } else {
      console.warn(
        "WebSocket is not connected. Message not sent:",
        message,
      );
      // TODO: Queue message or handle error?
    }
  }

  public closeConnection(
    code: number = 1000,
    reason: string = "Client closed connection",
  ): void {
    if (this.ws) {
      console.log(`Closing WebSocket connection with code ${code}: ${reason}`);
      // Prevent automatic reconnection when explicitly closing
      this.reconnectAttempts = this.maxReconnectAttempts;
      this.ws.close(code, reason);
      this.ws = null;
    } else {
      console.log("WebSocket connection is already closed or not established.");
    }
  }

  public getReadyState(): number | null {
    return this.ws ? this.ws.readyState : null;
  }
}

// Export a singleton instance or the class itself depending on desired usage pattern
// Option 1: Export the class
// export { WebSocketClient };

// Option 2: Export a singleton instance (if only one connection is needed globally)
const webSocketClientInstance = new WebSocketClient();
export default webSocketClientInstance;

/**
 * WebSocket Ready States:
 * CONNECTING = 0
 * OPEN = 1
 * CLOSING = 2
 * CLOSED = 3
 */
