import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  const { historial } = req.body;

  const promptSistema = {
    role: "system",
    content: `Actúas como Andrea, una Tech Recruiter experta. Haces un simulacro interactivo sobre React.
    Reglas: 
    1. Si el historial está casi vacío, saluda amigablemente y haz la primera pregunta técnica (ej: sobre Virtual DOM).
    2. Si el usuario ya respondió, dale un feedback muy cortito (ej: "¡Bien!", "Incompleto porque...", etc) y lánzale la siguiente pregunta de React.
    3. Mantén el formato de chat fluido e informal.`
  };

  try {
    const respuesta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [promptSistema, ...historial],
      temperature: 0.7,
    });

    res.status(200).json({ resultado: respuesta.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
