import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition } from '../PageTransition';

// Helper component to trigger navigation
const NavigationHelper = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  return <button onClick={() => navigate(to)}>Navigate</button>;
};

describe('PageTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders children through Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PageTransition />}>
            <Route path="/" element={<div data-testid="child">Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies visible styles initially', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PageTransition />}>
            <Route path="/" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const container = document.querySelector('.translate-y-0.opacity-100');
    expect(container).toBeInTheDocument();
  });

  it('hides content during transition and shows after delay', async () => {
    render(
      <MemoryRouter initialEntries={['/page1']}>
        <Routes>
          <Route element={<PageTransition />}>
            <Route
              path="/page1"
              element={
                <div>
                  <NavigationHelper to="/page2" />
                  Page 1
                </div>
              }
            />
            <Route path="/page2" element={<div>Page 2</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Initially visible
    expect(document.querySelector('.translate-y-0.opacity-100')).toBeInTheDocument();

    // Trigger navigation
    act(() => {
      screen.getByText('Navigate').click();
    });

    // Should be hidden during transition
    expect(document.querySelector('.translate-y-2.opacity-0')).toBeInTheDocument();

    // After timer, should become visible again
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(document.querySelector('.translate-y-0.opacity-100')).toBeInTheDocument();
  });

  it('clears timeout on unmount during transition', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/page1']}>
        <Routes>
          <Route element={<PageTransition />}>
            <Route
              path="/page1"
              element={
                <div>
                  <NavigationHelper to="/page2" />
                  Page 1
                </div>
              }
            />
            <Route path="/page2" element={<div>Page 2</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Trigger navigation
    act(() => {
      screen.getByText('Navigate').click();
    });

    // Unmount before timer completes
    unmount();

    // Should not throw error
    act(() => {
      jest.advanceTimersByTime(150);
    });
  });

  it('does not transition when pathname stays the same', () => {
    render(
      <MemoryRouter initialEntries={['/page1']}>
        <Routes>
          <Route element={<PageTransition />}>
            <Route path="/page1" element={<div>Page 1</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should always be visible when pathname doesn't change
    expect(document.querySelector('.translate-y-0.opacity-100')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(document.querySelector('.translate-y-0.opacity-100')).toBeInTheDocument();
  });
});
