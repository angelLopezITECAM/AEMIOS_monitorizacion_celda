
import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';

export function IntensidadBombasChart() {
    return (
        <GenericLineChart
            title="Intensidad (A)"
            seriesName="Intensidad Bombas"
            yAxisLabel="A"
            color="#007bff"
            magnitude="amperage_pumps"

        />
    );
}
