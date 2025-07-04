/**
 * Envía una solicitud al backend para que este mande un correo de alerta.
 * @param {object} lastMessage - El último mensaje de alerta recibido de MQTT.
 * @returns {Promise<void>}
 */
export const sendEmailOnAlert = async (lastMessage) => {
    // Si no hay mensaje, no hacemos nada.
    if (!lastMessage || !lastMessage.message) {
        console.error("sendEmailOnAlert fue llamado sin un mensaje válido.");
        return;
    }

    // Formateamos el cuerpo del correo para que sea claro y útil.
    const { message, value, ud, magnitude, time } = lastMessage.message;
    const formattedTime = new Date(time).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const emailBody = `
        Se ha detectado una nueva alerta crítica en el sistema:
        ----------------------------------------------------
        - Magnitud: ${magnitude || 'No especificada'}
        - Mensaje: ${message || 'Sin descripción.'}
        - Valor Detectado: ${value !== undefined ? value : 'N/A'} ${ud || ''}
        - Hora de Detección: ${formattedTime}
        ----------------------------------------------------
        Se recomienda revisar el sistema lo antes posible.
    `;

    try {
        // Hacemos la llamada al endpoint del backend que se encarga de enviar el correo.
        const response = await fetch('http://127.0.0.1:8002/send-mail-alarm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ msg: emailBody }),
        });

        // Verificamos si la solicitud al backend fue exitosa.
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        console.log("Respuesta del servidor de correo:", result.message);

    } catch (error) {
        console.error('Error al enviar la solicitud de correo de alerta:', error);
    }
};