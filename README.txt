src/
    │── api/                     # API call helpers (axios/fetch setup)
    │   ├── axiosClient.js
    │   ├── userApi.js
    │   ├── postApi.js
    │   └── commentApi.js
    │
    │── app/                     # Global app setup
    │   ├── store.js             # Redux store (or Zustand/Context API)
    │   └── rootReducer.js
    │
    │── features/                # Feature-based structure (scalable 🚀)
    │   ├── users/
    │   │   ├── components/       # UI specific to Users
    │   │   │   ├── UserList.jsx
    │   │   │   ├── UserProfile.jsx
    │   │   │   └── UserForm.jsx
    │   │   ├── userSlice.js      # Redux slice (or Zustand store)
    │   │   ├── userHooks.js      # Custom hooks for users
    │   │   └── index.js          # Entry point for users feature
    │   │
    │   ├── posts/
    │   │   ├── components/
    │   │   │   ├── PostList.jsx
    │   │   │   ├── PostDetails.jsx
    │   │   │   └── PostForm.jsx
    │   │   ├── postSlice.js
    │   │   ├── postHooks.js
    │   │   └── index.js
    │   │
    │   ├── comments/
    │   │   ├── components/
    │   │   │   ├── CommentList.jsx
    │   │   │   └── CommentForm.jsx
    │   │   ├── commentSlice.js
    │   │   ├── commentHooks.js
    │   │   └── index.js
    │
    │── components/              # Reusable shared components (buttons, modals, forms)
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   └── Modal.jsx
    │
    │── hooks/                   # Global reusable hooks
    │   ├── useAuth.js
    │   ├── useFetch.js
    │   └── useDebounce.js
    │
    │── pages/                   # Route-level components (mapped to React Router/Next.js)
    │   ├── HomePage.jsx
    │   ├── UsersPage.jsx
    │   ├── PostsPage.jsx
    │   └── PostDetailsPage.jsx
    │
    │── utils/                   # Utility functions
    │   ├── formatDate.js
    │   ├── validateForm.js
    │   └── constants.js
    │
    │── assets/                  # Static assets (images, icons, fonts, styles)
    │   ├── images/
    │   ├── icons/
    │   └── styles/
    │       ├── global.css
    │       └── variables.css
    │
    │── App.jsx                  # Root component
    │── index.jsx                # Entry point (ReactDOM.createRoot)
    │── routes.js                # Central route definitions
