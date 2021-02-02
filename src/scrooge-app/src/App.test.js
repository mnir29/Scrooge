import { render, screen } from '@testing-library/react';
import App from './App';

// Very simple test for instruction text to be in the document
test('renders learn react link', () => {
  render(<App />);
  const instruction = screen.getByText(/to make a/i);
  expect(instruction).toBeInTheDocument();
});
