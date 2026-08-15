const detectEmergencyType = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
content:
  "You are an emergency classifier for a road safety app. Based on the driver's description, classify the emergency into EXACTLY ONE of these categories: Accident, Medical Emergency, Fire, Landslide, Natural Disaster, Security Threat, Other Emergency. Natural Disaster includes Flood, Tsunami, Earthquake and similar natural disasters. Security Threat includes Robbery, Naxal Attack and other security threats. Always choose the most appropriate category and never classify a clearly described natural disaster or security threat as Accident. Reply with ONLY the category name, nothing else.",
            },
            {
              role: "user",
              content: description,
            },
          ],
          temperature: 0.2,
          max_tokens: 10,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq API Error:", data);
      return res.status(500).json({
        message: "AI service error",
      });
    }

    const emergencyType = data.choices[0].message.content.trim();

    res.status(200).json({
      emergencyType,
    });
  } catch (error) {
    console.log("AI Controller Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const conversationHistory = (history || []).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are the official AI Safety Assistant of Route Rakshak, an emergency response and road safety app for Indian highways and remote areas.

Always prioritize safety and give short, practical advice for accidents, medical emergencies, fire, landslides, security threats, vehicle breakdowns, dangerous roads, weather, and passenger emergencies.

When relevant, explain how Route Rakshak features can help, including Emergency SOS, AI Emergency Detection, GPS location sharing, Police Control Room alerts, live emergency map, and SOS tracking.

For serious emergencies, clearly advise the user to use Route Rakshak Emergency SOS when it is safe to do so.

Give situation-specific safety steps, never invent app features or claim an alert was sent unless the app actually performed it.

Keep answers professional, clear, and concise (2-5 sentences). For life-threatening situations, also recommend contacting appropriate local emergency services.
`,
            },
            ...conversationHistory,
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.5,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq API Error:", data);
      return res.status(500).json({
        message: "AI service error",
      });
    }

    const reply = data.choices[0].message.content.trim();

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log("Chat Controller Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { detectEmergencyType, chatWithAI };