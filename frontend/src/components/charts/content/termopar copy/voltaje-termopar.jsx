import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';

export function VoltajeTermoparChart() {
    return (
        <GenericLineChart
            title="Voltaje (V)"
            seriesName="Voltaje Termopar"
            yAxisLabel="V"
            color="#40E0D0"
            magnitude="amperage_tc"
            fixedValue={24}
        />
    );
}
