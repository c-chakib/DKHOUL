# 🧪 Admin Log Dashboard - Quick Test Guide

## ✅ How to Test Your New Log Dashboard

### **Step 1: Start the Servers**

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
ng serve
```

### **Step 2: Login as Admin**

1. Open browser: `http://localhost:4200`
2. Login with admin account:
   - Email: `admin@dkhoul.com`
   - Password: [your admin password]
3. Verify you see admin menu in navbar

### **Step 3: Access Log Dashboard**

```
Navigate to: http://localhost:4200/admin/logs

OR

1. Click "Admin" in navbar
2. Click "System Logs" button in Quick Actions
```

### **Step 4: Generate Some Logs**

To see logs appear, do these actions:

1. **Browse Services** → Generates INFO logs
   ```
   Navigate to: /services
   This creates: [INFO] Loaded 15 services
   ```

2. **Create a Booking** → Generates DEBUG/INFO logs
   ```
   Click any service → Book now
   This creates: [DEBUG] API Response, [INFO] Booking created
   ```

3. **Try Invalid Action** → Generates ERROR logs
   ```
   Try to access /services/999999 (non-existent)
   This creates: [ERROR] Service not found
   ```

4. **Refresh Page** → More logs
   ```
   Keep navigating around the app
   Each action creates logs!
   ```

### **Step 5: Test Dashboard Features**

#### **A. View Statistics**
✅ See 4 stat cards at top:
- Total Logs
- Today's Logs  
- Error Count
- Warning Count

#### **B. Filter Logs**
✅ Try each filter:
```
1. Level dropdown → Select "error" → See only errors
2. Component dropdown → Select "services" → See service logs
3. Date pickers → Select today → See today's logs
4. Search box → Type "booking" → See booking-related logs
5. Clear Filters button → Reset all filters
```

#### **C. View Error Trends**
✅ Check the chart:
- Shows errors per hour (last 24 hours)
- Bars represent error count
- Helps identify problem periods

#### **D. Table Features**
✅ Test the table:
```
1. Click column headers → Sort by timestamp/level
2. Click 3-dot menu → "View Details" → See full log info
3. Click 3-dot menu → "View User" → Navigate to user profile
4. Change page size → 10, 25, 50, 100 logs per page
5. Navigate pages → Previous/Next buttons
```

#### **E. Export Logs**
✅ Download CSV:
```
1. Apply filters (e.g., only errors, last 7 days)
2. Click "Export CSV" button
3. File downloads → logs-[timestamp].csv
4. Open in Excel/Sheets → See all log data
```

#### **F. Refresh**
✅ Update data:
```
1. Click "Refresh" button → Reloads logs & stats
2. Do more actions in app → Click refresh → See new logs
```

---

## 🔍 What to Look For

### **✅ Success Indicators:**

1. **Statistics Cards Show Numbers**
   - Not zero (unless fresh database)
   - Updates when you refresh

2. **Logs Table Populated**
   - Shows recent logs
   - Has timestamp, level, component, message

3. **Filters Work**
   - Dropdown changes filter logs
   - Search finds matching logs
   - Date pickers limit date range

4. **Color-Coded Levels**
   - 🔵 DEBUG = Blue chip
   - 🟢 INFO = Green chip
   - 🟡 WARN = Orange chip
   - 🔴 ERROR = Red chip

5. **Export Downloads File**
   - CSV file downloaded
   - Contains filtered logs
   - Opens in spreadsheet software

---

## ❌ Troubleshooting

### **Problem: No logs appear**

**Solution 1: Generate logs first**
```typescript
// Browse the app to create logs
1. Visit /services
2. View a service detail
3. Create a booking
4. Try login/logout
```

**Solution 2: Check backend connection**
```bash
# In browser console (F12)
GET http://localhost:5000/api/logs
# Should return 200 OK

# Check MongoDB connection
# Backend console should say "MongoDB connected"
```

**Solution 3: Verify authentication**
```javascript
// In browser console (F12)
localStorage.getItem('token') // Should exist
localStorage.getItem('role')  // Should be 'admin'
```

---

### **Problem: "Forbidden" or "Unauthorized"**

**Solution: Login as admin**
```typescript
// Only admin users can access logs
// Regular users/investors/service providers cannot

// Check your user role in database:
db.users.findOne({ email: 'your@email.com' })
// Should have: role: 'admin'
```

