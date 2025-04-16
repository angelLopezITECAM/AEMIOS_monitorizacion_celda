export function toLocalIsoString(date) {
    const pad = (num, size = 2) => String(num).padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Los meses en JavaScript inician en 0
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Obtener el offset en minutos y calcular el signo
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;
}


export const formatDateWithFormat = (date, format, defaultValue = null) => {

    if (!date) {
        return defaultValue;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return defaultValue;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('yyyy', year)
        .replace('mm', month)
        .replace('dd', day)
        .replace('HH', hours)
        .replace('ii', minutes)
        //.replace('MM', minutes)
        .replace('ss', seconds);
};