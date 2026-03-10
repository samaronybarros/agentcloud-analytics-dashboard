import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { RoleProvider, useRole } from '@/lib/hooks/use-role';

function TestConsumer() {
  const { role, setRole } = useRole();
  return (
    <div>
      <span data-testid="role">{role}</span>
      <button onClick={() => setRole('admin')}>set-admin</button>
      <button onClick={() => setRole('manager')}>set-manager</button>
      <button onClick={() => setRole('engineer')}>set-engineer</button>
    </div>
  );
}

describe('useRole', () => {
  it('throws when used outside RoleProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useRole must be used within a RoleProvider',
    );
    spy.mockRestore();
  });

  it('defaults to engineer role (least-privileged)', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });

  it('switches to manager role', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );
    act(() => {
      screen.getByText('set-manager').click();
    });
    expect(screen.getByTestId('role').textContent).toBe('manager');
  });

  it('switches to engineer role', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );
    act(() => {
      screen.getByText('set-engineer').click();
    });
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });

  it('switches back to admin from another role', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );
    act(() => {
      screen.getByText('set-engineer').click();
    });
    expect(screen.getByTestId('role').textContent).toBe('engineer');
    act(() => {
      screen.getByText('set-admin').click();
    });
    expect(screen.getByTestId('role').textContent).toBe('admin');
  });
});
