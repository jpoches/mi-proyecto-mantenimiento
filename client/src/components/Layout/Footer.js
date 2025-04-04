// client/src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-100 py-3 px-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left text-sm text-gray-600">
            &copy; {currentYear} Alvarez Construcciones. Todos los derechos reservados.
          </div>
          <div className="mt-2 md:mt-0 text-sm text-gray-500">
            Versión 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;