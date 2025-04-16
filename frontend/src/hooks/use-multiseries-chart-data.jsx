import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/itecam/fetcher';
import { useTimeFilter } from '@/context/filter-time-context';
import { parseDataInflux } from '@/lib/itecam/parse-data-influx';

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
        refreshInterval: 1000,
        dedupingInterval: 500,
        revalidateOnFocus: false
    };

    const fetchUrls = magnitudes.map(mag =>
        `http://192.168.15.38:8000/api/influx/data/${mag.endpoint}?${timeFilter}`
    );

    const swrResponses = magnitudes.map((mag, index) =>
        useSWR(fetchUrls[index], fetcher, configSWR)
    );

    useEffect(() => {
        const hasErrors = swrResponses.some(r => r.error);
        const isLoading = swrResponses.some(r => r.isLoading);
        if (isLoading || hasErrors) {
            setChartData(prev => ({ ...prev, isLoading, error: hasErrors }));
            return;
        }

        const seriesData = swrResponses.map((res) =>
            parseDataInflux(res.data.results)
        );

        const firstResult = swrResponses[0].data.results;
        const timeLabels = Object.keys(firstResult).map((key) =>
            new Date(firstResult[key].time).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            })
        );

        setChartData({ seriesData, timeLabels, isLoading: false, error: null });
    }, [swrResponses]);

    return chartData;
}
