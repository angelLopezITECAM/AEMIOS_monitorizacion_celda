import React from 'react';
import { GenericLineChart } from '@/components/charts/types/generic-line-chart';
import { getPotencia } from '@/lib/itecam/electricity';

export function PotenciaTermoparChart() {
    const voltaje = 24;

    return (
        <GenericLineChart
            title="Potencia (W)"
            seriesName="Potencia Termopar"
            yAxisLabel="W"
            color="#FF4500"
            magnitude="amperage_tc"
            processValue={(value) => getPotencia(voltaje, parseFloat(value))}
        />
    );
}
