import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AvatarConfig, Trip } from "../../types";
import { DashboardMainDialog } from "./DashboardMainDialog";

const now = new Date("2026-08-09T00:00:00Z");
const trip: Trip = {
  id: "trip-a",
  name: "Shared costs",
  roomCode: "ABC123",
  createdBy: "member-a",
  participants: [{ id: "member-a", name: "Andrew", createdAt: now }],
  expenses: [],
  createdAt: now,
  updatedAt: now,
};

const renderDetails = (currentUserId: string) =>
  renderToStaticMarkup(
    <DashboardMainDialog
      activeModal="details"
      avatar={{
        draft: {} as AvatarConfig,
        editing: false,
        onBegin: () => undefined,
        onChange: () => undefined,
        onClose: () => undefined,
        onSave: () => undefined,
        saving: false,
      }}
      budget={{
        error: "",
        onChange: () => undefined,
        onSubmit: () => undefined,
        saving: false,
        value: "",
      }}
      currentUserId={currentUserId}
      onAddMember={() => undefined}
      onClose={() => undefined}
      onCopyRoomCode={() => undefined}
      onCopyShareLink={() => undefined}
      onEditBudget={() => undefined}
      removal={{
        onCancel: () => undefined,
        onConfirm: () => undefined,
        onRequest: () => undefined,
        pending: null,
        saving: false,
      }}
      trip={trip}
    />
  );

describe("DashboardMainDialog", () => {
  it("offers optional budget setup from group details to the creator", () => {
    const markup = renderDetails("member-a");

    expect(markup).toContain("dashboard-budget-setting");
    expect(markup).toContain('aria-label="Set budget"');
  });

  it("shows the budget value without an edit control to other members", () => {
    const markup = renderDetails("member-b");

    expect(markup).not.toContain("dashboard-budget-setting");
    expect(markup).not.toContain('aria-label="Set budget"');
  });
});
