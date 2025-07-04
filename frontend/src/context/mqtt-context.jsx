import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import mqtt from 'mqtt';
import { MQTT_IP } from "@/lib/utils";

const MqttContext = createContext();

export const useMQTT = () => {
    const context = useContext(MqttContext);
    if (!context) throw new Error('useMQTT must be used within a MqttProvider');
    return context;
}

// Límite de mensajes a guardar en el historial para evitar problemas de rendimiento.
const MAX_MESSAGES_IN_HISTORY = 20;

export const MqttProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const pingIntervalRef = useRef(null);
    const connectionTimeoutRef = useRef(null);
    const manualReconnectTimeoutRef = useRef(null);
    const activeSubscriptionsRef = useRef(new Set());
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    const setupMqttConnection = () => {

        if (client) {
            try {
                client.end(true);
            } catch (e) {
                console.warn('Error al cerrar el cliente MQTT existente:', e);
            }
        }

        console.log(`Conectando al broker MQTT (intento ${connectionAttempts + 1})...`);

        const mqttClient = mqtt.connect(MQTT_IP, {
            keepalive: 30,
            reconnectPeriod: 3000,
            connectTimeout: 5000,
            clean: true,
            clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
            will: {
                topic: 'clients/webapp',
                payload: JSON.stringify({ status: 'disconnected', timestamp: new Date().toISOString() }),
                qos: 1,
                retain: false
            }
        });

        setClient(mqttClient);

        mqttClient.on('connect', () => {
            console.log('Conectado al broker MQTT');
            setIsConnected(true);
            setConnectionAttempts(0);

            // Re-suscribir a todos los tópicos activos
            activeSubscriptionsRef.current.forEach(topic => {
                mqttClient.subscribe(topic, (err) => {
                    if (err) console.error(`Error al re-suscribir a ${topic}:`, err);
                    else console.log(`Re-suscrito a ${topic}`);
                });
            });

            // Configurar un ping para mantener la conexión viva
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = setInterval(() => {
                if (mqttClient.connected) {
                    mqttClient.publish('clients/webapp/ping', JSON.stringify({
                        timestamp: new Date().toISOString()
                    }), { qos: 0, retain: false });

                }
            }, 25000); // menos que el keepalive


            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }
            if (manualReconnectTimeoutRef.current) {
                clearTimeout(manualReconnectTimeoutRef.current);
                manualReconnectTimeoutRef.current = null;
            }
        });

        mqttClient.on('reconnect', () => {
            console.log('Reconectando al broker MQTT...');
            setIsConnected(false);
        });

        mqttClient.on('close', () => {
            console.log('Conexión cerrada con el broker MQTT');
            setIsConnected(false);

            // Configurar una reconexión manual si la reconexión automática del cliente falla
            if (manualReconnectTimeoutRef.current) clearTimeout(manualReconnectTimeoutRef.current);
            manualReconnectTimeoutRef.current = setTimeout(() => {
                console.log('Intentando reconexión manual después de 5 segundos...');
                setConnectionAttempts(prev => prev + 1);
                setupMqttConnection();
            }, 5000);
        });

        mqttClient.on('error', (error) => {
            console.error('Error en la conexión MQTT:', error);
            setIsConnected(false);

            // No es necesario iniciar una reconexión manual aquí, ya que el evento 'close' se disparará
        });

        mqttClient.on('message', (topic, payload) => {
            try {


                const newMessage = {
                    topic: topic.toString(),
                    message: JSON.parse(payload.toString()),
                    timestamp: new Date().toISOString(),
                };


                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, newMessage];
                    // Si la lista supera el tamaño máximo, se recorta para mantener solo los últimos mensajes.
                    if (updatedMessages.length > MAX_MESSAGES_IN_HISTORY) {
                        return updatedMessages.slice(updatedMessages.length - MAX_MESSAGES_IN_HISTORY);
                    }
                    return updatedMessages;
                });
            } catch (e) {
                console.error('Error al procesar mensaje MQTT:', e);
            }
        });
    };

    useEffect(() => {
        setupMqttConnection();


        return () => {
            if (client) {
                try {
                    console.log('Limpiando cliente MQTT');
                    client.end(true);
                } catch (e) {
                    console.warn('Error durante la limpieza:', e);
                }
            }

            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
            if (manualReconnectTimeoutRef.current) clearTimeout(manualReconnectTimeoutRef.current);

            setClient(null);
            setIsConnected(false);
        };
    }, []);

    const publish = useCallback((topic, message, timeout = 2500) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();

            function tryPublish() {
                if (!client) {
                    reject(new Error('No hay cliente MQTT disponible'));
                    return;
                }

                if (client.connected) {
                    try {
                        client.publish(topic, message, { qos: 1 }, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(true);
                            }
                        });
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    if (Date.now() - start > timeout) {
                        reject(new Error('Timeout esperando conexión MQTT'));
                    } else {
                        setTimeout(tryPublish, 1000); // Reintenta cada 100ms
                    }
                }
            }

            tryPublish();
        });
    }, [client, isConnected]);

    const subscribe = useCallback((topic, subOptions = { qos: 0 }) => {
        if (client && client.connected) {
            client.subscribe(topic, subOptions, (err) => {
                if (err) {
                    console.error(`(Provider) Error al suscribir a ${topic}:`, err);
                } else {
                    console.log(`(Provider) Suscrito a ${topic}`);
                    activeSubscriptionsRef.current.add(topic);
                }
            });
        } else {
            console.warn(`(Provider) No conectado, no se puede suscribir a ${topic}.`);
            // Guardar la suscripción para intentarlo más tarde
            activeSubscriptionsRef.current.add(topic);
        }
    }, [client, isConnected]);

    const unsubscribe = useCallback((topic) => {
        if (client && client.connected) {
            client.unsubscribe(topic, (err) => {
                if (err) {
                    console.error(`(Provider) Error al desuscribir de ${topic}:`, err);
                } else {
                    console.log(`(Provider) Desuscrito de ${topic}`);
                    activeSubscriptionsRef.current.delete(topic);
                }
            });
        } else {
            console.warn(`(Provider) No conectado, no se puede desuscribir de ${topic}.`);
            // Eliminar de las suscripciones pendientes
            activeSubscriptionsRef.current.delete(topic);
        }
    }, [client, isConnected]);

    const contextValue = useMemo(() => ({
        isConnected,
        messages,
        publish,
        subscribe,
        unsubscribe,
        client,
    }), [isConnected, messages, publish, subscribe, unsubscribe, client]);

    return (
        <MqttContext.Provider value={contextValue}>
            {children}
        </MqttContext.Provider>
    );
}

