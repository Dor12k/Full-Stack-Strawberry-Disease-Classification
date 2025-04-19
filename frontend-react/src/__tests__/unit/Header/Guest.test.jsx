

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Guest from '../../../components/Index/Header/Guest'; 


// Hide console.log in testing
console.log = jest.fn(); 


describe('Guest component', () => {
  let mockSetType, mockSetShow;

  beforeEach(() => {
    mockSetType = jest.fn();
    mockSetShow = jest.fn();
    mockSetErrors = jest.fn();

    render(<Guest setType={mockSetType} setShow={mockSetShow} setErrors={mockSetErrors}/>);
  });

  test('renders Sign In and Sign Up buttons', () => {
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('clicking Sign In calls setType("signin") and setShow(true)', () => {
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(mockSetType).toHaveBeenCalledWith('signin');
    expect(mockSetShow).toHaveBeenCalledWith(true);
  });

  test('clicking Sign Up calls setType("signup") and setShow(true)', () => {
    fireEvent.click(screen.getByText(/Sign Up/i));
    expect(mockSetType).toHaveBeenCalledWith('signup');
    expect(mockSetShow).toHaveBeenCalledWith(true);
  });
});
