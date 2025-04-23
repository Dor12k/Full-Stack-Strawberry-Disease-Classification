

import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '../../../components/Index/Header/SignInForm';
import axiosInstance from '../../../axiosInstance';


// Silence console logs during tests
console.log = jest.fn();


jest.mock('axios');
jest.mock('../../../axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
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
    axios.post.mockResolvedValueOnce({
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

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
    await waitFor(() => expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true));
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/home'));
  });
});
