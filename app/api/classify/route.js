import Anthropic from '@anthropic-ai/sdk'

export async function POST(request) {
  try {
    const { name, email, company, message } = await request.json()

    if (!name || !email || !company || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      // Return mock data if no API key configured
      const score = Math.floor(40 + Math.random() * 55)
      const tier = score >= 70 ? 'HOT' : score >= 45 ? 'WARM' : 'COLD'
      return Response.json({
        tier,
        score,
        reason: 'Lead shows buying intent based on message context and company profile.',
        next_action: 'Schedule a discovery call within 24 hours to understand requirements.',
        estimated_value: '$8k–$25k MRR',
        mock: true,
      })
    }

    const client = new Anthropic({ apiKey })

    const prompt = `You are a startup sales AI assistant.
Classify the following inbound lead and respond ONLY in JSON.

Lead:
Name: ${name}
Email: ${email}
Company: ${company}
Message: "${message}"

Return ONLY this JSON with no extra text:
{
  "tier": "HOT" or "WARM" or "COLD",
  "score": <number 1-100>,
  "reason": "<one sentence why>",
  "next_action": "<what the sales team should do>",
  "estimated_value": "<e.g. $5k-$20k MRR>"
}`

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(text)

    return Response.json(result)
  } catch (error) {
    console.error('Classification error:', error)
    return Response.json({ error: 'Classification failed. Please try again.' }, { status: 500 })
  }
}
