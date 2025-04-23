

// __tests__/unit/Profile/Profile.test.jsx

import React from 'react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { AuthContext } from '../../../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../../../pages/Profile/Profile';
import axiosInstance from '../../../axiosInstance';


// Silence console logs during tests
console.log = jest.fn();

// Mock navigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

// Mock axios
jest.mock('../../../axiosInstance');

describe('Unit Tests: Profile.jsx', () => {
  const mockUser = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    profile_picture: '',
  };

  const renderProfile = (user = mockUser) => {
    return render(
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser: jest.fn() }}>
          <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
            <Profile />
          </AuthContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    window.alert = jest.fn();
  });
  
  test('renders loading spinner if user is null', () => {
    renderProfile(null);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders profile data', () => {
    renderProfile();
    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('opens EditProfilePopup on Edit click', async () => {
    renderProfile();

    const editBtn = screen.getByText('Edit Profile');
    fireEvent.click(editBtn);

    expect(await screen.getByTestId('editProfile-save-button')).toBeInTheDocument();
  });

  test('deletes user and navigates to home on confirm', async () => {
    axiosInstance.delete.mockResolvedValueOnce({});

    window.confirm = jest.fn(() => true); // Simulate clicking "OK" in confirm dialog
    const mockSetUser = jest.fn();
    const mockSetIsLoggedIn = jest.fn();

    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: mockSetIsLoggedIn }}>
            <Profile />
          </AuthContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    const deleteBtn = screen.getByText('Delete Profile');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('does not delete user if confirm is cancelled', async () => {
    window.confirm = jest.fn(() => false); // User clicks cancel
    renderProfile();

    const deleteBtn = screen.getByText('Delete Profile');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(axiosInstance.delete).not.toHaveBeenCalled();
    });
  });

  test('handles delete error gracefully', async () => {
    axiosInstance.delete.mockRejectedValueOnce(new Error('Delete failed'));
    window.confirm = jest.fn(() => true);
    renderProfile();

    const deleteBtn = screen.getByText('Delete Profile');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    
  });

  test('shows error if current password is empty on save', async () => {
    renderProfile();
  
    const editBtn = screen.getByText('Edit Profile');
    fireEvent.click(editBtn);
  
    const saveBtn = await screen.getByTestId('editProfile-save-button');
  
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: '' } });
  
    fireEvent.click(saveBtn);
  
    await waitFor(() => {
      expect(screen.getByText('Please enter your current password')).toBeInTheDocument();
    });
  });

  test('uploads and displays profile image', async () => {
    const file = new Blob(['file contents'], { type: 'image/png' });
    file.name = 'profile.png';
  
    renderProfile();
  
    fireEvent.click(screen.getByText('Edit Profile'));
  
    await waitFor(() => {
      expect(screen.getByTestId('edit-profile-popup')).toBeInTheDocument();
    });
  
    const inputFile = screen.getByTestId('input-img-edit'); 
  
    fireEvent.change(inputFile, { target: { files: [file] } });
  
    await waitFor(() => {
        // Make sure the placeholder text is no longer in the document
        expect(screen.queryByText('Upload your profile picture')).not.toBeInTheDocument();
        
        // Check if the image preview appears
        expect(screen.getByAltText('Edit Profile')).toHaveAttribute('src', expect.any(String));
    });
  });
  
});
