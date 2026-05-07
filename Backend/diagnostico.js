import dotenv from 'dotenv';
dotenv.config();

async function verModelosReales() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        if (data.models) {
            console.log("--- MODELOS DISPONIBLES PARA TU LLAVE ---");
            data.models.forEach(m => {
                // Solo nos interesan los que pueden generar contenido
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`> ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("No se encontraron modelos. Revisa tu API Key:", data);
        }
    } catch (e) {
        console.error("Error de conexión:", e);
    }
}

verModelosReales();