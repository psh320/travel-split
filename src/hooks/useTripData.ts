import { useCallback, useEffect, useRef, useState } from "react";
import { FirebaseService } from "../services/firebase";
import type { Trip } from "../types";

interface UseTripDataOptions {
  onError?: (error: unknown) => void;
  onLoaded?: (trip: Trip) => void;
  onMissing?: () => void;
}

export const useTripData = (
  tripId: string | undefined,
  options: UseTripDataOptions = {}
) => {
  const initialTrip = tripId ? FirebaseService.getCachedTripById(tripId) : null;
  const [trip, setTrip] = useState<Trip | null>(initialTrip);
  const [loading, setLoading] = useState(!initialTrip);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const reload = useCallback(
    async (showLoading = false): Promise<Trip | null> => {
      if (!tripId) {
        setTrip(null);
        setLoading(false);
        return null;
      }

      if (showLoading) setLoading(true);
      try {
        const tripData = await FirebaseService.getTripById(tripId, {
          force: Boolean(FirebaseService.getCachedTripById(tripId)),
        });
        setTrip(tripData);
        if (tripData) optionsRef.current.onLoaded?.(tripData);
        else optionsRef.current.onMissing?.();
        return tripData;
      } catch (error) {
        optionsRef.current.onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  useEffect(() => {
    void reload(!FirebaseService.getCachedTripById(tripId ?? ""));
  }, [reload, tripId]);

  return { loading, reload, setTrip, trip };
};
