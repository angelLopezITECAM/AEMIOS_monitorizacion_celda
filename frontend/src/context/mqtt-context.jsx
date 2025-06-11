import React, { createContext, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

// Límite de mensajes a guardar en el historial para evitar problemas de rendimiento.
const MAX_MESSAGES_IN_HISTORY = 200;

export const MQTTProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const mqttClient = mqtt.connect('ws://192.168.1.151:8083/mqtt');
        setClient(mqttClient);

        mqttClient.on('connect', () => {
            console.log('Conectado al broker MQTT');
            setIsConnected(true);
        });

        mqttClient.on('error', (err) => {
            console.error('Error de conexión:', err);
            mqttClient.end();
        });

        mqttClient.on('reconnect', () => {
            console.log('Reconectando...');
        });

        mqttClient.on('message', (topic, message) => {
            const newMessage = {
                topic: topic.toString(),
                message: JSON.parse(message.toString()),
                timestamp: new Date().toISOString(),
            };

            // --- ESTA ES LA CORRECCIÓN CLAVE ---
            // Se añade el nuevo mensaje y se asegura que la lista no crezca indefinidamente.
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, newMessage];
                // Si la lista supera el tamaño máximo, se recorta para mantener solo los últimos mensajes.
                if (updatedMessages.length > MAX_MESSAGES_IN_HISTORY) {
                    return updatedMessages.slice(updatedMessages.length - MAX_MESSAGES_IN_HISTORY);
                }
                return updatedMessages;
            });
        });

        return () => {
            if (mqttClient) {
                mqttClient.end();
                setIsConnected(false);
            }
        };
    }, []);

    const publish = (topic, message) => {
        if (client && isConnected) {
            client.publish(topic, message);
        } else {
            console.error('No se puede publicar. Cliente no conectado.');
        }
    };

    const subscribe = (topic) => {
        if (client && isConnected) {
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error('Error al suscribirse:', topic, err);
                } else {
                    console.log('Suscrito a:', topic);
                }
            });
        }
    };

    const unsubscribe = (topic) => {
        if (client && isConnected) {
            client.unsubscribe(topic);
        }
    };

    return (
        <MQTTContext.Provider value={{ isConnected, messages, publish, subscribe, unsubscribe }}>
            {children}
        </MQTTContext.Provider>
    );
};