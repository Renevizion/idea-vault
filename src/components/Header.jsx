import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">
          <a href="/" className="hover:text-gray-300">IdeaVault</a>
        </h1>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                />
              )}
            </svg>
          </button>
        </div>

        <div className={`md:flex items-center ${isMobileMenuOpen ? 'block' : 'hidden'} md:block absolute md:static bg-gray-800 md:bg-transparent w-full md:w-auto left-0 top-16 md:top-auto py-4 md:py-0 z-20`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-center">
            {user ? (
              <>
                <li>
                  <span className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition duration-300 ease-in-out block">Welcome, {user.email}</span>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full md:w-auto"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition duration-300 ease-in-out block"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 block"
                  >
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;