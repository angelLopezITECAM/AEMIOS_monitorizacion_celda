import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/itecam/fetcher';
import { useTimeFilter } from '@/context/filter-time-context';
// parseDataInflux might not be directly used in the same way, or can be adapted if needed elsewhere.
import { API_IP } from "@/lib/utils";

export function useMultiSeriesChartData(magnitudes) {
    const { getFilterQueryString } = useTimeFilter();
    const timeFilter = getFilterQueryString();

    const [chartData, setChartData] = useState({
        seriesData: [],
        timeLabels: [],
        isLoading: true,
        error: null
    });

    const configSWR = {
        // Keeping your SWR config, ensure refreshInterval and dedupingInterval
        // are appropriate for your real-time needs vs. historical views.
        // For historical data that doesn't change, you might set refreshInterval to 0.
        refreshInterval: 1000, // Or your preferred interval, 0 for static data after load
        dedupingInterval: 500,
        revalidateOnFocus: false
    };

    const fetchUrls = magnitudes.map(mag =>
        `${API_IP}/api/influx/data/${mag.endpoint}?${timeFilter}`
    );

    // Fetch data for all series
    const swrResponses = magnitudes.map((mag, index) =>
        useSWR(fetchUrls[index], fetcher, configSWR)
    );

    useEffect(() => {
        const hasErrors = swrResponses.some(r => r.error);
        const isLoadingInitial = swrResponses.some(r => r.isLoading);

        if (isLoadingInitial) {
            // Set loading state only on initial load or if not already loaded
            if (!chartData.seriesData.length) { // Check if data has been loaded before
                setChartData(prev => ({ ...prev, isLoading: true, error: null }));
            }
            return;
        }

        if (hasErrors) {
            console.error("Error fetching data for one or more series:", swrResponses.filter(r => r.error).map(r => r.error));
            setChartData(prev => ({ ...prev, isLoading: false, error: "Error fetching data" }));
            return;
        }

        const allDataAvailable = swrResponses.every(res => res.data?.results);
        if (!allDataAvailable) {
            // This might happen if some series are still loading or returned no data
            // You might want to handle this more gracefully, e.g. show partial data or wait
            // For now, if initial loading is done, but some data is missing, we might still proceed or show error
            if (!chartData.seriesData.length) { // If it's still the initial phase without data
                setChartData(prev => ({ ...prev, isLoading: true, error: null })); // Or indicate partial data
            }
            return;
        }

        // 1. Collect all data points with their original Date objects
        const allSeriesPoints = swrResponses.map(res => {
            if (!res.data || !Array.isArray(res.data.results)) {
                console.warn("A series has missing or malformed data.results", res);
                return []; // Return an empty array for this series
            }
            return res.data.results.map(point => ({
                time: new Date(point.time), // Keep as Date objects for sorting and mapping
                value: parseFloat(point.value)
            }));
        });

        // 2. Get all unique, sorted timestamps (as Date objects)
        let allRawTimestamps = [];
        allSeriesPoints.forEach(series => {
            series.forEach(point => {
                if (point.time instanceof Date && !isNaN(point.time)) { // Ensure valid Date
                    allRawTimestamps.push(point.time);
                }
            });
        });

        if (allRawTimestamps.length === 0) {
            // Handle case with no data points at all
            setChartData({ seriesData: [], timeLabels: [], isLoading: false, error: null });
            return;
        }

        const uniqueTimestamps = [...new Set(allRawTimestamps.map(date => date.getTime()))]
            .map(time => new Date(time))
            .sort((a, b) => a - b); // Sort chronologically

        // 3. Create the final timeLabels for the X-axis (formatted strings)
        const formattedTimeLabels = uniqueTimestamps.map(date =>
            date.toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            })
        );

        // 4. Create aligned seriesData. Each element in seriesData will be an array of values (or null).
        const alignedSeriesData = allSeriesPoints.map((singleSeriesPoints, seriesIndex) => {
            // Create a Map for quick lookup of values by time for the current series
            const seriesValueMap = new Map();
            singleSeriesPoints.forEach(point => {
                if (point.time instanceof Date && !isNaN(point.time) && !isNaN(point.value)) {
                    seriesValueMap.set(point.time.getTime(), point.value);
                }
            });

            // For each unique timestamp, get the value or null if not present in this series
            return uniqueTimestamps.map(timestamp => {
                const value = seriesValueMap.get(timestamp.getTime());
                return value !== undefined ? value : null; // Use null for missing ECharts points
            });
        });

        // Only update if data has actually changed to prevent infinite loops or unnecessary re-renders
        if (JSON.stringify(chartData.seriesData) !== JSON.stringify(alignedSeriesData) ||
            JSON.stringify(chartData.timeLabels) !== JSON.stringify(formattedTimeLabels)) {
            setChartData({
                seriesData: alignedSeriesData,
                timeLabels: formattedTimeLabels,
                isLoading: false,
                error: null
            });
        } else {
            // If no change, but was loading, set loading to false.
            if (chartData.isLoading) {
                setChartData(prev => ({ ...prev, isLoading: false, error: null }));
            }
        }

    }, [swrResponses, magnitudes, chartData.isLoading, chartData.seriesData, chartData.timeLabels]); // Added chartData.isLoading to dependencies

    return chartData;
}
