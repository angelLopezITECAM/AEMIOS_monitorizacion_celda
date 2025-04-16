
import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';
import { getPotencia } from '@/lib/itecam/electricity';

export function PotenciaBombasChart() {
    const voltaje = 24
    return (
        <GenericLineChart
            title="Potencia (W)"
            seriesName="Potencia Bombas"
            yAxisLabel="W"
            color="#90EE90"
            magnitude="amperage_pumps"
            processValue={(value) => getPotencia(voltaje, parseFloat(value))}
        />
    );
}
