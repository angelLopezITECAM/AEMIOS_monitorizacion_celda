"use client";
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { toLocalIsoString } from "@/lib/itecam/date"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


// Opciones de filtro de tiempo disponibles
export const TIME_FILTER_OPTIONS = {
    LAST_WEEK: "last_week",
    LAST_3_MONTHS: "last_3_months",
    LAST_6_MONTHS: "last_6_months",
    LAST_12_MONTHS: "last_12_months",
};

// Etiquetas legibles para los filtros
export const TIME_FILTER_LABELS = {
    [TIME_FILTER_OPTIONS.LAST_WEEK]: "Último minuto",
    [TIME_FILTER_OPTIONS.LAST_3_MONTHS]: "Últimos 15 minutos",
    [TIME_FILTER_OPTIONS.LAST_6_MONTHS]: "Últimos 30 minutos",
    [TIME_FILTER_OPTIONS.LAST_12_MONTHS]: "Última hora",
};

// Crear el contexto
const TimeFilterContext = createContext();

export function TimeFilterProvider({ children }) {
    // Estado principal: filtro seleccionado actualmente
    const [activeFilter, setActiveFilter] = useState(TIME_FILTER_OPTIONS.LAST_WEEK);

    // Estado opcional para fechas personalizadas
    const [customDateRange, setCustomDateRange] = useState({
        startDate: null,
        endDate: null,
    });

    // Calcular las fechas según el filtro seleccionado
    const dateRange = useMemo(() => {
        const now = new Date();
        const endDate = new Date(now); // Fecha final siempre es hoy
        let startDate = new Date(now);

        switch (activeFilter) {
            case TIME_FILTER_OPTIONS.LAST_WEEK:
                /* startDate.setDate(now.getDate() - 7); */
                startDate.setMinutes(now.getMinutes() - 1);
                break;
            case TIME_FILTER_OPTIONS.LAST_3_MONTHS:
                /* startDate.setMonth(now.getMonth() - 3); */
                startDate.setMinutes(now.getMinutes() - 15);
                break;
            case TIME_FILTER_OPTIONS.LAST_6_MONTHS:
                /* startDate.setMonth(now.getMonth() - 6); */
                startDate.setMinutes(now.getMinutes() - 30);
                break;
            case TIME_FILTER_OPTIONS.LAST_12_MONTHS:
                /* startDate.setMonth(now.getMonth() - 12); */
                startDate.setHours(now.getHours() - 1);
                break;
            default:
                /* startDate.setDate(now.getDate() - 7); */
                startDate.setMinutes(now.getMinutes() - 1);
        }

        return {
            startDate,
            endDate,
        };
    }, [activeFilter, customDateRange]);

    // Función para cambiar el filtro activo
    const changeFilter = useCallback((filterOption) => {
        if (Object.values(TIME_FILTER_OPTIONS).includes(filterOption)) {
            setActiveFilter(filterOption);
        } else {
            console.error(`Filtro de tiempo inválido: ${filterOption}`);
        }
    }, []);

    // Función para establecer un rango personalizado
    const setCustomRange = useCallback((startDate, endDate) => {
        setCustomDateRange({ startDate, endDate });
        setActiveFilter(TIME_FILTER_OPTIONS.CUSTOM);
    }, []);

    // Generar string para consultas de API
    const getFilterQueryString = useCallback(() => {
        const { startDate, endDate } = dateRange;

        if (!startDate || !endDate) return '';

        const start = new Date(startDate);
        const end = new Date(endDate);

        /* start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); */

        const formattedStart = start.toISOString();
        const formattedEnd = end.toISOString();
        return `start=${formattedStart}&end=${formattedEnd}`;
    }, [dateRange]);

    // Valor del contexto que exponemos
    const value = {
        activeFilter,
        dateRange,
        changeFilter,
        setCustomRange,
        getFilterQueryString,
        availableFilters: TIME_FILTER_OPTIONS,
        filterLabels: TIME_FILTER_LABELS,
    };

    return (
        <TimeFilterContext.Provider value={value}>
            {children}
        </TimeFilterContext.Provider>
    );
}

export function useTimeFilter() {
    const context = useContext(TimeFilterContext);
    if (context === undefined) {
        throw new Error('useTimeFilter debe usarse dentro de un TimeFilterProvider');
    }
    return context;
}

export function TimeFilter() {
    const { activeFilter, changeFilter, filterLabels } = useTimeFilter();

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Tiempo:</span>
            <Select onValueChange={changeFilter} defaultValue={activeFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Tiempo" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(TIME_FILTER_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}