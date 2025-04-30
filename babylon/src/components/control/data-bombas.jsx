import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback, useRef } from "react"
import useDebounce from "@/hooks/useDebounce"
import { useMQTT } from "@/context/mqtt-context"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DataBombas() {

    const topicGetData = `devices/data`
    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();
    const [isLoading, setIsLoading] = useState(true);
    const [intensidad, setIntensidad] = useState(0)
    const [potencia, setPotencia] = useState(0)
    const [voltaje, setVoltaje] = useState(0)

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

    const lastMessage = messages.findLast(msg => msg.message.magnitude === "amperage_pumps");

    useEffect(() => {
        if (lastMessage) {
            const newValue = lastMessage.message.value;
            const voltage = 24
            const potenciaValue = (newValue * voltage).toFixed(2)
            setIntensidad(`${newValue} ${lastMessage.message.ud}`)
            setVoltaje(`${voltage} V`)
            setPotencia(`${potenciaValue} w`)
        }
    }, [lastMessage])



    return (
        <section className='m-panel__section'>
            <div className='flex-between'>
                <h4 className='m-panel__section--title'>Bombas</h4>
            </div>
            <div className='m-panel__data'>
                <div className=''>
                    <p className='m-panel__data'><strong>Intensidad:</strong> {intensidad}</p>
                    <p className='m-panel__data'><strong>Potencia:</strong> {potencia}</p>
                    <p className='m-panel__data'><strong>Voltaje:</strong> {voltaje}</p>

                </div>
            </div>
        </section>
    )

}