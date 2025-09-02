import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import type { Trip, AddExpenseForm } from "../types";

const AddExpensePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [formData, setFormData] = useState<AddExpenseForm>({
    description: "",
    amount: "",
    paidBy: "",
    participants: [],
  });

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId]);

  useEffect(() => {
    // Set current user as default payer and select all participants by default
    if (trip && currentUserId) {
      setFormData((prev) => ({
        ...prev,
        paidBy: currentUserId,
        participants: trip.participants.map((p) => p.id), // Select all by default
      }));
    }
  }, [trip, currentUserId]);

  const loadTrip = async () => {
    if (!groupId) return;

    try {
      const tripData = await FirebaseService.getTripById(groupId);
      if (tripData) {
        setTrip(tripData);
      } else {
        alert("Group not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      alert("Failed to load group");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (participantId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      participants: checked
        ? [...prev.participants, participantId]
        : prev.participants.filter((id) => id !== participantId),
    }));
  };

  const selectAllParticipants = () => {
    if (!trip) return;
    setFormData((prev) => ({
      ...prev,
      participants: trip.participants.map((p) => p.id),
    }));
  };

  const selectNoParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !trip ||
      !formData.description.trim() ||
      !formData.amount ||
      !formData.paidBy
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (formData.participants.length === 0) {
      alert("Please select at least one participant to split the expense");
      return;
    }

    setLoading(true);
    try {
      await FirebaseService.addExpense(
        trip.id,
        formData.description.trim(),
        amount,
        formData.paidBy,
        formData.participants
      );

      alert("Expense added successfully!");
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  const splitAmount =
    formData.amount && formData.participants.length > 0
      ? parseFloat(formData.amount) / formData.participants.length
      : 0;

  return (
    <>
      <div className="header">
        <Link to={`/group/${groupId}`} className="back-button">
          ←
        </Link>
        <h1>Add Expense</h1>
        <p>Record a new shared expense</p>
      </div>

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="description">What was this expense for? *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Dinner at restaurant, Uber ride, Hotel room"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="paidBy">Who paid for this? *</label>
            <select
              id="paidBy"
              name="paidBy"
              value={formData.paidBy}
              onChange={handleInputChange}
              required
            >
              <option value="">Select payer</option>
              {trip.participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                  {participant.id === currentUserId ? " (You)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Who should split this expense? *</label>
            <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0" }}>
              <button
                type="button"
                onClick={selectAllParticipants}
                className="btn btn-secondary"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
              >
                Select All
              </button>
              <button
                type="button"
                onClick={selectNoParticipants}
                className="btn btn-secondary"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
              >
                Select None
              </button>
            </div>
            <div className="checkbox-group">
              {trip.participants.map((participant) => (
                <label key={participant.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(participant.id)}
                    onChange={(e) =>
                      handleParticipantChange(participant.id, e.target.checked)
                    }
                  />
                  <span>
                    {participant.name}
                    {participant.id === currentUserId ? " (You)" : ""}
                  </span>
                </label>
              ))}
            </div>
            {formData.participants.length > 0 && splitAmount > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  padding: "0.5rem",
                  background: "#f9fafb",
                  borderRadius: "0.375rem",
                }}
              >
                Each person pays: <strong>${splitAmount.toFixed(2)}</strong>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <div
                className="spinner"
                style={{ width: "1rem", height: "1rem", margin: "0 auto" }}
              />
            ) : (
              "Add Expense"
            )}
          </button>
        </form>

        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>Tips</h3>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            <p>• Be descriptive with expense names for easy reference</p>
            <p>• You can select different people for different expenses</p>
            <p>• The app will automatically calculate who owes what</p>
            <p>• You can delete expenses from the trip dashboard if needed</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddExpensePage;
