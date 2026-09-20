# Photo Relay Frontend

AI가 사진을 분석하고 다음 사진 주제를 만들어주는 사진 릴레이 서비스의 프론트엔드입니다.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · React Router · TanStack Query · Axios · Lucide React · ESLint · Prettier · pnpm

## Start

Node.js 22+ 및 pnpm을 권장합니다.

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

## Commands

```bash
pnpm dev
pnpm lint
pnpm format
pnpm format:check
pnpm build
pnpm preview
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_BASE_URL=ws://localhost:3000
```

개발 모드에서 `VITE_API_BASE_URL`을 생략하면 `http://localhost:3000`을 사용합니다.
배포 빌드에서 생략하면 현재 frontend origin의 `/api`를 사용합니다.

카카오 OAuth callback은 backend가 처리합니다. 로컬 backend 환경에는 아래 값이 서로
일치하도록 설정되어야 합니다.

```env
FRONTEND_URL=http://localhost:5173
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback
```

Kakao Developers에도 동일한 `KAKAO_REDIRECT_URI`를 등록해야 합니다. 로그인 완료 후
backend가 기존 회원은 `/`, 신규 회원은 `/signup`으로 이동시킵니다.

운영 값은 GitHub Actions 환경에서 주입합니다.

## Project Structure

```text
src/
├── api/          # Axios client / API functions
├── assets/       # Static assets
├── components/   # Reusable UI
├── hooks/        # Custom hooks
├── pages/        # Route-level pages
├── router/       # React Router
├── types/        # Domain types
└── utils/        # Utilities
```

백엔드 endpoint는 `src/api/endpoints.ts`에서 도메인별로 관리합니다. 실제 backend-test DTO 또는 URL이 달라지면 이 파일과 `src/types`의 타입을 함께 맞춰주세요.

## CI/CD

`.github/workflows/ci.yml`은 PR 또는 `main`/`develop` push 시 install → lint → format check → build를 수행합니다.

`.github/workflows/cd.yml`은 `main` 배포용 골격이며, AWS IAM Role/S3/CloudFront 정보를 확정한 후 주석 처리된 AWS 단계를 활성화합니다.

S3 + CloudFront로 SPA를 배포할 경우 `/relay`, `/result` 같은 직접 URL 접근을 위해 CloudFront의 403/404 fallback을 `/index.html`로 설정해야 합니다.
