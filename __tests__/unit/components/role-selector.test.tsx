import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleSelector } from '@/components/dashboard/role-selector';
import { RoleProvider } from '@/lib/hooks/use-role';

function renderWithProvider() {
  return render(
    <RoleProvider>
      <RoleSelector />
    </RoleProvider>,
  );
}

describe('RoleSelector', () => {
  it('renders the role selector with label', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Viewing as')).toBeInTheDocument();
  });

  it('defaults to Platform Engineer (least-privileged)', () => {
    renderWithProvider();
    const select = screen.getByLabelText('Viewing as') as HTMLSelectElement;
    expect(select.value).toBe('engineer');
  });

  it('shows all three role options', () => {
    renderWithProvider();
    expect(screen.getByText('Org Admin')).toBeInTheDocument();
    expect(screen.getByText('Eng Manager')).toBeInTheDocument();
    expect(screen.getByText('Platform Engineer')).toBeInTheDocument();
  });

  it('changes role on selection', () => {
    renderWithProvider();
    const select = screen.getByLabelText('Viewing as') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'engineer' } });
    expect(select.value).toBe('engineer');
  });
});
