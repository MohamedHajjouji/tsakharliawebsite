'use client';

import { useState, useCallback } from 'react';

interface LocationPickerProps {
  onConfirm: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  onCancel: () => void;
}

export default function LocationPicker({ onConfirm, onCancel }: LocationPickerProps) {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [coordsManually, setCoordsManually] = useState(false);

  const handleUseGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setGeoLoading(false);
        setCoordsManually(false);
        // Reverse geocode to get address if not already filled
        if (!address) {
          setAddress(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        }
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please enter your address manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out.');
            break;
          default:
            setGeoError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    onConfirm({
      address: address.trim(),
      lat: lat ?? 0,
      lng: lng ?? 0,
    });
  };

  const isValid = address.trim().length > 0;

  // Build OpenStreetMap static tile URL
  const mapTileUrl =
    lat !== null && lng !== null
      ? `https://tile.openstreetmap.org/15/${Math.floor(
          ((lng + 180) / 360) * 32768
        )}/${Math.floor(
          ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
            2) *
            32768
        )}.png`
      : null;

  // Marker position in percent (relative to tile center)
  const markerLeft = 50;
  const markerTop = 50;

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
          Delivery Location
        </h3>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Where should we deliver your order?
        </p>
      </div>

      {/* Address Input */}
      <div>
        <label
          className="block text-sm font-semibold mb-1.5"
          style={{ color: '#374151' }}
        >
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, neighborhood, city..."
          className="w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none"
          style={{
            backgroundColor: '#F9FAFB',
            borderColor: '#E5E7EB',
            color: '#1A1A1A',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#D02828';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(208,40,40,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.boxShadow = 'none';
          }}
          required
        />
      </div>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleUseGPS}
        disabled={geoLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 cursor-pointer"
        style={{
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          color: '#1A1A1A',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#D02828';
          e.currentTarget.style.backgroundColor = '#FEF2F2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E5E7EB';
          e.currentTarget.style.backgroundColor = '#F9FAFB';
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {geoLoading ? 'Getting location...' : 'Use My Current Location'}
      </button>

      {/* Location Confirmed Indicator */}
      {lat !== null && lng !== null && !geoLoading && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Location captured</span>
          <span className="text-xs font-normal" style={{ color: '#6B7280' }}>
            ({lat.toFixed(5)}, {lng.toFixed(5)})
          </span>
        </div>
      )}

      {/* Map Preview */}
      {lat !== null && lng !== null && !geoLoading && (
        <div className="rounded-xl overflow-hidden border border-gray-200 relative">
          <div className="relative w-full h-48 bg-gray-100">
            {mapTileUrl && (
              <img
                src={mapTileUrl}
                alt="Map of your location"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            {/* Crosshair marker */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${markerLeft}%`,
                top: `${markerTop}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <svg
                className="w-8 h-8 drop-shadow-lg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7.03 12.5 7.49 13.1.29.38.7.6 1.09.6s.8-.22 1.09-.6C14.42 20.5 20 14.17 20 8c0-4.42-3.58-8-8-8z"
                  fill="#D02828"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="8" r="3" fill="white" />
              </svg>
            </div>
          </div>
          <div
            className="px-3 py-2 text-xs font-medium flex items-center justify-between"
            style={{ backgroundColor: '#FAFAFA', color: '#6B7280' }}
          >
            <span>Your selected location</span>
            <span>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>
        </div>
      )}

      {/* Geo Error */}
      {geoError && (
        <div
          className="px-4 py-3 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
        >
          <p>{geoError}</p>
        </div>
      )}

      {/* Hidden lat/lng manual inputs */}
      {lat === null && !geoLoading && !geoError && (
        <button
          type="button"
          onClick={() => setCoordsManually(!coordsManually)}
          className="text-xs underline cursor-pointer"
          style={{ color: '#9CA3AF' }}
        >
          {coordsManually ? 'Hide' : 'Enter coordinates manually'}
        </button>
      )}

      {coordsManually && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#6B7280' }}>
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat ?? ''}
              onChange={(e) => setLat(parseFloat(e.target.value) || null)}
              placeholder="33.5731"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                backgroundColor: '#F9FAFB',
                borderColor: '#E5E7EB',
                color: '#1A1A1A',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#D02828';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#6B7280' }}>
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng ?? ''}
              onChange={(e) => setLng(parseFloat(e.target.value) || null)}
              placeholder="-7.1213"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                backgroundColor: '#F9FAFB',
                borderColor: '#E5E7EB',
                color: '#1A1A1A',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#D02828';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: '#F3F4F6',
            color: '#374151',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid}
          className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ backgroundColor: '#D02828' }}
          onMouseEnter={(e) => {
            if (isValid) {
              e.currentTarget.style.backgroundColor = '#B91C1C';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(208, 40, 40, 0.35)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#D02828';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}