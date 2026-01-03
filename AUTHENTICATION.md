# Lotus Digital Systems - Authentication & Role-Based Access

## Overview
The application implements a comprehensive role-based access control (RBAC) system with 6 distinct user roles, each with specific permissions and interface customizations.

---

## User Roles & Access Matrix

### 1. **Super Admin** 
**Description:** Business owner or Director  
**Username:** `admin@lotus.com`  
**Password:** `Admin@123`

**Access:**
- ✅ Dashboard (Full analytics)
- ✅ Leads & Sales Management
- ✅ Quote Builder & Approvals
- ✅ Accounting & GST Reports
- ✅ Service Management
- ✅ **Settings (User Management, System Config)**

**Key Capabilities:**
- Create/delete users
- Configure system settings (geo-fencing, notifications)
- Approve high-discount quotations
- Full financial visibility

---

### 2. **Sales Manager**
**Description:** Sales team head  
**Username:** `manager@lotus.com`  
**Password:** `Manager@123`

**Access:**
- ✅ Dashboard (Team metrics)
- ✅ Leads & Sales (All leads visibility)
- ✅ Quote Builder (Approve discounts)
- ✅ Service (View tickets)
- ❌ Accounting (No access)
- ❌ Settings (No access)

**Key Capabilities:**
- Assign leads to sales reps
- Approve quotations
- Monitor sales pipeline
- View service tickets

---

### 3. **Senior Sales Representative**
**Description:** Field sales person  
**Username:** `sales1@lotus.com`  
**Password:** `Sales@123`

**Access:**
- ✅ Dashboard (Personal metrics)
- ✅ Leads & Sales (Own leads only)
- ✅ Quote Builder (Create quotes)
- ❌ Accounting
- ❌ Service (View only)
- ❌ Settings

**Key Capabilities:**
- Create leads with GPS tracking
- Generate quotations
- Request discount approvals (>10%)
- Track customer visits

---

### 4. **Finance User**
**Description:** Accounting & finance team  
**Username:** `finance@lotus.com`  
**Password:** `Finance@123`

**Access:**
- ✅ Dashboard (Financial metrics)
- ✅ Accounting (Full access)
- ❌ Leads & Sales
- ❌ Quote Builder
- ❌ Service
- ❌ Settings

**Key Capabilities:**
- Generate tax invoices
- Record payments
- GST report generation
- EMI calculations
- Track outstanding balances

---

### 5. **Service Engineer**
**Description:** Service and support team  
**Username:** `service1@lotus.com`  
**Password:** `Service@123`

**Access:**
- ✅ Dashboard (Ticket metrics)
- ✅ Service (Full access)
- ❌ Leads & Sales
- ❌ Quote Builder
- ❌ Accounting
- ❌ Settings

**Key Capabilities:**
- Manage service tickets
- Update ticket status
- Record machine repairs
- Installation tracking
- **Blocked from creating tickets for financially locked machines**

---

### 6. **Customer**
**Description:** External clients  
**Username:** `customer1@xyz.com`  
**Password:** `Cust@123`

**Access:**
- ✅ Dashboard (Own data only)
- ✅ Quote Builder (View own quotes)
- ✅ Service (Raise tickets)
- ❌ Leads & Sales
- ❌ Accounting
- ❌ Settings

**Key Capabilities:**
- View quotations
- Raise service requests
- Track AMC status
- View machine details

---

## Technical Implementation

### Authentication Provider
Located in: `src/providers/auth-provider.tsx`

**Features:**
- Context-based authentication
- LocalStorage session persistence
- Mock credential validation
- Role-based user object

### Route Protection & Layout
**Files:**
- `src/middleware.ts`: Server-side route protection (checks cookies).
- `src/components/protected-route.tsx`: Client-side auth check wrapper.
- `src/components/layout-wrapper.tsx`: **NEW** - Conditionally renders the sidebar. Hides it on `/login` and `/` to prevent layout glitches.
- `src/app/layout.tsx`: Uses `LayoutWrapper` to manage global layout state.

**Behavior:**
- Unauthenticated users → Redirected to `/login`
- Authenticated users on `/login` → Redirected to `/dashboard`
- Root `/` → Auto-redirects based on auth state

### Role-Based UI
**Sidebar Navigation** (`src/components/app-sidebar.tsx`):
- Dynamically filters menu items based on user role
- Shows user info and role badge
- Logout button

**Dashboard** (`src/app/dashboard/page.tsx`):
- Role-specific statistics cards
- Personalized greetings
- Contextual activity feed

**Settings** (`src/app/settings/page.tsx`):
- Super Admin: Full user management interface
- Other roles: Limited personal settings

---

## Development Notes

### Adding New Users
Super Admin can create users via **Settings → User Management**

### Testing Different Roles
1. Logout current user
2. Login with role-specific credentials (see table above)
3. Observe sidebar navigation changes
4. Check dashboard customization

### Future Enhancements
- [ ] Backend API integration (replace mock auth)
- [ ] JWT token authentication
- [ ] Password reset functionality
- [ ] Role permission inheritance
- [ ] Audit logs for user actions
- [ ] Two-factor authentication (2FA)

---

## Security Considerations

⚠️ **Current Implementation:**
- Mock authentication (development only)
- Plain-text password comparison
- LocalStorage for session (not production-safe)

🔒 **Production Requirements:**
- Hash passwords (bcrypt/argon2)
- JWT with HTTP-only cookies
- HTTPS enforcement
- Rate limiting on login endpoint
- Session timeout
- CSRF protection

---

## File Structure
```
lotus/
├── src/
│   ├── providers/
│   │   └── auth-provider.tsx        # Auth context
│   ├── components/
│   │   ├── app-sidebar.tsx          # Role-based nav
│   │   └── protected-route.tsx      # Route guard
│   ├── app/
│   │   ├── login/page.tsx           # Login page
│   │   ├── dashboard/page.tsx       # Role dashboard
│   │   └── settings/page.tsx        # User management
│   ├── lib/
│   │   └── types.ts                 # UserRole definition
│   └── middleware.ts                # Route protection
```

---

**Last Updated:** January 2, 2026  
**Version:** 1.0.0
