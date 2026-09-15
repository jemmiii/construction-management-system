import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AssignmentHistory.css";

function AssignmentHistory() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssignmentHistory();
  }, []);

  const fetchAssignmentHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load assignment history"
        );
      }

      setAssignments(data.data || []);
    } catch (error) {
      console.error("Assignment history error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const activeAssignments = assignments.filter(
    (assignment) => assignment.is_active
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) => !assignment.is_active
  ).length;

  return (
    <div className="assignment-history-page">

      <div className="history-page-header">

        <div>
          <p className="history-page-label">
            WORKFORCE MANAGEMENT
          </p>

          <h1>Assignment History</h1>

          <p className="history-page-subtitle">
            Track current and previous worker allocations across construction sites
          </p>
        </div>

        <button
          className="history-back-button"
          onClick={() => navigate("/assignments")}
        >
          ← Back to Assignments
        </button>

      </div>

      <div className="history-summary">

        <div className="history-stat-card">
          <div className="history-stat-icon">📋</div>

          <div>
            <span>Total Records</span>
            <h2>{assignments.length}</h2>
            <small>All assignments</small>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon active-icon">
            ✓
          </div>

          <div>
            <span>Active</span>
            <h2>{activeAssignments}</h2>
            <small>Currently assigned</small>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon completed-icon">
            ✓
          </div>

          <div>
            <span>Completed</span>
            <h2>{completedAssignments}</h2>
            <small>Previous assignments</small>
          </div>
        </div>

      </div>

      {message && (
        <div className="history-message">
          {message}
        </div>
      )}

      <div className="history-main-card">

        <div className="history-card-header">

          <div>
            <p className="history-section-label">
              ASSIGNMENT RECORDS
            </p>

            <h2>Worker Assignment History</h2>

            <span>
              Complete record of workforce allocations
            </span>
          </div>

          <div className="history-record-count">
            {assignments.length} Records
          </div>

        </div>

        {loading ? (
          <div className="history-empty">
            Loading assignment history...
          </div>
        ) : assignments.length === 0 ? (
          <div className="history-empty">

            <div className="history-empty-icon">
              📋
            </div>

            <h3>No assignment history</h3>

            <p>
              Worker assignments will appear here once they are created.
            </p>

          </div>
        ) : (
          <div className="history-table">

            <div className="history-table-header">
              <span>WORKER</span>
              <span>CONSTRUCTION SITE</span>
              <span>ASSIGNED DATE</span>
              <span>STATUS</span>
            </div>

            {assignments.map((assignment) => (
              <div
                className="history-table-row"
                key={assignment.assignment_id}
              >

                <div className="history-worker">

                  <div className="history-avatar">
                    {assignment.worker_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {assignment.worker_name}
                    </strong>

                    <span>
                      {assignment.employee_id}
                    </span>
                  </div>

                </div>

                <div className="history-site">

                  <div className="history-arrow">
                    →
                  </div>

                  <div>
                    <strong>
                      {assignment.site_name}
                    </strong>

                    <span>
                      Construction Site
                    </span>
                  </div>

                </div>

                <div className="history-date">
                  {formatDate(assignment.assigned_date)}
                </div>

                <div>
                  <span
                    className={
                      assignment.is_active
                        ? "history-status active"
                        : "history-status completed"
                    }
                  >
                    {assignment.is_active
                      ? "● Active"
                      : "✓ Completed"}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AssignmentHistory;