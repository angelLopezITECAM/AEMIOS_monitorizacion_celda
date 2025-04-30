import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';

export function IntensidadTermoparChart() {
    return (
        <GenericLineChart
            title="Intensidad (A)"
            seriesName="Intensidad Termopar"
            yAxisLabel="A"
            color="#007bff"
            magnitude="amperage_tc"
        />
    );
}
