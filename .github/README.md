# CI/CD Pipeline Documentation

This document describes the comprehensive CI/CD pipeline setup for the Integral-X monorepo.

## Workflow Overview

Our CI/CD pipeline consists of 5 main workflows that ensure code quality, security, performance, and reliable deployments:

### 1. **PR Checks** (`.github/workflows/pr.yml`)

**Trigger**: Pull requests to `main` branch

**Purpose**: Validates all changes before they're merged

**Steps**:

- ✅ Code formatting validation (`yarn spotless:check`)
- ✅ Linting all projects (`yarn lint:all`)
- ✅ Testing all projects including validation tests (`yarn test:all`)
- ✅ Building all projects (`yarn build:all`)
- ✅ Docker build validation

### 2. **Main Checks** (`.github/workflows/main.yml`)

**Trigger**: Pushes to `main` branch

**Purpose**: Docker image validation on the main branch

**Features**:

- **Docker builds** with multi-platform support (amd64/arm64)
- **GitHub Actions caching** for improved performance

### 3. **Deploy** (`.github/workflows/deploy.yml`)

**Trigger**: Pushes to `main` branch

**Purpose**: Automated deployment pipeline

**Features**:

- **Container registry** integration (GitHub Container Registry)
- **Automatic tagging** with semantic versioning
- **Multi-platform builds** (linux/amd64, linux/arm64)

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

**Purpose**: Continuous performance monitoring

**Features**:

- **Load testing** with k6
- **Performance thresholds** (95% < 500ms, error rate < 10%)
- **Full stack testing** with Docker Compose
- **Performance reports** and artifacts
- **PR comments** with performance results

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

- ✅ Docker multi-platform builds

### Release Quality Gate

Releases require:

- ✅ All main branch quality gates
- ✅ Performance tests pass
