import { AnimatedAmount } from "../AnimatedAmount";
import { Avatar } from "../Avatar";
import { t } from "../../i18n";
import type { Balance, User } from "../../types";
import { formatAmount } from "../../utils";

interface BalanceOverviewCardProps {
  balance: Balance;
  user?: User;
}

const balanceTone = (amount: number) =>
  amount > 0 ? "is-positive" : amount < 0 ? "is-negative" : "is-neutral";

export const BalanceOverviewCard = ({ balance, user }: BalanceOverviewCardProps) => (
  <section className="card balance-result-card">
    <div className="balance-result-profile">
      {user && <Avatar user={user} size="lg" decorative eager />}
      <div>
        <span>{t("yourBalance")}</span>
        <strong>{user?.name ?? balance.userName}</strong>
      </div>
    </div>
    <div className={`balance-result-message ${balanceTone(balance.netBalance)}`}>
      {balance.netBalance > 0
        ? t("receiveMessage").replace("{amount}", formatAmount(balance.netBalance))
        : balance.netBalance < 0
          ? t("payMessage").replace("{amount}", formatAmount(Math.abs(balance.netBalance)))
          : t("settled")}
    </div>
    <div className="balance-result-metrics">
      <div>
        <span>{t("totalPaidLabel")}</span>
        <strong><AnimatedAmount amount={balance.totalPaid} /></strong>
      </div>
      <div>
        <span>{t("yourShare")}</span>
        <strong><AnimatedAmount amount={balance.totalOwed} /></strong>
      </div>
      <div>
        <span>{t("finalBalance")}</span>
        <strong className={balanceTone(balance.netBalance)}>
          {balance.netBalance > 0 && "+"}
          <AnimatedAmount amount={Math.abs(balance.netBalance)} />
        </strong>
      </div>
    </div>
  </section>
);
