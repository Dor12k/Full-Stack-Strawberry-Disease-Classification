


import React from 'react';
import Header from '../../../components/Index/Header';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';




const renderWithContexts = (ui, {
    user = null,
    isLoggedIn = false,
    setIsLoggedIn = jest.fn(),
    setUser = jest.fn()
  } = {}) => {

  return render(
    <MemoryRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {ui}
        </AuthContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
};



describe('Header', () => {

    test('shows guest auth buttons when logged out', () => {

        // Render the Header component with the user state set to null and isLoggedIn set to false
        renderWithContexts(<Header />, { user: null, isLoggedIn: false });
      
        // Assert that "Sign In" button is in the document
        const signInButton = screen.getByTestId('signin-nav-button');
        expect(signInButton).toBeInTheDocument();
      
        // Assert that "Sign Up" button is in the document
        const signUpButton = screen.getByTestId('signup-nav-button');
        expect(signUpButton).toBeInTheDocument();
        
          
    });
        
    test('shows member auth buttons when logged in', () => {

      renderWithContexts(<Header />, { user: { username: 'JohnDoe' }, isLoggedIn: true });

      // Assert that "Dashboard" button is in the document
      const signOutButton = screen.getByTestId('signout-nav-button');
      expect(signOutButton).toBeInTheDocument();
    
      // Assert that "Profile" button is in the document
      const profileButton = screen.getByTestId('profile-nav-button');
      expect(profileButton).toBeInTheDocument();

    });

    test('opens and closes the sign-up form when clicking Sign Up button', async () => {
      renderWithContexts(<Header />, { user: null, isLoggedIn: false });
    
      // Click on the "Sign In" button
      const signInButton = screen.getByTestId('signup-nav-button');
      fireEvent.click(signInButton);
    
      // Expect the modal to appear
      const modal = await screen.findByTestId('sign-up-modal');
      const modalWrapper = modal.parentElement;
    
      // Check the animation and styles of the modal
      expect(modalWrapper).toHaveClass('visible');
      expect(modalWrapper).toHaveClass('opacity-100');
      expect(modalWrapper).not.toHaveClass('pointer-events-none');  // verifying that pointer events are active
    
      // Find the Close button
      const closeButton = screen.getByRole('button', { name: 'Close' });
    
      // Click on the Close button
      fireEvent.click(closeButton);
    
      // Wait for the modal to close
      await waitFor(() => {
        expect(modalWrapper).toHaveClass('invisible');
        expect(modalWrapper).toHaveClass('opacity-0');
        expect(modalWrapper).toHaveClass('pointer-events-none');  // verifying that pointer events are disabled
      });
    
      // Clicking on the overlay should also close the modal
      const overlay = screen.getByTestId('sign-up-modal').parentElement.querySelector('.absolute');
      fireEvent.click(overlay);
    
      await waitFor(() => {
        expect(modalWrapper).toHaveClass('invisible');
        expect(modalWrapper).toHaveClass('opacity-0');
        expect(modalWrapper).toHaveClass('pointer-events-none');  // verifying that pointer events are disabled
      });
    });
    
    test('opens and closes the sign-in form when clicking Sign In button', async () => {
      renderWithContexts(<Header />, { user: null, isLoggedIn: false });
    
      // Click on the "Sign In" button
      const signInButton = screen.getByTestId('signin-nav-button');
      fireEvent.click(signInButton);
    
      // Expect the modal to appear
      const modal = await screen.findByTestId('sign-in-modal');
      const modalWrapper = modal.parentElement;
    
      // Check the animation and styles of the modal
      expect(modalWrapper).toHaveClass('visible');
      expect(modalWrapper).toHaveClass('opacity-100');
      expect(modalWrapper).not.toHaveClass('pointer-events-none');  // verifying that pointer events are active
    
      // Find the Close button
      const closeButton = screen.getByRole('button', { name: 'Close' });
    
      // Click on the Close button
      fireEvent.click(closeButton);
    
      // Wait for the modal to close
      await waitFor(() => {
        expect(modalWrapper).toHaveClass('invisible');
        expect(modalWrapper).toHaveClass('opacity-0');
        expect(modalWrapper).toHaveClass('pointer-events-none');  // verifying that pointer events are disabled
      });
    
      // Clicking on the overlay should also close the modal
      const overlay = screen.getByTestId('sign-in-modal').parentElement.querySelector('.absolute');
      fireEvent.click(overlay);
    
      await waitFor(() => {
        expect(modalWrapper).toHaveClass('invisible');
        expect(modalWrapper).toHaveClass('opacity-0');
        expect(modalWrapper).toHaveClass('pointer-events-none');  // verifying that pointer events are disabled
      });
    });

});
