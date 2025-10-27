import React from 'react';

const HomePage: React.FC = () => {
  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">Welcome Home!</h1>
      <p className="text-gray-600 max-w-lg mx-auto">
        This is a modern React + TypeScript + Tailwind setup with a common layout.
      </p>
    </section>
  );
};

export default HomePage;