---

### **Problem: Export doesn't work**

**Solution: Check popup blocker**
```
1. Browser may block new window
2. Allow popups for localhost:4200
3. Try export again
```

---

### **Problem: Stats show "0"**

**Solution: Database may be empty**
```bash
# Option 1: Import sample data
mongorestore --db dkhoul ./local-dump/dkhoul

# Option 2: Use app to generate data
# Just browse around, create bookings, etc.
```

---

## 🎯 Expected Results

### **After 5 minutes of testing:**

```
Statistics Cards:
✅ Total Logs: 50+
✅ Today's Logs: 50+
✅ Errors: 2-5
✅ Warnings: 0-3

Logs Table:
✅ Shows 25 most recent logs
✅ Sorted by timestamp (newest first)
✅ Color-coded by level
✅ Component names visible
✅ User names visible (if logged in)

Filters:
✅ Level dropdown has 4 options
✅ Component dropdown lists components
✅ Search finds text in messages
✅ Date pickers limit range

Export:
✅ CSV downloads successfully
✅ Contains all filtered logs
✅ Includes all columns
```

---

## 📸 Visual Checklist

### **Dashboard Should Look Like:**

```
┌─────────────────────────────────────────────────┐
│ 📄 System Logs        [Refresh] [Export CSV]    │
├─────────────────────────────────────────────────┤
│ [52 Total] [52 Today] [3 Errors] [1 Warnings]  │
├─────────────────────────────────────────────────┤
│ Filters: [All ▼] [All ▼] [Date] [Date] [🔍]    │
├─────────────────────────────────────────────────┤
│ Error Trends: [Chart with bars]                 │
├─────────────────────────────────────────────────┤
│ Table with logs (timestamp, level, message...)  │
│ [< Prev] [1 2 3 4 5] [Next >]                  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Test Checklist

Use this checklist to verify everything works:

- [ ] **Access**: Can navigate to /admin/logs
- [ ] **Stats**: See 4 stat cards with numbers
- [ ] **Table**: Logs displayed in table
- [ ] **Colors**: Levels are color-coded
- [ ] **Filter - Level**: Can filter by error/warn/info
- [ ] **Filter - Component**: Can filter by component
- [ ] **Filter - Date**: Can select date range
- [ ] **Filter - Search**: Can search text
- [ ] **Filter - Clear**: Reset button works
- [ ] **Sort**: Can click column headers
- [ ] **Paginate**: Can change page size
- [ ] **Paginate**: Can navigate pages
- [ ] **Details**: Can click 3-dot menu
- [ ] **User**: Can view user profile (if logged in user)
- [ ] **Refresh**: Updates logs & stats
- [ ] **Export**: Downloads CSV file
- [ ] **Chart**: Error trends visible (if errors exist)

---

## 💡 Pro Tips

### **Generate Lots of Logs Fast:**

```bash
# Run automated API tests
cd backend
npm test

# This creates 100+ logs in seconds!
```

### **Test Error Logging:**

```typescript
// In any component, manually trigger error:
throw new Error('Test error for dashboard');

// This creates ERROR log visible in dashboard
```

### **Monitor Real-Time:**

```typescript
// Keep dashboard open in one tab
// Use app in another tab
// Click refresh to see new logs appear
```

### **Use Filters Efficiently:**

```
1. Start with Level filter → Find critical errors
2. Add Date filter → Recent issues
3. Add Search → Specific error message
4. Export → Save for later analysis
```

---

## 🎉 Success!

If you can:
- ✅ See logs in the table
- ✅ Filter by level/component/date
- ✅ View statistics
- ✅ Export to CSV
- ✅ Navigate and sort

**Congratulations! Your log dashboard is working perfectly! 🎊**

---

## 📞 Need Help?

If logs aren't appearing:

1. **Check browser console (F12)**
   - Look for API errors
   - Check network tab for failed requests

2. **Check backend logs**
   - Terminal where backend runs
   - Look for MongoDB connection errors

3. **Verify MongoDB is running**
   ```bash
   # Check MongoDB status
   mongosh
   show dbs
   use dkhoul
   db.logs.find().limit(5)
   ```

4. **Re-read the guide**: `ADMIN_LOG_DASHBOARD_GUIDE.md`

---

**Happy logging! 📊🎯**
