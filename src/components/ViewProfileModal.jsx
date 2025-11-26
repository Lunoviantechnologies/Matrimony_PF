import React, { useEffect } from "react";
import "../styleSheets/profileCard.css";

export default function ViewProfileModal({ profile = {}, onClose = () => {} }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!profile) return null;

  const {
    name,
    age,
    job,
    education,
    location,
    community,
    height,
    image,
    bio,
    photos = [],
    phone,
    email,
    preferences = {},
    family = {},
  } = profile;

  const handleSendRequest = () => {
    // wire this to your API
    alert(`Request sent to ${name} (mock)`);
  };

  const handleMessage = () => {
    // route to chat or open messenger
    alert(`Open chat with ${name} (mock)`);
  };

  const handleClose = (e) => {
    // close when backdrop clicked
    if (e.target.classList && e.target.classList.contains("vp-backdrop")) onClose();
  };

  return (
    <div className="vp-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="vp-modal">
        <button className="vp-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vp-grid">
          <div className="vp-left">
            <div className="vp-main-image">
              <img src={image || (photos[0] ?? "")} alt={name} />
            </div>

            {photos.length > 0 && (
              <div className="vp-photos-row">
                {photos.map((p, i) => (
                  <img key={i} src={p} alt={`${name}-${i}`} className="vp-thumb" />
                ))}
              </div>
            )}
          </div>

          <div className="vp-right">
            <h2 className="vp-name">{name}, <span className="vp-age">{age}</span></h2>

            <div className="vp-meta">
              <div><strong>Height:</strong> {height || "—"}</div>
              <div><strong>Education:</strong> {education || "—"}</div>
              <div><strong>Occupation:</strong> {job || "—"}</div>
              <div><strong>Location:</strong> {location || "—"}</div>
              <div><strong>Community:</strong> {community || "—"}</div>
            </div>

            {bio && (
              <div className="vp-section">
                <h4>About</h4>
                <p className="vp-bio">{bio}</p>
              </div>
            )}

            {Object.keys(preferences || {}).length > 0 && (
              <div className="vp-section">
                <h4>Preferences</h4>
                <ul className="vp-list">
                  {Object.entries(preferences).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {String(v)}</li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(family || {}).length > 0 && (
              <div className="vp-section">
                <h4>Family</h4>
                <ul className="vp-list">
                  {Object.entries(family).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {String(v)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="vp-contact">
              {phone && <div><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></div>}
              {email && <div><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></div>}
            </div>

            <div className="vp-actions">
              <button className="connect-btn" onClick={handleSendRequest}>Send Request</button>
              <button className="connect-btn" onClick={handleMessage}>Message</button>
              <button className="connect-btn secondary" onClick={() => alert("Shortlist (mock)")}>Shortlist</button>
            </div>
          </div>
        </div>

        <div className="vp-footer">
          <small>Profile ID: {profile.id || profile.userId || "—"}</small>
        </div>
      </div>
    </div>
  );
}
