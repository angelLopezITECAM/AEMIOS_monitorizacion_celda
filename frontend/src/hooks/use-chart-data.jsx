// src/hooks/useChartData.js
import { useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/itecam/fetcher';
import { useTimeFilter } from '@/context/filter-time-context';
import { useMQTT } from '@/context/mqtt-context';

/**
 * Hook genérico para gestionar datos de un gráfico.
 * @param {Object} config - Configuración para obtener datos.
 * @param {string} config.magnitude - Magnitud para filtrar la data.
 * @param {number} [config.fixedValue] - Valor fijo para cada dato (opcional).
 * @param {Function} [config.processValue] - Función para procesar el valor recibido (opcional).
 */
export function useChartData({ magnitude, fixedValue, processValue }) {
    const [chartData, setChartData] = useState({ data: [], timeLabels: [] });
    const { getFilterQueryString } = useTimeFilter();
    const timeFilter = getFilterQueryString();
    const { messages } = useMQTT();

    // Obtener datos históricos con SWR
    const { data: historicalData } = useSWR(
        `http://192.168.15.151:8002/api/influx/data/${magnitude}?${timeFilter}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0
        }
    );

    // Función para obtener el valor: usa fixedValue o processValue o parseFloat
    const getValue = (rawValue) => {
        if (fixedValue !== undefined) {
            return fixedValue;
        }
        if (processValue) {
            return processValue(rawValue);
        }
        return parseFloat(rawValue);
    };

    // Procesar datos históricos
    useEffect(() => {
        if (!historicalData?.results) return;
        const newData = [];
        const newTimeLabels = [];
        Object.keys(historicalData.results).forEach(key => {
            const result = historicalData.results[key];
            const value = getValue(result.value);
            if (!isNaN(value)) {
                newData.push(value);
                const date = new Date(result.time);
                newTimeLabels.push(
                    date.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                );
            }
        });
        setChartData({
            data: newData,
            timeLabels: newTimeLabels
        });
    }, [historicalData]);

    // Referencia para evitar procesar mensajes duplicados
    const processedMessagesRef = useRef(new Set());

    // Procesar mensajes en tiempo real
    useEffect(() => {
        if (!messages || messages.length === 0) return;
        const relevantMessages = messages.filter(msg =>
            msg?.payload?.magnitude === magnitude &&
            !processedMessagesRef.current.has(msg.timestamp)
        );
        if (relevantMessages.length === 0) return;
        setChartData(prev => {
            const updatedData = [...prev.data];
            const updatedTimeLabels = [...prev.timeLabels];
            relevantMessages.forEach(msg => {
                const value = getValue(msg.payload.value);
                if (!isNaN(value)) {
                    updatedData.push(value);
                    const date = new Date(msg.timestamp);
                    updatedTimeLabels.push(
                        date.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    );
                    processedMessagesRef.current.add(msg.timestamp);
                }
            });
            return { data: updatedData, timeLabels: updatedTimeLabels };
        });
    }, [messages]);

    return chartData;
}
