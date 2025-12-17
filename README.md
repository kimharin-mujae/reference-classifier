# 레퍼런스 자동 분류 도우미

디자이너가 UI/UX 레퍼런스 이미지를 업로드하면 Claude가 자동으로 분류하고, 사용자가 수정한 뒤 Notion DB에 저장하는 웹앱입니다.

## 시작하기

### 1. Node.js 설치

Node.js LTS 버전을 설치하세요: https://nodejs.org

### 2. 의존성 설치

```bash
cd reference-classifier
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 열고 API 키를 입력하세요:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

#### Anthropic API 키 발급
1. https://console.anthropic.com 접속
2. API Keys 메뉴에서 새 키 생성

#### Notion 설정
1. https://www.notion.so/my-integrations 에서 새 integration 생성
2. API 키 복사
3. Notion에서 데이터베이스 생성 (필수 필드):
   - Name (Title)
   - Type (Select): Hero, Card, Button, Layout, Form, Navigation, Other
   - Platform (Select): Web, App
   - Memo (Rich Text)
   - Image (Files)
   - Created (Created Time)
4. 데이터베이스를 integration에 연결 (Share 버튼)
5. 데이터베이스 ID 복사 (URL의 database_id 부분)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어주세요.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Claude API (claude-sonnet-4-5-20250929)
- Notion API

## 프로젝트 구조

```
/app
  /page.tsx              # 메인 페이지
  /layout.tsx            # 레이아웃
  /globals.css           # 글로벌 스타일
  /api
    /analyze/route.ts    # Claude 이미지 분석 API
    /save/route.ts       # Notion 저장 API
/lib
  /types.ts              # TypeScript 타입 정의
  /claude.ts             # Claude API 래퍼
  /notion.ts             # Notion API 래퍼
/components
  /ImageUploader.tsx     # 이미지 업로드 컴포넌트
  /ResultEditor.tsx      # 분석 결과 수정 폼
```

## 사용 방법

1. 이미지를 드래그 앤 드롭하거나 클릭하여 업로드
2. Claude가 자동으로 이미지를 분석하여 분류 결과 표시
3. 필요시 결과를 수정
4. "Notion에 저장" 버튼을 클릭하여 저장

## 지원 이미지 형식

- JPG
- PNG
- WEBP
