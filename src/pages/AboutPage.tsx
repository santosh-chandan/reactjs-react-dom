import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold text-primary mb-4">About Us</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        This app is built using React 18, TypeScript, Tailwind CSS, and Vite — a
        fast and minimal setup perfect for modern front-end development.
      </p>
    </section>
  );
};

export default AboutPage;
