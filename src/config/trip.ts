export const MEMBER_ACCENT_COLORS = [
  "#B85C5C", // muted red
  "#5F7EA8", // slate blue
  "#C29A43", // ochre yellow
  "#678C65", // moss green
  "#846F9D", // muted purple
  "#C27A55", // burnt orange
  "#4F8986", // soft teal
  "#A7667F", // dusty rose
] as const;

export const MAX_TRIP_PARTICIPANTS = MEMBER_ACCENT_COLORS.length;

type MemberColorIdentity = {
  colorIndex?: number;
};

export const normalizeMemberColorIndex = (
  colorIndex: number | undefined,
  fallbackIndex: number
): number => {
  const candidate = Number.isInteger(colorIndex) ? colorIndex! : fallbackIndex;
  return (
    ((candidate % MAX_TRIP_PARTICIPANTS) + MAX_TRIP_PARTICIPANTS) %
    MAX_TRIP_PARTICIPANTS
  );
};

export const getMemberAccentColor = (
  colorIndex: number | undefined,
  fallbackIndex = 0
): string =>
  MEMBER_ACCENT_COLORS[
    normalizeMemberColorIndex(colorIndex, fallbackIndex)
  ];

export const getAvailableMemberColorIndex = (
  participants: MemberColorIdentity[]
): number => {
  const usedColorIndexes = new Set(
    participants.map((participant, index) =>
      normalizeMemberColorIndex(participant.colorIndex, index)
    )
  );

  const availableColorIndex = MEMBER_ACCENT_COLORS.findIndex(
    (_, index) => !usedColorIndexes.has(index)
  );
  return availableColorIndex === -1 ? 0 : availableColorIndex;
};

export class TripParticipantLimitError extends Error {
  constructor() {
    super(`A trip can have up to ${MAX_TRIP_PARTICIPANTS} participants.`);
    this.name = "TripParticipantLimitError";
  }
}
