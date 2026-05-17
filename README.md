# DayGrid

DayGrid 스타일의 일정 관리 웹앱. 세로 시간축 + 수평 이벤트 블록 타임라인, 드래그로 일정 생성, Google Calendar 연동을 지원합니다.

## 시작하기

```bash
npm install
npm run dev
```

## Google Calendar 연동

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. Google Calendar API 활성화
3. OAuth 2.0 클라이언트 ID 발급 (redirect URI: `http://localhost:5173`)
4. `.env.local.example` → `.env.local` 복사 후 클라이언트 ID 입력

```bash
cp .env.local.example .env.local
# .env.local 파일에 VITE_GOOGLE_CLIENT_ID 입력
```

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand (상태 관리 + localStorage 저장)
- date-fns
- vite-plugin-pwa (PWA 지원)
- @react-oauth/google (Google Calendar 연동)

## 주요 기능

- 세로 시간축(6:00~24:00) 수평 이벤트 블록 타임라인
- 드래그로 일정 생성 (마우스/터치 통합)
- 8가지 색상 카테고리 (이름/색상 커스텀)
- 현재 시간 빨간 라인 표시
- 포커스 타이머 (카운트다운)
- Google Calendar 읽기 연동
- PWA (모바일 홈 화면 추가 가능)
