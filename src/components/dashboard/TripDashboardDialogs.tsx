import { AvatarEditorDialog } from "./AvatarEditorDialog";
import { DashboardMainDialog } from "./DashboardMainDialog";
import { ParticipantRemovalDialog } from "./ParticipantRemovalDialog";
import type { TripDashboardDialogsProps } from "./dashboardDialogTypes";

export type {
  DashboardModal,
  PendingParticipantRemoval,
} from "./dashboardDialogTypes";

export const TripDashboardDialogs = ({
  activeModal,
  avatar,
  budget,
  currentUserId,
  onAddMember,
  onClose,
  onCopyRoomCode,
  onCopyShareLink,
  removal,
  trip,
}: TripDashboardDialogsProps) => (
  <>
    {activeModal && !(activeModal === "participants" && avatar.editing) && (
      <DashboardMainDialog
        activeModal={activeModal}
        avatar={avatar}
        budget={budget}
        currentUserId={currentUserId}
        onAddMember={onAddMember}
        onClose={onClose}
        onCopyRoomCode={onCopyRoomCode}
        onCopyShareLink={onCopyShareLink}
        removal={removal}
        trip={trip}
      />
    )}
    {activeModal === "participants" && avatar.editing && (
      <AvatarEditorDialog avatar={avatar} />
    )}
    {removal.pending && <ParticipantRemovalDialog removal={removal} />}
  </>
);
