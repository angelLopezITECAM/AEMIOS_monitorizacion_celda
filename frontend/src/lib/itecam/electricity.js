export function getConsumo() {
    const potencia = 1234;
    const tiempo = 3600; // en segundos
    const consumo = (potencia / 1000) * tiempo; // en Wh
    return consumo
}

export function getPotencia(voltaje, corriente) {

    const potencia = (voltaje * corriente).toFixed(2); // en vatios
    return potencia
}

export function getVoltaje() {
    const potencia = 2200; // en vatios
    const corriente = 10; // en amperios
    const voltaje = potencia / corriente; // en voltios
    return voltaje
}