

// tests/unit/components/Member.test.jsx

import React from 'react';
import Member from '../../../components/Index/Header/Member';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserContext } from '../../../context/UserContext';


// Hide console.log in testing
console.log = jest.fn(); 


// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe('Member component', () => {
  const mockSetIsLoggedIn = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', 'mockUser');
    localStorage.setItem('accessToken', 'mockAccess');
    localStorage.setItem('refreshToken', 'mockRefresh');
  });

  test('renders the Sign Out and Profile buttons', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: {}, setUser: mockSetUser }}>
          <Member setIsLoggedIn={mockSetIsLoggedIn} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(getByText(/Sign Out/i)).toBeInTheDocument();
    expect(getByText(/Profile/i)).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { name: 'test' }, setUser: mockSetUser }}>
          <Member setIsLoggedIn={mockSetIsLoggedIn} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Sign Out/i));

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });


  test('Profile button links to the profile page', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { username: 'JohnDoe' }, setUser: jest.fn() }}>
          <Member setIsLoggedIn={jest.fn()} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  
    const profileButton = screen.getByTestId('profile-nav-button');
  
    // Ensure the button is in the document
    expect(profileButton).toBeInTheDocument();
  
    // Ensure it's wrapped with a <Link> that points to "/profile"
    const linkElement = profileButton.closest('a');
    expect(linkElement).toHaveAttribute('href', '/profile');
  });

});
