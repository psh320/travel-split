import type { Settlement, User } from "../types";
import { formatAmount } from "../utils";
import { Avatar } from "./Avatar";

type SettlementRouteCardProps = {
  settlement: Settlement;
  participants: User[];
  senderLabel: string;
  receiverLabel: string;
};

export function SettlementRouteCard({
  settlement,
  participants,
  senderLabel,
  receiverLabel,
}: SettlementRouteCardProps) {
  const fromUser = participants.find((user) => user.id === settlement.fromUserId) ?? {
    id: settlement.fromUserId,
    name: settlement.fromUserName,
    createdAt: new Date(0),
  };
  const toUser = participants.find((user) => user.id === settlement.toUserId) ?? {
    id: settlement.toUserId,
    name: settlement.toUserName,
    createdAt: new Date(0),
  };

  return (
    <div className="settlement-route-card">
      <div className="settlement-route-person">
        <Avatar user={fromUser} size="lg" decorative />
        <span>{senderLabel}</span>
        <strong title={fromUser.name}>{fromUser.name}</strong>
      </div>

      <div className="settlement-route-transfer" aria-hidden="true">
        <span className="settlement-route-line" />
        <span className="settlement-route-arrow">→</span>
        <strong>{formatAmount(settlement.amount)}</strong>
      </div>

      <div className="settlement-route-person">
        <Avatar user={toUser} size="lg" decorative />
        <span>{receiverLabel}</span>
        <strong title={toUser.name}>{toUser.name}</strong>
      </div>

      <span className="sr-only">
        {fromUser.name} → {toUser.name}: {formatAmount(settlement.amount)}
      </span>
    </div>
  );
}
