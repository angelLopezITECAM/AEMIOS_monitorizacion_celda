import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts';

export const ChartWrapper = forwardRef(function ChartWrapper(
    { options, series, type, width = "100%", height = "100%" },
    ref
) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Exponer la instancia del gráfico correctamente
    useImperativeHandle(ref, () => ({
        getEchartsInstance: () => chartInstanceRef.current
    }));

    useEffect(() => {
        // Inicializar el gráfico si no existe
        if (!chartInstanceRef.current && chartRef.current) {
            try {
                chartInstanceRef.current = echarts.init(chartRef.current);
            } catch (error) {
                console.error("Error initializing chart:", error);
            }
        }

        // Configuración de ECharts
        const echartsOptions = {
            ...options,
            series: series.map(s => ({
                ...s,
                type: s.type || type // Usar el tipo de la serie o el tipo por defecto
            }))
        };

        // Aplicar la configuración
        if (chartInstanceRef.current) {
            try {
                chartInstanceRef.current.setOption(echartsOptions, true);
            } catch (error) {
                console.error("Error setting chart options:", error);
            }
        }

        // Manejar redimensionamiento
        const handleResize = () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);

        // Limpieza al desmontar
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, [options, series, type]); // Dependencias para actualizar cuando cambien las props

    return (
        <div
            ref={chartRef}
            style={{
                width: width,
                height: height,
                minHeight: "200px" // Asegurar que siempre tenga un tamaño mínimo
            }}
        />
    );
});