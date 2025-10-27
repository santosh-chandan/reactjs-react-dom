import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <RegisterForm redirectTo="/" />
      </div>
    </div>
  );
};

export default RegisterPage;
