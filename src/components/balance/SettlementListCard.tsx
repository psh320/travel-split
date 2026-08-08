import { SettlementRouteCard } from "../SettlementRouteCard";
import { t } from "../../i18n";
import type { Settlement, User } from "../../types";

interface SettlementListCardProps {
  description?: string;
  settlements: Settlement[];
  title: string;
  participants: User[];
}

export const SettlementListCard = ({
  description,
  participants,
  settlements,
  title,
}: SettlementListCardProps) => (
  <div className="card">
    <h3>{title}</h3>
    {description && (
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--ease-color-text-muted)",
          marginBottom: "1rem",
        }}
      >
        {description}
      </p>
    )}
    <div className="list">
      {settlements.map((settlement, index) => (
        <SettlementRouteCard
          key={`${settlement.fromUserId}-${settlement.toUserId}-${index}`}
          settlement={settlement}
          participants={participants}
          senderLabel={t("sender")}
          receiverLabel={t("receiver")}
        />
      ))}
    </div>
  </div>
);
