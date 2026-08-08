import { useState } from "react";
import { currentTripSession } from "../services/currentTripSession";

export const useCurrentTripUserId = (): string => {
  const [userId] = useState(() => currentTripSession.get().userId ?? "");
  return userId;
};
