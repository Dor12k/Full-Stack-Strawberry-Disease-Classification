


import React from 'react';
import Header from '../../../components/Index/Header';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axiosInstance from '../../../axiosInstance';


// Mock axios and axiosInstance
jest.mock('../../../axiosInstance', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  },
}));

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper function to render with contexts
const renderWithContexts = (ui, { user = null, isLoggedIn = false, setIsLoggedIn = jest.fn() } = {}) => {
  return render(
    <MemoryRouter>
      <UserContext.Provider value={{ user, setUser: jest.fn() }}>
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {ui}
        </AuthContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
};

describe('Header Integration Tests', () => {

    test('shows sign in button when user is not logged in', () => {
        renderWithContexts(<Header />, { isLoggedIn: false });

        const signInButton = screen.getByTestId('signin-nav-button');
        expect(signInButton).toBeInTheDocument();
    });

    test('clicking sign out button logs out the user and redirects to the home page', async () => {
        const setIsLoggedIn = jest.fn();

        // Render Header with logged-in user and mocked context
        renderWithContexts(<Header />, {
          user: { username: 'JohnDoe' },
          isLoggedIn: true,
          setIsLoggedIn,
        });
            

        const signOutButton = screen.getByTestId('signout-nav-button');
        expect(signOutButton).toBeInTheDocument();

        fireEvent.click(signOutButton);

        await waitFor(() => {
          // ✅ Verify that logout logic was triggered
          expect(setIsLoggedIn).toHaveBeenCalledWith(false);
          // ✅ Verify that navigate was called with the home path
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });


});


