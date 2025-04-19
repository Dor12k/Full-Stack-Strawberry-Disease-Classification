import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { render, fireEvent, screen } from '@testing-library/react';
import EditProfilePopup from '../../../components/Profile/EditProfilePopup';
import { waitFor } from '@testing-library/react';

describe('EditProfilePopup', () => {

    const mockUser = {
        username: 'john_doe',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
    };

    const setup = (
        errors = {},
        loading = false,
        handleSaveBtn = jest.fn(),
        handleImageUpload = jest.fn(),
        setEditBtn = jest.fn(),
        setErrors = jest.fn(),
        refs = null
      ) => {
        const defaultRefs = {
          usernameRef: { current: { value: '' } },
          emailRef: { current: { value: '' } },
          passwordRef: { current: { value: '' } },
          newPasswordRef: { current: { value: '' } },
          firstNameRef: { current: { value: '' } },
          lastNameRef: { current: { value: '' } },
        };
      
        const finalRefs = refs ?? defaultRefs;
      
        const utils = render(
          <BrowserRouter>
            <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
              <EditProfilePopup
                user={mockUser}
                {...finalRefs}
                imagePreview=""
                handleImageUpload={handleImageUpload}
                handleSaveBtn={handleSaveBtn}
                loading={loading}
                setEditBtn={setEditBtn}
                setErrors={setErrors}
                errors={errors}
              />
            </UserContext.Provider>
          </BrowserRouter>
        );
      
        return { ...utils, setEditBtn, setErrors };
    };

    test('disables save button and shows spinner when loading', () => {
        setup({}, true); // loading = true
        const button = screen.getByRole('button', { name: /please wait/i });
        expect(button).toBeDisabled();
        expect(screen.getByTestId('edit-profile-popup')).toBeInTheDocument();
    });

    test('renders input fields with default values from user', () => {
        setup();
        expect(screen.getByLabelText(/Username/i)).toHaveValue(mockUser.username);
        expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email);
        expect(screen.getByLabelText(/First Name/i)).toHaveValue(mockUser.first_name);
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue(mockUser.last_name);
    });

    test('shows error messages if errors are provided', () => {
        const errors = {
            username: 'Username already exists',
            email: 'Invalid email address',
            error: 'Server error occurred',
        };
        setup(errors);

        expect(screen.getByText(errors.username)).toBeInTheDocument();
        expect(screen.getByText(errors.email)).toBeInTheDocument();
        expect(screen.getByText(errors.error)).toBeInTheDocument();
    });

    test('calls setEditBtn and setErrors when overlay is clicked', async () => {
        const setEditBtn = jest.fn();
        const setErrors = jest.fn();
        
        setup({}, false, jest.fn(), jest.fn(), setEditBtn, setErrors);

        fireEvent.click(screen.getByTestId('overlay-background'));

        // Using waitFor to ensure async calls are completed before assertion
        expect(setEditBtn).toHaveBeenCalledWith(false);
        expect(setErrors).toHaveBeenCalledWith('');    
    });

    test('calls handleImageUpload when file input changes', () => {
        const handleImageUpload = jest.fn();
    
        setup({}, false, jest.fn(), handleImageUpload); // Pass the mocked handleImageUpload

        const fileInput = screen.getByTestId('input-img-edit');
        fireEvent.change(fileInput, {
            target: { files: [new File(['dummy'], 'avatar.png', { type: 'image/png' })] },
        });
    
        expect(handleImageUpload).toHaveBeenCalled();
    });

    test('calls handleSaveBtn when form is submitted', () => {
        const handleSaveBtn = jest.fn();

        setup({}, false, handleSaveBtn, jest.fn()); // Pass the mocked handleSaveBtn

        const button = screen.getByRole('button', { name: /save/i });
        fireEvent.click(button);
        expect(handleSaveBtn).toHaveBeenCalled();
    });


    
});
