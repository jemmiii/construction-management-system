import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AttendanceHistory.css";

function AttendanceHistory() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [sites, setSites] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

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
          attendanceData.message || "Failed to fetch attendance history"
        );
      }

      setAttendance(attendanceData.data || []);
      setSites(sitesData.data || []);
      setWorkers(workersData.data || []);
    } catch (error) {
      console.error("Attendance history error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = record.attendance_date
      ? record.attendance_date.split("T")[0]
      : "";

    const matchesSite =
      !selectedSite ||
      record.site_id?.toString() === selectedSite.toString();

    const matchesWorker =
      !selectedWorker ||
      record.worker_id?.toString() === selectedWorker.toString();

    const matchesStartDate =
      !startDate || recordDate >= startDate;

    const matchesEndDate =
      !endDate || recordDate <= endDate;

    return (
      matchesSite &&
      matchesWorker &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const presentCount = filteredAttendance.filter(
    (record) => record.status === "present"
  ).length;

  const absentCount = filteredAttendance.filter(
    (record) => record.status === "absent"
  ).length;

  const halfDayCount = filteredAttendance.filter(
    (record) => record.status === "half_day"
  ).length;

  const clearFilters = () => {
    setSelectedSite("");
    setSelectedWorker("");
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="history-page">

      <div className="history-header">
        <div>
          <p className="page-label">WORKFORCE MANAGEMENT</p>
          <h1>Attendance History</h1>
          <span>
            Review and analyze complete workforce attendance records
          </span>
        </div>

        <button
          className="back-attendance-button"
          onClick={() => navigate("/attendance")}
        >
          ← Back to Attendance
        </button>
      </div>

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      <div className="history-summary">

        <div className="history-stat-card">
          <span>Total Records</span>
          <h2>{filteredAttendance.length}</h2>
        </div>

        <div className="history-stat-card present-card">
          <span>Present</span>
          <h2>{presentCount}</h2>
        </div>

        <div className="history-stat-card absent-card">
          <span>Absent</span>
          <h2>{absentCount}</h2>
        </div>

        <div className="history-stat-card half-card">
          <span>Half Day</span>
          <h2>{halfDayCount}</h2>
        </div>

      </div>

      <div className="history-card">

        <div className="history-card-header">
          <div>
            <h2>Attendance Records</h2>
            <p>Filter records by worker, site or date range</p>
          </div>

          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="history-filters">

          <div className="filter-group">
            <label>Worker</label>

            <select
              value={selectedWorker}
              onChange={(e) =>
                setSelectedWorker(e.target.value)
              }
            >
              <option value="">All Workers</option>

              {workers.map((worker) => (
                <option
                  key={worker.id}
                  value={worker.id}
                >
                  {worker.name} ({worker.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Construction Site</label>

            <select
              value={selectedSite}
              onChange={(e) =>
                setSelectedSite(e.target.value)
              }
            >
              <option value="">All Sites</option>

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

          <div className="filter-group">
            <label>From Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>

        </div>

        <div className="history-table-wrapper">

          <table className="history-table">

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
                  <td colSpan="5" className="history-empty">
                    Loading attendance history...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" className="history-empty">
                    No attendance history found
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record.id}>

                    <td>
                      <div className="history-worker">
                        <div className="history-avatar">
                          {record.worker_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>{record.worker_name}</strong>
                      </div>
                    </td>

                    <td>{record.employee_id}</td>

                    <td>{record.site_name}</td>

                    <td>
                      {formatDate(record.attendance_date)}
                    </td>

                    <td>
                      <span
                        className={`history-status ${record.status}`}
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

      </div>

    </div>
  );
}

export default AttendanceHistory;