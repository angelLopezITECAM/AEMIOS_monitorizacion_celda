import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback, useRef } from "react"
import useDebounce from "@/hooks/useDebounce"
import { useMQTT } from "@/context/mqtt-context"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DataTermopar() {

    const topicGetData = `devices/data`
    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();
    const [isLoading, setIsLoading] = useState(true);
    const [intensidad, setIntensidad] = useState(0)
    const [potencia, setPotencia] = useState(0)
    const [voltaje, setVoltaje] = useState(0)
    const [temperatura, setTemperatura] = useState(0)

    useEffect(() => {
        if (isConnected) {
            subscribe(topicGetData);

            return () => {
                unsubscribe(topicGetData);
            }
        } else {
            setIsLoading(true);
            setInfoMsg("Conectando al sistema...");
            console.log("No se está conectado al broker");
        }
    }, [isConnected, topicGetData]);

    const lastMessageTemperature = messages.findLast(msg => msg.message.magnitude === "temperature_tc");
    const lastMessageAmperage = messages.findLast(msg => msg.message.magnitude === "amperage_tc");

    useEffect(() => {
        if (lastMessageTemperature) {
            const newValue = lastMessageTemperature.message.value;
            setTemperatura(`${newValue} ${lastMessageTemperature.message.ud}`)
        }
    }, [lastMessageTemperature])

    useEffect(() => {
        if (lastMessageAmperage) {
            const newValue = lastMessageAmperage.message.value;
            const voltage = 24
            const potenciaValue = (newValue * voltage).toFixed(2)
            setIntensidad(`${newValue} ${lastMessageAmperage.message.ud}`)
            setVoltaje(`${voltage} V`)
            setPotencia(`${potenciaValue} w`)
        }
    }, [lastMessageAmperage])


    return (
        <section className='m-panel__section'>
            <div className='flex-between'>
                <h4 className='m-panel__section--title'>Termopar</h4>
            </div>
            <div className='m-panel__data'>
                <div className=''>
                    <p className='m-panel__data'><strong>Intensidad:</strong> {intensidad}</p>
                    <p className='m-panel__data'><strong>Potencia:</strong> {potencia}</p>
                    <p className='m-panel__data'><strong>Voltaje:</strong> {voltaje}</p>
                    <p className='m-panel__data'><strong>Temperatura:</strong> {temperatura}</p>

                </div>
            </div>
        </section>
    )

}