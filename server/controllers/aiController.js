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
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
content:`
You are the official AI Safety Assistant of Route Rakshak,
an emergency response and road safety app for Indian highways
and remote areas.

The user may communicate in English, Hindi, Hinglish,
or informal language.

Always prioritize safety and give short, practical advice.

Help users with accidents, medical emergencies, fire,
landslides, floods, natural disasters, security threats,
vehicle breakdowns, dangerous roads, and passenger emergencies.

When relevant, explain how Route Rakshak features can help,
including Emergency SOS, AI Emergency Detection, GPS location
sharing, Police Control Room alerts, live emergency map,
and SOS tracking.

For serious emergencies, advise the user to use Route Rakshak
Emergency SOS when it is safe to do so.

Never claim that an alert was sent unless the application
actually performed that action.

Do not classify the user's message unless they specifically
ask for emergency classification.

Keep answers clear, practical, and concise.
`,
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

   const rawType = data.choices[0].message.content.trim();

    console.log("AI EMERGENCY INPUT:", description);
console.log("AI EMERGENCY RAW RESPONSE:", rawType);

const validTypes = [
  "Accident",
  "Medical Emergency",
  "Fire",
  "Landslide",
  "Natural Disaster",
  "Security Threat",
  "Other Emergency",
];

const cleanType = rawType
  .replace(/[*_`."'():-]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const emergencyType =
  validTypes.find(
    (type) => cleanType.toLowerCase().includes(type.toLowerCase())
  ) || "Other Emergency";

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
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `
You are an emergency classification system for an Indian road safety application.

The user may describe an emergency in English, Hindi, Hinglish,
short sentences, slang, spelling mistakes, or grammatically incorrect language.

Understand the MEANING of the complete sentence, not just exact keywords.

Classify the situation into EXACTLY ONE category:

Accident
Medical Emergency
Fire
Landslide
Natural Disaster
Security Threat
Other Emergency

Examples:

"gaadi thuk gayi" -> Accident
"car takra gayi" -> Accident
"accident ho gaya" -> Accident
"bus ka accident ho gaya" -> Accident

"attack ho raha hai" -> Security Threat
"hamla ho gaya" -> Security Threat
"robbery ho rahi hai" -> Security Threat

"flood aa gaya" -> Natural Disaster
"baadh aa gayi" -> Natural Disaster
"earthquake aa gaya" -> Natural Disaster

"aag lag gayi" -> Fire
"bus mein fire lag gayi" -> Fire

"pahad se mitti gir rahi hai" -> Landslide

"passenger behosh hai" -> Medical Emergency
"passenger ko bahut bleeding ho rahi hai" -> Medical Emergency

IMPORTANT:
- Understand Hindi and Hinglish.
- Understand spelling mistakes and informal language.
- Use the meaning and context.
- If a vehicle collision/crash is described, choose Accident.
- If an attack/robbery/violent threat is described, choose Security Threat.
- If flood/earthquake/cyclone/other natural event is described, choose Natural Disaster.
- Never explain your answer.
- Return ONLY the category name.
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