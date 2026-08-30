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
```

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

현재 백엔드 Swagger에는 사진 릴레이 API가 확정되어 있지 않으므로 `src/api/relay.ts`의 endpoint는 실제 명세가 나오면 교체합니다.

## CI/CD

`.github/workflows/ci.yml`은 PR 또는 `main`/`develop` push 시 install → lint → format check → build를 수행합니다.

`.github/workflows/cd.yml`은 `main` 배포용 골격이며, AWS IAM Role/S3/CloudFront 정보를 확정한 후 주석 처리된 AWS 단계를 활성화합니다.

S3 + CloudFront로 SPA를 배포할 경우 `/relay`, `/result` 같은 직접 URL 접근을 위해 CloudFront의 403/404 fallback을 `/index.html`로 설정해야 합니다.
