import React from "react";

const SEOContent: React.FC = () => {
  return (
    <div className="card">
      <h3>Frequently Asked Questions</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            How do I split expenses online for free?
          </h4>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Simply click "Create New Group" to start a new expense sharing
            session. Add your friends, enter shared expenses, and our bill
            splitting calculator will show who owes whom. It's completely free
            with no registration required.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            Is this expense splitter really free?
          </h4>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Yes! Our bill splitting calculator is 100% free to use. There are no
            hidden fees, premium plans, or subscription costs. Split expenses
            online free without any limitations.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            Do I need to create an account to split costs online?
          </h4>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            No account needed! Start splitting expenses immediately. Just create
            a group, share the room code with friends, and begin tracking shared
            costs right away.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            Can I use this bill splitter on my phone?
          </h4>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Absolutely! Our expense splitting app works perfectly on phones,
            tablets, and computers. You can even install it as a mobile app for
            quick access to split expenses online.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            How does the expense calculation work?
          </h4>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Our smart bill splitting calculator automatically calculates who
            owes whom and minimizes the number of transactions needed to settle
            all debts. Just enter who paid and who should split each expense.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEOContent;
