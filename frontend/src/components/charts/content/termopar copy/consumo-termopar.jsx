import { useRef } from 'react';
import { LineChart } from '@/components/charts/types/line';

export function ConsumoTermoparChart() {
    const chartRef = useRef(null);

    // Datos de ejemplo
    const datos = [10, 15, 13, 25, 22, 30, 28];
    const etiquetas = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Configuración completa del gráfico
    const params = {
        title: {
            text: 'Consumo (kWh)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: etiquetas,
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            name: 'kWh'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };

    // Series de datos
    const series = [
        {
            name: 'Temperatura',
            data: datos,
            smooth: true,
            showSymbol: false,
            color: '#007bff'
        }
    ];

    return (
        <div className="w-full h-64">
            <LineChart
                ref={chartRef}
                params={params}
                series={series}
            />
        </div>
    );
}