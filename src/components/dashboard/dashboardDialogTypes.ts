import type { FormEvent } from "react";
import type { AvatarConfig, Trip } from "../../types";

export type DashboardModal = "details" | "participants" | "budget" | null;
export type PendingParticipantRemoval = {
  id: string;
  name: string;
  linkedExpenseCount: number;
} | null;

export interface BudgetDialogState {
  error: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  saving: boolean;
  value: string;
}

export interface AvatarDialogState {
  draft: AvatarConfig;
  editing: boolean;
  onBegin: (participant: Trip["participants"][number]) => void;
  onChange: (config: AvatarConfig) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}

export interface RemovalDialogState {
  onCancel: () => void;
  onConfirm: () => void;
  onRequest: (userId: string, userName: string) => void;
  pending: PendingParticipantRemoval;
  saving: boolean;
}

export interface TripDashboardDialogsProps {
  activeModal: DashboardModal;
  avatar: AvatarDialogState;
  budget: BudgetDialogState;
  currentUserId: string;
  onAddMember: () => void;
  onClose: () => void;
  onCopyRoomCode: () => void;
  onCopyShareLink: () => void;
  removal: RemovalDialogState;
  trip: Trip;
}
