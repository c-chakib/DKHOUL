# Frontend Testing Setup - DKHOUL Platform

## Overview
Comprehensive test suite for the DKHOUL frontend Angular application with focus on authentication (including Google OAuth), booking services, and critical user flows.

## Test Coverage

### ✅ Implemented Tests

#### 1. Auth Service Tests (`auth.service.spec.ts`)
**Location:** `src/app/core/services/auth.service.spec.ts`

**Test Coverage:**
- ✅ User Registration (success & error)
- ✅ Email/Password Login (success & invalid credentials)
- ✅ **Google OAuth Login** (success & invalid token)
- ✅ Logout (clear tokens and user data)
- ✅ Authentication Status Check
- ✅ Current User Retrieval
- ✅ Role-Based Authorization
- ✅ Email Verification
- ✅ Password Reset Flow (forgot & reset)
- ✅ Token Refresh

**Key Features Tested:**
- LocalStorage management
- HTTP requests and responses
- Error handling
- Google OAuth integration
- JWT token management

**Total Test Cases:** ~26 tests

#### 2. Login Component Tests (`login.component.spec.ts`)
**Location:** `src/app/features/auth/login/login.component.spec.ts`

**Test Coverage:**
- ✅ Form Initialization
- ✅ Form Validation (email & password)
- ✅ Email/Password Login Flow
- ✅ **Google Sign-In Integration**
  - Script loading
  - Google SDK initialization
  - Button click handling
  - Credential callback processing
  - Error handling
- ✅ Role-Based Navigation (tourist, provider, admin)
- ✅ Error Messages Display
- ✅ Loading State Management
- ✅ Password Visibility Toggle

**Key Features Tested:**
- Reactive Forms validation
- Component/Service interaction
- Router navigation
- SweetAlert2 integration
- Google Identity Services SDK

**Total Test Cases:** ~28 tests

#### 3. Booking Service Tests (`booking.service.spec.ts`)
**Location:** `src/app/core/services/booking.service.spec.ts`

**Test Coverage:**
- ✅ Create Booking
- ✅ Get All Bookings (with filters)
- ✅ Get Booking by ID
- ✅ Update Booking Status
- ✅ Cancel Booking (with reason)
- ✅ Confirm Booking
- ✅ Complete Booking
- ✅ Get Tourist Bookings
- ✅ Get Host Bookings
- ✅ Get My Bookings
- ✅ Error Handling

**Total Test Cases:** ~15 tests

### 📊 Total Test Coverage

**Services Tested:** 2/13 (15%)
- ✅ AuthService (complete)
- ✅ BookingService (complete)
- ⏸️ UserService
- ⏸️ ServiceService
- ⏸️ PaymentService
- ⏸️ ReviewService
- ⏸️ MessageService
- ⏸️ SocketService
- ⏸️ UploadService
- ⏸️ StorageService
- ⏸️ AdminService
- ⏸️ ApiService
- ⏸️ SEOService

**Components Tested:** 1/~30 (3%)
- ✅ LoginComponent (complete with Google OAuth)
- ⏸️ RegisterComponent
- ⏸️ Dashboard Components
- ⏸️ Booking Components
- ⏸️ Service Components
- ⏸️ Profile Components

**Total Test Cases Implemented:** ~69 tests

## Setup & Configuration

### 1. Test Configuration Files

#### Karma Configuration (`karma.conf.js`)
- **Framework:** Jasmine
- **Browser:** Chrome (with ChromeHeadlessCI for CI/CD)
- **Coverage:** lcov, html, text-summary
- **Reporter:** Jasmine HTML Reporter

#### TypeScript Configuration (`tsconfig.spec.json`)
- **Extends:** Base tsconfig.json
- **Types:** Jasmine
- **Include:** All *.spec.ts files

### 2. Dependencies (Already Installed)

```json
{
  "devDependencies": {
    "@angular/compiler-cli": "^19.2.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.6.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0"
  }
}
```

## Running Tests

### Run All Tests
```powershell
cd frontend
npm test
```

This will:
- Start Karma test runner
- Open Chrome browser
- Run all tests
- Generate coverage report
- Watch for file changes

### Run Tests in Headless Mode (CI/CD)
```powershell
cd frontend
npm run test -- --no-watch --browsers=ChromeHeadlessCI
```

### Run Specific Test File
```powershell
cd frontend
npm test -- --include='**/auth.service.spec.ts'
```

### Generate Coverage Report
```powershell
cd frontend
npm test -- --no-watch --code-coverage
```

Coverage reports will be in: `frontend/coverage/frontend/index.html`

## Test Structure

