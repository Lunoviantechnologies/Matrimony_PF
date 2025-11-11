import React, { useState, useRef, useEffect } from "react";
import "../styleSheets/EditProfile.css";
import { FaCamera, FaChevronRight, FaEdit, FaPlus } from "react-icons/fa";

export default function EditProfile() {
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const [openModal, setOpenModal] = useState(null);

  // ---- Profile data ----
  const [personal, setPersonal] = useState({
    fullName: "Bhavya S.",
    dob: "1999-08-01",
    gender: "Female",
    motherTongue: "Telugu",
    maritalStatus: "Never Married",
    location: "Hyderabad, Telangana",
    hobbies: ["Dancing", "Cooking", "Reading novels"],
  });

  const [basics, setBasics] = useState({
    height: "5'3\"",
    weight: "55 kg",
    bodyType: "Athletic",
    complexion: "Wheatish",
  });

  const [educationCareer, setEducationCareer] = useState({
    highestEducation: "B.Tech - CSE",
    employedIn: "Private",
    occupation: "Software Engineer",
    company: "NextHub Technologies",
    experience: "2 – 3 years",
  });

  const [family, setFamily] = useState({
    fatherName: "Suresh",
    motherName: "Latha",
    siblings: "1 Brother",
    familyStatus: "Middle Class",
  });

  const [astro, setAstro] = useState({
    manglik: "No",
    rashi: "Mesha",
    nakshatra: "Bharani",
  });

  const [partnerPrefs, setPartnerPrefs] = useState({
    ageRange: "27 - 32",
    religion: "Hindu",
    education: "Any Graduate",
    locationPref: "India",
    work: "Working / Employed",
    hobbies: ["Traveling", "Movies", "Cooking"],
  });

  const [editBuffer, setEditBuffer] = useState({});
  useEffect(() => {
    if (!openModal) setEditBuffer({});
  }, [openModal]);

  // ----- Handlers -----
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleUploadClick = () => fileInputRef.current && fileInputRef.current.click();

  const openSectionModal = (sectionKey) => {
    const sectionMap = { personal, basics, educationCareer, family, astro, partnerPrefs };
    setEditBuffer(JSON.parse(JSON.stringify(sectionMap[sectionKey])));
    setOpenModal(sectionKey);
  };

  const saveSection = () => {
    const setterMap = {
      personal: setPersonal,
      basics: setBasics,
      educationCareer: setEducationCareer,
      family: setFamily,
      astro: setAstro,
      partnerPrefs: setPartnerPrefs,
    };
    setterMap[openModal]?.(editBuffer);
    setOpenModal(null);
  };

  const cancelEdit = () => {
    setOpenModal(null);
    setEditBuffer({});
  };

  const handleEditInput = (k, v) => setEditBuffer((p) => ({ ...p, [k]: v }));

  const Row = ({ label, value, actionText, onAction }) => (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">
        <div className="value-text">
          {Array.isArray(value)
            ? value.join(", ")
            : value || <em className="muted">Not specified</em>}
        </div>
        {actionText && (
          <button className="action-link" onClick={onAction}>
            {actionText} <FaChevronRight className="chev" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="edit-profile-page">
      <h3>Edit Profile</h3>
      {/* ---- Main content ---- */}
      <main className="page-content">
        <aside className="left-column">
          <div className="photo-card">
            <div className="photo-box">
              {photo ? (
                <img src={photo} alt="Profile" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <FaCamera className="camera-icon" />
                  <div className="upload-text">Upload Photo</div>
                </div>
              )}
              <div className="camera-action" onClick={handleUploadClick}>
                <FaCamera /> <span>Change</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="photo-caption">
              <div className="photo-name">{personal.fullName}</div>
              <div className="photo-sub">Active member • Verified</div>
            </div>
            <div className="photo-actions-row">
              <button className="btn-blue" onClick={() => openSectionModal("personal")}>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header red">
              Basics & Lifestyle
              <button className="edit-inline" onClick={() => openSectionModal("basics")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body">
              <Row label="Height" value={basics.height} />
              <Row label="Weight" value={basics.weight} />
              <Row label="Body Type" value={basics.bodyType} />
              <Row label="Complexion" value={basics.complexion} />
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header red">
              Family Details
              <button className="edit-inline" onClick={() => openSectionModal("family")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body">
              <Row label="Father" value={family.fatherName} />
              <Row label="Mother" value={family.motherName} />
              <Row label="Siblings" value={family.siblings} />
              <Row label="Family Status" value={family.familyStatus} />
            </div>
          </div>
        </aside>

        <section className="right-column">
          <div className="main-card boxed">
            <div className="box-header red">
              Personal Details
              <button className="edit-inline" onClick={() => openSectionModal("personal")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Full Name" value={personal.fullName} />
                <Row label="Date of Birth" value={personal.dob} />
                <Row label="Gender" value={personal.gender} />
                <Row label="Mother Tongue" value={personal.motherTongue} />
                <Row label="Marital Status" value={personal.maritalStatus} />
                <Row label="Location" value={personal.location} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Highest Education" value={educationCareer.highestEducation} />
                <Row label="Occupation" value={educationCareer.occupation} />
                <Row label="Company" value={educationCareer.company} />
                <Row label="Experience" value={educationCareer.experience} />
                <Row label="Rashi" value={astro.rashi} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Education & Career
              <button className="edit-inline" onClick={() => openSectionModal("educationCareer")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Highest Education" value={educationCareer.highestEducation} />
                <Row label="Employed In" value={educationCareer.employedIn} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Occupation" value={educationCareer.occupation} />
                <Row label="Company" value={educationCareer.company} />
                <Row label="Experience" value={educationCareer.experience} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Hobbies
              <button className="edit-inline" onClick={() => openSectionModal("personal")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your Hobbies" value={personal.hobbies} />
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Partner Preferences
              <button className="edit-inline" onClick={() => openSectionModal("partnerPrefs")}>
                <FaEdit /> Edit
              </button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Age Range" value={partnerPrefs.ageRange} />
                <Row label="Religion" value={partnerPrefs.religion} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Education" value={partnerPrefs.education} />
                <Row label="Work" value={partnerPrefs.work} />
                <Row label="Partner Hobbies" value={partnerPrefs.hobbies} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---- Modal ---- */}
      {openModal && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && cancelEdit()}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit {modalTitleForKey(openModal)}</h3>
              <button className="modal-close" onClick={cancelEdit}>✕</button>
            </div>
            <div className="modal-body">
              {renderModalForm(openModal, editBuffer, handleEditInput)}
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={cancelEdit}>Cancel</button>
              <button className="btn-primary" onClick={saveSection}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Helper functions ---- */

function modalTitleForKey(key) {
  const titles = {
    personal: "Personal Details",
    basics: "Basics & Lifestyle",
    educationCareer: "Education & Career",
    family: "Family Details",
    astro: "Astro / Religious",
    partnerPrefs: "Partner Preferences",
  };
  return titles[key] || "Details";
}

function renderModalForm(key, buffer, handleEditInput) {
  const addHobby = () => {
    handleEditInput("hobbies", [...(buffer.hobbies || []), ""]);
  };

  const updateHobby = (index, value) => {
    const newHobbies = [...buffer.hobbies];
    newHobbies[index] = value;
    handleEditInput("hobbies", newHobbies);
  };

  switch (key) {
    case "basics":
      return (
        <div className="modal-form">
          <label className="field"><div className="field-label">Height</div><input value={buffer.height || ""} onChange={(e) => handleEditInput("height", e.target.value)} /></label>
          <label className="field"><div className="field-label">Weight</div><input value={buffer.weight || ""} onChange={(e) => handleEditInput("weight", e.target.value)} /></label>
          <label className="field"><div className="field-label">Body Type</div><input value={buffer.bodyType || ""} onChange={(e) => handleEditInput("bodyType", e.target.value)} /></label>
          <label className="field"><div className="field-label">Complexion</div><input value={buffer.complexion || ""} onChange={(e) => handleEditInput("complexion", e.target.value)} /></label>
        </div>
      );

    case "family":
      return (
        <div className="modal-form">
          <label className="field"><div className="field-label">Father's Name</div><input value={buffer.fatherName || ""} onChange={(e) => handleEditInput("fatherName", e.target.value)} /></label>
          <label className="field"><div className="field-label">Mother's Name</div><input value={buffer.motherName || ""} onChange={(e) => handleEditInput("motherName", e.target.value)} /></label>
          <label className="field"><div className="field-label">Siblings</div><input value={buffer.siblings || ""} onChange={(e) => handleEditInput("siblings", e.target.value)} /></label>
          <label className="field"><div className="field-label">Family Status</div><input value={buffer.familyStatus || ""} onChange={(e) => handleEditInput("familyStatus", e.target.value)} /></label>
        </div>
      );

    case "educationCareer":
      return (
        <div className="modal-form">
          <label className="field"><div className="field-label">Highest Education</div><input value={buffer.highestEducation || ""} onChange={(e) => handleEditInput("highestEducation", e.target.value)} /></label>
          <label className="field"><div className="field-label">Employed In</div><select value={buffer.employedIn || ""} onChange={(e) => handleEditInput("employedIn", e.target.value)}><option>Private</option><option>Government</option><option>Self Employed</option></select></label>
          <label className="field"><div className="field-label">Occupation</div><input value={buffer.occupation || ""} onChange={(e) => handleEditInput("occupation", e.target.value)} /></label>
          <label className="field"><div className="field-label">Company</div><input value={buffer.company || ""} onChange={(e) => handleEditInput("company", e.target.value)} /></label>
          <label className="field"><div className="field-label">Experience</div><select value={buffer.experience || ""} onChange={(e) => handleEditInput("experience", e.target.value)}><option>&lt; 1 year</option><option>2 – 3 years</option><option>3 – 5 years</option><option>&gt; 5 years</option></select></label>
        </div>
      );

    case "personal":
      return (
        <div className="modal-form">
          <label className="field"><div className="field-label">Full Name</div><input value={buffer.fullName || ""} onChange={(e) => handleEditInput("fullName", e.target.value)} /></label>
          <label className="field"><div className="field-label">Date of Birth</div><input type="date" value={buffer.dob || ""} onChange={(e) => handleEditInput("dob", e.target.value)} /></label>
          <label className="field"><div className="field-label">Gender</div><select value={buffer.gender || ""} onChange={(e) => handleEditInput("gender", e.target.value)}><option>Female</option><option>Male</option><option>Other</option></select></label>
          <label className="field"><div className="field-label">Mother Tongue</div><input value={buffer.motherTongue || ""} onChange={(e) => handleEditInput("motherTongue", e.target.value)} /></label>
          <label className="field"><div className="field-label">Marital Status</div><select value={buffer.maritalStatus || ""} onChange={(e) => handleEditInput("maritalStatus", e.target.value)}><option>Never Married</option><option>Divorced</option><option>Widowed</option></select></label>
          <label className="field"><div className="field-label">Location</div><input value={buffer.location || ""} onChange={(e) => handleEditInput("location", e.target.value)} /></label>
          <div className="field">
            <div className="field-label">Hobbies</div>
            {(buffer.hobbies || []).map((hobby, i) => (
              <input
                key={i}
                className="hobby-input"
                value={hobby}
                placeholder={`Hobby ${i + 1}`}
                onChange={(e) => updateHobby(i, e.target.value)}
              />
            ))}
            <button type="button" className="add-hobby-btn" onClick={addHobby}>
              <FaPlus /> Add Hobby
            </button>
          </div>
        </div>
      );

    case "partnerPrefs":
      return (
        <div className="modal-form">
          <label className="field"><div className="field-label">Age Range</div><input value={buffer.ageRange || ""} onChange={(e) => handleEditInput("ageRange", e.target.value)} /></label>
          <label className="field"><div className="field-label">Religion</div><input value={buffer.religion || ""} onChange={(e) => handleEditInput("religion", e.target.value)} /></label>
          <label className="field"><div className="field-label">Education</div><input value={buffer.education || ""} onChange={(e) => handleEditInput("education", e.target.value)} /></label>
          <label className="field"><div className="field-label">Work</div><input value={buffer.work || ""} onChange={(e) => handleEditInput("work", e.target.value)} /></label>
          <div className="field">
            <div className="field-label">Partner Hobbies</div>
            {(buffer.hobbies || []).map((hobby, i) => (
              <input
                key={i}
                className="hobby-input"
                value={hobby}
                placeholder={`Partner Hobby ${i + 1}`}
                onChange={(e) => {
                  const newHobbies = [...buffer.hobbies];
                  newHobbies[i] = e.target.value;
                  handleEditInput("hobbies", newHobbies);
                }}
              />
            ))}
            <button type="button" className="add-hobby-btn" onClick={() => handleEditInput("hobbies", [...(buffer.hobbies || []), ""])}>
              <FaPlus /> Add Hobby
            </button>
          </div>
        </div>
      );

    default:
      return <div>Editing not supported for this section.</div>;
  }
}
