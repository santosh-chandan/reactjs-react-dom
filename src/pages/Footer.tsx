import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-auto border-t border-gray-200">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} React Tailwind App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
