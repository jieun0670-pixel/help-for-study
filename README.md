# AI PDF Study Helper

Vercel 정적 HTML + Serverless API 구조로 만든 PDF 학습 지원 웹앱입니다. Next.js를 사용하지 않습니다.

## 파일 구조

```text
index.html
api/generate-questions.js
api/grade-essay.js
api/save-result.js
sampleQuestions.js
package.json
vercel.json
README.md
```

## 동작 흐름

1. 사용자가 PDF를 업로드합니다.
2. 브라우저에서 PDF.js CDN으로 텍스트를 추출합니다.
3. 난이도 하, 중, 상 중 하나를 선택합니다.
4. 문제 생성 버튼을 누르면 `/api/generate-questions`로 요청합니다.
5. OpenAI API 키가 있으면 AI 문제를 생성합니다.
6. API 키가 없거나 호출이 실패하면 샘플 문제 17개를 반환합니다.
7. 어떤 경우에도 문제 풀이 화면으로 넘어가도록 구성했습니다.
8. 채점 후 결과 리포트를 만들고 `/api/save-result`로 Firebase Realtime Database에 저장합니다.

## 문제 구성

- O/X 문제 5개
- 객관식 문제 10개
- 서술형 문제 2개
- 총 17개

각 문제에는 문제 ID, 문제 유형, 문제 내용, 보기, 정답, 해설, 관련 개념, 난이도가 포함됩니다.

## 환경 변수

Vercel 프로젝트 설정에서 아래 환경 변수를 등록할 수 있습니다.

```text
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
FIREBASE_DATABASE_URL=https://help-for-study-default-rtdb.firebaseio.com/
```

`OPENAI_API_KEY`가 없으면 자동으로 샘플 문제와 키워드 기반 서술형 채점을 사용합니다.

`FIREBASE_DATABASE_URL`을 생략하면 기본값으로 아래 주소를 사용합니다.

```text
https://help-for-study-default-rtdb.firebaseio.com/
```

## Vercel 배포

1. 이 폴더의 파일을 GitHub 저장소에 업로드합니다.
2. Vercel에서 저장소를 Import합니다.
3. 필요한 환경 변수를 등록합니다.
4. Deploy를 실행합니다.

## 오류 표시

문제 생성 API 호출 실패, OpenAI 실패, Firebase 저장 실패 등의 원인은 브라우저 콘솔에 출력됩니다. 화면에도 "오류 원인" 영역으로 표시됩니다.
