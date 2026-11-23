export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST method required" });
  }

  try {
    const { topic, language, wordCount } = req.body || {};

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Эссе тақырыбын енгіз!" });
    }

    const prompt = `
Эссе жазуға көмектес.
Тақырып: ${topic}
Тіл: ${language || "Қазақша"}
Сөз саны: ${wordCount || 200}

Тақырыпты ашатын, кіріспесі, негізгі бөлімі және қорытындысы бар эссе жаз.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "AI қатесі. Кейін қайталап көр." });
    }

    const essay = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    return res.status(200).json({ essay });

  } catch (error) {
    return res.status(500).json({ error: "Сервер қатесі." });
  }
}