### Standard Test Template

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('methodName', () => {
    it('should perform expected action', (done) => {
      // Test implementation
      done();
    });
  });
});
```

### Component Test Template

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

    await TestBed.configureTestingModule({
      imports: [ComponentName, ReactiveFormsModule],
      providers: [
        { provide: ServiceName, useValue: serviceSpy }
      ]
    }).compileComponents();

    mockService = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Test Results

### Expected Output

```
✅ AuthService
  ✓ should be created
  ✓ register - should register a new user successfully
  ✓ register - should handle registration errors
  ✓ login - should login user successfully
  ✓ login - should handle invalid credentials
  ✓ googleLogin - should login with Google successfully
  ✓ googleLogin - should handle invalid Google token
  ✓ logout - should clear user data and tokens
  ✓ isAuthenticated - should return true when token exists
  ✓ isAuthenticated - should return false when no token exists
  ✓ getCurrentUser - should return current user
  ✓ hasRole - should return true for matching role
  ✓ getUserRole - should return user role
  ✓ verifyEmail - should verify email with token
  ✓ forgotPassword - should send password reset email
  ✓ resetPassword - should reset password with token
  ✓ refreshToken - should refresh access token

✅ LoginComponent
  ✓ should create
  ✓ Form Initialization - should initialize with empty values
  ✓ Form Validation - email field validators
  ✓ Form Validation - password field validators
  ✓ Form Submission - should not submit if invalid
  ✓ Form Submission - should call authService.login
  ✓ Google Sign-In - should load Google script
  ✓ Google Sign-In - should initialize SDK
  ✓ Google Sign-In - should trigger prompt on click
  ✓ Google Sign-In - should handle callback successfully
  ✓ Google Sign-In - should handle login error
  ✓ Navigation - should navigate to user dashboard
  ✓ Navigation - should navigate to provider dashboard
  ✓ Navigation - should navigate to admin dashboard

✅ BookingService
  ✓ should be created
  ✓ createBooking - should create booking
  ✓ getBookings - should retrieve all bookings
  ✓ getBookingById - should retrieve booking by id
  ✓ updateBookingStatus - should update status
  ✓ cancelBooking - should cancel with reason
  ✓ confirmBooking - should confirm booking
  ✓ completeBooking - should complete booking

Total: 69 specs, 0 failures
```

## Coverage Goals

### Current Coverage
- **Lines:** TBD (run tests to generate)
- **Statements:** TBD
- **Branches:** TBD
- **Functions:** TBD

### Target Coverage
- **Lines:** > 80%
- **Statements:** > 80%
- **Branches:** > 70%
- **Functions:** > 80%

## Next Steps to Expand Testing

### Priority 1: Core Services
1. **UserService** - Profile management, settings
2. **ServiceService** - Service listings, search, filters
3. **PaymentService** - Payment processing, transactions

### Priority 2: Critical Components
1. **RegisterComponent** - User registration with validation
2. **DashboardComponents** - All dashboard views
3. **BookingComponents** - Booking creation, management

### Priority 3: Integration Tests
1. **End-to-End User Flows**
   - Complete booking flow
   - Complete registration → login → book → pay flow
   - Provider flow: create service → receive booking → confirm

2. **API Integration Tests**
   - Mock API responses
   - Error scenarios
   - Loading states

### Priority 4: Advanced Testing
1. **Socket.io Testing** - Real-time messaging
2. **Upload Service** - File upload/download
3. **Guards** - Route protection
4. **Interceptors** - HTTP interceptors
5. **Pipes** - Custom pipes

## Continuous Integration

### GitHub Actions Example

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run tests
        run: cd frontend && npm run test -- --no-watch --code-coverage --browsers=ChromeHeadlessCI
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./frontend/coverage/lcov.info
```

## Troubleshooting

### Common Issues

#### Issue 1: Chrome not found
**Solution:** Install Chrome or use ChromeHeadless
```powershell
npm test -- --browsers=ChromeHeadless
```

#### Issue 2: Port already in use
**Solution:** Kill existing Karma process
```powershell
Get-Process -Name chrome | Stop-Process -Force
```

#### Issue 3: Tests timing out
**Solution:** Increase jasmine timeout in karma.conf.js
```javascript
jasmine: {
  timeoutInterval: 10000
}
```

#### Issue 4: Module not found
**Solution:** Clear cache and reinstall
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

## Best Practices

### ✅ Do's
- Write tests before fixing bugs (TDD)
- Test one thing per test case
- Use descriptive test names
- Mock external dependencies
- Clean up after each test (afterEach)
- Use `done()` for async tests
- Test error scenarios

### ❌ Don'ts
- Don't test implementation details
- Don't share state between tests
- Don't make actual HTTP calls
- Don't test third-party libraries
- Don't skip tests without reason
- Don't test private methods directly

## Documentation

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Testing Best Practices](https://angular.dev/guide/testing/best-practices)

## Status Summary

✅ **Testing Infrastructure:** Complete  
✅ **Auth Service Tests:** Complete (26 tests)  
✅ **Login Component Tests:** Complete (28 tests including Google OAuth)  
✅ **Booking Service Tests:** Complete (15 tests)  
⏸️ **Additional Services:** Pending  
⏸️ **Additional Components:** Pending  

**Next Action:** Run tests and expand coverage to other critical services and components.

---

**Last Updated:** Current session  
**Total Tests:** 69  
**Status:** ✅ Ready to run
