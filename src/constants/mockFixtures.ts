import { OpenSkyResponse, RawStateVector } from '../types/opensky';

/**
 * High-fidelity recorded OpenSky Network snapshot fixture for offline/demo development
 * Recorded over London Terminal Manoeuvring Area (Heathrow / Gatwick / Stansted)
 * Clearly labeled as demo data per aviation spec.
 */
export const MOCK_OPENSKY_LONDON_SNAPSHOT: OpenSkyResponse = {
  time: 1718000000,
  states: [
    // 0: icao24, 1: callsign, 2: country, 3: time_pos, 4: last_contact, 5: lon, 6: lat, 7: baro_alt, 8: on_ground, 9: velocity, 10: true_track, 11: vert_rate, 12: sensors, 13: geo_alt, 14: squawk, 15: spi, 16: pos_source
    [
      '40061e',
      'BAW456  ',
      'United Kingdom',
      1718000000,
      1718000000,
      -0.4543,
      51.4700,
      0,
      true, // on ground at Heathrow
      12.4, // taxi speed m/s (~24 kts)
      270.0,
      0.0,
      null,
      0,
      '1000',
      false,
      0,
    ],
    [
      '406691',
      'EZY812  ',
      'United Kingdom',
      1718000000,
      1718000000,
      -0.2850,
      51.5200,
      1524.0, // 5,000 ft
      false,
      128.6, // ~250 kts
      85.0,
      7.5, // climbing +1476 fpm
      null,
      1560.0,
      '2410',
      false,
      0,
    ],
    [
      '3c6665',
      'DLH901  ',
      'Germany',
      1718000000,
      1718000000,
      -0.0820,
      51.6100,
      4572.0, // 15,000 ft
      false,
      210.0, // ~408 kts
      110.0,
      -5.2, // descending -1023 fpm
      null,
      4620.0,
      '3621',
      false,
      0,
    ],
    [
      '4ca9e5',
      'RYR34PX ',
      'Ireland',
      1718000000,
      1718000000,
      0.2350,
      51.8850,
      8534.4, // 28,000 ft
      false,
      235.0, // ~456 kts
      195.0,
      0.0, // cruising level
      null,
      8600.0,
      '6245',
      false,
      0,
    ],
    [
      '896472',
      'UAE007  ',
      'United Arab Emirates',
      1718000000,
      1718000000,
      -0.6500,
      51.3800,
      10668.0, // 35,000 ft
      false,
      252.0, // ~490 kts
      125.0,
      0.0,
      null,
      10750.0,
      '7102',
      false,
      0,
    ],
    [
      '3949e2',
      'AFR1680 ',
      'France',
      1718000000,
      1718000000,
      0.0500,
      51.2500,
      6705.6, // 22,000 ft
      false,
      220.0, // ~427 kts
      160.0,
      -6.8, // descending
      null,
      6780.0,
      '4512',
      false,
      0,
    ],
    [
      '484556',
      'KLM1009 ',
      'Netherlands',
      1718000000,
      1718000000,
      -0.8500,
      51.7200,
      9753.6, // 32,000 ft
      false,
      245.0,
      95.0,
      0.0,
      null,
      9820.0,
      '1255',
      false,
      0,
    ],
    [
      'a1b2c3',
      'VIR45   ',
      'United Kingdom',
      1718000000,
      1718000000,
      -1.0500,
      51.4200,
      11277.6, // 37,000 ft
      false,
      260.0,
      265.0,
      0.0,
      null,
      11350.0,
      '5510',
      false,
      0,
    ],
    [
      '4b1812',
      'SWR318  ',
      'Switzerland',
      1718000000,
      1718000000,
      -0.1200,
      51.4100,
      3048.0, // 10,000 ft
      false,
      180.0,
      135.0,
      -4.5,
      null,
      3090.0,
      '2764',
      false,
      0,
    ],
    [
      '40092b',
      'BAW92B  ',
      'United Kingdom',
      1718000000,
      1718000000,
      -0.4610,
      51.4720,
      0,
      true, // on ground at Heathrow Gate
      0.0,
      90.0,
      0.0,
      null,
      0,
      '7000',
      false,
      0,
    ],
    // Aircraft with missing / null fields to verify resilience
    [
      '4072f1',
      null, // null callsign
      'United Kingdom',
      1718000000,
      1718000000,
      -0.3400,
      51.6500,
      null, // null altitude
      false,
      95.0,
      210.0,
      null, // null vertical rate
      null,
      null,
      null, // null squawk
      false,
      0,
    ],
    // Emergency Transponder Squawk 7700
    [
      'e40770',
      'EMERG77 ',
      'United Kingdom',
      1718000000,
      1718000000,
      -0.1500,
      51.3500,
      2438.0, // 8,000 ft
      false,
      145.0,
      340.0,
      -7.5, // Rapid descent
      null,
      2480.0,
      '7700', // General Emergency
      true,
      0,
    ],
    // Trans-Atlantic Corridors
    [
      'a01122',
      'BAW178  ',
      'United Kingdom',
      1718000000,
      1718000000,
      -25.5000,
      52.3000,
      11277.0, // 37,000 ft
      false,
      240.0,
      262.0,
      0.0,
      null,
      11400.0,
      '5231',
      false,
      0,
    ],
    [
      '394a10',
      'AFR008  ',
      'France',
      1718000000,
      1718000000,
      -35.2000,
      48.6000,
      10972.0,
      false,
      245.0,
      275.0,
      0.0,
      null,
      11100.0,
      '4412',
      false,
      0,
    ],
    [
      '3c6660',
      'DLH400  ',
      'Germany',
      1718000000,
      1718000000,
      -15.8000,
      54.1000,
      10668.0,
      false,
      235.0,
      285.0,
      0.0,
      null,
      10800.0,
      '3120',
      false,
      0,
    ],
    // North America Continental
    [
      'a00001',
      'AAL100  ',
      'United States',
      1718000000,
      1718000000,
      -85.2000,
      40.5000,
      11582.0, // 38,000 ft
      false,
      240.0,
      265.0,
      0.0,
      null,
      11700.0,
      '2201',
      false,
      0,
    ],
    [
      'a00002',
      'UAL452  ',
      'United States',
      1718000000,
      1718000000,
      -95.5000,
      41.8000,
      10363.0,
      false,
      230.0,
      270.0,
      0.0,
      null,
      10500.0,
      '1640',
      false,
      0,
    ],
    [
      'a00003',
      'DAL882  ',
      'United States',
      1718000000,
      1718000000,
      -92.0000,
      38.2000,
      11887.0,
      false,
      235.0,
      305.0,
      0.0,
      null,
      12000.0,
      '3514',
      false,
      0,
    ],
    [
      'c01234',
      'ACA112  ',
      'Canada',
      1718000000,
      1718000000,
      -105.0000,
      50.1000,
      10972.0,
      false,
      238.0,
      280.0,
      0.0,
      null,
      11100.0,
      '2105',
      false,
      0,
    ],
    // Europe Continental
    [
      '484123',
      'KLM1234 ',
      'Netherlands',
      1718000000,
      1718000000,
      2.1000,
      45.2000,
      9753.0,
      false,
      225.0,
      205.0,
      0.0,
      null,
      9900.0,
      '7102',
      false,
      0,
    ],
    [
      '342111',
      'IBE310  ',
      'Spain',
      1718000000,
      1718000000,
      1.2000,
      43.5000,
      10363.0,
      false,
      230.0,
      355.0,
      0.0,
      null,
      10500.0,
      '6511',
      false,
      0,
    ],
    [
      '4b1200',
      'SWR500  ',
      'Switzerland',
      1718000000,
      1718000000,
      9.8000,
      49.2000,
      8534.0,
      false,
      215.0,
      25.0,
      0.0,
      null,
      8650.0,
      '4210',
      false,
      0,
    ],
    // Asia-Pacific & Oceania
    [
      '860123',
      'ANA006  ',
      'Japan',
      1718000000,
      1718000000,
      165.0000,
      38.0000,
      11582.0,
      false,
      255.0,
      85.0,
      0.0,
      null,
      11700.0,
      '3341',
      false,
      0,
    ],
    [
      '780456',
      'CPA888  ',
      'Hong Kong',
      1718000000,
      1718000000,
      135.2000,
      30.5000,
      11277.0,
      false,
      250.0,
      55.0,
      0.0,
      null,
      11400.0,
      '5612',
      false,
      0,
    ],
    [
      '76ce12',
      'SIA322  ',
      'Singapore',
      1718000000,
      1718000000,
      82.5000,
      15.2000,
      10668.0,
      false,
      240.0,
      310.0,
      0.0,
      null,
      10800.0,
      '4105',
      false,
      0,
    ],
    [
      '800101',
      'AIC101  ',
      'India',
      1718000000,
      1718000000,
      65.0000,
      32.5000,
      10972.0,
      false,
      235.0,
      305.0,
      0.0,
      null,
      11100.0,
      '2314',
      false,
      0,
    ],
    [
      '7c4321',
      'QFA11   ',
      'Australia',
      1718000000,
      1718000000,
      175.0000,
      -20.5000,
      11887.0,
      false,
      260.0,
      60.0,
      0.0,
      null,
      12000.0,
      '6211',
      false,
      0,
    ],
    // Middle East
    [
      '896100',
      'UAE201  ',
      'United Arab Emirates',
      1718000000,
      1718000000,
      40.0000,
      35.0000,
      11582.0,
      false,
      245.0,
      315.0,
      0.0,
      null,
      11700.0,
      '7215',
      false,
      0,
    ],
    [
      '06a120',
      'QTR701  ',
      'Qatar',
      1718000000,
      1718000000,
      38.5000,
      32.0000,
      11277.0,
      false,
      242.0,
      310.0,
      0.0,
      null,
      11400.0,
      '6124',
      false,
      0,
    ],
    // Latin America & Africa
    [
      'e80200',
      'LAN600  ',
      'Chile',
      1718000000,
      1718000000,
      -77.5000,
      -5.2000,
      11277.0,
      false,
      235.0,
      355.0,
      0.0,
      null,
      11400.0,
      '4512',
      false,
      0,
    ],
    [
      '040050',
      'ETH500  ',
      'Ethiopia',
      1718000000,
      1718000000,
      18.0000,
      14.5000,
      10972.0,
      false,
      238.0,
      295.0,
      0.0,
      null,
      11100.0,
      '3205',
      false,
      0,
    ],
    [
      '008012',
      'SAA280  ',
      'South Africa',
      1718000000,
      1718000000,
      22.0000,
      -2.0000,
      11582.0,
      false,
      245.0,
      350.0,
      0.0,
      null,
      11700.0,
      '5510',
      false,
      0,
    ],
  ],
};

