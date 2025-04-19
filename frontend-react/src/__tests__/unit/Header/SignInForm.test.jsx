import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '../../../components/Index/Header/SignInForm';

// Silence console logs during tests
console.log = jest.fn();

// Mock axios and axiosInstance
jest.mock('axios');
jest.mock('../../../axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));



// Mock react-router-dom navigate (not used in unit tests, but imported)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderWithRouter = (ui) => {
  
  const mockSetUser = jest.fn();
  const mockSetIsLoggedIn = jest.fn();

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn: mockSetIsLoggedIn }}>
        <UserContext.Provider value={{ user: null, setUser: mockSetUser}}>
          {ui}
        </UserContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignInForm Unit Tests', () => {


  const errors = {};
  const mockSetErrors = jest.fn();
  const mockSetShow = jest.fn();

  test('renders the sign in form', () => {
      
    renderWithRouter(<SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('submits form and calls axios.post for login', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      },
    });

    renderWithRouter(<SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Strongpassword123*' } });

    const submitButton = screen.getAllByText(/Sign In/i).find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test.each([
    
    { label: "email with empty value", value: "", expectedError: "Email cannot be empty." },
    { label: "email with special characters", value: "test*@test.com", expectedError: "Email can't contain special characters." },
  ])
  ('shows error "$expectedError" when $label', async ({ value, expectedError }) => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { email: [expectedError] },
        headers: { 'content-type': 'application/json' },
      },
    });

    renderWithRouter(<SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'StrongPassword123!*' } });

    const submitButton = screen.getAllByText(/Sign In/i).find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.findByTestId('email-error')).resolves.toHaveTextContent(expectedError);
      });
  });

  test('displays error message when login fails due to incorrect password', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: "Invalid username, email or password." },
        headers: { 'content-type': 'application/json' },
      },
    });

    renderWithRouter(<SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword123*' } });

    const submitButton = screen.getAllByText(/Sign In/i).find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.findByTestId('error-error')).resolves.toHaveTextContent("Invalid username, email or password.");
    });

  });

  test('displays error message when login fails due to missing password', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { password: "Password is required." },
        headers: { 'content-type': 'application/json' },
      },
    });

    renderWithRouter(<SignInForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword123' } });

    const submitButton = screen.getAllByText(/Sign In/i).find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.findByTestId('password-error')).resolves.toHaveTextContent("Password is required.");
    });

  });







});
