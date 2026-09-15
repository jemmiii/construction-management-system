import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

  const [stats, setStats] = useState({
    total_workers: 0,
    active_workers: 0,
    total_sites: 0,
    active_sites: 0,
    total_assignments: 0,
    today_present: 0,
  });

  const [recentAttendance, setRecentAttendance] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Dashboard Statistics
        const statsResponse = await fetch(
          " https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statsData = await statsResponse.json();

        if (!statsResponse.ok) {
          throw new Error(
            statsData.message || "Failed to fetch dashboard data"
          );
        }

        if (statsData.success) {
          setStats(statsData.data);
        }

        // Recent Attendance
        const attendanceResponse = await fetch(
          " https://reproductive-goes-vary-nirvana.https://construction-management-system-kx2y.onrender.com  /api/dashboard/recent-attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const attendanceData = await attendanceResponse.json();

        if (attendanceResponse.ok && attendanceData.success) {
          setRecentAttendance(attendanceData.data || []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      navigate("/");
    }
  }, [navigate, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/");
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">🏗️</div>
          <span>BuildFlow</span>
        </div>

        <nav className="sidebar-menu">

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/workers")}
          >
            <span>👷</span>
            Workers
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/sites")}
          >
            <span>🏗️</span>
            Sites
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/assignments")}
          >
            <span>📋</span>
            Assignments
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/attendance")}
          >
            <span>📅</span>
            Attendance
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-info">

            <div className="admin-avatar">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div>
              <strong>{admin?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <p className="header-greeting">Overview</p>
            <h1>Dashboard</h1>
          </div>

          <div className="header-right">

            <div className="header-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>

            <div className="header-avatar">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>

          </div>

        </header>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Welcome Banner */}
        <section className="welcome-banner">

          <div>
            <p>GOOD TO SEE YOU AGAIN</p>

            <h2>
              Welcome back, {admin?.name?.split(" ")[0] || "Admin"} 👋
            </h2>

            <span>
              Here's what's happening with your projects today.
            </span>
          </div>

          <div className="welcome-icon">🏗️</div>

        </section>

        {/* Stats */}
        <section className="stats-grid">

          {/* Total Workers */}
          <div className="stat-card">

            <div className="stat-icon workers-icon">
              👷
            </div>

            <div>
              <p>Total Workers</p>

              <h3>
                {loading ? "—" : stats.total_workers}
              </h3>

              <span>
                {loading
                  ? "Loading data..."
                  : `${stats.active_workers || 0} active workers`}
              </span>
            </div>

          </div>

          {/* Active Sites */}
          <div className="stat-card">

            <div className="stat-icon sites-icon">
              🏗️
            </div>

            <div>
              <p>Active Sites</p>

              <h3>
                {loading ? "—" : stats.active_sites}
              </h3>

              <span>
                {loading
                  ? "Loading data..."
                  : `${stats.total_sites || 0} total sites`}
              </span>
            </div>

          </div>

          {/* Assignments */}
          <div className="stat-card">

            <div className="stat-icon assignment-icon">
              📋
            </div>

            <div>
              <p>Assignments</p>

              <h3>
                {loading ? "—" : stats.total_assignments}
              </h3>

              <span>
                {loading
                  ? "Loading data..."
                  : "Active assignments"}
              </span>
            </div>

          </div>

          {/* Present Today */}
          <div className="stat-card">

            <div className="stat-icon attendance-icon">
              ✓
            </div>

            <div>
              <p>Present Today</p>

              <h3>
                {loading ? "—" : stats.today_present}
              </h3>

              <span>
                {loading
                  ? "Loading data..."
                  : "Workers present today"}
              </span>
            </div>

          </div>

        </section>

        {/* Bottom Cards */}
        <section className="dashboard-bottom-grid">

          {/* Recent Activity */}
          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h3>Recent Activity</h3>
                <p>Latest attendance updates</p>
              </div>
            </div>

            {loading ? (

              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <p>Loading recent activity...</p>
              </div>

            ) : recentAttendance.length === 0 ? (

              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No attendance activity yet</p>
              </div>

            ) : (

              <div className="activity-list">

                {recentAttendance.slice(0, 5).map((item) => (

                  <div
                    className="activity-item"
                    key={item.id}
                  >

                    <div className="activity-avatar">
                      {item.worker_name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="activity-info">

                      <strong>
                        {item.worker_name}
                      </strong>

                      <span>
                        {item.site_name} • {item.employee_id}
                      </span>

                    </div>

                    <div
                      className={`attendance-status ${item.status}`}
                    >
                      {item.status}
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Quick Actions */}
          <div className="dashboard-card quick-actions">

            <div className="card-header">
              <div>
                <h3>Quick Actions</h3>
                <p>Manage your system faster</p>
              </div>
            </div>

            <button onClick={() => navigate("/workers")}>
              <span>👷</span>

              <div>
                <strong>Manage Workers</strong>
                <small>Add or view workers</small>
              </div>

              <b>→</b>
            </button>

            <button onClick={() => navigate("/sites")}>
              <span>🏗️</span>

              <div>
                <strong>Manage Sites</strong>
                <small>Create or view sites</small>
              </div>

              <b>→</b>
            </button>

            <button onClick={() => navigate("/assignments")}>
              <span>📋</span>

              <div>
                <strong>Manage Assignments</strong>
                <small>Assign workers to sites</small>
              </div>

              <b>→</b>
            </button>

            <button onClick={() => navigate("/attendance")}>
              <span>📅</span>

              <div>
                <strong>Mark Attendance</strong>
                <small>Manage daily attendance</small>
              </div>

              <b>→</b>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;