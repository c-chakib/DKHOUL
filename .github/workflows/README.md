# DKHOUL CI/CD Pipeline

This document describes the CI/CD setup for the DKHOUL marketplace platform.

## 🚀 Workflows Overview

### 1. Full Stack CI/CD (`ci-cd.yml`)
- **Triggers**: Push to master/main, Pull Requests
- **Security Scanning**: Trivy vulnerability scanning
- **Testing**: Backend & Frontend unit tests with coverage
- **Building**: Production builds for both stacks
- **Docker**: Build and push container images
- **Deployment**: Automated deployment to Railway

### 2. Code Quality (`code-quality.yml`)
- **Triggers**: Pull Requests only
- **Checks**: ESLint, TypeScript, Prettier, Security audit, Bundle size
- **Feedback**: Automated PR comments with results

### 3. Individual Stack Workflows
- `backend.yml`: Backend-specific CI/CD
- `frontend.yml`: Frontend-specific CI/CD

## 🔧 Required Secrets

Add these secrets to your GitHub repository settings:

### Docker Hub
```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
```

### Railway Deployment
```
RAILWAY_TOKEN=your_railway_api_token
```

### Code Coverage (Optional)
```
CODECOV_TOKEN=your_codecov_token
```

## 📋 Workflow Features

### Security & Quality
- ✅ Automated dependency vulnerability scanning
- ✅ Security audit for npm packages
- ✅ Code linting and formatting checks
- ✅ TypeScript compilation verification
- ✅ Bundle size monitoring

### Testing & Coverage
- ✅ Backend: Jest test suite with coverage
- ✅ Frontend: Jasmine/Karma test suite with coverage
- ✅ Codecov integration for coverage reporting

### Deployment
- ✅ Docker image building and pushing
- ✅ Automated deployment to Railway
- ✅ Health checks and deployment notifications
- ✅ Rollback capabilities (via Railway)

### Automation
- ✅ Dependabot for automatic dependency updates
- ✅ Weekly dependency updates
- ✅ Automated PR reviews and comments

## 🏃‍♂️ Local Development

The CI/CD pipeline ensures that:
- All tests pass before deployment
- Code quality standards are maintained
- Security vulnerabilities are caught early
- Production builds are optimized

## 📊 Monitoring

- **Test Results**: Available in GitHub Actions
- **Coverage Reports**: Uploaded to Codecov
- **Security Scans**: Available in Security tab
- **Bundle Sizes**: Monitored via bundlesize

## 🚨 Troubleshooting

### Common Issues

1. **Docker Build Fails**
   - Check Dockerfile syntax
   - Verify build context paths

2. **Tests Fail in CI**
   - Ensure test environment variables are set
   - Check for missing dependencies

3. **Deployment Fails**
   - Verify Railway token permissions
   - Check Railway project configuration

### Manual Triggers

You can manually trigger workflows from the Actions tab or use these commands:

```bash
# Trigger full CI/CD
gh workflow run ci-cd.yml

# Trigger code quality check
gh workflow run code-quality.yml
```

## 🔄 Branch Protection

Consider setting up branch protection rules:

1. Go to Settings → Branches
2. Add rule for `master`/`main` branch
3. Require status checks to pass:
   - `test` (backend-test, frontend-test)
   - `security-scan`
   - `code-quality`

This ensures no code is merged without passing all quality gates.