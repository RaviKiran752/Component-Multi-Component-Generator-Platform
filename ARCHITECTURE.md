# Component & Multi-Component Generator Platform - Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js + React)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Auth Pages    │  │  Chat Interface │  │  Live Preview   │  │ Code Editor │ │
│  │  (Login/Signup) │  │   (Conversational│  │   (Iframe       │  │ (JSX/CSS    │ │
│  │                 │  │    UI)          │  │   Sandbox)      │  │  Tabs)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│           │                     │                     │                     │     │
│           └─────────────────────┼─────────────────────┼─────────────────────┘     │
│                                 │                     │                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    Zustand State Management                               │   │
│  │  • User Authentication State                                              │   │
│  │  • Session Management                                                    │   │
│  │  • Chat History                                                          │   │
│  │  • Generated Code & CSS                                                  │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Node.js + Express)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐   │
│  │   Auth Routes   │  │ Session Routes  │  │   AI Routes     │  │Export Routes│   │
│  │  • /auth/signup │  │ • /sessions     │  │ • /ai/generate  │  │• /export/:id│   │
│  │  • /auth/login  │  │ • /sessions/:id │  │                 │  │             │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘   │
│           │                     │                     │                     │       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    Controllers Layer                                      │   │
│  │  • authController.js - User authentication & JWT                          │   │
│  │  • sessionController.js - Session CRUD operations                        │   │
│  │  • aiController.js - Gemini AI integration                               │   │
│  │  • exportController.js - ZIP file generation                             │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│           │                     │                     │                     │       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    Middleware Layer                                       │   │
│  │  • CORS Configuration - Allow Vercel domains                            │   │
│  │  • JWT Authentication - Protect routes                                   │   │
│  │  • Express JSON Parser                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Operations
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (MongoDB Atlas)                                │
│  ┌─────────────────┐                    ┌─────────────────┐                       │
│  │   Users         │                    │   Sessions      │                       │
│  │  • _id          │                    │  • _id          │                       │
│  │  • email        │                    │  • user (ref)   │                       │
│  │  • password     │                    │  • chat[]       │                       │
│  │  • createdAt    │                    │  • code         │                       │
│  └─────────────────┘                    │  • css          │                       │
│                                         │  • createdAt    │                       │
│                                         │  • updatedAt    │                       │
│                                         └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    Google Gemini AI                                        │   │
│  │  • Model: gemini-2.0-flash                                               │   │
│  │  • Input: Natural language prompts                                        │   │
│  │  • Output: JSX/TSX + CSS code                                            │   │
│  │  • Integration: REST API calls                                            │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

```
User Input → Frontend → Backend → AI Service → Code Generation → Live Preview
     ↓         ↓         ↓           ↓              ↓              ↓
  Chat UI   Zustand   Express    Gemini API   JSX/CSS      Iframe Sandbox
     ↓         ↓         ↓           ↓              ↓              ↓
  Session   MongoDB   JWT Auth   Response     State Update   Real-time Render
```

## 🏛️ Component Architecture

### **Frontend Components:**
```
src/
├── components/
│   ├── AuthForm.tsx          # Login/Signup forms
│   ├── ChatPanel.tsx         # Conversational AI interface
│   ├── LivePreview.tsx       # Component preview iframe
│   ├── CodeTabs.tsx          # JSX/CSS code display
│   └── SessionList.tsx       # Session management
├── pages/
│   ├── index.tsx             # Main application
│   ├── login.tsx             # Login page
│   └── signup.tsx            # Signup page
├── store/
│   └── useStore.ts           # Zustand state management
└── services/
    └── api.ts                # API communication
```

### **Backend Architecture:**
```
server/
├── models/
│   ├── User.js               # User schema
│   └── Session.js            # Session schema
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── sessionController.js  # Session management
│   ├── aiController.js       # AI integration
│   └── exportController.js   # File export
├── middleware/
│   └── auth.js              # JWT authentication
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── sessions.js          # Session endpoints
│   ├── ai.js               # AI endpoints
│   └── export.js           # Export endpoints
└── index.js                 # Server entry point
```

## 🔐 Security Architecture

### **Authentication Flow:**
```
1. User Registration → Password Hashing (bcryptjs) → JWT Token
2. User Login → Password Verification → JWT Token
3. Protected Routes → JWT Verification → Access Control
```

### **CORS Configuration:**
```
Allowed Origins:
• http://localhost:3000 (Development)
• https://multi-component-generater.vercel.app (Production)
• All *.vercel.app domains (Dynamic deployment)
```

## 📊 State Management Architecture

### **Zustand Store Structure:**
```typescript
interface StoreState {
  // Authentication
  user: { id: string; email: string } | null;
  token: string | null;
  
  // Session Management
  sessions: Session[];
  currentSession: Session | null;
  
  // Chat & Code
  chat: ChatMessage[];
  code: string;
  css: string;
  
  // Actions
  setUser: (user, token) => void;
  setSessions: (sessions) => void;
  setCurrentSession: (session) => void;
  setChat: (chat) => void;
  setCode: (code) => void;
  setCss: (css) => void;
  reset: () => void;
}
```

## 🚀 Deployment Architecture

### **Production Deployment:**
```
Frontend (Vercel):
├── Domain: https://multi-component-generater.vercel.app
├── Framework: Next.js 15
├── Build: npm run build
└── Environment: NEXT_PUBLIC_API_URL

Backend (Render):
├── Domain: https://component-generator-backend-5z7s.onrender.com
├── Framework: Node.js + Express
├── Database: MongoDB Atlas
└── Environment: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY

Database (MongoDB Atlas):
├── Cluster: Atlas Cloud
├── Collections: users, sessions
└── Security: IP whitelist, authentication
```

## 🔄 API Architecture

### **RESTful Endpoints:**
```
Authentication:
POST /auth/signup - User registration
POST /auth/login - User authentication

Sessions:
GET /sessions - List user sessions
POST /sessions - Create new session
GET /sessions/:id - Get specific session

AI Generation:
POST /ai/generate - Generate component code

Export:
GET /export/:id - Download session as ZIP
```

## 🎯 Key Architectural Decisions

### **1. Monorepo Structure:**
- **Frontend**: Next.js for SSR and routing
- **Backend**: Express.js for RESTful API
- **Shared**: Common types and utilities

### **2. State Management:**
- **Zustand**: Lightweight, TypeScript-friendly
- **Auto-save**: Real-time session persistence
- **Optimistic updates**: Immediate UI feedback

### **3. AI Integration:**
- **Gemini 2.0 Flash**: Modern, fast AI model
- **Structured output**: JSX/TSX + CSS extraction
- **Error handling**: Graceful fallbacks

### **4. Security:**
- **JWT tokens**: Stateless authentication
- **Password hashing**: bcryptjs for security
- **CORS protection**: Domain-specific access

### **5. Deployment:**
- **Vercel**: Optimized for Next.js
- **Render**: Reliable Node.js hosting
- **MongoDB Atlas**: Managed database service

## 📈 Scalability Considerations

### **Horizontal Scaling:**
- **Stateless backend**: Easy horizontal scaling
- **MongoDB Atlas**: Auto-scaling database
- **CDN**: Vercel's global edge network

### **Performance:**
- **Code splitting**: Next.js automatic optimization
- **Caching**: Vercel's edge caching
- **Database indexing**: Optimized queries

This architecture provides a robust, scalable foundation for the Component & Multi-Component Generator Platform, meeting all assignment requirements while maintaining clean separation of concerns and modern development practices. 