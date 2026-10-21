import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AviationEmblem,
  CommercialAircraftIcon,
  LightAircraftIcon,
  AirportTerminalIcon,
  RunwayIcon,
  DepartureIcon,
  ArrivalIcon,
  FlightRouteIcon,
  CompassHeadingIcon,
  AltimeterIcon,
  AirspeedIcon,
  CoordinatesIcon,
  GlobeNavigationIcon,
  AirportPinIcon,
  RadarSearchIcon,
  FlightHistoryIcon,
  RadarBeaconIcon,
  AviationSettingsIcon,
  AviationLayersIcon,
  AviationRefreshIcon,
  PilotWingsIcon,
  ThemeDayIcon,
  ThemeNightIcon,
  ThemeAutoIcon,
  EditorialCloud,
  RouteFlightIllustration,
  MiniatureCompassRose,
  PaperFlightPlanIllustration,
  AirportControlTowerIllustration,
  BoardingPassTag,
  GlobeRouteIllustration,
  RunwayFlightDivider,
  AirportStampBadge,
  NoAircraftEmptyState,
  OfflineOrBlockedEmptyState,
  LocationPromptEmptyState,
  RadarLoadingState,
} from '../components/AviationDesignSystem';
import { useAtcStore } from '../store/useAtcStore';

describe('Aviation Design System Suite', () => {
  describe('Custom Aviation Icons Family', () => {
    it('renders all aviation icon symbols with customizable size and color', () => {
      const { container } = render(
        <div>
          <CommercialAircraftIcon size={24} color="#D87C43" />
          <LightAircraftIcon size={24} />
          <AirportTerminalIcon size={24} />
          <RunwayIcon size={24} />
          <DepartureIcon size={24} />
          <ArrivalIcon size={24} />
          <FlightRouteIcon size={24} />
          <CompassHeadingIcon size={24} heading={180} />
          <AltimeterIcon size={24} />
          <AirspeedIcon size={24} />
          <CoordinatesIcon size={24} />
          <GlobeNavigationIcon size={24} />
          <AirportPinIcon size={24} />
          <RadarSearchIcon size={24} />
          <FlightHistoryIcon size={24} />
          <RadarBeaconIcon size={24} />
          <AviationSettingsIcon size={24} />
          <AviationLayersIcon size={24} />
          <AviationRefreshIcon size={24} />
          <PilotWingsIcon size={24} />
          <ThemeDayIcon size={24} />
          <ThemeNightIcon size={24} />
          <ThemeAutoIcon size={24} />
        </div>
      );

      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(23);
    });

    it('rotates CompassHeadingIcon according to true heading angle', () => {
      const { container } = render(<CompassHeadingIcon heading={270} />);
      const needleGroup = container.querySelector('g');
      expect(needleGroup?.getAttribute('style')).toContain('rotate(270deg)');
    });
  });

  describe('Aviation Brand Emblem', () => {
    it('renders emblem in different sizes and variants', () => {
      const { container, rerender } = render(<AviationEmblem size="sm" variant="mark" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<AviationEmblem size="md" variant="badge" />);
      expect(container.querySelector('svg')).toBeInTheDocument();

      rerender(<AviationEmblem size="lg" variant="full" />);
      expect(screen.getByText('AirTrafficControl')).toBeInTheDocument();
      expect(screen.getByText('Aviation Field Journal')).toBeInTheDocument();
    });
  });

  describe('Aviation Illustrations', () => {
    it('renders editorial illustrations cleanly', () => {
      const { container } = render(
        <div>
          <EditorialCloud />
          <RouteFlightIllustration />
          <MiniatureCompassRose />
          <PaperFlightPlanIllustration />
          <AirportControlTowerIllustration />
          <BoardingPassTag callsign="BAW178" origin="LHR" destination="JFK" />
          <GlobeRouteIllustration />
          <RunwayFlightDivider />
          <AirportStampBadge code="EGLL" name="London Heathrow" />
        </div>
      );

      expect(screen.getByText('BAW178')).toBeInTheDocument();
      expect(screen.getByText(/EGLL/i)).toBeInTheDocument();
      expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('Purposeful Empty States', () => {
    it('renders NoAircraftEmptyState with required message and handles reset', () => {
      let resetTriggered = false;
      render(<NoAircraftEmptyState onReset={() => { resetTriggered = true; }} />);

      expect(
        screen.getByText(/Nothing passing through here just yet\. Try widening your search area or explore the global view\./i)
      ).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: /Return to Global View/i });
      fireEvent.click(btn);
      expect(resetTriggered).toBe(true);
    });

    it('renders OfflineOrBlockedEmptyState with action buttons', () => {
      let demoClicked = false;
      render(<OfflineOrBlockedEmptyState onLoadDemo={() => { demoClicked = true; }} />);

      expect(screen.getByText(/Live Flight Feed Temporarily Throttled/i)).toBeInTheDocument();
      const btn = screen.getByRole('button', { name: /Explore Demonstration Flights/i });
      fireEvent.click(btn);
      expect(demoClicked).toBe(true);
    });

    it('renders LocationPromptEmptyState with hub selection', () => {
      let selectedHubCode = '';
      render(
        <LocationPromptEmptyState
          onSelectHub={(hub) => {
            selectedHubCode = hub.name;
          }}
        />
      );

      expect(screen.getByText(/Choose a place to begin exploring\./i)).toBeInTheDocument();
      const lhrBtn = screen.getByRole('button', { name: /\[ LHR \]/i });
      fireEvent.click(lhrBtn);
      expect(selectedHubCode).toContain('Heathrow');
    });

    it('renders RadarLoadingState with animation indicator', () => {
      render(<RadarLoadingState label="Calibrating radar receivers..." />);
      expect(screen.getByText(/Calibrating radar receivers\.\.\./i)).toBeInTheDocument();
    });
  });

  describe('Theme Management in Store', () => {
    it('allows toggling between light, dark, and system modes', () => {
      const store = useAtcStore.getState();

      store.setThemeMode('dark');
      expect(useAtcStore.getState().themeMode).toBe('dark');

      store.setThemeMode('light');
      expect(useAtcStore.getState().themeMode).toBe('light');

      store.setThemeMode('system');
      expect(useAtcStore.getState().themeMode).toBe('system');
    });
  });
});
