import { CircleAlert, CircleX, CircleCheckBig, Info } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export function Alertas() {
    return (
        <>
            <div className="flex items-center space-x-2 my-2">

                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        El consumo eléctrico no ha tenido variaciones.
                    </AlertDescription>
                </Alert>

            </div>

            <div className="flex items-center space-x-2 my-2">

                <Alert variant="warning">
                    <CircleAlert className="h-4 w-4" />
                    <AlertDescription>
                        La temperatura está cerca del límite.
                    </AlertDescription>
                </Alert>

            </div>

            <div className="flex items-center space-x-2 my-2">

                <Alert variant="danger">
                    <CircleX className="h-4 w-4" />
                    <AlertDescription>
                        Se ha gastado un 50% más de agua.
                    </AlertDescription>
                </Alert>

            </div>

            <div className="flex items-center space-x-2 my-2">

                <Alert variant="success">
                    <CircleCheckBig className="h-4 w-4" />
                    <AlertDescription>
                        Se ha cerrado el ánodo correctamente.
                    </AlertDescription>
                </Alert>

            </div>

        </>
    )
}