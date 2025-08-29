# Government Cybercrime Portal - Login/Register System

A professional, responsive authentication system for the Government Cybercrime Portal with role-based access control and localStorage integration.

## 🚀 Features

### ✅ Core Authentication
- **Dual Role System**: Public Users & Admin/Officers
- **Login/Register Toggle**: Seamless tab switching
- **localStorage Integration**: User data persistence
- **Role-based Redirection**: Automatic dashboard routing
- **Session Management**: 24-hour session expiry

### ✅ Security Features
- **Password Strength Validation**: Real-time strength checking
- **Input Validation**: Client-side form validation
- **Username Availability**: Real-time checking
- **Secure Password Toggle**: Show/hide functionality
- **Session Protection**: Automatic session management

### ✅ UI/UX Excellence
- **Professional Government Theme**: Blue/white/grey color scheme
- **Fully Responsive Design**: Mobile-first approach
- **Smooth Animations**: Tab transitions and form animations
- **Loading States**: Professional loading overlays
- **Error Handling**: Clear validation feedback

## 📁 File Structure

```
E:\login\
├── index.html              # Main login/register page
├── styles.css              # Professional government styling
├── script.js               # Complete authentication logic
├── public-dashboard.html   # Public user dashboard (demo)
├── admin-dashboard.html    # Admin dashboard (demo)
└── README.md              # This documentation
```

## 🧪 Testing & Demo

### Quick Start:
1. **Open the Page**: Double-click `index.html` to open in your browser
2. **Test with Demo Accounts**:

#### Pre-loaded Demo Accounts:
- **Public User**: `demo_public` / `password123`
- **Admin User**: `demo_admin` / `admin123`

### Testing Flows:

#### 📱 **Public User Flow**:
1. Select "👤 Public User" role
2. Enter username: `demo_public`
3. Enter password: `password123`
4. Click "Sign In"
5. → Redirects to Public Dashboard

#### 👮 **Admin Flow**:
1. Select "👮 Admin/Officer" role
2. Enter username: `demo_admin`
3. Enter password: `admin123`
4. Click "Sign In"
5. → Redirects to Admin Dashboard

#### 📝 **Registration Flow**:
1. Click "Register" tab
2. Fill all required fields
3. Select role (Public/Admin)
4. Check "Terms" checkbox
5. Click "Create Account"
6. → Auto-login + redirect to appropriate dashboard

## 🔧 Technical Implementation

### localStorage Structure:

#### Users Storage:
```javascript
localStorage.setItem('users', JSON.stringify([
    {
        username: 'demo_public',
        password: 'password123',
        role: 'public',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: '2025-01-15T10:30:00.000Z'
    }
]));
```

#### Session Storage:
```javascript
localStorage.setItem('currentUser', JSON.stringify({
    username: 'demo_public',
    role: 'public',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    loginTime: '2025-01-15T10:30:00.000Z'
}));
```

### Role-based Redirection:
- **Public Role** → `public-dashboard.html`
- **Admin Role** → `admin-dashboard.html`

## 🎯 Page Components

### 🏛️ **Header**
- Minimal government logo
- "Cybercrime Portal" branding
- Professional blue gradient

### 🔐 **Authentication Forms**

#### Login Form:
- **Role Dropdown**: Public/Admin selection with icons
- **Username Input**: Text field with validation
- **Password Input**: Secure field with show/hide toggle
- **Remember Me**: Optional checkbox
- **Forgot Password**: Recovery link

#### Register Form:
- **Account Type**: Role selection dropdown
- **Full Name**: Text input with validation
- **Email**: Email input with format validation
- **Username**: Unique username with availability check
- **Password**: Strong password with strength indicator
- **Terms Agreement**: Required checkbox

### ⚡ **Interactive Features**
- **Real-time Validation**: Instant feedback on input
- **Password Strength Meter**: Visual strength indicator
- **Username Availability**: Live availability checking
- **Auto-save Draft**: Prevents data loss on refresh
- **Smooth Animations**: Tab switching and form transitions

### 📱 **Responsive Design**
- **Mobile Optimized**: Touch-friendly interface
- **Tablet Support**: Adaptive layout
- **Desktop Enhanced**: Full feature set

## 🎨 **Design Specifications**

### Color Palette:
- **Primary Blue**: #2b6cb0 (Government standard)
- **Secondary Blue**: #2c5aa0
- **Success Green**: #38a169
- **Error Red**: #e53e3e
- **Warning Orange**: #d69e2e
- **Text Gray**: #2d3748
- **Background**: #f7fafc

