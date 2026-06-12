# AI PDF Study Helper

PDF 강의자료를 업로드하면 텍스트를 추출하고, 선택한 난이도에 맞춰 AI가 학습 문제를 생성하는 웹앱입니다. 문제 풀이 후 점수, 정답, 해설, 풀이 시간, 취약 개념 분석, 학습 피드백을 리포트로 확인하고 다운로드할 수 있습니다.

## 주요 기능

- PDF 파일 업로드 및 텍스트 추출
- 난이도 선택: 하, 중, 상
- 총 17문항 자동 생성
  - O/X 5문항
  - 객관식 10문항
  - 서술형 2문항
- 자동 채점
- 서술형 AI 채점 API 연결 구조
- OpenAI API 키가 없을 때 샘플 문제와 키워드 기반 채점으로 동작
- 학습 분석 리포트 생성
- Firebase Realtime Database 저장
- 문제와 리포트 다운로드
- Vercel 배포 가능 구조

## 파일 구조

```text
.
├── index.html
├── package.json
├── vercel.json
└── api
    ├── generate.js
    ├── grade-essay.js
    ├── save-report.js
    └── shared.js
```

## 실행 방식

이 프로젝트는 별도 패키지 설치 없이 동작하도록 구성되어 있습니다. PDF 텍스트 추출은 브라우저에서 PDF.js CDN을 사용합니다.

로컬에서 화면만 확인하려면 `index.html`을 브라우저로 열 수 있습니다. 단, `/api` 함수까지 테스트하려면 Vercel 개발 서버 또는 Vercel 배포 환경에서 확인하는 것을 권장합니다.

## Vercel 배포

1. 이 프로젝트를 GitHub 저장소에 업로드합니다.
2. Vercel에서 해당 GitHub 저장소를 Import합니다.
3. 환경 변수를 설정합니다.
4. Deploy를 누릅니다.

## 환경 변수

필수는 아니지만, 실제 AI 문제 생성과 서술형 채점을 사용하려면 OpenAI API 키를 설정해야 합니다.

```text
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
FIREBASE_DATABASE_URL=https://help-for-study-default-rtdb.firebaseio.com/
```

`OPENAI_API_KEY`가 없으면 샘플 문제 생성과 키워드 기반 서술형 채점으로 작동합니다.

`FIREBASE_DATABASE_URL`을 설정하지 않아도 기본값으로 아래 주소를 사용합니다.

```text
https://help-for-study-default-rtdb.firebaseio.com/
```

## Firebase 저장 위치

학습 결과 리포트는 Firebase Realtime Database의 아래 경로에 저장됩니다.

```text
/studyReports
```

## 참고

Firebase Realtime Database 규칙이 쓰기를 허용하지 않으면 저장이 실패할 수 있습니다. 저장에 실패해도 사용자는 리포트 다운로드 기능을 계속 사용할 수 있습니다.
