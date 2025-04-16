
import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';

export function VoltajeBombasChart() {
    const voltaje = 24
    return (
        <GenericLineChart
            title="Voltaje (V)"
            seriesName="Voltaje Bombas"
            yAxisLabel="V"
            color="#40E0D0"
            magnitude="amperage_pumps"
            fixedValue={voltaje}
        />
    );
}
