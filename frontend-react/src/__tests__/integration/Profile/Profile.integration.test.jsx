import React from "react";
import axiosInstance from '../../../axiosInstance';
import Profile from "../../../pages/Profile/Profile";
import { UserContext } from '../../../context/UserContext';
import { AuthContext } from '../../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

// Silence console logs during tests
console.log = jest.fn();


jest.mock('../../../axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
  },
}));


// mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: '',
  last_name: '',
};

const renderWithProviders = () => {
  
  const mockSetUser = jest.fn(); 
  const mockSetIsLoggedIn = jest.fn();
  
  const Wrapper = () => {
    const [user, setUser] = React.useState(mockUser);
    const [isLoggedIn] = React.useState(true);
  
    const handleSetUser = (newUser) => {
      console.log('Setting user:', newUser); 
      mockSetUser(newUser);
      setUser(newUser);
    };
  
    return (
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
          <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: mockSetIsLoggedIn }}>
            <Profile />
          </AuthContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  };
  

  return [render(<Wrapper />), mockSetUser, mockSetIsLoggedIn];
};




describe("Testing Integration", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
    
  beforeAll(() => {
    window.alert = jest.fn();
  });

  test("Edit profile popup open when button clicked", () => {
    renderWithProviders();

    const editButton = screen.getByText('Edit Profile');

    fireEvent.click(editButton);

    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();
  });

  test("Edit profile popup close when overlay clicked", () => {
    renderWithProviders();

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();

    const overlayButton = screen.getByTestId('overlay-background');
    fireEvent.click(overlayButton);

    expect(popupTitle).not.toBeInTheDocument();
  });

  test("Edit profile popup open with user details", () => {
    renderWithProviders();

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();

    expect(screen.getByLabelText(/Username/i)).toHaveValue(mockUser.username);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
    expect(screen.getByLabelText(/First Name/i)).toHaveValue(mockUser.first_name);
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue(mockUser.last_name);
  });

  test("Edit user profile details and send it to the server", async () => {

    localStorage.setItem('access_token', 'mockAccessToken');
    localStorage.setItem('refresh_token', 'mockRefreshToken');
  
    axiosInstance.put.mockResolvedValueOnce({
      data: {
        id: 2,
        email: 'updatedemail@example.com',
        username: 'updateduser',
        first_name: 'updatedFirstName',
        last_name: 'updatedLastName',
      },
      headers: {
        'content-type': 'application/json',
        access: 'mockAccessToken',
        refresh: 'mockRefreshToken',
      }
    });
  
    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();

    fireEvent.click(screen.getByText('Edit Profile'));
  
    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updatedemail@example.com' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'Strongpassword123*' } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: 'updatedpassword1!' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'updatedFirstName' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'updatedLastName' } });
  
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/users/1/',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 2,
        username: 'updateduser',
        email: 'updatedemail@example.com',
        first_name: 'updatedFirstName',
        last_name: 'updatedLastName',
      });
    });
  
    expect(screen.getByText('updateduser')).toBeInTheDocument();
    expect(screen.getByText('updatedemail@example.com')).toBeInTheDocument();
    expect(screen.getByText('updatedFirstName')).toBeInTheDocument();
    expect(screen.getByText('updatedLastName')).toBeInTheDocument();
  });
  
  beforeAll(() => {
    window.confirm = jest.fn(() => true); 
  });

  test("Shows error messages for invalid values for edit user details", async () => {

    localStorage.setItem('access_token', 'mockAccessToken');
    localStorage.setItem('refresh_token', 'mockRefreshToken');
  
    axiosInstance.put.mockRejectedValueOnce({
      response: {
        data: {
          password: "Current password is incorrect",
        },
        headers: {
          'content-type': 'application/json',
        },
      },
    });

    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();

    fireEvent.click(screen.getByText('Edit Profile'));
  
    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'updated user' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updatedemail*@example.com' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'Strongpassword123' } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: 'updatedpassword!' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'updatedFirstName' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'updatedLastName' } });
  
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/users/1/',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText("Current password is incorrect")).toBeInTheDocument();
    });  
  });

  beforeAll(() => {
    window.confirm = jest.fn(() => true); 
  });

  test("Shows error messages for invalid values for edit user details", async () => {

    localStorage.setItem('access_token', 'mockAccessToken');
    localStorage.setItem('refresh_token', 'mockRefreshToken');
  
    axiosInstance.put.mockRejectedValueOnce({
      response: {
        data: {
          username: "Username can't contain spaces.",
          email: "Email can't contain special characters.",
          password: "Current password is incorrect",
          new_password: "Password must contain at least one number.",
        },
        headers: {
          'content-type': 'application/json',
        },
      },
    });

    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();

    fireEvent.click(screen.getByText('Edit Profile'));
  
    const popupTitle = screen.getByLabelText("New Password");
    expect(popupTitle).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'updated user' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updatedemail*@example.com' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'Strongpassword123*' } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: 'updatedpassword!' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'updatedFirstName' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'updatedLastName' } });
  
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/users/1/',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText("Username can't contain spaces.")).toBeInTheDocument();
      expect(screen.getByText("Email can't contain special characters.")).toBeInTheDocument();
      expect(screen.getByText("Password must contain at least one number.")).toBeInTheDocument();
    });  
  });

  beforeAll(() => {
    window.confirm = jest.fn(() => true); 
  });

  test("Delete user account and handle state/logout properly", async () => {

    localStorage.setItem('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');

    window.confirm = jest.fn(() => true);

    axiosInstance.delete.mockResolvedValueOnce({});

    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });

    await waitFor(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/users/1/', {
        headers: {
          Authorization: 'Bearer mockAccessToken',
        },
      });
    });

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  beforeAll(() => {
    window.confirm = jest.fn(() => true); 
  });

  test("Shows error alert when user deletion fails", async () => {
    localStorage.setItem('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  
    window.confirm = jest.fn(() => true);
  
    // Mocking axios rejection with a general error response
    axiosInstance.delete.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          message: 'Internal Server Error',  // The actual message from the server
        },
      },
    });
  
    window.alert = jest.fn(); // Mocking the alert function
  
    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/users/1/', {
        headers: {
          Authorization: 'Bearer mockAccessToken',
        },
      });
    });
  
    // Check if the alert displays the actual error message from the server
    expect(window.alert).toHaveBeenCalledWith('Internal Server Error');
  
    // Ensure state and localStorage are not changed
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
  });
  
  
  
  
  beforeAll(() => {
    window.confirm = jest.fn(() => true); 
  });

  test("Shows server error message when deletion fails", async () => {
    localStorage.setItem('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  
    window.confirm = jest.fn(() => true);
  
    // Mocking axios rejection with a custom error message from the server
    axiosInstance.delete.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'You are not authorized to perform this action.',
        },
      },
    });
  
    window.alert = jest.fn(); // Mocking the alert function
  
    const [_, mockSetUser, mockSetIsLoggedIn] = renderWithProviders();
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/users/1/', {
        headers: {
          Authorization: 'Bearer mockAccessToken',
        },
      });
    });
  
    // Check if the alert displays the server's error message
    expect(window.alert).toHaveBeenCalledWith('You are not authorized to perform this action.');
  
    // Make sure state and localStorage haven't changed
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
  });
  



});
