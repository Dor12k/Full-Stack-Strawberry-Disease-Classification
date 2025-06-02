import React from 'react';
import axios from 'axios';
import SignUpForm from '../../../components/Index/Header/SignUpForm';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../../axiosInstance';


// Mock axiosInstance
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

// Hide console.log in testing
console.log = jest.fn(); 

// Pass prop
const setShow = jest.fn();

// Mock useNavigate from react-router-dom BEFORE the component is imported
const mockedNavigate = jest.fn();

// Reset the mocks
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Utility wrapper to provide routing context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SignUpForm Component Test', () => {

  
  const errors = {};
  const mockSetErrors = jest.fn();
  const mockSetShow = jest.fn();

  function SignUpFormWrapper() {
    const [errors, setErrors] = React.useState({});
    const [show, setShow] = React.useState(true);
  
    return (
      <SignUpForm
        errors={errors}
        setErrors={setErrors}
        setShow={setShow}
      />
    );
  }

  test('renders all input fields and button', () => {
    renderWithRouter(<SignUpForm errors={errors} setErrors={mockSetErrors} setShow={mockSetShow}/>);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('submits form and navigates on success', async () => {
    axiosInstance.post.mockResolvedValueOnce({ 
      data: {
        id: 96,
        username: 'testuser',
        email: 'test@example.com',
        first_name: '',
        last_name: '',
      },
      status: 201, 
      statusText: 'Created', 
      headers: {
        'content-length': '126',
        'content-type': 'application/json',
      },
    });

    renderWithRouter(<SignUpFormWrapper />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Strongpassword123*' },
    });

    const buttons = screen.getAllByText(/Sign Up/i);
    const submitButton = buttons.find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays validation errors from the server', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        status: 400, 
        data: {
          username: "Username can't contain spaces.",
          email: "Email can't contain special characters.",
          password: "Password must contain at least one uppercase letter."
        },
        statusText: 'Bad Request',
        headers: {
          'content-type': 'application/json',
        },
      },
    });

    renderWithRouter(<SignUpFormWrapper />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'test user' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalidemail!#@emai.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'StrongPassword123' },
    });

    const buttons = screen.getAllByText(/Sign Up/i);
    const submitButton = buttons.find(button => button.type === 'submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.findByTestId('username-error')).resolves.toHaveTextContent("Username can't contain spaces.");
      expect(screen.findByTestId('email-error')).resolves.toHaveTextContent("Email can't contain special characters.");
      expect(screen.findByTestId('password-error')).resolves.toHaveTextContent("Password must contain at least one uppercase letter.");
      
    });
  });

  // Consolidated parameterized test for email validation errors
  const emailErrorCases = [
    {
      label: "existing email",
      value: "test@test.com",
      expectedError: "Email already exists.",
    },
    {
      label: "email with empty value",
      value: "",
      expectedError: "Email can't be empty.",
    },
    {
      label: "email with special characters",
      value: "test*@test.com",
      expectedError: "Email can't contain special characters.",
    },
  ];

  // Testing email invalid values
  test.each(emailErrorCases)(
    "shows error '$expectedError' when $label",
    async ({ value, expectedError }) => {
      axiosInstance.post.mockRejectedValueOnce({
        response: {
          status: 400, 
          data: {
            email: expectedError
          },
          statusText: 'Bad Request',
          headers: {
            'content-type': 'application/json',
          },
        },
      });

      renderWithRouter(<SignUpFormWrapper />);

      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test*@test.com' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'StrongPassword123!*' },
      });

      const buttons = screen.getAllByText(/Sign Up/i);
      const submitButton = buttons.find(button => button.type === 'submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.findByTestId('email-error')).resolves.toHaveTextContent(expectedError);
      });
    }
  );


  // Consolidated parameterized test for username validation errors
  const usernameErrorCases = [
    {
      label: "username with empty value",
      value: "",
      expectedError: "Username can't be empty.",
    },
    {
      label: "existing username",
      value: "test",
      expectedError: "Username already exists.",
    },
    {
      label: "username with spaces",
      value: "user name",
      expectedError: "Username can't contain spaces.",
    },
    {
      label: "username with special characters",
      value: "test*",
      expectedError: "Username can't contain special characters.",
    },
  ];

  // Testing username invalid values
  test.each(usernameErrorCases)(
    "shows error '$expectedError' when $label",
    async ({ value, expectedError }) => {
      axiosInstance.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            username: expectedError,
          },
          headers: {
            'content-type': 'application/json',
          },
        },
      });

      renderWithRouter(<SignUpFormWrapper />);

      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@test.com' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'StrongPassword123!*' },
      });
      
      const buttons = screen.getAllByText(/Sign Up/i);
      const submitButton = buttons.find(button => button.type === 'submit');
      fireEvent.click(submitButton);
      const errorElement = await screen.findByTestId('username-error');
      expect(errorElement).toHaveTextContent(expectedError);
    }
  );


  // Consolidated parameterized test for username validation errors
  const passwordErrorCases = [
    {
      label: "password with empty value",
      value: "",
      expectedError: "Password can't be empty.",
    },
    {
      label: "password without uppercase letter",
      value: "strongpassword123",
      expectedError: "Password must contain at least one uppercase letter.",
    },
    {
      label: "password without special characters",
      value: "StrongPassword123",
      expectedError: "Password must contain at least one special character.",
    },
    {
      label: "password without number",
      value: "StrongPassword",
      expectedError: "Password must contain at least one number.",
    },
  ];
  
  // Testing password invalid values
  test.each(passwordErrorCases)(
    "shows error '$expectedError' when $label",
    async ({ value, expectedError }) => {
      axiosInstance.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            password: expectedError,
          },
          headers: {
            'content-type': 'application/json',
          },
        },
      });

      renderWithRouter(<SignUpFormWrapper />);

      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: 'testuser' },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'test@test.com' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value },
      });

        
      const buttons = screen.getAllByText(/Sign Up/i);
      const submitButton = buttons.find(button => button.type === 'submit');
      fireEvent.click(submitButton);
      const errorElement = await screen.findByTestId('password-error');
      expect(errorElement).toHaveTextContent(expectedError);
    }
  );
  
  // Parameterized test for empty fields
  const emptyFieldCases = [
    {
      label: 'empty email',
      fields: { username: 'testuser', email: '', password: 'StrongPassword123!*' },
      expectedError: 'Email cannot be empty.',
      testid: 'email-error',
    },
    {
      label: 'empty username',
      fields: { username: '', email: 'test@test.com', password: 'StrongPassword123!*' },
      expectedError: 'Username cannot be empty.',
      testid: 'username-error',
    },
    {
      label: 'empty password',
      fields: { username: 'testuser', email: 'test@test.com', password: '' },
      expectedError: 'Password must contain at least one uppercase letter.',
      testid: 'password-error',
    }
  ];

  test.each(emptyFieldCases)(
    'shows error "$expectedError" when $label',
    async ({ fields, expectedError, testid }) => {
      axiosInstance.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            ...(fields.email === '' && { email: expectedError }),
            ...(fields.username === '' && { username: expectedError }),
            ...(fields.password === '' && { password: expectedError }),
          },
          headers: {
            'content-type': 'application/json',
          },
        },
      });

      renderWithRouter(<SignUpFormWrapper />);

      fireEvent.change(screen.getByLabelText(/Username/i), {
        target: { value: fields.username },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: fields.email },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: fields.password },
      });

      const buttons = screen.getAllByText(/sign up/i);
      const submitButton = buttons.find(button => button.type === 'submit');
      fireEvent.click(submitButton);
      
      const errorElement = await screen.findByTestId(testid);
      expect(errorElement).toHaveTextContent(expectedError);
    }
  );

});
