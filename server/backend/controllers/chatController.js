import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres el asistente oficial de FeedYou. Recomiendas contenido personalizado a los usuarios."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERROR COMPLETO:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
};
