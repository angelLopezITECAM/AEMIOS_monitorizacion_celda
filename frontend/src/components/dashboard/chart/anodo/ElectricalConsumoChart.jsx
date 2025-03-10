"use client"

import { PiePadAnglesChart } from "../types/pie-pad-angles"

const generateRandomValues = () => {
    const values = [];
    let sum = 0;

    for (let i = 0; i < 3; i++) {
        const value = Math.floor(Math.random() * (70 - sum));
        values.push(value);
        sum += value;
    }

    values.push(100 - sum); // Asegurarse de que la suma sea 100
    return values;
};

export function ElectricalConsumoChart() {

    const randomValues = generateRandomValues();
    const params = {
        data: [
            { value: randomValues[0], name: "Ánodo" },
            { value: randomValues[1], name: "Cátodo" },
            { value: randomValues[2], name: "Control Temp." },
            { value: randomValues[3], name: "Otros" },
        ]
    }
    return <PiePadAnglesChart params={params} />

}

