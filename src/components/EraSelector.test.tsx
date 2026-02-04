import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EraSelector from './EraSelector';
import { EraProvider } from '@/context/EraContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock ThemeProvider since we rely on theme for borders
const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <EraProvider>
        {ui}
      </EraProvider>
    </ThemeProvider>
  );
};

describe('EraSelector', () => {
  it('renders all eras', () => {
    renderWithProviders(<EraSelector />);
    
    // Check if Taylor Swift (first era) is present
    expect(screen.getByText('Taylor Swift')).toBeInTheDocument();
    // Check if Midnights (last era) is present
    expect(screen.getByText('Midnights')).toBeInTheDocument();
  });

  it('selects an era when clicked', () => {
    renderWithProviders(<EraSelector />);
    
    const fearlessButton = screen.getByRole('radio', { name: /Fearless/i });
    fireEvent.click(fearlessButton);
    
    expect(fearlessButton).toHaveAttribute('aria-checked', 'true');
  });
  
  it('has correct accessibility attributes', () => {
    renderWithProviders(<EraSelector />);
    
    const group = screen.getByRole('radiogroup', { name: /Select Taylor Swift Era/i });
    expect(group).toBeInTheDocument();
    
    const buttons = screen.getAllByRole('radio');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
