import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HUD from '../../src/ui/HUD.jsx';

describe('HUD Component', () => {
  it('should render score', () => {
    render(<HUD score={1000} lives={3} level={1} fuel={100} />);
    expect(screen.getByText('Score: 1000')).toBeInTheDocument();
  });

  it('should render lives', () => {
    render(<HUD score={1000} lives={3} level={1} fuel={100} />);
    expect(screen.getByText('Lives: 3')).toBeInTheDocument();
  });

  it('should render level', () => {
    render(<HUD score={1000} lives={3} level={1} fuel={100} />);
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
  });

  it('should render fuel', () => {
    render(<HUD score={1000} lives={3} level={1} fuel={100} />);
    expect(screen.getByText('Fuel: 100%')).toBeInTheDocument();
  });

  it('should round fuel percentage', () => {
    render(<HUD score={1000} lives={3} level={1} fuel={75.5} />);
    expect(screen.getByText('Fuel: 76%')).toBeInTheDocument();
  });

  it('should render all HUD items', () => {
    render(<HUD score={5000} lives={2} level={3} fuel={50} />);
    expect(screen.getByText('Score: 5000')).toBeInTheDocument();
    expect(screen.getByText('Lives: 2')).toBeInTheDocument();
    expect(screen.getByText('Level: 3')).toBeInTheDocument();
    expect(screen.getByText('Fuel: 50%')).toBeInTheDocument();
  });
});
