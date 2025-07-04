import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import mqtt from 'mqtt';

const MQTTContext = createContext();

// Límite de mensajes a guardar en el historial para evitar problemas de rendimiento.
const MAX_MESSAGES_IN_HISTORY = 20;

export function MqttProvider({ children, brokerUrl, options }) {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (brokerUrl) {
            const mqttClient = mqtt.connect(brokerUrl, options);
            setClient(mqttClient);

            mqttClient.on('connect', () => {
                console.log('Conectado al broker MQTT');
                setIsConnected(true);
            });

            mqttClient.on('error', (err) => {
                console.error('Error en la conexión MQTT:', err);
                mqttClient.end();
            });

            mqttClient.on('reconnect', () => {
                console.log('Reconectando al broker MQTT...');
            });

            mqttClient.on('message', (topic, payload) => {
                const message = {
                    topic,
                    message: JSON.parse(payload.toString()),
                    timestamp: new Date().toISOString(),
                };

                setMessages((prevMessages) => {
                    const newMessages = [message, ...prevMessages];
                    if (newMessages.length > MAX_MESSAGES_IN_HISTORY) {
                        return newMessages.slice(0, MAX_MESSAGES_IN_HISTORY);
                    }
                    return newMessages;
                });
            });

            return () => {
                if (mqttClient) {
                    mqttClient.end();
                    setIsConnected(false);
                    console.log('Desconectado del broker MQTT');
                }
            };
        }
    }, [brokerUrl, options]);

    // **AQUÍ LA CORRECCIÓN**: Envolvemos las funciones en useCallback
    const subscribe = useCallback((topic, qos = 0) => {
        if (client && isConnected) {
            client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.error(`Error al suscribirse al tópico ${topic}:`, error);
                } else {
                    console.log(`Suscrito exitosamente al tópico: ${topic}`);
                }
            });
        }
    }, [client, isConnected]);

    const unsubscribe = useCallback((topic) => {
        if (client && isConnected) {
            client.unsubscribe(topic, (error) => {
                if (error) {
                    console.error(`Error al desuscribirse del tópico ${topic}:`, error);
                } else {
                    console.log(`Desuscrito exitosamente del tópico: ${topic}`);
                }
            });
        }
    }, [client, isConnected]);

    const publish = useCallback((topic, message, qos = 0) => {
        if (client && isConnected) {
            client.publish(topic, JSON.stringify(message), { qos }, (error) => {
                if (error) {
                    console.error(`Error al publicar en el tópico ${topic}:`, error);
                }
            });
        }
    }, [client, isConnected]);

    // Optimizamos también el valor del contexto con useMemo
    const contextValue = useMemo(() => ({
        isConnected,
        messages,
        publish,
        subscribe,
        unsubscribe,
        client,
    }), [isConnected, messages, publish, subscribe, unsubscribe, client]);

    return (
        <MQTTContext.Provider value={contextValue}>
            {children}
        </MQTTContext.Provider>
    );
}

export const useMQTT = () => {
    const context = useContext(MQTTContext);
    if (!context) {
        throw new Error('useMQTT debe ser usado dentro de un MQTTProvider');
    }
    return context;
};