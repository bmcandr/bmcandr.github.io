import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from '../Map';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn().mockImplementation(() => ({
      remove: vi.fn(),
    })),
  },
}));

describe('Map', () => {
  test('renders a container div', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  test('applies default height of 400px', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} />);
    const div = container.querySelector('div') as HTMLDivElement;
    expect(div.style.height).toBe('400px');
  });

  test('applies custom height', () => {
    const { container } = render(<Map center={[0, 0]} zoom={2} height="600px" />);
    const div = container.querySelector('div') as HTMLDivElement;
    expect(div.style.height).toBe('600px');
  });
});
