import { useState, useEffect } from "react";

export type Coordinates = {
    latitude: number;
    longitude: number;
} | {};

type CoordinatesError = {
  message: string;
} | null

export const usePosition = (): [Coordinates,CoordinatesError]=> {
  const [coordinates, setCoordinates] = useState<Coordinates>({});
  const [geolocationError, setGeolocationError] = useState<CoordinatesError>(null);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setGeolocationError({ message: "Geolocation is not supported" });
      return;
    }
    const geo = navigator.geolocation;
    geo.getCurrentPosition(
      (position) => setCoordinates(position.coords),
      (error) => setGeolocationError(error)
    );
  }, []);

  return [coordinates, geolocationError];
};
