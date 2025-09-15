# 🍌 In-Banana

AI 기반 이미지 편집 및 합성 도구

## 📖 소개

In-Banana는 Google의 Gemini AI를 활용한 혁신적인 이미지 편집 웹 애플리케이션입니다. 메인 이미지에 다양한 요소들(표정, 제스처, 액션, 오브젝트, 스타일, 위치)을 추가하여 창의적이고 독특한 이미지를 생성할 수 있습니다.

## ✨ 주요 기능

- **AI 기반 이미지 합성**: Gemini AI를 활용한 자연스러운 이미지 합성
- **다양한 요소 추가**: 표정, 제스처, 액션, 오브젝트, 스타일, 위치 등 6가지 카테고리의 요소 지원
- **텍스트 프롬프트**: 추가적인 스타일 지시사항을 텍스트로 입력 가능
- **다양한 비율 지원**: 1:1, 3:4, 9:16, 9:22 등 다양한 화면 비율 지원
- **인스타그램 공유**: 생성된 이미지를 인스타그램으로 바로 공유
- **갤러리 기능**: 생성한 이미지들을 로컬 저장소에 보관 및 관리
- **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **AI 서비스**: Google Gemini API
- **스타일링**: Tailwind CSS (클래스 기반)
- **상태 관리**: React Hooks
- **로컬 저장소**: localStorage

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js (최신 LTS 버전 권장)
- Gemini API 키

### 설치 방법

1. 저장소 클론
```bash
git clone [repository-url]
cd In-Banana
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 Gemini API 키를 설정합니다:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:5173` 접속

## 📱 사용 방법

1. **메인 이미지 업로드**: 편집하고 싶은 기본 이미지를 업로드합니다.

2. **요소 이미지 추가**: 6가지 카테고리 중 원하는 요소의 이미지를 추가합니다:
   - Expression (표정)
   - Gesture (제스처) 
   - Action (액션)
   - Object (오브젝트)
   - Style (스타일)
   - Location (위치)

3. **텍스트 프롬프트 입력**: 추가적인 스타일이나 지시사항을 텍스트로 입력할 수 있습니다.

4. **이미지 생성**: "Generate Image" 버튼을 클릭하여 AI가 합성한 새로운 이미지를 생성합니다.

5. **결과 활용**: 
   - 인스타그램에 바로 공유
   - 이미지 다운로드
   - 다양한 비율로 크롭
   - 갤러리에서 이전 작업물 확인

## 🏗 프로젝트 구조

```
In-Banana/
├── components/           # React 컴포넌트
│   ├── icons/           # 아이콘 컴포넌트
│   ├── ActionButton.tsx # 액션 버튼
│   ├── Gallery.tsx      # 갤러리 컴포넌트
│   ├── ImageEditorToolbar.tsx # 이미지 편집 도구바
│   ├── ImageUploader.tsx # 이미지 업로더
│   └── Logo.tsx         # 로고 컴포넌트
├── services/            # 외부 서비스 연동
│   └── geminiService.ts # Gemini API 서비스
├── utils/               # 유틸리티 함수
│   └── fileUtils.ts     # 파일 처리 유틸리티
├── App.tsx              # 메인 앱 컴포넌트
├── types.ts             # TypeScript 타입 정의
└── index.tsx            # 앱 진입점
```

## 🔧 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

