import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';

export function TemperaturaTermoparChart() {
    return (
        <GenericLineChart
            title="Temperatura"
            seriesName="Temperatura Termopar"
            yAxisLabel="ºC"
            color="#FF4500"
            magnitude="temperature_tc"
        />
    );
}
