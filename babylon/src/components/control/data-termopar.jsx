import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback, useRef } from "react"
import useDebounce from "@/hooks/useDebounce"
import { useMQTT } from "@/context/mqtt-context"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DataTermopar() {

    const { messages } = useMQTT()
    const [intensidad, setIntensidad] = useState(0)
    const [potencia, setPotencia] = useState(0)
    const [voltaje, setVoltaje] = useState(0)
    const [temperatura, setTemperatura] = useState(0)

    const processedMessagesRef = useRef(new Set());

    useEffect(() => {
        console.log(messages)
        if (!messages || messages.length === 0) return;

        const relevantMessages = messages.filter(msg =>
            (msg?.payload?.magnitude === "amperage_tc" || msg?.payload?.magnitude === "temperature_tc") &&
            !processedMessagesRef.current.has(msg.timestamp)
        );

        if (relevantMessages.length === 0) return;

        relevantMessages.forEach(msg => {

            const value = msg.payload.value;
            switch (msg?.payload?.magnitude) {
                case "amperage_tc":
                    const voltage = 24
                    const potenciaValue = (value * voltage).toFixed(2)
                    setIntensidad(`${value} ${msg.payload.ud}`)
                    setVoltaje(`${voltage} V`)
                    setPotencia(`${potenciaValue} w`)
                    break;
                case "temperature_tc":
                    setTemperatura(`${value} ${msg.payload.ud}`)
                    break;

                default:
                    break;
            }



        });


    }, [messages]);

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