import React from 'react';  // Add this import at the top
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/navbar/NavBar';

test('renders the NavBar with the correct links', () => {
  render(
    <MemoryRouter>
      <NavBar finishedEditing={false} />
    </MemoryRouter>
  );

  expect(screen.getByText('View All Budgets')).toBeInTheDocument();
  expect(screen.getByText('Add New Budget')).toBeInTheDocument();
});



// render(<NavBar finishedEditing={false} />):
// This renders the NavBar component in a simulated DOM environment provided by React Testing Library.
// The finishedEditing={false} prop is passed just to ensure the component mounts correctly, 
//but it isn’t doing anything significant here—since the focus is only on the static UI.
// expect(screen.getByText('View All Budgets')).toBeInTheDocument();:
// screen.getByText() looks for a specific element in the rendered DOM that matches the given text: 'View All Budgets'.
// .toBeInTheDocument() is an assertion that ensures the queried element actually exists in the DOM.