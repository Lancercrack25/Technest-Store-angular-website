import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analizarCompatibilidad(componentes) {
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" }); 

        const prompt = `Analiza este hardware: ${JSON.stringify(componentes)}.
        Responde ÚNICAMENTE con este JSON exacto (sin texto adicional):
        {
          "compatible": true,
          "detalles": "- Punto 1\\n- Punto 2",
          "cuello_de_botella": "Análisis de rendimiento"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        
        const jsonFinal = JSON.parse(text);
        console.log("✅ Análisis enviado al frontend:", jsonFinal);
        return jsonFinal;

    } catch (error) {
        console.error("❌ Error en la IA:", error);
        throw error;
    }
}