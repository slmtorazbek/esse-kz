export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST required" });
  }

  try {
    const apiKey = String(process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return res.status(500).json({ error: "API кілті табылмады." });
    }

    const { topic, language, wordCount, style } = req.body || {};

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "Тақырып енгіз!" });
    }

    const count = Number(wordCount);

    if (!Number.isInteger(count) || count < 50 || count > 3000) {
      return res.status(400).json({ error: "Сөз саны дұрыс емес." });
    }

    const prompt = `
Қазақ тілінде сауатты эссе жаз.
Тақырып: ${topic}
Тілі: ${language || "Қазақша"}
Сөз саны: шамамен ${count}
Стилі: ${style || "Мектептік"}

Кіріспе, негізгі бөлім және қорытынды болсын.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(500).json({
        error: "AI қатесі. Кейін қайталап көр."
      });
    }

    const essay = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!essay) {
      return res.status(500).json({ error: "Эссе алынбады." });
    }

    return res.status(200).json({ essay });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Сервер қатесі." });
  }
}
