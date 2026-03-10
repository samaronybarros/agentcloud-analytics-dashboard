import React from 'react';
import { render, screen } from '@testing-library/react';

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

import { useRole } from '@/lib/hooks/use-role';

function TestConsumer() {
  const { role } = useRole();
  return <span data-testid="role">{role}</span>;
}

describe('useRole', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
  });

  it('defaults to engineer when no role param is present', () => {
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });

  it('reads admin role from URL search params', () => {
    mockSearchParams = new URLSearchParams('role=admin');
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('admin');
  });

  it('reads manager role from URL search params', () => {
    mockSearchParams = new URLSearchParams('role=manager');
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('manager');
  });

  it('reads engineer role from URL search params', () => {
    mockSearchParams = new URLSearchParams('role=engineer');
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });

  it('defaults to engineer for invalid role values', () => {
    mockSearchParams = new URLSearchParams('role=superadmin');
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });

  it('defaults to engineer for empty role value', () => {
    mockSearchParams = new URLSearchParams('role=');
    render(<TestConsumer />);
    expect(screen.getByTestId('role').textContent).toBe('engineer');
  });
});
