import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing WebSocket connection to the dashboard endpoint.
 * Automatically handles reconnection, message parsing, and cleanup.
 * 
 * @param {Function} onUpdate - Callback function triggered when dashboard_updated event is received
 * @param {Object} options - Configuration options
 * @param {number} options.reconnectInterval - Reconnection interval in milliseconds (default: 3000)
 * @param {boolean} options.autoConnect - Automatically connect on mount (default: true)
 * @returns {boolean} Connection status (true if connected, false otherwise)
 */

function useDashboardSocket(
    onUpdate,
    options = {}
) {
    const {
        reconnectInterval = 3000,
        autoConnect = true
    } = options;

    const [connected, setConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const socketRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const isConnectingRef = useRef(false);
    const maxReconnectAttempts = 10;
    const pingIntervalRef = useRef(null);

    useEffect(() => {
        const connect = () => {
            // Prevent multiple connection attempts
            if (isConnectingRef.current) {
                console.log("Connection already in progress...");
                return;
            }

            // Check if already connected
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                console.log("Already connected to dashboard socket.");
                return;
            }

            // Check if maximum reconnect attempts reached
            if (reconnectAttempts.current >= maxReconnectAttempts) {
                console.error(`Maximum reconnect attempts (${maxReconnectAttempts}) reached.`);
                setConnected(false);
                return;
            }

            isConnectingRef.current = true;
            reconnectAttempts.current++;

            console.log(`Connecting to dashboard socket... (Attempt ${reconnectAttempts.current})`);

            try {
                // Use Vite environment variables (import.meta.env) instead of process.env
                const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/dashboard";
                socketRef.current = new WebSocket(wsUrl);

                socketRef.current.onopen = () => {
                    console.log("✅ Dashboard socket connected successfully.");
                    setConnected(true);
                    isConnectingRef.current = false;
                    reconnectAttempts.current = 0; // Reset attempts on successful connection

                    // Send initial handshake message
                    try {
                        socketRef.current.send(JSON.stringify({
                            type: "client_connected",
                            timestamp: new Date().toISOString(),
                            client: "dashboard_frontend"
                        }));
                    } catch (sendError) {
                        console.warn("Could not send handshake message:", sendError);
                    }

                    // Start ping interval to keep connection alive
                    if (pingIntervalRef.current) {
                        clearInterval(pingIntervalRef.current);
                    }
                    pingIntervalRef.current = setInterval(() => {
                        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                            try {
                                socketRef.current.send(JSON.stringify({
                                    type: "ping",
                                    timestamp: new Date().toISOString()
                                }));
                            } catch (pingError) {
                                console.warn("Could not send ping:", pingError);
                            }
                        }
                    }, 25000); // Send ping every 25 seconds
                };

                socketRef.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log("📨 WebSocket message received:", data);

                        // Handle different event types
                        if (data.event === "dashboard_updated") {
                            console.log("🔄 Dashboard update received, refreshing data...");
                            if (typeof onUpdate === 'function') {
                                onUpdate(data);
                            }
                        } else if (data.type === "connection") {
                            console.log("🔗 Connection status:", data.message);
                        } else if (data.type === "ping" || data.type === "pong") {
                            // Handle ping/pong responses
                            console.log("💓 Heartbeat received:", data.type);
                        }
                    } catch (parseError) {
                        console.error("Failed to parse WebSocket message:", parseError);
                    }
                };

                socketRef.current.onclose = (event) => {
                    console.log(`🔌 Socket disconnected. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
                    setConnected(false);
                    isConnectingRef.current = false;
                    
                    // Clear ping interval
                    if (pingIntervalRef.current) {
                        clearInterval(pingIntervalRef.current);
                        pingIntervalRef.current = null;
                    }

                    // Don't reconnect if the socket was closed intentionally (code 1000)
                    if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                        console.log(`🔄 Reconnecting in ${reconnectInterval}ms...`);
                        clearTimeout(reconnectTimerRef.current);
                        reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
                    } else if (event.code !== 1000) {
                        console.error(`❌ Max reconnect attempts (${maxReconnectAttempts}) reached.`);
                    }
                };

                socketRef.current.onerror = (error) => {
                    console.error("❌ WebSocket error:", error);
                    setConnected(false);
                    // Close the socket to trigger reconnect logic
                    if (socketRef.current) {
                        socketRef.current.close();
                    }
                };

            } catch (error) {
                console.error("Failed to create WebSocket connection:", error);
                setConnected(false);
                isConnectingRef.current = false;
                
                // Attempt to reconnect on error
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
            }
        };

        // Auto-connect on mount
        if (autoConnect) {
            connect();
        }

        // Cleanup on unmount
        return () => {
            console.log("Cleaning up dashboard socket hook...");
            clearTimeout(reconnectTimerRef.current);
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = null;
            }
            if (socketRef.current) {
                socketRef.current.close(1000, "Component unmounting");
                socketRef.current = null;
            }
            setConnected(false);
            isConnectingRef.current = false;
        };
    }, [onUpdate, reconnectInterval, autoConnect]); // Remove reconnectAttempts from dependencies

    // Return connection status
    return connected;
}

export default useDashboardSocket;