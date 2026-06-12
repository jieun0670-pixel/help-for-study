# AI PDF Study Helper

PDF 강의자료를 업로드하면 텍스트를 추출하고, 선택한 난이도에 맞춰 17개 학습 문제를 생성한 뒤 채점과 학습 분석 리포트를 제공하는 Next.js 웹앱입니다.

## 주요 기능

- PDF 업로드 및 텍스트 추출
- 난이도 하, 중, 상 선택
- O/X 5개, 객관식 10개, 서술형 2개 자동 생성
- 한 문제씩 풀이하는 카드형 UI
- O/X 및 객관식 자동 채점
- 서술형 AI 채점 API 구조 제공
- OpenAI API 키가 없을 때 샘플 문제 및 키워드 기반 임시 채점
- 총점, 정답 수, 오답 수, 풀이 시간, 취약 개념, 학습 피드백 리포트
- Firebase Realtime Database 저장
- 문제와 리포트 JSON 다운로드
- Vercel 배포 가능 구조

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 환경 변수

`.env.local` 파일을 만들고 필요한 값을 설정할 수 있습니다.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://help-for-study-default-rtdb.firebaseio.com
```

`OPENAI_API_KEY`가 없으면 앱은 PDF에서 추출한 텍스트를 바탕으로 샘플 문제를 생성하고, 서술형은 키워드 포함 여부로 임시 채점합니다.

## Firebase Realtime Database

학습 결과는 다음 경로에 저장됩니다.

```text
studyResults/{reportId}
```

현재 기본 데이터베이스 URL은 다음으로 설정되어 있습니다.

```text
https://help-for-study-default-rtdb.firebaseio.com
```

쓰기 권한이 막혀 있으면 결과 화면에 저장 실패 메시지가 표시됩니다. 실제 서비스에서는 Firebase 보안 규칙과 인증을 함께 구성하는 것을 권장합니다.

## Vercel 배포

1. Git 저장소를 Vercel에 연결합니다.
2. Vercel 프로젝트 환경 변수에 `OPENAI_API_KEY`, `OPENAI_MODEL`, `NEXT_PUBLIC_FIREBASE_DATABASE_URL`을 추가합니다.
3. 기본 빌드 명령은 `npm run build`입니다.

## 문제 데이터 구조

각 문제는 다음 정보를 포함합니다.

- 문제 ID
- 문제 유형
- 문제 내용
- 보기
- 정답
- 해설
- 관련 개념
- 난이도
- 서술형 임시 채점용 키워드

## 점수 계산

- O/X 및 객관식은 각 1점
- 서술형은 각 10점
- 원점수를 합산한 뒤 100점 기준으로 환산합니다.
