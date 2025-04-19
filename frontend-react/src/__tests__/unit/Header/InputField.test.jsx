

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';  // Import necessary testing utilities
import InputField from '../../../components/Index/Header/InputField'; // Import the component to test




// Test suite for the InputField component
describe('InputField Component', () => {

  // Test case to check if label and placeholder are rendered correctly
  test('renders label and placeholder correctly', () => {
    render(
      <InputField
        label="Username"                // The label to display next to the input
        name="username"                 // The input's name attribute
        id="username"                   // The input's id attribute
        placeholder="Enter your username"  // The placeholder text
        type="text"                     // The input's type
        value=""                        // The initial value of the input
        onChange={() => {}}             // The onChange handler (mocked as empty)
        autoComplete="off"              // Disable autocomplete
        className="input-class"         // The CSS class for styling
      />
    );

    // Check that the label is rendered and has the correct text
    expect(screen.getByLabelText('Username')).toBeInTheDocument();

    // Check that the placeholder text is rendered in the input field
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
  });

  // Test case to check if the input field correctly responds to the onChange event
  test('responds to onChange event', () => {
    const handleChange = jest.fn(); // Create a mock function for onChange

    render(
      <InputField
        label="Email"
        name="email"
        id="email"
        placeholder="Enter your email"
        type="email"
        value=""
        onChange={handleChange}  // Pass the mock function to the onChange prop
        autoComplete="off"
        className=""
      />
    );

    const input = screen.getByPlaceholderText('Enter your email'); // Get the input by its placeholder text
    
    // Simulate typing in the input field by firing the change event
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    // Assert that the onChange handler was called
    expect(handleChange).toHaveBeenCalled();
  });
});
