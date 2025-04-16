export function parseDataInflux(data) {
    let array = []
    if (!data) return array

    for (const key in data) {
        const { time, ud, value } = data[key]
        array.push(parseFloat(value))
    }
    return array
}