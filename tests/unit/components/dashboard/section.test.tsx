import React from 'react';
import { render, screen } from '@testing-library/react';
import { Section } from '@/components/dashboard/section';

describe('Section', () => {
  it('renders title as a heading', () => {
    render(
      <Section title="Runs Over Time">
        <p>Chart goes here</p>
      </Section>,
    );
    expect(
      screen.getByRole('heading', { name: 'Runs Over Time' }),
    ).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Section title="Test">
        <span data-testid="child">Hello</span>
      </Section>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Section title="Multi">
        <span data-testid="first">A</span>
        <span data-testid="second">B</span>
      </Section>,
    );
    expect(screen.getByTestId('first')).toBeInTheDocument();
    expect(screen.getByTestId('second')).toBeInTheDocument();
  });

  it('uses a section element for semantic structure', () => {
    const { container } = render(
      <Section title="Semantic">
        <p>Content</p>
      </Section>,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
