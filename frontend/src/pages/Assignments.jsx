import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssignmentData();
  }, []);

  const fetchAssignmentData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [workersResponse, sitesResponse, assignmentsResponse] =
        await Promise.all([
          fetch(" https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/workers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(" https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/sites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(" https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/assignments", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const workersData = await workersResponse.json();
      const sitesData = await sitesResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      setWorkers(workersData.data || []);
      setSites(sitesData.data || []);
      setAssignments(assignmentsData.data || []);
    } catch (error) {
      console.error("Assignment fetch error:", error);
      setMessage("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedWorker || !selectedSite) {
      setMessage("Please select both worker and construction site");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            worker_id: selectedWorker,
            site_id: selectedSite,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign worker");
      }

      setMessage("Worker assigned successfully");

      setSelectedWorker("");
      setSelectedSite("");

      fetchAssignmentData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        ` https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/assignments/${assignmentId}/unassign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove assignment");
      }

      setMessage("Worker unassigned successfully");

      fetchAssignmentData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const activeAssignments = assignments.filter(
    (assignment) => assignment.is_active
  );

  return (
    <div className="assignments-page">

      {/* PAGE HEADER */}
      <div className="assignments-header">

        <div className="assignment-header-content">
          <p className="page-label">WORKFORCE MANAGEMENT</p>

          <h1>Worker Assignments</h1>

          <span>
            Assign workers to construction sites and manage workforce allocation
          </span>
        </div>

        {/* HEADER BUTTONS */}
        <div className="assignment-header-actions">

          <button
            className="assignment-history-button"
            onClick={() => navigate("/assignment-history")}
          >
            <span className="history-icon">↻</span>
            <span>Assignment History</span>
          </button>

          <button
            className="back-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

        </div>

      </div>

      {/* SUMMARY CARDS */}
      <div className="assignment-summary">

        <div className="assignment-stat-card">
          <div className="assignment-stat-icon">👷</div>

          <div>
            <span>Total Workers</span>
            <h2>{workers.length}</h2>
            <small>Registered workforce</small>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="assignment-stat-icon site-stat">🏗️</div>

          <div>
            <span>Construction Sites</span>
            <h2>{sites.length}</h2>
            <small>Available locations</small>
          </div>
        </div>

        <div className="assignment-stat-card">
          <div className="assignment-stat-icon assignment-stat">📋</div>

          <div>
            <span>Active Assignments</span>
            <h2>{activeAssignments.length}</h2>
            <small>Worker-site allocations</small>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="assignment-main-grid">

        {/* ASSIGNMENT FORM */}
        <div className="assignment-form-card">

          <div className="assignment-card-header">
            <p className="section-label">NEW ASSIGNMENT</p>

            <h2>Assign Worker to Site</h2>

            <span>
              Select a worker and assign them to a construction site
            </span>
          </div>

          {message && (
            <div className="assignment-message">
              {message}
            </div>
          )}

          <form onSubmit={handleAssign}>

            <div className="assignment-form-group">
              <label>Select Worker</label>

              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
              >
                <option value="">Choose a worker</option>

                {workers
                  .filter((worker) => worker.is_active)
                  .map((worker) => (
                    <option
                      key={worker.id}
                      value={worker.id}
                    >
                      {worker.name} ({worker.employee_id})
                    </option>
                  ))}
              </select>
            </div>

            <div className="assignment-form-group">
              <label>Select Construction Site</label>

              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                <option value="">Choose a site</option>

                {sites
                  .filter((site) => site.is_active)
                  .map((site) => (
                    <option
                      key={site.id}
                      value={site.id}
                    >
                      {site.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="assign-worker-button"
            >
              Assign Worker →
            </button>

          </form>

        </div>

        {/* ACTIVE ASSIGNMENTS */}
        <div className="assignments-list-card">

          <div className="assignment-card-header">
            <p className="section-label">CURRENT ALLOCATION</p>

            <h2>Active Assignments</h2>

            <span>
              Workers currently assigned to construction sites
            </span>
          </div>

          {loading ? (
            <div className="assignment-empty">
              Loading assignments...
            </div>
          ) : activeAssignments.length === 0 ? (

            <div className="assignment-empty">
              <div className="assignment-empty-icon">📋</div>

              <h3>No active assignments yet</h3>

              <p>
                Assign workers to construction sites to manage your workforce.
              </p>
            </div>

          ) : (

            <div className="assignments-list">

              {activeAssignments.map((assignment) => (

                <div
                  className="assignment-list-item"
                  key={assignment.assignment_id}
                >

                  <div className="assignment-worker-avatar">
                    {assignment.worker_name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="assignment-worker-info">
                    <strong>{assignment.worker_name}</strong>
                    <span>{assignment.employee_id}</span>
                  </div>

                  <div className="assignment-arrow">
                    →
                  </div>

                  <div className="assignment-site-info">
                    <strong>{assignment.site_name}</strong>
                    <span>Construction Site</span>
                  </div>

                  <span className="assignment-active">
                    Active
                  </span>

                  <button
                    className="remove-assignment-button"
                    onClick={() =>
                      handleRemoveAssignment(assignment.assignment_id)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Assignments;