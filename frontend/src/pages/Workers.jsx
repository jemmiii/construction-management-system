import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Workers.css";

function Workers() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [editingWorker, setEditingWorker] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    salary_type: "daily",
    daily_wage: "",
    monthly_salary: "",
    joining_date: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    email: "",
    salary_type: "daily",
    daily_wage: "",
    monthly_salary: "",
    joining_date: "",
    is_active: true,
  });

  // Fetch all workers
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/workers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch workers");
      }

      setWorkers(result.data || []);
    } catch (error) {
      console.error("Fetch workers error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Add worker form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit worker form change
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create worker
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/workers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create worker");
      }

      if (data.success) {
        alert("Worker created successfully!");

        setFormData({
          employee_id: "",
          name: "",
          phone: "",
          email: "",
          password: "",
          salary_type: "daily",
          daily_wage: "",
          monthly_salary: "",
          joining_date: "",
        });

        setShowAddModal(false);
        fetchWorkers();
      }
    } catch (error) {
      console.error("Error creating worker:", error);
      alert(error.message || "Failed to create worker");
    }
  };

  // Update worker
  const handleUpdateWorker = async (e) => {
    e.preventDefault();

    if (!editingWorker) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        ` https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/workers/${editingWorker.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update worker");
      }

      if (data.success) {
        alert("Worker updated successfully!");

        setEditingWorker(null);
        fetchWorkers();
      }
    } catch (error) {
      console.error("Update worker error:", error);
      alert(error.message || "Failed to update worker");
    }
  };

  // Activate / Deactivate worker
  const handleToggleWorkerStatus = async () => {
    if (!selectedWorker) return;

    const newStatus = !selectedWorker.is_active;

    const action = newStatus ? "activate" : "deactivate";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} ${selectedWorker.name}?`
    );

    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        ` https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/workers/${selectedWorker.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} worker`);
      }

      if (data.success) {
        alert(
          `Worker ${
            newStatus ? "activated" : "deactivated"
          } successfully!`
        );

        setSelectedWorker(null);
        fetchWorkers();
      }
    } catch (error) {
      console.error("Toggle worker status error:", error);
      alert(error.message || `Failed to ${action} worker`);
    }
  };

  // Search workers
  const filteredWorkers = workers.filter((worker) => {
    const search = searchTerm.toLowerCase();

    return (
      worker.name?.toLowerCase().includes(search) ||
      worker.employee_id?.toLowerCase().includes(search) ||
      worker.phone?.toString().includes(search)
    );
  });

  return (
    <div className="workers-page">

      {/* Header */}
      <div className="workers-header">
        <div>
          <p className="page-label">MANAGEMENT</p>
          <h1>Workers</h1>
          <span>Manage all your construction workers</span>
        </div>

        <button
          className="add-worker-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add Worker
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Workers Table */}
      <div className="workers-card">

        <div className="workers-toolbar">
          <div>
            <h2>All Workers</h2>
            <p>View and manage your workforce</p>
          </div>

          <input
            type="text"
            placeholder="Search workers..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="workers-table">

            <thead>
              <tr>
                <th>Worker</th>
                <th>Employee ID</th>
                <th>Phone</th>
                <th>Salary Type</th>
                <th>Daily Wage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-workers">
                    Loading workers...
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-workers">
                    No workers found
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id}>

                    <td>
                      <strong>{worker.name}</strong>
                    </td>

                    <td>{worker.employee_id}</td>

                    <td>{worker.phone}</td>

                    <td>
                      {worker.salary_type === "daily"
                        ? "Daily"
                        : "Monthly"}
                    </td>

                    <td>
                      ₹
                      {worker.salary_type === "daily"
                        ? worker.daily_wage
                        : worker.monthly_salary}
                    </td>

                    <td>
                      <span
                        className={
                          worker.is_active
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {worker.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-worker-button"
                        onClick={() => setSelectedWorker(worker)}
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* Back Button */}
      <button
        className="back-dashboard"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* ADD WORKER MODAL */}
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="add-worker-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>Add New Worker</h2>
                <p>Enter worker details below</p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form
              className="add-worker-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    name="employee_id"
                    placeholder="e.g. WRK002"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Salary Type</label>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Daily Wage</label>
                  <input
                    type="number"
                    name="daily_wage"
                    placeholder="Enter daily wage"
                    value={formData.daily_wage}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Salary</label>
                  <input
                    type="number"
                    name="monthly_salary"
                    placeholder="Enter monthly salary"
                    value={formData.monthly_salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-worker-button"
                >
                  Save Worker
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW WORKER MODAL */}
      {selectedWorker && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedWorker(null)}
        >
          <div
            className="view-worker-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>Worker Details</h2>
                <p>Complete worker information</p>
              </div>

              <button
                className="close-modal"
                onClick={() => setSelectedWorker(null)}
              >
                ×
              </button>
            </div>

            <div className="worker-details-grid">

              <div className="detail-item">
                <span>Employee ID</span>
                <strong>{selectedWorker.employee_id}</strong>
              </div>

              <div className="detail-item">
                <span>Full Name</span>
                <strong>{selectedWorker.name}</strong>
              </div>

              <div className="detail-item">
                <span>Phone Number</span>
                <strong>{selectedWorker.phone}</strong>
              </div>

              <div className="detail-item">
                <span>Email</span>
                <strong>
                  {selectedWorker.email || "Not provided"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Salary Type</span>
                <strong>
                  {selectedWorker.salary_type === "daily"
                    ? "Daily"
                    : "Monthly"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Salary</span>
                <strong>
                  ₹
                  {selectedWorker.salary_type === "daily"
                    ? selectedWorker.daily_wage
                    : selectedWorker.monthly_salary}
                </strong>
              </div>

              <div className="detail-item">
                <span>Joining Date</span>
                <strong>
                  {selectedWorker.joining_date || "Not provided"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>
                  {selectedWorker.is_active
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedWorker(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="save-worker-button"
                onClick={() => {
                  setEditingWorker(selectedWorker);

                  setEditFormData({
                    name: selectedWorker.name || "",
                    phone: selectedWorker.phone || "",
                    email: selectedWorker.email || "",
                    salary_type:
                      selectedWorker.salary_type || "daily",
                    daily_wage:
                      selectedWorker.daily_wage || "",
                    monthly_salary:
                      selectedWorker.monthly_salary || "",
                    joining_date: selectedWorker.joining_date
                      ? selectedWorker.joining_date.split("T")[0]
                      : "",
                    is_active: selectedWorker.is_active,
                  });

                  setSelectedWorker(null);
                }}
              >
                Edit Worker
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleToggleWorkerStatus}
              >
                {selectedWorker.is_active
                  ? "Deactivate Worker"
                  : "Activate Worker"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* EDIT WORKER MODAL */}
      {editingWorker && (
        <div
          className="modal-overlay"
          onClick={() => setEditingWorker(null)}
        >
          <div
            className="add-worker-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>Edit Worker</h2>
                <p>Update worker information</p>
              </div>

              <button
                className="close-modal"
                onClick={() => setEditingWorker(null)}
              >
                ×
              </button>
            </div>

            <form
              className="add-worker-form"
              onSubmit={handleUpdateWorker}
            >

              <div className="form-grid">

                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    value={editingWorker.employee_id}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Salary Type</label>
                  <select
                    name="salary_type"
                    value={editFormData.salary_type}
                    onChange={handleEditChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Daily Wage</label>
                  <input
                    type="number"
                    name="daily_wage"
                    value={editFormData.daily_wage}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Salary</label>
                  <input
                    type="number"
                    name="monthly_salary"
                    value={editFormData.monthly_salary}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={editFormData.joining_date}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editFormData.is_active}
                      onChange={handleEditChange}
                    />
                    Active Worker
                  </label>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingWorker(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-worker-button"
                >
                  Update Worker
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Workers;