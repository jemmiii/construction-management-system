import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Attendance.css";

function Attendance() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [sites, setSites] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Records filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Mark attendance
  const today = new Date().toISOString().split("T")[0];

  const [markSite, setMarkSite] = useState("");
  const [markDate, setMarkDate] = useState(today);

  const [workerStatuses, setWorkerStatuses] = useState({});
  const [existingWorkerIds, setExistingWorkerIds] = useState([]);

  // -----------------------------------------
  // FETCH ALL DATA
  // -----------------------------------------

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const [attendanceResponse, sitesResponse, workersResponse] =
        await Promise.all([
          fetch(" https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/attendance", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(" https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/sites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(" https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/workers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const attendanceData = await attendanceResponse.json();
      const sitesData = await sitesResponse.json();
      const workersData = await workersResponse.json();

      if (!attendanceResponse.ok) {
        throw new Error(
          attendanceData.message || "Failed to fetch attendance"
        );
      }

      setAttendance(attendanceData.data || []);
      setSites(sitesData.data || []);
      setWorkers(workersData.data || []);

      return attendanceData.data || [];
    } catch (error) {
      console.error("Attendance fetch error:", error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // ONLY ACTIVE SITES
  // -----------------------------------------

  const activeSites = sites.filter(
    (site) => site.is_active !== false
  );

  // -----------------------------------------
  // WORKERS FOR SELECTED SITE
  // -----------------------------------------

  const markingWorkers = markSite
    ? workers.filter((worker) => {
        if (!worker.site_id) return true;

        return (
          worker.site_id?.toString() ===
          markSite.toString()
        );
      })
    : [];

  // -----------------------------------------
  // LOAD EXISTING ATTENDANCE
  // WHEN SITE OR DATE CHANGES
  // -----------------------------------------

  useEffect(() => {
    if (!markSite || !markDate) {
      setWorkerStatuses({});
      setExistingWorkerIds([]);
      return;
    }

    const loadExistingAttendance = () => {
      const selectedDateRecords = attendance.filter(
        (record) => {
          const recordDate = record.attendance_date
            ? record.attendance_date.split("T")[0]
            : "";

          return (
            record.site_id?.toString() ===
              markSite.toString() &&
            recordDate === markDate
          );
        }
      );

      const existingStatuses = {};

      selectedDateRecords.forEach((record) => {
        existingStatuses[record.worker_id] =
          record.status;
      });

      setWorkerStatuses(existingStatuses);

      setExistingWorkerIds(
        selectedDateRecords.map(
          (record) => record.worker_id
        )
      );
    };

    loadExistingAttendance();
  }, [markSite, markDate, attendance]);

  // -----------------------------------------
  // CHANGE WORKER STATUS
  // -----------------------------------------

  const handleStatusChange = (workerId, status) => {
    if (
      existingWorkerIds.some(
        (id) =>
          id.toString() === workerId.toString()
      )
    ) {
      return;
    }

    setWorkerStatuses((prev) => ({
      ...prev,
      [workerId]: status,
    }));
  };

  // -----------------------------------------
  // SAVE ATTENDANCE
  // -----------------------------------------

  const handleSaveAttendance = async () => {
    setError("");
    setMessage("");

    if (!markSite) {
      setError("Please select a construction site");
      return;
    }

    if (!markDate) {
      setError("Please select attendance date");
      return;
    }

    if (markDate > today) {
      setError("Future date attendance is not allowed");
      return;
    }

    if (markingWorkers.length === 0) {
      setError("No workers found for this site");
      return;
    }

    const selectedWorkers = markingWorkers.filter(
      (worker) =>
        workerStatuses[worker.id] &&
        !existingWorkerIds.some(
          (id) =>
            id.toString() ===
            worker.id.toString()
        )
    );

    if (selectedWorkers.length === 0) {
      setError(
        "Select attendance for at least one new worker"
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const results = await Promise.allSettled(
        selectedWorkers.map(async (worker) => {
          const response = await fetch(
            " https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/attendance",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                worker_id: worker.id,
                site_id: markSite,
                attendance_date: markDate,
                status: workerStatuses[worker.id],
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to mark attendance"
            );
          }

          return data;
        })
      );

      const failed = results.filter(
        (result) =>
          result.status === "rejected"
      );

      const successCount =
        results.length - failed.length;

      if (successCount > 0) {
        setMessage(
          `Attendance saved successfully for ${successCount} worker${
            successCount > 1 ? "s" : ""
          }`
        );
      }

      if (failed.length > 0) {
        setError(
          `${failed.length} attendance record${
            failed.length > 1 ? "s" : ""
          } could not be saved`
        );
      }

      await fetchData();

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      console.error(
        "Save attendance error:",
        error
      );

      setError(
        error.message ||
          "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // FILTER RECORDS
  // -----------------------------------------

  const filteredAttendance = attendance.filter(
    (record) => {
      const search =
        searchTerm.toLowerCase();

      const recordDate =
        record.attendance_date
          ? record.attendance_date.split(
              "T"
            )[0]
          : "";

      const matchesSearch =
        record.worker_name
          ?.toLowerCase()
          .includes(search) ||
        record.employee_id
          ?.toLowerCase()
          .includes(search) ||
        record.site_name
          ?.toLowerCase()
          .includes(search);

      const matchesSite =
        !selectedSite ||
        record.site_id?.toString() ===
          selectedSite.toString();

      const matchesDate =
        !selectedDate ||
        recordDate === selectedDate;

      return (
        matchesSearch &&
        matchesSite &&
        matchesDate
      );
    }
  );

  // -----------------------------------------
  // SUMMARY
  // -----------------------------------------

  const presentCount =
    filteredAttendance.filter(
      (record) =>
        record.status === "present"
    ).length;

  const absentCount =
    filteredAttendance.filter(
      (record) =>
        record.status === "absent"
    ).length;

  const halfDayCount =
    filteredAttendance.filter(
      (record) =>
        record.status === "half_day"
    ).length;

  // -----------------------------------------
  // FORMAT DATE
  // -----------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------------------
  // JSX
  // -----------------------------------------

  return (
    <div className="attendance-page">

      {/* HEADER */}

      <div className="attendance-header">

        <div>

          <p className="page-label">
            WORKFORCE MANAGEMENT
          </p>

          <h1>Attendance</h1>

          <span>
            Manage and monitor workforce
            attendance across all sites
          </span>

        </div>

        <div className="attendance-header-actions">

          <button
            className="attendance-history-button"
            onClick={() =>
              navigate("/attendance-history")
            }
          >
            Attendance History
          </button>

          <button
  className="attendance-history-button"
  onClick={() => navigate("/attendance-history")}
>
  View All Records
</button>

          <button
            className="back-dashboard"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="attendance-success">
          ✓ {message}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="attendance-summary">

        <div className="attendance-stat-card">

          <div className="stat-icon total-icon">
            👷
          </div>

          <div>
            <span>Total Workers</span>

            <h2>{workers.length}</h2>

            <small>
              Registered workforce
            </small>
          </div>

        </div>

        <div className="attendance-stat-card">

          <div className="stat-icon present-icon">
            ✓
          </div>

          <div>
            <span>Present</span>

            <h2>{presentCount}</h2>

            <small>
              Based on selected filters
            </small>
          </div>

        </div>

        <div className="attendance-stat-card">

          <div className="stat-icon absent-icon">
            ×
          </div>

          <div>
            <span>Absent</span>

            <h2>{absentCount}</h2>

            <small>
              Based on selected filters
            </small>
          </div>

        </div>

        <div className="attendance-stat-card">

          <div className="stat-icon half-icon">
            ½
          </div>

          <div>
            <span>Half Day</span>

            <h2>{halfDayCount}</h2>

            <small>
              Partial attendance
            </small>
          </div>

        </div>

      </div>

      {/* MARK ATTENDANCE */}

      <div className="mark-attendance-card">

        <div className="mark-attendance-header">

          <div>

            <p className="section-label">
              DAILY ATTENDANCE
            </p>

            <h2>
              Mark Worker Attendance
            </h2>

            <span>
              Select a site, choose a date
              and update worker status
            </span>

          </div>

          <div className="mark-attendance-badge">
            ● Ready
          </div>

        </div>

        {/* CONTROLS */}

        <div className="mark-attendance-controls">

          <div className="control-group">

            <label>
              Construction Site *
            </label>

            <select
              value={markSite}
              onChange={(e) => {
                setMarkSite(e.target.value);
                setWorkerStatuses({});
                setExistingWorkerIds([]);
                setError("");
              }}
            >

              <option value="">
                Select construction site
              </option>

              {activeSites.map((site) => (

                <option
                  key={site.id}
                  value={site.id}
                >
                  {site.name}
                </option>

              ))}

            </select>

          </div>

          <div className="control-group">

            <label>
              Attendance Date *
            </label>

            <input
              type="date"
              value={markDate}
              max={today}
              onChange={(e) => {
                setMarkDate(e.target.value);
                setWorkerStatuses({});
                setExistingWorkerIds([]);
                setError("");
              }}
            />

          </div>

        </div>

        {/* NO SITE */}

        {!markSite ? (

          <div className="mark-attendance-empty">

            <div className="mark-empty-icon">
              👷
            </div>

            <h3>
              Select a construction site
            </h3>

            <p>
              Choose a site above to load
              workers and mark their attendance.
            </p>

          </div>

        ) : markingWorkers.length === 0 ? (

          <div className="mark-attendance-empty">

            <div className="mark-empty-icon">
              📋
            </div>

            <h3>
              No workers found
            </h3>

            <p>
              No workers are currently
              available for this site.
            </p>

          </div>

        ) : (

          <>

            <div className="mark-workers-list">

              {markingWorkers.map((worker) => {

                const isExisting =
                  existingWorkerIds.some(
                    (id) =>
                      id.toString() ===
                      worker.id.toString()
                  );

                return (

                  <div
                    className="mark-worker-row"
                    key={worker.id}
                  >

                    <div className="mark-worker-info">

                      <div className="mark-worker-avatar">

                        {worker.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <strong>
                          {worker.name}
                        </strong>

                        <span>
                          {worker.employee_id ||
                            "No Employee ID"}
                        </span>

                      </div>

                    </div>

                    <div className="attendance-status-actions">

                      <button
                        disabled={isExisting}
                        className={
                          workerStatuses[worker.id] ===
                          "present"
                            ? "status-action active-present"
                            : "status-action"
                        }
                        onClick={() =>
                          handleStatusChange(
                            worker.id,
                            "present"
                          )
                        }
                      >
                        ✓ Present
                      </button>

                      <button
                        disabled={isExisting}
                        className={
                          workerStatuses[worker.id] ===
                          "absent"
                            ? "status-action active-absent"
                            : "status-action"
                        }
                        onClick={() =>
                          handleStatusChange(
                            worker.id,
                            "absent"
                          )
                        }
                      >
                        × Absent
                      </button>

                      <button
                        disabled={isExisting}
                        className={
                          workerStatuses[worker.id] ===
                          "half_day"
                            ? "status-action active-half"
                            : "status-action"
                        }
                        onClick={() =>
                          handleStatusChange(
                            worker.id,
                            "half_day"
                          )
                        }
                      >
                        ½ Half Day
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

            <div className="mark-attendance-footer">

              <span>
                {
                  markingWorkers.filter(
                    (worker) =>
                      workerStatuses[worker.id]
                  ).length
                }{" "}
                of {markingWorkers.length} workers marked
              </span>

              <button
                className="save-attendance-button"
                onClick={handleSaveAttendance}
                disabled={saving}
              >

                {saving
                  ? "Saving Attendance..."
                  : "Save Attendance"}

              </button>

            </div>

          </>

        )}

      </div>

      {/* ATTENDANCE RECORDS */}

      <div className="attendance-card">

        <div className="attendance-card-header">

          <div>

            <h2>
              Attendance Records
            </h2>

            <p>
              View and monitor worker attendance
              across your construction sites
            </p>

          </div>

          <div className="live-status">
            <span className="live-dot"></span>
            Live Records
          </div>

        </div>

        {/* FILTERS */}

        <div className="attendance-controls">

          <div className="control-group">

            <label>
              Attendance Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
            />

          </div>

          <div className="control-group">

            <label>
              Construction Site
            </label>

            <select
              value={selectedSite}
              onChange={(e) =>
                setSelectedSite(
                  e.target.value
                )
              }
            >

              <option value="">
                All Construction Sites
              </option>

              {sites.map((site) => (

                <option
                  key={site.id}
                  value={site.id}
                >
                  {site.name}
                </option>

              ))}

            </select>

          </div>

          <div className="control-group">

            <label>
              Search Worker
            </label>

            <input
              type="text"
              placeholder="Name, ID or site..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* RECORDS TABLE */}

        <div className="attendance-table-wrapper">

          <table className="attendance-table">

            <thead>

              <tr>
                <th>Worker</th>
                <th>Employee ID</th>
                <th>Site</th>
                <th>Date</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="attendance-empty"
                  >
                    Loading attendance records...
                  </td>

                </tr>

              ) : filteredAttendance.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="attendance-empty"
                  >

                    <div className="empty-icon">
                      📋
                    </div>

                    <h3>
                      No attendance records found
                    </h3>

                    <p>
                      Try changing your filters or
                      mark today's attendance.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredAttendance.map((record) => (

                  <tr key={record.id}>

                    <td>

                      <div className="worker-name-cell">

                        <div className="worker-avatar">

                          {record.worker_name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        <strong>
                          {record.worker_name}
                        </strong>

                      </div>

                    </td>

                    <td>
                      {record.employee_id}
                    </td>

                    <td>

                      <span className="site-name">
                        {record.site_name}
                      </span>

                    </td>

                    <td>
                      {formatDate(
                        record.attendance_date
                      )}
                    </td>

                    <td>

                      <span
                        className={`attendance-status ${record.status}`}
                      >

                        {record.status === "present"
                          ? "Present"
                          : record.status === "absent"
                          ? "Absent"
                          : "Half Day"}

                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {!loading &&
          filteredAttendance.length > 0 && (

            <div className="attendance-record-footer">

              Showing{" "}

              <strong>
                {filteredAttendance.length}
              </strong>{" "}

              attendance records

            </div>

          )}

      </div>

      {/* FOOTER */}

      <div className="attendance-footer">

        <span>
          Construction Workforce Management System
        </span>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Attendance;