import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Menu from '../../src/ui/Menu.jsx';

describe('Menu Component', () => {
  it('should render title', () => {
    render(<Menu onStart={() => {}} />);
    expect(screen.getByText('Interludious')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    render(<Menu onStart={() => {}} />);
    expect(screen.getByText('A modern take on the classic Thrust')).toBeInTheDocument();
  });

  it('should render start button', () => {
    render(<Menu onStart={() => {}} />);
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should call onStart when button clicked', () => {
    const onStart = vi.fn();
    render(<Menu onStart={onStart} />);
    
    const button = screen.getByText('Start Game');
    button.click();
    
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
