import type { Difficulty, StudyQuestion } from "@/app/types";

const difficultyGuide: Record<Difficulty, string> = {
  하: "핵심 개념과 정의를 확인하는 쉬운",
  중: "개념 이해와 간단한 응용을 확인하는",
  상: "실전형 사고와 심화 이해를 확인하는"
};

function pickConcepts(text: string) {
  const words = text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 80);

  const unique = Array.from(new Set(words));
  const fallback = ["핵심 개념", "학습 목표", "주요 원리", "적용 방법", "비교 기준"];
  return [...unique, ...fallback].slice(0, 20);
}

export function buildSampleQuestions(text: string, difficulty: Difficulty): StudyQuestion[] {
  const concepts = pickConcepts(text);
  const guide = difficultyGuide[difficulty];
  const questions: StudyQuestion[] = [];

  for (let i = 0; i < 5; i += 1) {
    const concept = concepts[i] || "핵심 개념";
    questions.push({
      id: `Q${String(i + 1).padStart(2, "0")}`,
      type: "OX",
      question: `${concept}은(는) PDF 자료에서 중요하게 다룬 ${guide} 확인 항목이다.`,
      choices: ["O", "X"],
      answer: "O",
      explanation: `자료에서 반복적으로 등장하는 표현을 바탕으로 ${concept}을(를) 핵심 개념으로 볼 수 있습니다.`,
      concept,
      difficulty,
      keywords: [concept]
    });
  }

  for (let i = 0; i < 10; i += 1) {
    const concept = concepts[i + 5] || concepts[i % concepts.length] || "주요 원리";
    questions.push({
      id: `Q${String(i + 6).padStart(2, "0")}`,
      type: "MULTIPLE_CHOICE",
      question: `${concept}에 대한 설명으로 가장 적절한 것은 무엇인가요?`,
      choices: [
        `${concept}의 의미와 역할을 자료의 맥락에서 파악한다.`,
        `${concept}은 자료 내용과 관련이 전혀 없다.`,
        `${concept}은 항상 하나의 예외 없는 규칙만 의미한다.`,
        `${concept}은 복습 과정에서 고려할 필요가 없다.`
      ],
      answer: `${concept}의 의미와 역할을 자료의 맥락에서 파악한다.`,
      explanation: `${concept}은(는) 자료의 맥락 안에서 정의, 역할, 적용 방식을 함께 이해해야 합니다.`,
      concept,
      difficulty,
      keywords: [concept, "의미", "역할"]
    });
  }

  for (let i = 0; i < 2; i += 1) {
    const concept = concepts[i + 15] || concepts[i] || "핵심 개념";
    questions.push({
      id: `Q${String(i + 16).padStart(2, "0")}`,
      type: "SHORT_ANSWER",
      question: `${concept}의 핵심 의미와 학습 자료에서 중요한 이유를 간단히 서술하세요.`,
      choices: [],
      answer: `${concept}은 자료의 핵심 흐름을 이해하는 데 필요한 개념이며, 정의와 적용 맥락을 함께 설명해야 한다.`,
      explanation: `서술형 답안에는 ${concept}의 의미, 역할, 적용 맥락이 포함되어야 합니다.`,
      concept,
      difficulty,
      keywords: [concept, "의미", "역할", "맥락"]
    });
  }

  return questions;
}
