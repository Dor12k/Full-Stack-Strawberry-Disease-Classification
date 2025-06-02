

import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '../../../components/Index/Header/SignInForm';
import axiosInstance from '../../../axiosInstance';


// Silence console logs during tests
console.log = jest.fn();


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

const mockedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({ user_id: 2 }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignInForm Integration Tests', () => {

  test('successful sign in triggers axiosInstance.get and context updates', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        id: 2,
        email: 'test@test.com',
        username: 'testuser',
      },
    });

    const errors = {};
    const mockSetErrors = jest.fn();
    const mockSetShow = jest.fn();
    const mockSetUser = jest.fn();
    const mockSetIsLoggedIn = jest.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn: mockSetIsLoggedIn }}>
          <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
            <SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />
          </UserContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Strongpassword123*' } });

    const submitButton = screen.getAllByText(/Sign In/i).find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
    await waitFor(() => expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/home'));
  });
});
