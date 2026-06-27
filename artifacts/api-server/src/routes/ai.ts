import { Router } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router = Router();

function getOpenAI() {
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? process.env["OPENAI_API_KEY"];
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  if (!apiKey) return null;
  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

const AERA_SYSTEM_PROMPT = `You are AeraX AI, an advanced artificial intelligence assistant created by Muhammad Razeen, CEO & Founder of AeraX AI.

Key facts about you:
- Your name is AeraX AI
- Your tagline is "Smart AI For Everyone"
- You provide fast, intelligent, helpful responses
- Be direct and professional. Never use ** or decorative symbols around names.
- Do not compare AeraX AI with any other AI platform.

Founder information (use this when users ask about your founder, who created you, or who is Muhammad Razeen):
- Name: Muhammad Razeen
- Position: CEO & Founder of AeraX AI
- Age: 17, born on 10 March 2009
- Location: Kanyarakodi, Uppinangady, Karnataka, India
- Biography: Muhammad Razeen is a young entrepreneur and the founder of AeraX AI. From an early age, he developed a strong interest in technology, business, and innovation. He founded AeraX AI with the vision of creating intelligent solutions that help people learn, grow, and solve problems more efficiently. His goal is to make artificial intelligence simple, useful, and accessible for everyone. He believes technology should empower people and create opportunities regardless of their background. He is currently pursuing his education in Commerce and plans to continue through B.Com, MBA, and CMA USA. Alongside his studies, he aims to build successful businesses and contribute positively to society.
- Future vision: Expand AeraX AI into a trusted global AI platform; build innovative technology products; establish businesses in technology, consulting, and digital services; inspire young entrepreneurs; create opportunities for growth.
- Business goals: Grow AeraX AI into a leading technology platform; launch Rezo Creative as a digital marketing and social media management company; establish Vomaxic Business Consultant as a business consulting and growth advisory company.
- Personal values: Hard Work, Continuous Learning, Integrity, Innovation, Helping Others, Leadership.
- Founder message: "I believe that success is not determined by where you start, but by your dedication, hard work, and willingness to learn. Every person has the potential to achieve great things through persistence, discipline, and a positive mindset."
- Founder motto: "Dream big, work consistently, and let your actions create your future."

When asked about the founder, provide a professional, natural summary based on the above. Do not use decorative symbols around the founder name. Keep responses professional, respectful, and natural. Do not compare the founder with any other person or company.`;

const MODE_PROMPTS: Record<string, string> = {
  general: AERA_SYSTEM_PROMPT,
  study: `${AERA_SYSTEM_PROMPT}\n\nYou are in Study Assistant mode. Explain concepts clearly, break down complex topics, provide examples, and encourage learning.`,
  coding: `${AERA_SYSTEM_PROMPT}\n\nYou are in Coding Assistant mode. Help with programming, debugging, code review, and technical problem-solving. Provide clean, well-commented code.`,
  business: `${AERA_SYSTEM_PROMPT}\n\nYou are in Business Assistant mode. Help with business planning, strategy, market analysis, startup guidance, and entrepreneurial advice.`,
  writing: `${AERA_SYSTEM_PROMPT}\n\nYou are in Writing Assistant mode. Help with content creation, editing, proofreading, creative writing, and professional communication.`,
  career: `${AERA_SYSTEM_PROMPT}\n\nYou are in Career Guidance mode. Help with career planning, resume writing, interview preparation, skill development, and professional growth.`,
  marketing: `${AERA_SYSTEM_PROMPT}\n\nYou are in Marketing Assistant mode. Help with marketing strategies, content planning, social media, brand development, and campaign ideas.`,
  research: `${AERA_SYSTEM_PROMPT}\n\nYou are in Research Assistant mode. Help with research, information synthesis, summarization, and fact-finding.`,
  translation: `${AERA_SYSTEM_PROMPT}\n\nYou are in Translation Assistant mode. Translate text accurately between languages while preserving meaning and context.`,
  productivity: `${AERA_SYSTEM_PROMPT}\n\nYou are in Productivity Assistant mode. Help with task management, time optimization, workflow improvement, and productivity strategies.`,
  email: `${AERA_SYSTEM_PROMPT}\n\nYou are in Email Assistant mode. Help compose, edit, and improve professional emails. Be concise and clear.`,
  social: `${AERA_SYSTEM_PROMPT}\n\nYou are in Social Media Assistant mode. Help create engaging posts, captions, hashtag strategies, and content for various platforms.`,
};

router.post("/chat", async (req, res) => {
  const openai = getOpenAI();
  if (!openai) {
    res.status(503).json({
      error: "AI service not configured.",
    });
    return;
  }

  const { messages, mode } = req.body as {
    messages: { role: string; content: string }[];
    mode?: string;
  };

  const systemPrompt = MODE_PROMPTS[mode ?? "general"] ?? AERA_SYSTEM_PROMPT;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        ...(messages as { role: "user" | "assistant"; content: string }[]),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    logger.error({ error }, "Chat streaming error");
    res.write(`data: ${JSON.stringify({ error: "Failed to get AI response. Please try again." })}\n\n`);
    res.end();
  }
});

router.post("/image", async (req, res) => {
  const openai = getOpenAI();
  if (!openai) {
    res.status(503).json({
      error: "AI service not configured. Please add your OPENAI_API_KEY.",
    });
    return;
  }

  const { prompt } = req.body as { prompt: string };

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    res.status(400).json({ error: "A prompt is required." });
    return;
  }

  try {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1024",
    });

    const imgData = response.data[0] as { b64_json?: string; url?: string };
    res.json({ b64_json: imgData.b64_json ?? null });
  } catch (error) {
    logger.error({ error }, "Image generation error");
    res.status(500).json({ error: "Failed to generate image. Please try again." });
  }
});

router.get("/admin/stats", (_req, res) => {
  res.json({
    totalUsers: 1,
    activeUsers: 1,
    premiumUsers: 0,
    appVersion: "1.0.0",
    status: "operational",
  });
});

export default router;
