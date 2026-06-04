const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function analyzeSymptoms(name, age, symptoms) {
  const prompt = `You are a medical triage AI for an Indian hospital.
Patient: ${name}, Age: ${age}
Symptoms: ${symptoms}

Analyze and respond in this EXACT JSON format only, no extra text:
{
  "priority": <1, 2, 3, or 4>,
  "priorityLabel": "<Emergency|Serious|Moderate|Normal>",
  "department": "<Cardiology|Neurology|Orthopedics|General Medicine|Pediatrics|Emergency>",
  "waitTime": "<Immediately|15 min|45 min|60 min>",
  "reason": "<one line reason in simple english>"
}

Priority rules:
1 = Emergency (chest pain, stroke, severe breathing issues, unconscious)
2 = Serious (high fever 104+, severe pain, vomiting blood)
3 = Moderate (moderate fever, fracture, mild pain)
4 = Normal (cold, routine checkup, mild symptoms)`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 200
  });

  const text = response.choices[0].message.content.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI response parse failed');
  return JSON.parse(jsonMatch[0]);
}

module.exports = { analyzeSymptoms };