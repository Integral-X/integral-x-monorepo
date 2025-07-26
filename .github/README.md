# CI/CD Pipeline Documentation

This document describes the comprehensive CI/CD pipeline setup for the Integral-X monorepo.

## Workflow Overview

Our CI/CD pipeline consists of 6 main workflows that ensure code quality, security, performance, and reliable deployments:

### 1. **PR Checks** (`.github/workflows/pr.yml`)

**Trigger**: Pull requests to `main` branch

**Purpose**: Validates all changes before they're merged

**Steps**:

- ✅ Code formatting validation (`yarn spotless:check`)
- ✅ Linting all projects (`npx nx run-many --target=lint --all`)
- ✅ Testing all projects including validation tests (`npx nx run-many --target=test --all`)
- ✅ Building all projects (`npx nx run-many --target=build --all`)
- ✅ Nx affected analysis (optimization for large repos)
- ✅ Docker build validation
- ✅ Quality gate check

### 2. **Main Checks** (`.github/workflows/main.yml`)

**Trigger**: Pushes to `main` branch

**Purpose**: Comprehensive validation on the main branch with multi-version testing

**Features**:

- **Matrix builds** on Node.js 18.x and 20.x
- **Code coverage** upload to Codecov
- **Docker builds** with multi-platform support (amd64/arm64)
- **Security scanning** with Trivy
- **GitHub Actions caching** for improved performance

### 3. **Deploy** (`.github/workflows/deploy.yml`)

**Trigger**:

- Pushes to `main` (staging)
- Tags starting with `v*` (production)
- Manual workflow dispatch

**Purpose**: Automated deployment pipeline

**Features**:

- **Container registry** integration (GitHub Container Registry)
- **Automatic tagging** with semantic versioning
- **Multi-platform builds** (linux/amd64, linux/arm64)
- **Environment-specific deployments** (staging/production)
- **Deployment notifications**

### 4. **Release** (`.github/workflows/release.yml`)

**Trigger**:

- Pushes to `main` (auto-release)
- Manual workflow dispatch with version type selection

**Purpose**: Automated semantic versioning and release management

**Features**:

- **Automatic changelog** generation using conventional commits
- **Semantic versioning** (patch/minor/major)
- **Multi-package version updates** (all apps and libs)
- **GitHub releases** with Docker image references
- **Git tagging** and version commits

### 5. **Performance Tests** (`.github/workflows/performance.yml`)

**Trigger**:

- Daily schedule (2 AM UTC)
- Pushes to `main` affecting apps/libs
- Manual workflow dispatch

**Purpose**: Continuous performance monitoring

**Features**:

- **Load testing** with k6
- **Performance thresholds** (95% < 500ms, error rate < 10%)
- **Full stack testing** with Docker Compose
- **Performance reports** and artifacts
- **PR comments** with performance results

### 6. **Code Quality & Security** (`.github/workflows/code-quality.yml`)

**Trigger**:

- Pushes to `main`
- Pull requests
- Weekly schedule (Mondays 6 AM UTC)

**Purpose**: Comprehensive code quality and security analysis

**Features**:

- **ESLint** detailed reporting for code quality
- **CodeQL** analysis for security vulnerabilities (free GitHub feature)
- **Code complexity analysis** with complexity-report
- **Dependency scanning** with npm audit and yarn audit
- **Docker security scanning** with Trivy (free)
- **Security pattern detection** for common vulnerabilities
- **License compliance** checking

## 📊 Quality Gates

### PR Quality Gate

All PRs must pass:

- ✅ Code formatting check
- ✅ All linting rules
- ✅ All tests (including validation tests)
- ✅ Successful build
- ✅ Docker build validation

### Main Branch Quality Gate

Main branch deployments require:

- ✅ All PR quality gates
- ✅ Security scan passes
- ✅ Docker multi-platform builds

### Release Quality Gate

Releases require:

- ✅ All main branch quality gates
- ✅ Performance tests pass
- ✅ Code quality thresholds met
- ✅ No high-severity security vulnerabilities

## 🚀 Deployment Strategy

### Staging Environment

- **Trigger**: Every push to `main`
- **Purpose**: Integration testing and validation
- **Features**: Full stack deployment with all services

### Production Environment

- **Trigger**: Git tags starting with `v*` or manual dispatch
- **Purpose**: Live production deployment
- **Features**: Blue-green deployment with rollback capability

## 📈 Monitoring & Observability

### Performance Monitoring

- **Daily performance tests** with k6
- **Response time thresholds**: 95% < 500ms
- **Error rate thresholds**: < 10%
- **Load testing**: Up to 20 concurrent users

### Security Monitoring

- **Weekly security scans** for dependencies and containers
- **Real-time vulnerability alerts** via GitHub Security tab
- **License compliance** monitoring
- **Code quality metrics** via ESLint and complexity analysis
- **Security pattern detection** for common vulnerabilities

### Build Monitoring

- **Build time tracking** across all projects
- **Cache hit rates** for optimization
- **Multi-platform build success** rates
- **Deployment success** tracking
