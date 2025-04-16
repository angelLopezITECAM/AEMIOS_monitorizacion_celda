import React from 'react';
import { GenericMultiLineChart } from '@/components/charts/types/generic-multiline-chart';

export function CaudalBombasChart() {
    const seriesConfigs = [
        {
            seriesName: "Ánodo",
            endpoint: "flow_anode",
            color: '#00FFFF'
        },
        {
            seriesName: "Cátodo",
            endpoint: "flow_cathode",
            color: '#000080'
        }
    ];

    return (
        <GenericMultiLineChart
            title="Caudal"
            yAxisLabel="L/min"
            seriesConfigs={seriesConfigs}
        />
    );
}
