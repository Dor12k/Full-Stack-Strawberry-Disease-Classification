

// __tests__/unit/Profile/UserProfileCard.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfileCard from '../../../components/Profile/UserProfileCard';

describe('UserProfileCard', () => {

  const mockUser = {
    username: 'john_doe',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    profile_picture: 'https://example.com/profile.jpg',
  };

  test('renders user profile data correctly', () => {
    render(
      <UserProfileCard
        user={mockUser}
        onEditPopUp={jest.fn()}
        onDeleteBtn={jest.fn()}
        loading={false}
      />
    );

    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  test('renders profile placeholder if no profile picture is provided', () => {
    const userWithoutPicture = { ...mockUser, profile_picture: '' };

    render(
      <UserProfileCard
        user={userWithoutPicture}
        onEditPopUp={jest.fn()}
        onDeleteBtn={jest.fn()}
        loading={false}
      />
    );

    expect(screen.getByTestId('profile-placeholder')).toBeInTheDocument();
  });

  test('calls onEditPopUp with true when Edit Profile button is clicked', () => {
    const onEditPopUp = jest.fn();

    render(
      <UserProfileCard
        user={mockUser}
        onEditPopUp={onEditPopUp}
        onDeleteBtn={jest.fn()}
        loading={false}
      />
    );

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    expect(onEditPopUp).toHaveBeenCalledWith(true);
  });

  test('calls onDeleteBtn when Delete Profile button is clicked and not loading', () => {
    const onDeleteBtn = jest.fn();

    render(
      <UserProfileCard
        user={mockUser}
        onEditPopUp={jest.fn()}
        onDeleteBtn={onDeleteBtn}
        loading={false}
      />
    );

    const deleteButton = screen.getByText('Delete Profile');
    fireEvent.click(deleteButton);

    expect(onDeleteBtn).toHaveBeenCalled();
  });

  test('disables delete button and shows spinner when loading is true', () => {
    render(
      <UserProfileCard
        user={mockUser}
        onEditPopUp={jest.fn()}
        onDeleteBtn={jest.fn()}
        loading={true}
      />
    );

    const loadingButton = screen.getByRole('button', { name: /please wait/i });
    expect(loadingButton).toBeDisabled();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

});
