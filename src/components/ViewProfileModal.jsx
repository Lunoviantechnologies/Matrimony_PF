import React, { useEffect, useState } from "react";
import "../styleSheets/viewProfileModal.css";
import MatchPreferences from "./MatchPreferences";
import { IoIosLock } from "react-icons/io";

export default function ViewProfileModal({ premium, profile = {}, onClose = () => { } }) {

  const images = [profile.updatePhoto, profile.updatePhoto1, profile.updatePhoto2, profile.updatePhoto3, profile.updatePhoto4].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);

  const locked = !premium && imgIndex > 0;
  const nextImage = () => { setImgIndex(i => (i + 1) % images.length); };
  const prevImage = () => { setImgIndex(i => (i - 1 + images.length) % images.length); };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => document.body.style.overflow = "auto";
  }, []);

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
    fullName = firstName + " " + lastName,
    age,
    gender = "—",
    height = "—",
    religion = "",
    community = "",
    motherTongue = "—",
    maritalStatus = "—",
    noOfChildren = "—",
    numberOfBrothers = "—",
    numberOfSisters = "—",
    highestEducation = "—",
    occupation = "—",
    companyName = "—",
    annualIncome = "—",
    city = "—",
    state = "—",
    country = "—",
    fatherName = "_",
    motherName = "_",
    familyStatus = "—",
    familyType = "—",
    aboutYourself = "",
    photos = [],
    mobileNumber = "_",
    emailId = "_",
    hobbies = "—",
    weight = "—",
    bodyType = "—",
    habbits = "—",
    vegiterian = "—",
    rashi = "—",
    nakshatra = "—",
    dosham = "—",
    spituralPath = "—",
    updatePhoto: image,
  } = profile;

  const imgSrc = image ? image : (gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png");
  console.log("ViewProfileModal :", profile);

  const handleBackdrop = (e) => {
    if (e.target.classList && (e.target.classList.contains("vp-backdrop") || e.target.classList.contains("vp-pop-backdrop"))) {
      onClose();
    }
  };

  const renderCentered = () => (
    <div className="vp-backdrop" onClick={handleBackdrop}>
      <div className="vp-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="vp-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vp-grid">
          <div className="vp-left">
            <div className="vp-main-image carousel">

              <img
                src={images[imgIndex] ? images[imgIndex] : profile.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                alt={fullName}
                className={locked ? "blur-image" : ""}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />

              {locked && (
                <div className="premium-overlay">
                  <IoIosLock color="orange" size={18} />
                  Upgrade to Premium to view photos
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button className="nav left" onClick={prevImage}>‹</button>
                  <button className="nav right" onClick={nextImage}>›</button>
                </>
              )}

            </div>

            {photos && photos.length > 1 && (
              <div className="vp-photos-row">
                {photos.slice(0, 6).map((p, i) => <img key={i} src={p} alt={`${fullName}-${i}`} className="vp-thumb" />)}
              </div>
            )}
          </div>

          <div className="vp-right">
            <div className="vp-header-row">
              <h2 className="vp-name">
                {fullName} <span className="vp-age"><br />{age ? `${age} yrs` : ""}</span>
              </h2>

              <div className="vp-match-circle">
                <div className="vp-match-percent">{matchPercent}%</div>
                <div className="vp-match-text">Matched</div>
              </div>
            </div>

            <div className="vp-meta">
              <div><strong>Gender:</strong> {gender}</div>
              <div><strong>Height:</strong> {height}</div>
              <div><strong>Religion / Community:</strong> {religion || community || "—"}</div>
              <div><strong>Mother Tongue:</strong> {motherTongue}</div>
              <div><strong>Marital Status:</strong> {maritalStatus}</div>
              <div><strong>Company:</strong> {companyName}</div>
              <div><strong>Education:</strong> {highestEducation}</div>
              <div><strong>Occupation:</strong> {occupation}</div>
              <div><strong>Location:</strong> {city}{state ? `, ${state}` : ""}{country ? `, ${country}` : ""}</div>
              <div><strong>Income:</strong> {annualIncome}</div>
            </div>

            <hr />

            <div className="vp-section">
              <h4>About</h4>
              {
                premium ? (
                  <p className="vp-bio">{aboutYourself ? aboutYourself : "No information available"}</p>
                ) : (
                  <p className="vp-about-text vp-blur-text">
                    <IoIosLock color="orange" size={18} /> Upgrade to Premium to view full profile details.
                  </p>
                )
              }
            </div>

            <hr />

            <div className="vp-section">
              <h4>Family</h4>
              <ul className="vp-list" type="none">
                <li><strong>Father:</strong> {fatherName}</li>
                <li><strong>Mother:</strong> {motherName}</li>
                <li><strong>Family Status:</strong> {familyStatus}</li>
                <li><strong>Family Type:</strong> {familyType}</li>
                <li><strong>Siblings:</strong> {numberOfBrothers === null ? 0 : numberOfBrothers} Brother(s), {numberOfSisters === null ? 0 : numberOfSisters} Sister(s)</li>
                <li><strong>Children's:</strong> {noOfChildren === null ? 0 : noOfChildren}</li>
              </ul>
            </div>

            <hr />

            <div className="vp-contact">
              <h4>Contact</h4>
              {
                premium ? (
                  <div>
                    {mobileNumber && <div><strong>Phone:</strong> <a href={`tel:${mobileNumber}`}>{mobileNumber}</a></div>}
                    {emailId && <div><strong>Email:</strong> <a href={`mailto:${emailId}`}>{emailId}</a></div>}
                  </div>
                ) : (
                  <p className="vp-contact-text vp-blur-text">
                    <IoIosLock color="orange" size={18} /> Upgrade to Premium to view contact details.
                  </p>
                )
              }
            </div>

            <hr />

            <div className="vp-lifestyle">
              <h4>Life Style</h4>
              <div><strong>Weight:</strong> {weight} kg</div>
              <div><strong>Body Type:</strong> {bodyType}</div>
              <div><strong>Food Preference:</strong> {vegiterian}</div>
              <div><strong>Habbits:</strong> {habbits}</div>
              <div><strong>Hobbies:</strong> {hobbies}</div>
            </div>

            <hr />

            <div className="vp-horoscope">
              <h4>Horoscope</h4>
              {
                premium ? (
                  <div>
                    <div><strong>Rashi:</strong> {rashi}</div>
                    <div><strong>Nakshatra:</strong> {nakshatra}</div>
                    <div><strong>Dosham:</strong> {dosham}</div>
                    <div><strong>Spiritual Path:</strong> {spituralPath}</div>
                  </div>
                ) : (
                  <p className="vp-horoscope-text vp-blur-text">
                    <IoIosLock color="orange" size={18} /> Upgrade to Premium to view horoscope details.
                  </p>
                )
              }
            </div>

            <hr />

            <div className="vp-matchPreferences">
              <h4>Match Preferences</h4>
              <MatchPreferences profile={profile} setMatchPercent={setMatchPercent} />
            </div>

            <hr />

            <div>
              {!premium && (
                <div className="vp-premium-note">
                  <IoIosLock color="orange" size={18} /> Upgrade to Premium to view full profile details and photos.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return renderCentered();
}
