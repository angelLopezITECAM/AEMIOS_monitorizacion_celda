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
        return new Promise((resolve, reject) => {
            console.log("=== Iniciando envío de mensaje ===");
            console.log("Socket:", socket);
            console.log("Estado del socket:", socket?.readyState);
            console.log("Topic:", topic);
            console.log("Message:", message);

            if (!socket) {
                const error = new Error("No hay conexión WebSocket disponible");
                console.error(error);
                reject(error);
                return;
            }

            let attempts = 0;
            const maxAttempts = 5;
            const attemptInterval = 1000;

            const tryToSend = () => {
                console.log(`Intento ${attempts + 1}/${maxAttempts}`);

                if (socket.readyState === WebSocket.OPEN) {
                    try {
                        const payload = JSON.stringify({ topic, message });
                        console.log("Enviando payload:", payload);
                        socket.send(payload);
                        console.log("Mensaje enviado correctamente");
                        resolve(true);
                    } catch (error) {
                        console.error("Error al enviar el mensaje:", error);
                        reject(error);
                    }
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        const error = new Error(`WebSocket no está listo después de ${maxAttempts} intentos`);
                        console.error(error);
                        reject(error);
                    } else {
                        console.log(`Socket no está listo (estado: ${socket.readyState}), reintentando en ${attemptInterval}ms...`);
                        setTimeout(tryToSend, attemptInterval);
                    }
                }
            };

            tryToSend();
        });
    }, [socket]);

    const connectWebSocket = useCallback(() => {
        try {
            console.log("=== Iniciando conexión WebSocket ===");
            const ws = new WebSocket("ws://192.168.15.109:8002/api/mqtt/ws");

            ws.onopen = () => {
                console.log("Conexión WebSocket establecida");
                console.log("Estado del socket:", ws.readyState);
                setIsConnected(true);
                setError(null);
            }

            ws.onmessage = (event) => {
                try {
                    let data = JSON.parse(event.data);
                    console.log("Mensaje recibido en WebSocket:", data);
                    data.process = false;
                    setMessages(prev => {
                        const nuevos = [...prev, data];

                        return nuevos.slice(-100);
                    });
                } catch (error) {
                    console.error("Error al parsear el mensaje:", error);
                }
            }

            ws.onerror = (error) => {
                console.error("Error en WebSocket:", error);
                setError("Error en la conexión WebSocket");
                setIsConnected(false);
            }

            ws.onclose = () => {
                console.log("Conexión WebSocket cerrada");
                setIsConnected(false);
                // Intentar reconectar después de 5 segundos
                setTimeout(() => {
                    console.log("Intentando reconectar...");
                    connectWebSocket();
                }, 5000);
            }

            setSocket(ws);
            console.log("Socket configurado:", ws);

            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    console.log("Cerrando conexión WebSocket");
                    ws.close();
                }
            }
        } catch (e) {
            console.error("Error al conectar WebSocket:", e);
            setError("No se pudo establecer la conexión WebSocket");
            return null;
        }
    }, []);

    useEffect(() => {
        console.log("=== Iniciando efecto de conexión WebSocket ===");
        const cleanup = connectWebSocket();

        return () => {
            console.log("Limpiando conexión WebSocket");
            if (cleanup) cleanup();
        };
    }, [connectWebSocket]);

    const markAlarmAsProcessed = (alarm) => {
        setMessages(prev => prev.map(msg => {
            if (msg.topic === alarm.topic &&
                msg.timestamp === alarm.timestamp &&
                msg.payload === alarm.payload) {
                return { ...msg, process: true };
            }
            return msg;
        }));
    };

    const publishMessage = (topic, message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                topic,
                message
            }));
        }
    };

    const value = {
        isConnected,
        messages,
        error,
        sendMessage,
        reconnect: connectWebSocket,
        markAlarmAsProcessed,
        publishMessage
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