### Typography:
- **Font Family**: Poppins (Professional, readable)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive Sizing**: Mobile-optimized text sizes

### Layout:
- **Card Design**: Elevated cards with shadows
- **Grid System**: CSS Grid and Flexbox
- **Spacing**: Consistent 8px grid system

## 🔧 **JavaScript Functions**

### Core Functions:
```javascript
// Authentication
handleLogin(event)          // Process login form
handleRegister(event)       // Process registration form
redirectToDashboard(role)   // Role-based redirection

// Validation
validateLoginInputs(data)   // Validate login form
validateRegisterInputs(data) // Validate registration form
checkPasswordStrength()     // Password strength checking

// UI Management
switchTab(tab)              // Switch between login/register
togglePassword(inputId)     // Show/hide password
showLoading(message)        // Show loading overlay
```

### Utility Functions:
```javascript
// Testing helpers
authUtils.fillDemo('public') // Auto-fill demo data
authUtils.getCurrentUser()   // Get logged-in user
authUtils.getAllUsers()      // Get all users
authUtils.logout()           // Logout function
```

## ⌨️ **Keyboard Shortcuts**
- **Ctrl+1**: Switch to Login tab
- **Ctrl+2**: Switch to Register tab
- **Escape**: Close overlays/modals
- **Enter**: Submit active form

## 📊 **Validation Rules**

### Login Validation:
- **Role**: Must be selected
- **Username**: Minimum 3 characters
- **Password**: Minimum 6 characters

### Register Validation:
- **Role**: Must be selected
- **Full Name**: Minimum 2 characters
- **Email**: Valid email format
- **Username**: 3+ chars, alphanumeric + underscore only
- **Password**: 8+ chars, uppercase, lowercase, numbers
- **Terms**: Must be agreed

## 🔄 **Data Flow**

### Login Process:
1. **Input Validation** → Check required fields
2. **Credential Verification** → Match against localStorage
3. **Session Creation** → Store user session data
4. **Dashboard Redirect** → Route based on role

### Register Process:
1. **Input Validation** → Comprehensive form validation
2. **Duplicate Check** → Username/email uniqueness
3. **User Creation** → Add to localStorage users array
4. **Auto-login** → Create session immediately
5. **Dashboard Redirect** → Route based on selected role

## 🧪 **Testing Console Commands**

Open browser console and use these commands:

```javascript
// Auto-fill demo data
authUtils.fillDemo('public')  // Fill public user demo data
authUtils.fillDemo('admin')   // Fill admin user demo data

// Check current state
authUtils.getCurrentUser()    // See who's logged in
authUtils.getAllUsers()       // See all registered users

// Utility functions
authUtils.logout()           // Logout current user
authUtils.switchTab('login') // Switch to login tab
authUtils.clearForm('loginFormElement') // Clear login form
```

## 🔐 **Security Considerations**

### Current Implementation:
- Client-side validation (demo purposes)
- localStorage storage (demo purposes)
- Basic password requirements

### Production Recommendations:
- Server-side validation and authentication
- Encrypted password storage
- JWT token-based sessions
- Rate limiting and CSRF protection
- HTTPS enforcement

## 🌐 **Browser Compatibility**
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 8+

## 📱 **Mobile Features**
- Touch-friendly form inputs
- Optimized keyboard types for email/text
- Responsive grid layouts
- Finger-friendly button sizes
- Swipe-friendly tab navigation

## 🚀 **Future Enhancements**
- Two-factor authentication (2FA)
- Social login integration
- Password reset via email
- Account verification
- Advanced role permissions
- Audit logging
- API integration

## 🔧 **Local Development**

### File Setup:
1. Create folder: `E:\login\`
2. Place all files in the folder
3. Open `index.html` in browser
4. No server required - works offline

### Testing Steps:
1. **Test Login**: Use demo accounts
2. **Test Registration**: Create new accounts
3. **Test Validation**: Try invalid inputs
4. **Test Mobile**: Use browser dev tools
5. **Test Persistence**: Refresh page (session maintained)

---

## 📞 **Support & Contact**

**Government Cybercrime Portal**  
📱 Helpline: **1930** (24x7)  
📧 Email: complaints@cybercrime.gov.in  
🏛️ Ministry of Home Affairs, Government of India

---

*Created for demonstration purposes. In production, implement proper server-side authentication and security measures.*
