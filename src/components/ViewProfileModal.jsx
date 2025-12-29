import React, { useEffect } from "react";
import "../styleSheets/ViewProfileModal.css";

export default function ViewProfileModal({ premium ,profile = {}, onClose = () => { }, anchorRect = null }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!profile) return null;

  // destructure safely, fallbacks are "—"
  const {
    firstName = "—",
    lastName = "—",
    age,
    gender = "—",
    height = "—",
    religion = "",
    community = "",
    motherTongue = "—",
    maritalStatus = "—",
    siblings = "—",
    highestEducation = "—",
    occupation = "—",
    annualIncome = "—",
    city = "—",
    state = "—",
    country = "—",
    family = {},
    bio = "",
    photos = [],
    phone = "",
    email = "",
    id,
    updatePhoto: image,
  } = profile;

  const imgSrc = image ? image : (gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png");
  // console.log("ViewProfileModal imgSrc:", premium);

  const handleBackdrop = (e) => {
    if (e.target.classList && (e.target.classList.contains("vp-backdrop") || e.target.classList.contains("vp-pop-backdrop"))) {
      onClose();
    }
  };

  // anchored small popover rendering (uses fixed positioning - viewport coords)
  const renderPopover = () => {
    if (!anchorRect) return null;

    const popupH = 340;
    const popupW = 500;
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = anchorRect.right + pad;
    let top = anchorRect.top;

    if (left + popupW > vw - 12) left = anchorRect.left - popupW - pad;
    if (top + popupH > vh - 12) top = Math.max(12, vh - popupH - 12);

    left = Math.max(8, Math.min(left, vw - popupW - 8));
    top = Math.max(8, Math.min(top, vh - 80));

    return (
      <div className="vp-pop-backdrop" onClick={handleBackdrop}>
        <div
          className="vp-popover vp-popover-expanded"
          style={{ position: "fixed", left, top, width: popupW, maxHeight: popupH, zIndex: 2000, }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="vp-close-small" onClick={onClose} aria-label="Close">✕</button>

          <div className="vp-pop-row">
            <div className="vp-passport-small">
              <img src={imgSrc} alt={firstName}
                className={`profile-img ${!premium ? "blur-image" : ""}`}
                onError={(e) => {
                  e.target.src = gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
                }}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            <div className="vp-info-small vp-info-scroll">
              <div className="vp-name-small">{firstName + " " + lastName} <span className="vp-age-small">{age ? `${age} yrs` : ""}</span></div>
              <div className="vp-subline-small">{gender} {height ? ` • ${height}` : ""}</div>

              <div className="vp-meta-small">
                <div><strong>Religion / Community:</strong> {religion || community || "—"}</div>
                <div><strong>Mother Tongue:</strong> {motherTongue}</div>
                <div><strong>Marital Status:</strong> {maritalStatus}</div>
                <div><strong>Siblings:</strong> {siblings}</div>
                <div><strong>Education:</strong> {highestEducation}</div>
                <div><strong>Occupation:</strong> {occupation}</div>
                <div><strong>Income:</strong> {annualIncome}</div>
                <div><strong>Location:</strong> {city}{state ? `, ${state}` : ""}{country ? `, ${country}` : ""}</div>
              </div>

              {bio && (
                <div className="vp-section-small">
                  <strong>About:</strong>
                  <div className="vp-bio-small">{bio}</div>
                </div>
              )}

              {family && Object.keys(family).length > 0 && (
                <div className="vp-section-small">
                  <strong>Family:</strong>
                  <ul className="vp-list-small">
                    {Object.entries(family).map(([k, v]) => (
                      <li key={k}><strong>{k}:</strong> {String(v)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="vp-contact-small">
                {phone && <div><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></div>}
                {email && <div><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></div>}
                {/* <div><strong>Profile ID:</strong> {id || "—"}</div> */}
              </div>

              <div className="vp-actions-small">
                <button className="connect-btn" onClick={() => alert("Send Request (mock)")}>Send Request</button>
                <button className="connect-btn secondary" onClick={() => alert("Message (mock)")}>Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCentered = () => (
    <div className="vp-backdrop" onClick={handleBackdrop}>
      <div className="vp-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="vp-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vp-grid">
          <div className="vp-left">
            <div className="vp-main-image"><img src={imgSrc} alt={name} /></div>
            {photos && photos.length > 1 && (
              <div className="vp-photos-row">
                {photos.slice(0, 6).map((p, i) => <img key={i} src={p} alt={`${name}-${i}`} className="vp-thumb" />)}
              </div>
            )}
          </div>

          <div className="vp-right">
            <h2 className="vp-name">{name} <span className="vp-age">{age ? `${age} yrs` : ""}</span></h2>

            <div className="vp-meta">
              <div><strong>Gender:</strong> {gender}</div>
              <div><strong>Height:</strong> {height}</div>
              <div><strong>Religion / Community:</strong> {religion || community || "—"}</div>
              <div><strong>Mother Tongue:</strong> {motherTongue}</div>
              <div><strong>Marital Status:</strong> {maritalStatus}</div>
              <div><strong>Siblings:</strong> {siblings}</div>
              <div><strong>Education:</strong> {highestEducation}</div>
              <div><strong>Occupation:</strong> {occupation}</div>
              <div><strong>Income:</strong> {annualIncome}</div>
              <div><strong>Location:</strong> {city}{state ? `, ${state}` : ""}{country ? `, ${country}` : ""}</div>
            </div>

            {bio && (
              <div className="vp-section">
                <h4>About</h4>
                <p className="vp-bio">{bio}</p>
              </div>
            )}

            {family && Object.keys(family).length > 0 && (
              <div className="vp-section">
                <h4>Family</h4>
                <ul className="vp-list">
                  {Object.entries(family).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}
                </ul>
              </div>
            )}

            <div className="vp-contact">
              {phone && <div><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></div>}
              {email && <div><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></div>}
              {/* <div><strong>Profile ID:</strong> {id || "—"}</div> */}
            </div>

            <div className="vp-actions">
              <button className="connect-btn" onClick={() => alert("Send Request (mock)")}>Send Request</button>
              <button className="connect-btn secondary" onClick={() => alert("Message (mock)")}>Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return anchorRect ? renderPopover() : renderCentered();
}
