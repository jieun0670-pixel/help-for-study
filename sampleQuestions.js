(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.SampleQuestions = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const concepts = [
    "핵심 개념",
    "정의와 특징",
    "원리",
    "비교",
    "적용",
    "절차",
    "사례",
    "한계",
    "자료 해석",
    "종합 이해",
    "실전 판단",
    "개념 연결"
  ];

  const descriptions = {
    "하": "핵심 개념과 정의를 확인하는 쉬운 문제",
    "중": "개념 이해와 간단한 응용을 확인하는 문제",
    "상": "시험 대비를 위한 실전형 심화 문제"
  };

  function makeSampleQuestions(difficulty = "중", sourceText = "") {
    const topic = pickTopic(sourceText);
    const questions = [];

    for (let index = 0; index < 5; index += 1) {
      questions.push({
        id: `OX-${index + 1}`,
        type: "OX",
        prompt: `${topic} 학습에서 ${concepts[index]}을 설명할 때, 근거 없이 결론만 암기하는 것은 충분한 복습 전략이다.`,
        choices: ["O", "X"],
        answer: index % 2 === 0 ? "X" : "O",
        explanation:
          index % 2 === 0
            ? "핵심 개념은 정의, 근거, 예시를 함께 연결해야 오래 기억되고 응용할 수 있습니다."
            : "일부 기본 정의는 먼저 기억한 뒤 예시와 연결하면 이해가 빨라질 수 있습니다.",
        concept: concepts[index],
        difficulty,
        keywords: [concepts[index], "정의", "근거"]
      });
    }

    for (let index = 0; index < 10; index += 1) {
      const concept = concepts[(index + 2) % concepts.length];
      const baseChoices = [
        `${concept}을 정의, 조건, 예시와 함께 설명한다.`,
        "본문의 모든 문장을 순서대로 외우는 데만 집중한다.",
        "관련 없는 사례를 중심으로 결론을 만든다.",
        "용어의 이름만 보고 세부 의미를 생략한다."
      ];
      questions.push({
        id: `MC-${index + 1}`,
        type: "MULTIPLE_CHOICE",
        prompt: `${descriptions[difficulty] || descriptions["중"]}로 가장 적절한 ${concept} 복습 방법은 무엇인가?`,
        choices: rotateChoices(baseChoices, index % 4),
        answer: baseChoices[0],
        explanation: `${concept}은 정의뿐 아니라 조건, 예시, 반례를 함께 확인해야 실제 문제에서 활용할 수 있습니다.`,
        concept,
        difficulty,
        keywords: [concept, "예시", "조건"]
      });
    }

    for (let index = 0; index < 2; index += 1) {
      const concept = concepts[(index + 8) % concepts.length];
      questions.push({
        id: `SA-${index + 1}`,
        type: "SHORT_ANSWER",
        prompt: `${topic}에서 ${concept}이 중요한 이유를 핵심 용어 2개 이상을 포함해 설명하세요.`,
        choices: [],
        answer: `${concept}은 핵심 개념을 실제 사례에 적용하고 조건과 한계를 판단하는 기준이 되기 때문에 중요합니다.`,
        explanation: `좋은 답안은 ${concept}, 조건, 사례, 한계 중 여러 요소를 연결해 설명합니다.`,
        concept,
        difficulty,
        keywords: [concept, "조건", "사례", "한계"]
      });
    }

    return questions;
  }

  function keywordEssayGrade(question, answer) {
    const keywords = question.keywords && question.keywords.length ? question.keywords : question.answer.split(/\s+/).slice(0, 4);
    const normalizedAnswer = normalize(answer);
    const hits = keywords.filter((keyword) => normalizedAnswer.includes(normalize(keyword))).length;
    const score = Math.min(10, Math.round((hits / Math.max(1, keywords.length)) * 10));

    return {
      score,
      isCorrect: score >= 6,
      feedback:
        score >= 6
          ? "핵심 키워드가 충분히 포함되었습니다. 표현을 조금 더 구체화하면 더 좋은 답안이 됩니다."
          : "핵심 키워드와 근거가 부족합니다. 관련 개념, 조건, 예시를 함께 보완해 보세요."
    };
  }

  function pickTopic(text) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "업로드한 강의자료";
    return clean.slice(0, 28) + (clean.length > 28 ? "..." : "");
  }

  function rotateChoices(choices, shift) {
    return choices.slice(shift).concat(choices.slice(0, shift));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  return {
    makeSampleQuestions,
    keywordEssayGrade
  };
});
