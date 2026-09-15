import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sites.css";

function Sites() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
const [selectedSite, setSelectedSite] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    allowed_radius: "200",
    contact_person: "",
    contact_phone: "",
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/sites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch sites");
      }

      setSites(result.data || []);
    } catch (error) {
      console.error("Fetch sites error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();

    return (
      site.name?.toLowerCase().includes(search) ||
      site.address?.toLowerCase().includes(search) ||
      site.contact_person?.toLowerCase().includes(search) ||
      site.contact_phone?.toString().includes(search)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        " https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/sites",
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

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create site");
      }

      if (data.success) {
        alert("Site created successfully!");

        setFormData({
          name: "",
          address: "",
          latitude: "",
          longitude: "",
          allowed_radius: "200",
          contact_person: "",
          contact_phone: "",
        });

        setShowAddModal(false);

        // Refresh sites list
        fetchSites();
      }
    } catch (error) {
      console.error("Create site error:", error);
      alert(error.message || "Failed to create site");
    }
  };
const handleStatusChange = async (site) => {
  try {
    const token = localStorage.getItem("token");

    const newStatus = !site.is_active;

    const response = await fetch(
      ` https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/sites/${site.id}`,
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
      throw new Error(
        data.message || "Failed to update site status"
      );
    }

    // Update table immediately
    setSites((prevSites) =>
      prevSites.map((item) =>
        item.id === site.id
          ? { ...item, is_active: newStatus }
          : item
      )
    );

  } catch (error) {
    console.error("Status update error:", error);
    alert(error.message || "Failed to update site status");
  }
};
  return (
    <div className="sites-page">
      <div className="sites-header">
        <div>
          <p className="page-label">MANAGEMENT</p>
          <h1>Sites</h1>
          <span>Manage all your construction sites</span>
        </div>

        <button
          className="add-site-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add Site
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="sites-card">
        <div className="sites-toolbar">
          <div>
            <h2>All Sites</h2>
            <p>View and manage your construction sites</p>
          </div>

          <input
            type="text"
            placeholder="Search sites..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="sites-table">
            <thead>
              <tr>
                <th>Site Name</th>
                <th>Address</th>
                <th>Contact Person</th>
                <th>Contact Phone</th>
                <th>Allowed Radius</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-sites">
                    Loading sites...
                  </td>
                </tr>
              ) : filteredSites.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-sites">
                    No sites found
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr key={site.id}>
                    <td>{site.name}</td>

                    <td>{site.address || "-"}</td>

                    <td>{site.contact_person || "-"}</td>

                    <td>{site.contact_phone || "-"}</td>

                    <td>{site.allowed_radius || 200} m</td>

                    <td>
  <button
    type="button"
    className={
      site.is_active
        ? "status-button active"
        : "status-button inactive"
    }
    onClick={() => handleStatusChange(site)}
  >
    <span className="status-dot"></span>

    {site.is_active ? "Active" : "Inactive"}
  </button>
</td>
                    <td>
                     <button
  className="view-site-button"
  onClick={() => {
    setSelectedSite(site);
    setShowViewModal(true);
  }}
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

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="add-site-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add New Site</h2>
                <p>Enter construction site details</p>
              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form
              className="add-site-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name *</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter site name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter site address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Latitude *</label>

                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    placeholder="e.g. 23.0225"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Longitude *</label>

                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    placeholder="e.g. 72.5714"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Allowed Radius (meters)</label>

                  <input
                    type="number"
                    name="allowed_radius"
                    placeholder="200"
                    value={formData.allowed_radius}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Person</label>

                  <input
                    type="text"
                    name="contact_person"
                    placeholder="Enter contact person name"
                    value={formData.contact_person}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>

                  <input
                    type="text"
                    name="contact_phone"
                    placeholder="Enter contact phone number"
                    value={formData.contact_phone}
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
                  className="save-site-button"
                >
                  Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{showViewModal && selectedSite && (
  <div
    className="modal-overlay"
    onClick={() => setShowViewModal(false)}
  >
    <div
      className="view-site-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2>Site Details</h2>
          <p>View complete construction site information</p>
        </div>

        <button
          type="button"
          className="close-modal"
          onClick={() => setShowViewModal(false)}
        >
          ×
        </button>
      </div>

      <div className="site-details-grid">

        <div className="site-detail-item">
          <span>Site Name</span>
          <strong>{selectedSite.name}</strong>
        </div>

        <div className="site-detail-item">
          <span>Status</span>
          <strong>
            {selectedSite.is_active ? "Active" : "Inactive"}
          </strong>
        </div>

        <div className="site-detail-item">
          <span>Address</span>
          <strong>{selectedSite.address || "-"}</strong>
        </div>

        <div className="site-detail-item">
          <span>Allowed Radius</span>
          <strong>
            {selectedSite.allowed_radius || 200} meters
          </strong>
        </div>

        <div className="site-detail-item">
          <span>Latitude</span>
          <strong>{selectedSite.latitude}</strong>
        </div>

        <div className="site-detail-item">
          <span>Longitude</span>
          <strong>{selectedSite.longitude}</strong>
        </div>

        <div className="site-detail-item">
          <span>Contact Person</span>
          <strong>
            {selectedSite.contact_person || "-"}
          </strong>
        </div>

        <div className="site-detail-item">
          <span>Contact Phone</span>
          <strong>
            {selectedSite.contact_phone || "-"}
          </strong>
        </div>

      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={() => setShowViewModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      <button
        className="back-dashboard"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default Sites;