/**
 * Advances mock vectors by elapsed seconds for realistic movement simulation
 * when users run offline demo mode.
 */
export function advanceMockVectors(
  vectors: RawStateVector[],
  elapsedSec: number
): RawStateVector[] {
  return vectors.map((v) => {
    const copy = [...v] as RawStateVector;
    const onGround = copy[8];
    const velocityMps = copy[9] ?? 0;
    const headingDeg = copy[10] ?? 0;
    const vertRateMps = copy[11] ?? 0;
    const currentLon = copy[5];
    const currentLat = copy[6];
    const currentAlt = copy[7];

    if (currentLon === null || currentLat === null) {
      return copy;
    }

    if (onGround) {
      if (velocityMps > 0) {
        // slight taxi motion
        const distKm = (velocityMps * elapsedSec) / 1000;
        const dLat = (distKm / 111) * Math.cos((headingDeg * Math.PI) / 180);
        const dLon =
          (distKm / (111 * Math.cos((currentLat * Math.PI) / 180))) *
          Math.sin((headingDeg * Math.PI) / 180);
        copy[5] = Number((currentLon + dLon).toFixed(6));
        copy[6] = Number((currentLat + dLat).toFixed(6));
      }
      return copy;
    }

    // Airborne physics projection
    const distMeters = velocityMps * elapsedSec;
    const headingRad = (headingDeg * Math.PI) / 180;
    const dLatDeg = (distMeters * Math.cos(headingRad)) / 111139;
    const dLonDeg =
      (distMeters * Math.sin(headingRad)) /
      (111139 * Math.cos((currentLat * Math.PI) / 180));

    copy[5] = Number((currentLon + dLonDeg).toFixed(6));
    copy[6] = Number((currentLat + dLatDeg).toFixed(6));

    // Update altitude if climbing or descending
    if (currentAlt !== null && vertRateMps !== 0) {
      const nextAlt = currentAlt + vertRateMps * elapsedSec;
      copy[7] = Math.max(100, Math.round(nextAlt));
    }

    // Advance timestamp
    copy[3] = (copy[3] ?? 1718000000) + Math.round(elapsedSec);
    copy[4] = copy[4] + Math.round(elapsedSec);

    return copy;
  });
}
