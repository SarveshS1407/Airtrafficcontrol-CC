import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricsBanner } from '../components/Sidebar/MetricsBanner';
import { FilterPanel } from '../components/Sidebar/FilterPanel';
import { MovementHistoryLog } from '../components/Telemetry/MovementHistoryLog';
import { StaleDataAlert } from '../components/Common/StaleDataAlert';
import { StatusBadge } from '../components/Common/StatusBadge';
import { ATC_CONFIG } from '../constants/config';
import { ApiStatus } from '../types/telemetry';

describe('UI Component Test Suite', () => {
  it('renders MetricsBanner with active telemetry breakdown', () => {
    const stats = {
      totalTracked: 42,
      airborneCount: 35,
      onGroundCount: 7,
      filteredCount: 20,
      inBoundsCount: 38,
      highestAltitudeFt: 38000,
      fastestSpeedKts: 490,
    };

    render(<MetricsBanner stats={stats} lastUpdated={Date.now()} />);

    expect(screen.getByText(/In View/i)).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/Airborne/i)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText(/Updated/i)).toBeInTheDocument();
  });

  it('renders MovementHistoryLog with mandatory session disclaimer', () => {
    const observations = [
      {
        timestamp: 1718000000000,
        latitude: 51.47,
        longitude: -0.45,
        baroAltitudeMeters: 3000,
        baroAltitudeFeet: 9842,
        geoAltitudeMeters: 3000,
        geoAltitudeFeet: 9842,
        velocityMps: 200,
        velocityKnots: 389,
        heading: 270,
        verticalRateMps: 0,
        verticalRateFpm: 0,
        onGround: false,
      },
    ];

    render(
      <MovementHistoryLog
        observations={observations}
        callsign="BAW456"
        onClearHistory={vi.fn()}
      />
    );

    // Verify the mandatory disclaimer text is rendered clearly
    expect(screen.getByText(ATC_CONFIG.HISTORY_DISCLAIMER)).toBeInTheDocument();
    expect(screen.getByText(/TRACKED WAYPOINTS \(1\)/i)).toBeInTheDocument();
  });

  it('renders StaleDataAlert with retry and demo switch buttons', () => {
    const apiStatus: ApiStatus = {
      source: 'LIVE',
      status: 'ERROR',
      freshness: 'STALE',
      lastSuccessfulFetch: Date.now() - 30000,
      lastAttempt: Date.now(),
      lastError: 'OpenSky API 503 Server Error',
      rateLimitBackoffUntil: null,
      consecutiveFailures: 2,
      snapshotServerTime: 1718000000,
      requestDurationMs: 450,
    };

    const handleRetry = vi.fn();
    const handleSwitchDemo = vi.fn();

    render(
      <StaleDataAlert
        apiStatus={apiStatus}
        aircraftCount={15}
        onRetry={handleRetry}
        onSwitchToDemo={handleSwitchDemo}
      />
    );

    expect(screen.getByText(/Live flight data is temporarily unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/demonstration flights/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);

    const demoBtn = screen.getByRole('button', { name: /Use Demonstration Data/i });
    fireEvent.click(demoBtn);
    expect(handleSwitchDemo).toHaveBeenCalledTimes(1);
  });

  it('renders StatusBadge and switches between LIVE and DEMO mode', () => {
    const apiStatus: ApiStatus = {
      source: 'LIVE',
      status: 'IDLE',
      freshness: 'FRESH',
      lastSuccessfulFetch: Date.now(),
      lastAttempt: Date.now(),
      lastError: null,
      rateLimitBackoffUntil: null,
      consecutiveFailures: 0,
      snapshotServerTime: 1718000000,
      requestDurationMs: 200,
    };

    const handleToggle = vi.fn();

    render(
      <StatusBadge
        apiStatus={apiStatus}
        isPaused={false}
        onToggleSource={handleToggle}
      />
    );

    expect(screen.getByText(/Live OpenSky/i)).toBeInTheDocument();
    expect(screen.getByText(/Demo Fixtures/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Demo Fixtures/i));
    expect(handleToggle).toHaveBeenCalledWith('DEMO');
  });

  it('handles FilterPanel user interactions', () => {
    const filters = {
      searchQuery: '',
      minAltitudeFt: 0,
      maxAltitudeFt: 55000,
      minVelocityKts: 0,
      maxVelocityKts: 700,
      groundState: 'ALL' as const,
      verticalState: 'ALL' as const,
      originCountry: '',
      onlyWithPosition: true,
      emergencyOnly: false,
    };

    const handleFilterChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleReset}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search callsign/i);
    fireEvent.change(searchInput, { target: { value: 'DLH' } });
    expect(handleFilterChange).toHaveBeenCalledWith({ searchQuery: 'DLH' });

    const groundBtn = screen.getByRole('button', { name: /On Ground/i });
    fireEvent.click(groundBtn);
    expect(handleFilterChange).toHaveBeenCalledWith({ groundState: 'ON_GROUND' });
  });
});
