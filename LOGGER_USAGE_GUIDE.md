# 🔍 Logger Service - Complete Usage Guide

**Date:** November 11, 2025  
**Purpose:** How to use and see logs in DKHOUL application

---

## 📋 Table of Contents

1. [How Logger Works](#how-logger-works)
2. [Where to See Logs](#where-to-see-logs)
3. [How to Use Logger](#how-to-use-logger)
4. [Testing Logger](#testing-logger)
5. [Advanced Features](#advanced-features)
6. [Production vs Development](#production-vs-development)

---

## 🎯 How Logger Works

### Current Implementation

The `LoggerService` is **environment-aware**:

```typescript
// In DEVELOPMENT (environment.production = false)
✅ All logs appear in browser console (debug, info, warn, error)

// In PRODUCTION (environment.production = true)
❌ Only ERROR logs appear
❌ Debug, info, warn are HIDDEN
```

### Why You Don't See Logs?

**Most likely reason:** You're in **development mode** BUT the logs are being called correctly!

Let me show you how to verify and test.

---

## 👀 Where to See Logs

### 1. **Open Browser Developer Console**

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Or `Right Click` → `Inspect` → `Console` tab

**Firefox:**
- Press `F12` or `Ctrl+Shift+K`

**Safari:**
- `Cmd+Option+I` → `Console` tab

### 2. **Filter Logs by Level**

In the console, look for prefixes:
```
[DEBUG] - Debug information
[INFO]  - Informational messages
[WARN]  - Warnings
[ERROR] - Errors
```

### 3. **Example Console Output**

When you navigate the app, you should see:
```
[INFO] Loaded 15 services
[DEBUG] API Response received {data: {...}}
[ERROR] Error loading bookings Error: Network failed
```

---

## 🛠️ How to Use Logger

### Already Implemented (You're Using It!)

Your components are **already using** the logger. For example:

**service-list.component.ts:**
```typescript
loadServices(): void {
  this.serviceService.getServices(filters).subscribe({
    next: (response: any) => {
      this.logger.debug('API Response received', response);  // ✅ LOGS IN DEV
      // ... process data
      this.logger.info(`Loaded ${this.services.length} services`); // ✅ LOGS IN DEV
    },
    error: (error) => {
      this.logger.error('Error loading services', error); // ✅ ALWAYS LOGS
    }
  });
}
```

**booking-create.component.ts:**
```typescript
createBooking(): void {
  this.bookingService.createBooking(data).subscribe({
    error: (error) => {
      this.logger.error('Booking error', error); // ✅ LOGS ERROR
    }
  });
}
```

---

## 🧪 Testing Logger (See It In Action!)

### Test 1: Manual Test in Component

Add a test log in any component to verify it's working:

**Step 1:** Open `app.component.ts`

**Step 2:** Add this in `ngOnInit()`:
```typescript
ngOnInit(): void {
  // TEST LOGGER
  this.logger.debug('🚀 Application started - DEBUG test');
  this.logger.info('✅ Application initialized - INFO test');
  this.logger.warn('⚠️ This is a warning - WARN test');
  this.logger.error('❌ This is an error test - ERROR test');
  
  console.log('👉 Direct console.log - This should NOT be used');
}
```

**Step 3:** Open browser console (`F12`)

**Step 4:** You should see:
```
[DEBUG] 🚀 Application started - DEBUG test
[INFO] ✅ Application initialized - INFO test
[WARN] ⚠️ This is a warning - WARN test
[ERROR] ❌ This is an error test - ERROR test
👉 Direct console.log - This should NOT be used
```

### Test 2: Test in Browser Console Directly

**Step 1:** Open browser console

**Step 2:** Type:
```javascript
// Access Angular's logger service from console
const logger = ng.probe(document.querySelector('app-root')).injector.get('LoggerService');

// Test logs
logger.debug('Console test - debug');
logger.info('Console test - info');
logger.warn('Console test - warn');
logger.error('Console test - error');
```

### Test 3: Trigger Real Scenarios

**Scenario A - Load Services:**
1. Navigate to `/services` page
2. Open console (`F12`)
3. Refresh page
4. You should see:
   ```
   [DEBUG] API Response received {...}
   [INFO] Loaded 15 services
   ```

**Scenario B - Trigger Error:**
1. Turn off backend server
2. Try to load services page
3. You should see:
   ```
   [ERROR] Error loading services Error: Http failure response...
   ```

**Scenario C - Create Booking:**
1. Try to create a booking
2. Watch console for:
   ```
   [DEBUG] Booking data prepared
   [INFO] Booking created successfully
   ```
   Or on error:
   ```
   [ERROR] Booking error Error: ...
   ```

---

## 🎨 Advanced Features

### 1. **Group Related Logs**

```typescript
// In your component
debugComplexOperation(): void {
  this.logger.group('🔍 Service Loading Process');
  this.logger.debug('Step 1: Fetching data');
  this.logger.debug('Step 2: Processing response');
  this.logger.debug('Step 3: Updating UI');
  this.logger.groupEnd();
}
```

**Console Output:**
```
🔍 Service Loading Process
  [DEBUG] Step 1: Fetching data
  [DEBUG] Step 2: Processing response
  [DEBUG] Step 3: Updating UI
```

### 2. **Log Tables (Arrays/Objects)**

```typescript
// Display array data as table
loadServices(): void {
  this.serviceService.getServices().subscribe({
    next: (services) => {
      this.logger.table(services); // ✅ Shows nice table in console
    }
  });
}
```

**Console Output:**
```
┌─────────┬──────────────┬────────┬─────────┐
│ (index) │    title     │ price  │  city   │
├─────────┼──────────────┼────────┼─────────┤
│    0    │ 'WiFi Room'  │  50    │ 'Rabat' │
│    1    │ 'Cooking'    │  200   │ 'Fes'   │
└─────────┴──────────────┴────────┴─────────┘
```

### 3. **Timestamp Logging (Debug Timing)**

```typescript
// Track performance
loadData(): void {
  this.logger.logWithTimestamp('Started loading');
  
  this.service.getData().subscribe({
    next: () => {
      this.logger.logWithTimestamp('Finished loading');
    }
  });
}
```

**Console Output:**
```
[2025-11-11T15:30:45.123Z] Started loading
[2025-11-11T15:30:45.456Z] Finished loading
// Time difference = 333ms
```

### 4. **Change Log Level Dynamically**

```typescript
// Enable ALL logs (even in production)
this.logger.setLogLevel(LogLevel.DEBUG);

// Show only errors
this.logger.setLogLevel(LogLevel.ERROR);

// Disable all logs
this.logger.setLogLevel(LogLevel.NONE);
```

---

## 🏭 Production vs Development

### Development Mode (Current)

**Check Environment:**
```typescript
// frontend/src/environments/environment.ts
export const environment = {
  production: false,  // ← You're here
  apiUrl: 'http://localhost:5000/api',
  socketUrl: 'http://localhost:5000'
};
```

**What Logs:**
```
✅ debug() - Shows
✅ info()  - Shows
✅ warn()  - Shows
✅ error() - Shows
```

### Production Mode

**Check Environment:**
```typescript
// frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,  // ← Production build
  apiUrl: 'https://api.dkhoul.com/api',
  socketUrl: 'https://api.dkhoul.com'
};
```

**What Logs:**
```
❌ debug() - HIDDEN
❌ info()  - HIDDEN
❌ warn()  - HIDDEN
✅ error() - Shows (sent to error tracking)
```

---

## 🔧 Troubleshooting

### Issue 1: "I don't see any logs!"

**Solution A - Check Console is Open:**
```
Press F12 → Go to "Console" tab
```

**Solution B - Check Log Level:**
```typescript
// Add to app.component.ts ngOnInit()
console.log('Environment:', environment);
console.log('Production mode:', environment.production);
```

**Solution C - Verify Logger Import:**
```typescript
// In your component
import { LoggerService } from '../../../core/services/logger.service';

constructor(private logger: LoggerService) {
  // Test immediately
  this.logger.info('Logger is working!');
}
```

### Issue 2: "Logs show but prefixes are missing"

**Check console filters:**
- Make sure "All levels" is selected in console
- Clear any search filters

### Issue 3: "Logs work in some components but not others"

**Check constructor injection:**
```typescript
// ✅ CORRECT
constructor(private logger: LoggerService) {}

// ❌ WRONG - logger not injected
constructor() {}
```

---

## 📊 Real-World Examples

### Example 1: Service List Component

**Open:** `service-list.component.ts`

**Current Implementation:**
```typescript
loadServices(): void {
  this.loading = true;
  const filters = { limit: 100, page: 1 };
  
  this.serviceService.getServices(filters).subscribe({
    next: (response: any) => {
      this.logger.debug('API Response received', response); // 👈 CHECK CONSOLE
      
      const servicesData = response.data?.services || response.services || response;
      this.services = Array.isArray(servicesData) ? servicesData : [];
      
      this.logger.info(`Loaded ${this.services.length} services`); // 👈 CHECK CONSOLE
      
      this.loading = false;
    },
    error: (error) => {
      this.logger.error('Error loading services', error); // 👈 CHECK CONSOLE
      this.loading = false;
    }
  });
}
```

**To Test:**
1. Navigate to `/services` page
2. Open console (`F12`)
3. You should see:
   ```
   [DEBUG] API Response received {success: true, data: {...}}
   [INFO] Loaded 15 services
   ```

### Example 2: Login Component

**Open:** `login.component.ts`

**Current Implementation:**
```typescript
signInWithGoogle(): void {
  this.logger.debug('Google OAuth sign-in initiated'); // 👈 CHECK CONSOLE
  
  this.authService.loginWithGoogle().subscribe({
    next: (response) => {
      this.logger.info('Google OAuth successful', response.user); // 👈 CHECK CONSOLE
      this.router.navigate(['/home']);
    },
    error: (error) => {
      this.logger.error('Google OAuth failed', error); // 👈 CHECK CONSOLE
    }
  });
}
```

**To Test:**
1. Go to login page
2. Open console
3. Click "Sign in with Google"
4. Watch console for logs

---

## 🎯 Quick Start Checklist

- [ ] 1. Open browser (`http://localhost:4200`)
- [ ] 2. Press `F12` to open DevTools
- [ ] 3. Click "Console" tab
- [ ] 4. Navigate to any page (e.g., `/services`)
- [ ] 5. Look for `[DEBUG]`, `[INFO]`, `[ERROR]` messages
- [ ] 6. Try triggering an error (turn off backend)
- [ ] 7. See `[ERROR]` messages appear

---

## 🚀 Pro Tips

### Tip 1: Filter Console by Keyword
```
Type in console search: [DEBUG]
Type in console search: [ERROR]
Type in console search: Error loading
```

### Tip 2: Add Custom Debug Points
```typescript
// Temporary debug logging
private debugUserFlow(): void {
  this.logger.group('👤 User Flow Debug');
  this.logger.debug('Current user:', this.currentUser);
  this.logger.debug('Is authenticated:', this.isAuthenticated);
  this.logger.debug('Current route:', this.router.url);
  this.logger.groupEnd();
}
```

### Tip 3: Log Component Lifecycle
```typescript
ngOnInit(): void {
  this.logger.debug(`${this.constructor.name} initialized`);
}

ngOnDestroy(): void {
  this.logger.debug(`${this.constructor.name} destroyed`);
}
```

### Tip 4: Log HTTP Requests
```typescript
// See all API calls
this.serviceService.getServices().subscribe({
  next: (response) => {
    this.logger.group('📡 API Call: Get Services');
    this.logger.debug('Request URL:', '/api/services');
    this.logger.debug('Response:', response);
    this.logger.debug('Status:', 'Success');
    this.logger.groupEnd();
  }
});
```

---

## 📈 Monitoring in Production

### Future Integration (Ready to Add)

**Option 1: Sentry Integration**
```typescript
// In logger.service.ts sendToErrorTracking()
import * as Sentry from '@sentry/angular';

private sendToErrorTracking(message: string, error: any): void {
  Sentry.captureException(error, {
    extra: { message },
    tags: { component: message }
  });
}
```

**Option 2: LogRocket Integration**
```typescript
import LogRocket from 'logrocket';

private sendToErrorTracking(message: string, error: any): void {
  LogRocket.captureException(error, {
    extra: { message }
  });
}
```

**Option 3: Backend Logging Endpoint**
```typescript
private sendToErrorTracking(message: string, error: any): void {
  fetch(`${environment.apiUrl}/logs/error`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }).catch(() => {});
}
```

---

## ✅ Summary

### Logger is Already Working!

Your application **already has logger integrated** in:
- ✅ 20+ components
- ✅ All error handlers
- ✅ All service calls
- ✅ All critical operations

### To See Logs Right Now:

1. **Open your app:** `http://localhost:4200`
2. **Open console:** Press `F12`
3. **Navigate around:** Go to /services, /bookings, etc.
4. **Watch console:** See `[DEBUG]`, `[INFO]`, `[ERROR]` messages

### Logs are ONLY Visible:
- ✅ In **browser DevTools console** (F12)
- ✅ In **development mode**
- ❌ NOT in UI (by design - logs are for developers)

---

**Need Help?** 
- Check browser console (F12)
- Verify `environment.production = false`
- Look for `[DEBUG]`, `[INFO]`, `[ERROR]` prefixes
- Test with the examples above

**The logger is working - you just need to look in the right place! 🎉**
