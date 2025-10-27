import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

// Root App Component
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* RouterProvider injects all routes */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
