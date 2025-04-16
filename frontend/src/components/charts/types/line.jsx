import { useRef, forwardRef, useImperativeHandle } from 'react';
import { ChartWrapper } from "@/components/charts/chart-wrapper";

export const LineChart = forwardRef(function LineChart({ params, series }, ref) {
    const wrapperRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getEchartsInstance: () => {

            if (wrapperRef.current) {
                return wrapperRef.current.getEchartsInstance();
            }
            return null;
        }
    }));

    const extractedSeries = params.series || [];
    const finalSeries = series || extractedSeries;
    const { series: _, ...optionsWithoutSeries } = params;

    return (
        <ChartWrapper
            ref={wrapperRef}
            options={optionsWithoutSeries}
            series={finalSeries}
            type="line"
            height="100%"
            width="100%"
        />
    );
});