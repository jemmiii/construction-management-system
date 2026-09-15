import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        " https://reproductive-goes-vary-nirvana.trycloudflare.com  /api/admin/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.data)
        );

        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="brand">
            <div className="logo">🏗️</div>
            <span>BuildFlow</span>
          </div>

          <div className="welcome-content">
            <p className="welcome-tag">
              CONSTRUCTION MANAGEMENT SYSTEM
            </p>

            <h1>
              Build smarter.
              <br />
              Manage better.
            </h1>

            <p>
              Manage your construction sites, workers, assignments
              and attendance from one powerful platform.
            </p>
          </div>

          <div className="stats">
            <div>
              <strong>100+</strong>
              <span>Projects</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Workers</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Sites</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-form-container">

            <div className="mobile-logo">
              🏗️ BuildFlow
            </div>

            <h2>Welcome back</h2>

            <p className="login-subtitle">
              Enter your details to access your dashboard
            </p>

            <form onSubmit={handleLogin}>

              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <div className="password-label">
                  <label>Password</label>
                  <span>Forgot password?</span>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">
                  Remember me
                </label>
              </div>

              {message && (
                <p
                  style={{
                    color: message === "Login successful!"
                      ? "green"
                      : "red",
                  }}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In →"}
              </button>

            </form>

            <p className="footer-text">
              Secure access to your construction management platform
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;