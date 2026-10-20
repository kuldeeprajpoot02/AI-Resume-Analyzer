
import "../../../style.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/get-me`,
          { withCredentials: true }
        );

        const profile = response.data?.user;

        if (!active) return;

        setUser(profile);
        setForm({
          username: profile?.username || "",
          email: profile?.email || "",
        });
      } catch (err) {
        if (!active) return;

        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  const initials = (
    form.username || form.email || "U"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const username = form.username.trim();

    if (username.length < 3 || username.length > 30) {
      setError("Username must be between 3 and 30 characters.");
      return;
    }

    if (username === user?.username) {
      setEditing(false);
      setSuccess("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      // Backend route uses PUT /api/auth/update-profile
      const response = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        { username },
        { withCredentials: true }
      );

      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("Invalid server response.");
      }

      setUser(updatedUser);
      setForm({
        username: updatedUser.username || "",
        email: updatedUser.email || "",
      });

      setEditing(false);
      setSuccess(
        response.data.message || "Profile updated successfully."
      );
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-shell">
          <div className="profile-state">
            Loading your profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <button
          type="button"
          className="profile-back"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>

        <section className="profile-hero">
          <div>
            <p className="profile-eyebrow">ACCOUNT SETTINGS</p>
            <h1>My Profile</h1>
            <p className="profile-subtitle">
              Manage your account information in one place.
            </p>
          </div>

          <div className="profile-avatar">{initials}</div>
        </section>

        {error && (
          <div className="profile-alert" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success" role="status">
            {success}
          </div>
        )}

        <section className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Your account details</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="profile-button profile-button-primary"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditing(true);
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div className="profile-fields">
              <label className="profile-field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  disabled={!editing || saving}
                  onChange={handleChange}
                  placeholder="Your name"
                  minLength={3}
                  maxLength={30}
                  required
                />
              </label>

              <label className="profile-field">
                <span>Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  readOnly
                />
              </label>
            </div>

            {editing && (
              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-button profile-button-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-button profile-button-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="profile-card profile-security">
          <div className="profile-security-icon">✓</div>

          <div>
            <h2>Account Security</h2>
            <p>
              Keep your login credentials private.
              Your password is never shown on this page.
            </p>
          </div>

          <button
            type="button"
            className="profile-button profile-button-secondary"
            onClick={() => navigate("/login")}
          >
            Login Page
          </button>
        </section>

        <p className="profile-footer">
          AI Resume Analyzer · Your career journey, organized.
        </p>
      </div>
    </main>
  );
};

export default Profile;
