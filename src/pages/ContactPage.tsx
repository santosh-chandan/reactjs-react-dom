import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
      <p className="text-gray-600 mb-6">
        Have any questions? Feel free to reach out!
      </p>
      <form className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />
        <textarea
          placeholder="Your Message"
          className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 focus:ring-2 focus:ring-primary outline-none"
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default ContactPage;
