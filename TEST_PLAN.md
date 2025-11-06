# 🧪 DKHOUL PROJECT - COMPREHENSIVE TEST PLAN

> **Status**: Testing Framework Setup Required  
> **Last Updated**: November 4, 2025  
> **Priority**: Critical - Production Readiness

---

## 📋 TABLE OF CONTENTS

1. [Testing Overview](#testing-overview)
2. [Backend Tests (Jest)](#backend-tests-jest)
3. [Frontend Tests (Karma/Jasmine)](#frontend-tests-karmajas mine)
4. [E2E Tests (Cypress)](#e2e-tests-cypress)
5. [Manual Test Checklist](#manual-test-checklist)
6. [Test Execution Order](#test-execution-order)
7. [Known Issues & Fixes](#known-issues--fixes)

---

## 🎯 TESTING OVERVIEW

### Test Coverage Goals
- **Backend**: 80% code coverage (Jest)
- **Frontend**: 75% code coverage (Karma/Jasmine)
- **E2E**: Critical user flows (Cypress)
- **Manual**: UI/UX validation

### Technology Stack
```
Backend:  Jest + Supertest
Frontend: Karma + Jasmine + Angular Testing Library
E2E:      Cypress
API:      Postman/Thunder Client
```

---

## 🔧 BACKEND TESTS (Jest)

### Setup Instructions
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
npx jest --init
```

### Test Structure
```
backend/
├── src/
│   ├── __tests__/
│   │   ├── controllers/
│   │   │   ├── auth.controller.test.ts
│   │   │   ├── service.controller.test.ts
│   │   │   ├── booking.controller.test.ts
│   │   │   ├── review.controller.test.ts
│   │   │   └── payment.controller.test.ts
│   │   ├── services/
│   │   │   ├── auth.service.test.ts
│   │   │   ├── email.service.test.ts
│   │   │   └── upload.service.test.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.test.ts
│   │   │   └── validation.middleware.test.ts
│   │   └── utils/
│   │       ├── jwt.util.test.ts
│   │       └── validators.test.ts
│   └── jest.config.js
```

---

### 1. AUTHENTICATION TESTS

#### Test File: `auth.controller.test.ts`
```typescript
describe('Authentication Controller', () => {
  
  describe('POST /api/auth/register', () => {
    test('✅ Should register new user with valid data', async () => {
      // Test successful registration
    });
    
    test('❌ Should reject registration with duplicate email', async () => {
      // Test duplicate email error
    });
    
    test('❌ Should reject registration with weak password', async () => {
      // Test password validation
    });
    
    test('❌ Should reject registration with missing fields', async () => {
      // Test required fields
    });
  });

  describe('POST /api/auth/login', () => {
    test('✅ Should login with correct credentials', async () => {
      // Test successful login
      // Verify accessToken and refreshToken returned
    });
    
    test('❌ Should reject login with wrong password', async () => {
      // Test invalid password
    });
    
    test('❌ Should reject login with non-existent email', async () => {
      // Test invalid email
    });
    
    test('❌ Should reject login for inactive account', async () => {
      // Test isActive = false
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('✅ Should refresh token with valid refreshToken', async () => {
      // Test token refresh
    });
    
    test('❌ Should reject refresh with invalid token', async () => {
      // Test invalid refresh token
    });
  });

  describe('GET /api/auth/verify-email/:token', () => {
    test('✅ Should verify email with valid token', async () => {
      // Test email verification
    });
    
    test('❌ Should reject expired verification token', async () => {
      // Test expired token
    });
  });
});
```

#### Priority: **CRITICAL** 🔴  
**Why**: Auth blocks all protected routes  
**Estimated Time**: 2 hours

---

### 2. SERVICE TESTS

#### Test File: `service.controller.test.ts`
```typescript
describe('Service Controller', () => {
  
  describe('GET /api/services', () => {
    test('✅ Should return all active services', async () => {
      // Test service listing (should return 60 seeded services)
    });
    
    test('✅ Should filter services by category', async () => {
      // Test category filter (Space, Skills, Connect)
    });
    
    test('✅ Should filter services by city', async () => {
      // Test city filter (Casablanca, Marrakech, Fès)
    });
    
    test('✅ Should filter services by price range', async () => {
      // Test minPrice and maxPrice
    });
    
    test('✅ Should paginate results correctly', async () => {
      // Test pagination with page & limit
    });
    
    test('✅ Should populate hostId field correctly', async () => {
      // FIXED: Now uses hostId instead of provider
    });
  });

  describe('GET /api/services/:id', () => {
    test('✅ Should return service details', async () => {
      // Test single service retrieval
    });
    
    test('❌ Should return 404 for invalid service ID', async () => {
      // Test non-existent service
    });
  });

  describe('POST /api/services (Protected)', () => {
    test('✅ Should create service for authenticated host', async () => {
      // Test service creation
      // Verify hostId is set to current user
    });
    
    test('❌ Should reject creation without auth token', async () => {
      // Test 401 Unauthorized
    });
    
    test('❌ Should reject creation with invalid data', async () => {
      // Test validation errors
    });
  });

  describe('PUT /api/services/:id (Protected)', () => {
    test('✅ Should update own service', async () => {
      // Test service update
    });
    
    test('❌ Should reject update of another host's service', async () => {
      // Test 403 Forbidden
    });
  });

  describe('DELETE /api/services/:id (Protected)', () => {
    test('✅ Should delete own service', async () => {
      // Test service deletion
    });
    
    test('✅ Should allow admin to delete any service', async () => {
      // Test admin privilege
    });
    
    test('❌ Should reject deletion of another host's service', async () => {
      // Test 403 Forbidden
    });
  });
});
```

#### Priority: **CRITICAL** 🔴  
**Why**: Core business functionality  
**Estimated Time**: 3 hours  
**Fixed Issues**:
- ✅ Changed `provider` → `hostId` in all populate() calls
- ✅ Removed non-existent `isAvailable` field
- ✅ Fixed populate to use `profile.firstName` instead of `firstName`

---

### 3. BOOKING TESTS

#### Test File: `booking.controller.test.ts`
```typescript
describe('Booking Controller', () => {
  
  describe('POST /api/bookings (Protected)', () => {
    test('✅ Should create booking for available service', async () => {
      // Test booking creation
      // Verify touristId, hostId, serviceId are set correctly
    });
    
    test('❌ Should prevent booking own service', async () => {
      // Test self-booking prevention
    });
    
    test('❌ Should reject booking for inactive service', async () => {
      // Test service status validation
    });
    
    test('❌ Should reject booking without auth token', async () => {
      // Test 401 Unauthorized
    });
  });

  describe('GET /api/bookings/my (Protected)', () => {
    test('✅ Should return user's bookings', async () => {
      // Test booking list for tourist
    });
    
    test('✅ Should populate serviceId and hostId correctly', async () => {
      // FIXED: Now uses touristId, hostId, serviceId
    });
    
    test('❌ Should reject request without auth token', async () => {
      // Test 401 Unauthorized
    });
  });

  describe('GET /api/bookings/:id (Protected)', () => {
    test('✅ Should return booking details for tourist', async () => {
      // Test tourist viewing their booking
    });
    
    test('✅ Should return booking details for host', async () => {
      // Test host viewing booking for their service
    });
    
    test('❌ Should reject access for other users', async () => {
      // Test 403 Forbidden
    });
  });

  describe('PATCH /api/bookings/:id/status (Host Protected)', () => {
    test('✅ Should allow host to confirm booking', async () => {
      // Test status update pending → confirmed
    });
    
    test('✅ Should allow host to reject booking', async () => {
      // Test status update pending → rejected
    });
    
    test('❌ Should prevent tourist from changing status', async () => {
      // Test 403 Forbidden
    });
  });

  describe('POST /api/bookings/:id/cancel (Protected)', () => {
    test('✅ Should allow tourist to cancel within deadline', async () => {
      // Test cancellation > 24h before booking
    });
    
    test('❌ Should prevent cancellation within 24 hours', async () => {
      // Test cancellation deadline
    });
    
    test('❌ Should prevent cancellation of completed booking', async () => {
      // Test status validation
    });
  });
});
```

#### Priority: **HIGH** 🟠  
**Why**: Revenue-generating functionality  
**Estimated Time**: 3 hours  
**Fixed Issues**:
- ✅ Changed `user` → `touristId` in all queries
- ✅ Changed `service.provider` → `service.hostId`
- ✅ Fixed booking creation to use correct field names
- ✅ Removed non-existent `startDate`/`endDate` (uses `bookingDate`)

---

### 4. REVIEW TESTS

#### Test File: `review.controller.test.ts`
```typescript
describe('Review Controller', () => {
  
  describe('POST /api/reviews (Protected)', () => {
    test('✅ Should create guest review for completed booking', async () => {
      // Test tourist reviewing host
    });
    
    test('✅ Should create host review for completed booking', async () => {
      // Test host reviewing tourist
    });
    
    test('❌ Should prevent duplicate reviews', async () => {
      // Test review uniqueness
    });
    
    test('❌ Should prevent review of non-completed booking', async () => {
      // Test status validation
    });
  });

  describe('GET /api/reviews/service/:serviceId', () => {
    test('✅ Should return all reviews for service', async () => {
      // Test review listing
    });
    
    test('✅ Should populate reviewerId correctly', async () => {
      // FIXED: Now uses reviewerId instead of reviewer
    });
  });

  describe('PUT /api/reviews/:id (Protected)', () => {
    test('✅ Should allow reviewer to edit their review', async () => {
      // Test review update
    });
    
    test('❌ Should prevent editing after expiry period', async () => {
      // Test expiresAt validation
    });
  });

  describe('POST /api/reviews/:id/respond (Host Protected)', () => {
    test('✅ Should allow host to respond to review', async () => {
      // Test host response
    });
    
    test('❌ Should prevent duplicate responses', async () => {
      // Test response uniqueness
    });
  });
});
```

#### Priority: **MEDIUM** 🟡  
**Why**: Trust & reputation system  
**Estimated Time**: 2 hours  
**Fixed Issues**:
- ✅ Changed `reviewer` → `reviewerId`
- ✅ Changed `service` → `serviceId`
- ✅ Changed `hostResponse` → `response`
- ✅ Fixed `booking.user` → `booking.touristId`

---

### 5. PAYMENT TESTS

#### Test File: `payment.controller.test.ts`
```typescript
describe('Payment Controller', () => {
  
  describe('POST /api/payments/init (Protected)', () => {
    test('✅ Should initialize payment for confirmed booking', async () => {
      // Test payment initialization
    });
    
    test('❌ Should prevent payment for non-existent booking', async () => {
      // Test booking validation
    });
  });

  describe('POST /api/payments/webhook', () => {
    test('✅ Should process successful payment', async () => {
      // Test Stripe webhook handling
    });
    
    test('✅ Should handle failed payment', async () => {
      // Test payment failure
    });
  });

  describe('POST /api/payments/refund (Protected)', () => {
    test('✅ Should process refund for cancelled booking', async () => {
      // Test refund processing
    });
  });
});
```

#### Priority: **CRITICAL** 🔴  
**Why**: Revenue & financial transactions  
**Estimated Time**: 2 hours

---

### 6. MIDDLEWARE TESTS

#### Test File: `auth.middleware.test.ts`
```typescript
describe('Auth Middleware', () => {
  test('✅ Should allow access with valid token', async () => {
    // Test token validation
  });
  
  test('❌ Should reject expired token', async () => {
    // Test 401 Unauthorized
  });
  
  test('❌ Should reject invalid token format', async () => {
    // Test malformed token
  });
  
  test('❌ Should reject missing Authorization header', async () => {
    // Test 401 Unauthorized
  });
});

describe('Authorization Middleware', () => {
  test('✅ Should allow admin access to admin routes', async () => {
    // Test admin role
  });
  
  test('✅ Should allow host access to host routes', async () => {
    // Test host role
  });
  
  test('❌ Should reject tourist access to host routes', async () => {
    // Test 403 Forbidden
  });
});
```

#### Priority: **HIGH** 🟠  
**Why**: Security layer for all protected routes  
**Estimated Time**: 1 hour

---

## 🎨 FRONTEND TESTS (Karma/Jasmine)

### Setup Instructions
```bash
cd frontend
npm install --save-dev @angular/cli karma karma-jasmine karma-chrome-launcher
```

### Test Structure
```
frontend/src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.spec.ts
│   │   ├── api.service.spec.ts
│   │   └── service.service.spec.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.spec.ts
│   │   └── error.interceptor.spec.ts
│   └── guards/
│       ├── auth.guard.spec.ts
│       └── role.guard.spec.ts
├── features/
│   ├── auth/
│   │   ├── login/login.component.spec.ts
│   │   └── register/register.component.spec.ts
│   ├── services/
│   │   ├── service-list/service-list.component.spec.ts
│   │   └── service-detail/service-detail.component.spec.ts
│   ├── dashboard/
│   │   └── dashboard.component.spec.ts
│   └── bookings/
│       └── booking-list/booking-list.component.spec.ts
└── shared/
    └── components/
        └── navbar/navbar.component.spec.ts
```

---

### 1. AUTH SERVICE TESTS

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should store accessToken on login', () => {
    // FIXED: Now stores response.data.accessToken instead of response.data.token
  });

  it('should attach token to requests via interceptor', () => {
    // FIXED: Interceptor now reads localStorage directly
  });

  it('should redirect to login on 401 error', () => {
    // Test error interceptor behavior
  });
});
```

#### Priority: **CRITICAL** 🔴  
**Fixed Issues**:
- ✅ AuthService now saves `accessToken` (not `token`)
- ✅ Auth interceptor reads from `localStorage` directly
- ✅ Only excludes specific URLs (login, register, forgot-password)

---

### 2. COMPONENT TESTS

```typescript
describe('LoginComponent', () => {
  it('should login successfully and navigate to dashboard', () => {
    // Test login flow
  });

  it('should display error on invalid credentials', () => {
    // Test error handling
  });
});

describe('ServiceListComponent', () => {
  it('should load services on init', () => {
    // Test service fetching
  });

  it('should filter services by category', () => {
    // Test category filter
  });
});

describe('DashboardComponent', () => {
  it('should load bookings with token', () => {
    // FIXED: Now sends token correctly
  });
});
```

#### Priority: **MEDIUM** 🟡  
**Estimated Time**: 4 hours

---

## 🌐 E2E TESTS (Cypress)

### Setup Instructions
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

### Critical User Flows

#### 1. Complete Booking Flow
```javascript
describe('Complete Booking Flow', () => {
  it('should complete full booking journey', () => {
    cy.visit('/');
    cy.get('[data-cy=login-btn]').click();
    cy.get('[data-cy=email]').type('user1@dkhoul.ma');
    cy.get('[data-cy=password]').type('password123');
    cy.get('[data-cy=submit]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Navigate to services
    cy.get('[data-cy=services-link]').click();
    
    // Select a service
    cy.get('[data-cy=service-card]').first().click();
    
    // Create booking
    cy.get('[data-cy=book-now-btn]').click();
    cy.get('[data-cy=date-picker]').type('2025-11-10');
    cy.get('[data-cy=time-slot]').select('09:00 - 17:00');
    cy.get('[data-cy=guests]').type('2');
    cy.get('[data-cy=confirm-booking]').click();
    
    // Verify booking created
    cy.contains('Booking created successfully').should('be.visible');
  });
});
```

#### 2. Authentication Flow
```javascript
describe('Authentication Flow', () => {
  it('should register, login, and logout', () => {
    // Test complete auth cycle
  });

  it('should persist session after page refresh', () => {
    // Test token persistence
  });
});
```

#### Priority: **HIGH** 🟠  
**Estimated Time**: 3 hours

---

## ✅ MANUAL TEST CHECKLIST

### Authentication ✓
- [ ] Register new user (tourist)
- [ ] Register new user (host)
- [ ] Login as tourist
- [ ] Login as host
- [ ] Login as admin (admin@dkhoul.ma / password123)
- [ ] Logout
- [ ] Access protected route without token → redirected to login
- [ ] Refresh page while logged in → session persists

### Services ✓
- [ ] View all services (60 seeded services visible)
- [ ] Filter by category (Space, Skills, Connect)
- [ ] Filter by city (Casablanca, Marrakech, Fès)
- [ ] Filter by price range
- [ ] Search services by keyword
- [ ] View service details
- [ ] Create new service (as host)
- [ ] Edit own service (as host)
- [ ] Delete own service (as host)
- [ ] Cannot edit another host's service → 403 error

### Bookings ✓
- [ ] Create booking for service
- [ ] View my bookings
- [ ] Cancel booking (>24h before date)
- [ ] Cannot cancel booking (<24h before date)
- [ ] Host views booking requests
- [ ] Host confirms booking
- [ ] Host rejects booking
- [ ] Cannot book own service → error message

### Reviews ✓
- [ ] Tourist reviews completed booking
- [ ] Host reviews completed booking
- [ ] Host responds to review
- [ ] Cannot review pending booking → error message
- [ ] Cannot submit duplicate review → error message

### Payments ✓
- [ ] Initialize payment for confirmed booking
- [ ] Payment success webhook processing
- [ ] Refund cancelled booking

### Admin Dashboard ✓
- [ ] View all users
- [ ] View all services
- [ ] Approve/reject services
- [ ] View all bookings
- [ ] View payment transactions

---

## 🔄 TEST EXECUTION ORDER

### Phase 1: Backend Foundation (Day 1-2)
```bash
1. Authentication Tests          [2h]
2. Middleware Tests              [1h]
3. JWT Utility Tests             [1h]
4. Validator Tests               [1h]
Total: 5 hours
```

### Phase 2: Core Business Logic (Day 3-4)
```bash
5. Service Controller Tests      [3h]
6. Booking Controller Tests      [3h]
7. Review Controller Tests       [2h]
8. Payment Controller Tests      [2h]
Total: 10 hours
```

### Phase 3: Frontend (Day 5-6)
```bash
9. Auth Service Tests            [2h]
10. API Service Tests            [1h]
11. Component Tests              [4h]
12. Guard & Interceptor Tests    [2h]
Total: 9 hours
```

### Phase 4: E2E & Integration (Day 7)
```bash
13. Critical User Flows          [3h]
14. Cross-browser Testing        [2h]
15. Manual QA                    [2h]
Total: 7 hours
```

**Grand Total: 31 hours (~4-5 working days)**

---

## 🐛 KNOWN ISSUES & FIXES APPLIED

### ✅ FIXED ISSUES

#### 1. Authentication Token Mismatch
**Problem**: Frontend saved `token` but backend returned `accessToken`  
**Fix**: Updated AuthService to save `response.data.accessToken`  
**Files Changed**:
- `frontend/src/app/core/services/auth.service.ts` (lines 45, 59, 95)
- `frontend/src/app/core/interceptors/auth.interceptor.ts` (line 6)

#### 2. Service Controller Field Names
**Problem**: Controller used `provider` but model uses `hostId`  
**Fix**: Changed all `.populate('provider')` → `.populate('hostId')`  
**Files Changed**:
- `backend/src/controllers/service.controller.ts` (lines 43, 71, 246)
- `backend/src/controllers/review.controller.ts` (lines 44, 260)
- `backend/src/controllers/admin.controller.ts` (line 154)
- `backend/src/controllers/booking.controller.ts` (lines 26, 169, 172, 200, 201)

#### 3. Booking Controller Field Names
**Problem**: Used `user`, `service` but model uses `touristId`, `serviceId`  
**Fix**: Updated all field references  
**Files Changed**:
- `backend/src/controllers/booking.controller.ts` (complete refactor)

#### 4. Review Controller Field Names
**Problem**: Used `reviewer`, `service`, `hostResponse` but model uses `reviewerId`, `serviceId`, `response`  
**Fix**: Updated all field references  
**Files Changed**:
- `backend/src/controllers/review.controller.ts` (lines 40, 52, 180, 202, 227, 231, 259, 265, 269)

#### 5. Auth Interceptor Too Restrictive
**Problem**: Excluded ALL `/auth/*` URLs, preventing `/auth/verify-email` etc.  
**Fix**: Only exclude login, register, forgot-password, reset-password  
**Files Changed**:
- `frontend/src/app/core/interceptors/auth.interceptor.ts` (lines 7-9)

#### 6. Non-existent Model Fields
**Problem**: Controllers referenced `isAvailable`, `views`, `startDate`, `endDate`  
**Fix**: Removed or replaced with correct fields  
**Files Changed**:
- `backend/src/controllers/service.controller.ts` (removed `views`)
- `backend/src/controllers/booking.controller.ts` (removed `isAvailable`, changed to `status`)

---

## 🚀 RUNNING TESTS

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm test -- --coverage    # With coverage report
npm test auth.controller  # Run specific test file
npm test -- --watch       # Watch mode
```

### Frontend Tests
```bash
cd frontend
ng test                   # Run all tests
ng test --code-coverage   # With coverage report
ng test --watch=false     # Single run
```

### E2E Tests
```bash
cd frontend
npx cypress open          # Interactive mode
npx cypress run           # Headless mode
```

---

## 📊 SUCCESS CRITERIA

### Backend
- ✅ All controllers have 0 TypeScript errors
- ✅ Backend server starts without errors
- ⏳ 80% test coverage
- ⏳ All API endpoints return correct status codes
- ⏳ All field names match model definitions

### Frontend
- ⏳ 75% test coverage
- ⏳ No console errors on any page
- ⏳ Auth token properly attached to all requests
- ⏳ Error interceptor handles 401/403 correctly

### E2E
- ⏳ Complete booking flow works end-to-end
- ⏳ Authentication persists across page refreshes
- ⏳ All critical paths tested

---

## 📝 NOTES FOR DEVELOPERS

### When Adding New Features
1. ✅ Verify field names match model definitions
2. ✅ Use correct populate references (hostId, touristId, reviewerId, serviceId)
3. ✅ Add unit tests for new controllers/services
4. ✅ Update E2E tests if user flow changes
5. ✅ Check auth token is sent for protected routes

### Common Pitfalls to Avoid
- ❌ Don't use `provider` (use `hostId`)
- ❌ Don't use `user` in bookings (use `touristId`)
- ❌ Don't use `reviewer` in reviews (use `reviewerId`)
- ❌ Don't use `service` as field name (use `serviceId`)
- ❌ Don't exclude all `/auth/*` URLs in interceptor

### Database Seeding
Before testing, ensure database is seeded:
```bash
cd backend
npx ts-node src/scripts/seed.ts
```
This creates:
- 1 Admin (admin@dkhoul.ma / password123)
- 10 Tourists (user1-10@dkhoul.ma / password123)
- 10 Hosts (host1-10@dkhoul.ma / password123)
- 60 Services (20 Space, 20 Skills, 20 Connect)
- 15 Sample Bookings
- 25 Sample Reviews

---

## 🎯 NEXT STEPS

1. **Setup Jest for Backend** (30 min)
2. **Write Authentication Tests** (2 hours)
3. **Write Service Controller Tests** (3 hours)
4. **Setup Karma for Frontend** (30 min)
5. **Write Frontend Service Tests** (2 hours)
6. **Setup Cypress** (30 min)
7. **Write E2E Tests** (3 hours)
8. **Generate Coverage Reports** (1 hour)
9. **Fix Uncovered Edge Cases** (2 hours)
10. **Manual QA Pass** (2 hours)

**Total Estimated Time: 16-20 hours (2-3 days)**

---

## 📞 SUPPORT

For questions about this test plan:
- Check model definitions in `backend/src/models/`
- Review fixed controllers in `backend/src/controllers/`
- Test API endpoints in Thunder Client/Postman
- Run backend server and check terminal output

---

**Remember**: All backend field name issues are now fixed! The server is running cleanly with 0 errors. Focus on writing tests to ensure stability. 🎉
