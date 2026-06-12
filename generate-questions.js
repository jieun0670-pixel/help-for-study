const { makeSampleQuestions } = require("../sampleQuestions.js");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return res.status(200).json({
      questions: makeSampleQuestions("중", ""),
      source: "sample",
      warning: "POST가 아닌 요청이라 샘플 문제를 반환했습니다."
    });
  }

  const { text = "", difficulty = "중" } = req.body || {};
  const safeDifficulty = ["하", "중", "상"].includes(difficulty) ? difficulty : "중";

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({
      questions: makeSampleQuestions(safeDifficulty, text),
      source: "sample",
      warning: "OPENAI_API_KEY가 없어 샘플 문제를 반환했습니다."
    });
  }

  try {
    const questions = await generateWithOpenAI(text, safeDifficulty);
    if (!Array.isArray(questions) || questions.length !== 17) {
      throw new Error("AI 응답의 문제 개수가 17개가 아닙니다.");
    }

    return res.status(200).json({
      questions,
      source: "openai"
    });
  } catch (error) {
    console.error("generate-questions fallback:", error);
    return res.status(200).json({
      questions: makeSampleQuestions(safeDifficulty, text),
      source: "sample",
      warning: `AI 문제 생성 실패로 샘플 문제를 반환했습니다: ${error.message}`
    });
  }
};

async function generateWithOpenAI(text, difficulty) {
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
          content: "너는 한국어 학습 평가 문항 생성 전문가다. 반드시 JSON 스키마를 지키고, PDF 텍스트에 근거한 문제만 만든다."
        },
        {
          role: "user",
          content: `난이도: ${difficulty}
문항 수: 총 17개. OX 5개, 객관식 10개, 서술형 2개.

난이도 기준:
- 하: 핵심 개념과 정의 중심
- 중: 개념 이해와 간단한 응용 중심
- 상: 실전형 및 심화 문제 중심

PDF 텍스트:
${String(text).slice(0, 18000)}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "study_questions",
          strict: true,
          schema: questionSchema
        }
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI API 오류 ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
  if (!outputText) throw new Error("OpenAI 응답에서 JSON 텍스트를 찾지 못했습니다.");

  return JSON.parse(outputText).questions;
}

const questionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      minItems: 17,
      maxItems: 17,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "type", "prompt", "choices", "answer", "explanation", "concept", "difficulty", "keywords"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["OX", "MULTIPLE_CHOICE", "SHORT_ANSWER"] },
          prompt: { type: "string" },
          choices: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
          explanation: { type: "string" },
          concept: { type: "string" },
          difficulty: { type: "string", enum: ["하", "중", "상"] },
          keywords: { type: "array", items: { type: "string" } }
        }
      }
    }
  }
};
