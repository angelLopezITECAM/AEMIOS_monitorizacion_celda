import { createContext, useState, useContext, useEffect, useCallback } from "react"
import mqtt from "mqtt";

const MQTTContext = createContext()

export const MQTTProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    // Esta función debe estar fuera, no dentro de connectWebSocket
    const sendMessage = useCallback((topic, message) => {

        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ topic, message });
            console.log("Enviando mensaje:", payload)
            socket.send(payload);
            return true;
        } else {
            console.error("WebSocket no está conectado");
            return false;
        }
    }, [socket]);

    const connectWebSocket = useCallback(() => {
        try {
            const ws = new WebSocket("ws://192.168.15.38:8000/api/mqtt/ws");

            ws.onopen = () => {
                console.log("Conexión WebSocket establecida")
                setIsConnected(true)
                setError(null);
            }

            ws.onmessage = (event) => {
                try {
                    let data = JSON.parse(event.data)
                    /* console.log("Mensaje recibido:", data) */
                    data.process = false
                    setMessages(prev => [...prev, data].slice(-50)); // Mantener solo los últimos 50 mensajes
                } catch (error) {
                    console.error("Error al parsear el mensaje", error)
                }
            }

            ws.onerror = (error) => {
                console.error("Error en WebSocket:", error)
                setError("Error en la conexión WebSocket");
                setIsConnected(false);
            }

            ws.onclose = () => {
                console.log("Conexión WebSocket cerrada")
                setIsConnected(false)
                // Intentar reconectar después de 5 segundos
                setTimeout(() => {
                    console.log("Intentando reconectar...");
                    connectWebSocket();
                }, 5000);
            }

            setSocket(ws)

            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close()
                }
            }
        } catch (e) {
            console.error("Error al conectar WebSocket:", e)
            setError("No se pudo establecer la conexión WebSocket");
            return null;
        }
    }, []); // No dependencias para evitar recreación

    useEffect(() => {
        const cleanup = connectWebSocket();

        // Limpiar al desmontar
        return () => {
            if (cleanup) cleanup();
        };
    }, [connectWebSocket]);

    const value = {
        isConnected,
        messages,
        error,
        sendMessage,
        reconnect: connectWebSocket
    };

    return (
        <MQTTContext.Provider value={value}>
            {children}
        </MQTTContext.Provider>
    )
};

export const useMQTT = () => {
    const context = useContext(MQTTContext)
    if (!context) {
        throw new Error("useMQTT must be used within a MQTTProvider")
    }
    return context
}