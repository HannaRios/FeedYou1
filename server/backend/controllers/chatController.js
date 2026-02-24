import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  try {
    const { message, category } = req.body;
  
    console.log(`Mensaje recibido para la categoría: ${category}`);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    const prompt = `
      Eres YouBot, un asistente experto especializado en la categoría: ${category} que habla estrictamente solo de eso.
      
      Instrucciones:
      1. Tu respuesta debe tener como maximo dos párrafos detallados.
      2. Sé amable y cercano.
      3. Usa emojis de forma ocasional para que la charla sea amena.
      4. Si el usuario te pregunta algo fuera de ${category}, intenta relacionarlo con el tema o responde de forma breve y sugiere volver a hablar de ${category}.

      Pregunta del usuario: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });

  } catch (error) {
    console.error("Error en Gemini API:", error.message);
    res.status(500).json({ error: "No se pudo obtener respuesta de la IA" });
  }
};
