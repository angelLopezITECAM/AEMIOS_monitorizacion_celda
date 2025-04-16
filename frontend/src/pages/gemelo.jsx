
import { useState } from 'react';
import { TimeFilterProvider, TimeFilter } from '@/context/filter-time-context';
import { ConsumoBombasChart } from '@/components/charts/content/bombas/consumo-bombas';
import { Loader } from '@/components/ui/itecam/loader';

export function PageGemelo() {

    const [isLoading, setIsLoading] = useState(true)

    return (
        <>

            <div className="flex items-center justify-between my-2 ">
                <h1 className="text-2xl font-bold tracking-tight">Inicio</h1>

            </div>

            <div className="max-h-[85vh] h-[85vh] m-2 ">
                {isLoading && <Loader />}
                <iframe
                    /* src="http://192.168.15.109:3003/" */
                    src="http://localhost:3003/"
                    className="w-full h-full rounded-3xl"
                    onLoad={() => setIsLoading(false)} />

            </div>

        </>
    )

}