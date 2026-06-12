const { keywordEssayGrade } = require("../sampleQuestions.js");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 사용할 수 있습니다." });
  }

  const { question, answer = "" } = req.body || {};
  if (!question) {
    return res.status(400).json({ error: "채점할 답안 정보가 부족합니다." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json(keywordEssayGrade(question, answer));
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        input: [
          {
            role: "developer",
            content: "한국어 서술형 답안을 10점 만점으로 채점한다. 기준 답안과 핵심 키워드를 참고해 간결한 피드백을 준다."
          },
          {
            role: "user",
            content: `문제: ${question.prompt}
기준 답안: ${question.answer}
핵심 키워드: ${(question.keywords || []).join(", ")}
학생 답안: ${answer}`
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "essay_grade",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["score", "isCorrect", "feedback"],
              properties: {
                score: { type: "number", minimum: 0, maximum: 10 },
                isCorrect: { type: "boolean" },
                feedback: { type: "string" }
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI 서술형 채점 오류 ${response.status}: ${detail.slice(0, 300)}`);
    }

    const data = await response.json();
    const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
    if (!outputText) throw new Error("OpenAI 응답에서 서술형 채점 JSON을 찾지 못했습니다.");

    return res.status(200).json(JSON.parse(outputText));
  } catch (error) {
    console.error("grade-essay fallback:", error);
    return res.status(200).json({
      ...keywordEssayGrade(question, answer),
      warning: `AI 서술형 채점 실패로 키워드 채점을 사용했습니다: ${error.message}`
    });
  }
};
