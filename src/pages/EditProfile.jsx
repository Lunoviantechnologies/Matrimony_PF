import React, { useState, useEffect, useRef } from "react";
import "../styleSheets/EditProfile.css";
import { FaCamera, FaChevronRight, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import backendIP from "../api/api";

const PROFILE_ID = 36; // change to dynamic id when ready

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({}); // full profile object
  const [photo, setPhoto] = useState(null);

  const [openModal, setOpenModal] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});

  const fileInputRef = useRef(null);

  /* ------------------ GET PROFILE ------------------ */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendIP}/api/admin/profiles/36`);
        const data = res.data || {};
        console.log("a:",res.data)
        setProfileData(data);

        if (data.photo) setPhoto(data.photo);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ------------------ Modal open ------------------ */
  const openSectionModal = (sectionKey) => {
    // We support editing either nested objects (e.g. educationCareer) or root fields.
    // If the backend returns nested objects under keys like educationCareer, use them; otherwise derive from root.
    const sectionMap = {
      personal: {
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        mobileNumber: profileData.mobileNumber || "",
        dateOfBirth: profileData.dateOfBirth || profileData.dob || "",
        gender: profileData.gender || "",
        motherTongue: profileData.motherTongue || "",
        maritalStatus: profileData.maritalStatus || "",
        location: profileData.location || "",
        about: profileData.about || ""
      },
      basics: {
        height: profileData.height || "",
        weight: profileData.weight || "",
        bodyType: profileData.bodyType || "",
        complexion: profileData.complexion || ""
      },
      educationCareer: {
        highestEducation: profileData.highestEducation || "",
        collegeName: profileData.collegeName || "",
        employedIn: profileData.employedIn || "",
        sector: profileData.sector || "",
        occupation: profileData.occupation || "",
        companyName: profileData.companyName || "",
        annualIncome: profileData.annualIncome || "",
        workLocation: profileData.workLocation || "",
        state: profileData.state || "",
        country: profileData.country || "",
        city: profileData.city || ""
      },
      family: {
        fatherName: profileData.fatherName || "",
        motherName: profileData.motherName || "",
        siblings: profileData.siblings || "",
        familyStatus: profileData.familyStatus || ""
      },
      astro: {
        rashi: profileData.rashi || "",
        nakshatra: profileData.nakshatra || "",
        ascendant: profileData.ascendant || "",
        basicPlanetaryPosition: profileData.basicPlanetaryPosition || ""
      },
      partnerPrefs: {
        ageRange: profileData.partnerAgeRange || "",
        religion: profileData.partnerReligion || "",
        education: profileData.partnerEducation || "",
        work: profileData.partnerWork || "",
        hobbies: Array.isArray(profileData.partnerHobbies) ? profileData.partnerHobbies : (profileData.partnerHobbies?.split?.(",") || [])
      }
    };

    setEditBuffer(sectionMap[sectionKey] || {});
    setOpenModal(sectionKey);
  };

  /* ------------------ Save edited section ------------------ */
  const saveSection = async () => {
    try {
      // Merge edits into full profile object
      const updatedProfile = { ...profileData, ...editBuffer, id: PROFILE_ID };

      // If partnerHobbies/hobbies are arrays, convert to comma-string if your backend expects strings.
      // (Adjust as needed depending on backend.)
      if (Array.isArray(updatedProfile.hobbies)) {
        updatedProfile.hobbies = updatedProfile.hobbies.join(",");
      }
      if (Array.isArray(updatedProfile.partnerHobbies)) {
        updatedProfile.partnerHobbies = updatedProfile.partnerHobbies.join(",");
      }

      // Send full object to update endpoint
      const res = await axios.put(`${backendIP}/api/admin/update/36`, updatedProfile);

      // On success update local UI
      setProfileData(updatedProfile);
      setOpenModal(null);
      setEditBuffer({});
      console.log("Update response:", res.data);
      alert("Saved successfully");
    } catch (err) {
      console.error("Error saving section:", err.response || err);
      alert("Save failed — check console");
    }
  };

  const cancelEdit = () => {
    setOpenModal(null);
    setEditBuffer({});
  };

  const handleEditInput = (key, value) =>
    setEditBuffer((p) => ({ ...p, [key]: value }));

  /* ------------------ Photo upload (preview only) ------------------ */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const Row = ({ label, value, onAction, actionText }) => (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">
        <div className="value-text">
          {Array.isArray(value) ? value.join(", ") : value || <em className="muted">Not specified</em>}
        </div>
        {actionText && (
          <button className="action-link" onClick={onAction}>
            {actionText} <FaChevronRight className="chev" />
          </button>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="edit-profile-page">
      <h3>Edit Profile</h3>

      <main className="page-content">
        <aside className="left-column">
          <div className="photo-card">
            <div className="photo-box">
              {photo ? <img src={photo} alt="Profile" className="photo-preview" /> : (
                <div className="photo-placeholder">
                  <FaCamera className="camera-icon" />
                  <div className="upload-text">Upload Photo</div>
                </div>
              )}
              <div className="camera-action" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                <FaCamera /> <span>Change</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            </div>

            <div className="photo-caption">
              <div className="photo-name">{profileData.fullName || `${profileData.firstName || ""} ${profileData.lastName || "Null"}`}</div>
              <div className="photo-sub">Active member • Verified</div>
            </div>

            <div className="photo-actions-row">
              <button className="btn-blue" onClick={() => openSectionModal("personal")}>Edit Profile</button>
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
              <Row label="Height" value={profileData.height} />
              <Row label="Weight" value={profileData.weight} />
              <Row label="Body Type" value={profileData.bodyType} />
              <Row label="Complexion" value={profileData.complexion} />
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header red">
              Astrology
              <button className="edit-inline" onClick={() => openSectionModal("astro")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body">
              <Row label="Rashi" value={profileData.rashi} />
              <Row label="Nakshatra" value={profileData.nakshatra} />
              <Row label="Ascendant" value={profileData.ascendant} />
              <Row label="Basic planetary position" value={profileData.basicPlanetaryPosition} />
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header red">
              Family Details
              <button className="edit-inline" onClick={() => openSectionModal("family")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body">
              <Row label="Father Status" value={profileData.fatherName} />
              <Row label="Mother Status" value={profileData.motherName} />
              <Row label="Number of Brothers" value={profileData.numberofbrothers} />
              <Row label="Number of Sisters" value={profileData.numberofsister} />
              <Row label="ancestral Origin/Native Place" value={profileData.NativePalce} />
            </div>
          </div>
        </aside>

        <section className="right-column">
          <div className="main-card boxed">
            <div className="box-header red">
              Personal Details
              <button className="edit-inline" onClick={() => openSectionModal("personal")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="First Name" value={profileData.firstName} />
                <Row label="Last Name" value={profileData.lastName} />
                <Row label="Mobile Number" value={profileData.mobileNumber} />
                <Row label="Date of Birth" value={profileData.dateOfBirth || profileData.dob} />
                <Row label="Gender" value={profileData.gender} />
                <Row label="Mother Tongue" value={profileData.motherTongue} />
                <Row label="Marital Status" value={profileData.maritalStatus} />
                <Row label="Location" value={profileData.location} />
              </div>

              <div className="right-col underlined-block">
                <Row label="Highest Education" value={profileData.highestEducation} />
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company" value={profileData.companyName} />
                <Row label="Experience" value={profileData.experience} />
                <Row label="Sector" value={profileData.sector} />
                <Row label="Sports " value={profileData.Sports} />
                 <Row label="Living with Childrens" value={profileData.livingwithchildrens} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Education & Career
              <button className="edit-inline" onClick={() => openSectionModal("educationCareer")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Highest Education" value={profileData.highestEducation} />
                <Row label="College Name" value={profileData.collegeName} />
                <Row label="Employed In" value={profileData.employedIn} />
                <Row label="Sector" value={profileData.sector} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company Name" value={profileData.companyName} />
                <Row label="Annual Income" value={profileData.annualIncome} />
                <Row label="Work Location" value={profileData.workLocation} />
                <Row label="State" value={profileData.state} />
                <Row label="Country" value={profileData.country} />
                <Row label="City" value={profileData.city} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Hobbies
              <button className="edit-inline" onClick={() => openSectionModal("personal")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your Hobbies" value={(profileData.hobbies && profileData.hobbies.split?.(",")) || profileData.hobbies} />
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Partner Preferences
              <button className="edit-inline" onClick={() => openSectionModal("partnerPrefs")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Age Range" value={profileData.partnerAgeRange} />
                <Row label="Religion" value={profileData.partnerReligion} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Education" value={profileData.partnerEducation} />
                <Row label="Work" value={profileData.partnerWork} />
                <Row label="Partner Hobbies" value={(profileData.partnerHobbies && profileData.partnerHobbies.split?.(",")) || profileData.partnerHobbies} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------ Modal ------------------ */}
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

  /* ------------------ helpers ------------------ */

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

  function addHobbyToBuffer(field = "hobbies") {
    setEditBuffer((p) => ({ ...p, [field]: [...(p[field] || []), ""] }));
  }

  function updateHobbyInBuffer(field, idx, val) {
    const arr = [...(editBuffer[field] || [])];
    arr[idx] = val;
    setEditBuffer((p) => ({ ...p, [field]: arr }));
  }

  function renderModalForm(key, buffer, handleEditInputLocal) {
    // Use buffer to render, handleEditInputLocal to update single key
    switch (key) {
      case "basics":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Height</div>
              <input value={buffer.height || ""} onChange={(e) => handleEditInputLocal("height", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Weight</div>
              <input value={buffer.weight || ""} onChange={(e) => handleEditInputLocal("weight", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Body Type</div>
              <input value={buffer.bodyType || ""} onChange={(e) => handleEditInputLocal("bodyType", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Complexion</div>
              <input value={buffer.complexion || ""} onChange={(e) => handleEditInputLocal("complexion", e.target.value)} />
            </label>
          </div>
        );

      case "family":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Father's Name</div>
              <input value={buffer.fatherName || ""} onChange={(e) => handleEditInputLocal("fatherName", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Mother's Name</div>
              <input value={buffer.motherName || ""} onChange={(e) => handleEditInputLocal("motherName", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Siblings</div>
              <input value={buffer.siblings || ""} onChange={(e) => handleEditInputLocal("siblings", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Family Status</div>
              <input value={buffer.familyStatus || ""} onChange={(e) => handleEditInputLocal("familyStatus", e.target.value)} />
            </label>
          </div>
        );

      case "educationCareer":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Highest Education</div>
              <input value={buffer.highestEducation || ""} onChange={(e) => handleEditInputLocal("highestEducation", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">College Name</div>
              <input value={buffer.collegeName || ""} onChange={(e) => handleEditInputLocal("collegeName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Employed In</div>
              <input value={buffer.employedIn || ""} onChange={(e) => handleEditInputLocal("employedIn", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Sector</div>
              <input value={buffer.sector || ""} onChange={(e) => handleEditInputLocal("sector", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Occupation</div>
              <input value={buffer.occupation || ""} onChange={(e) => handleEditInputLocal("occupation", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Company Name</div>
              <input value={buffer.companyName || ""} onChange={(e) => handleEditInputLocal("companyName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Annual Income</div>
              <input value={buffer.annualIncome || ""} onChange={(e) => handleEditInputLocal("annualIncome", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Work Location</div>
              <input value={buffer.workLocation || ""} onChange={(e) => handleEditInputLocal("workLocation", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">State</div>
              <input value={buffer.state || ""} onChange={(e) => handleEditInputLocal("state", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">City</div>
              <input value={buffer.city || ""} onChange={(e) => handleEditInputLocal("city", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Country</div>
              <input value={buffer.country || ""} onChange={(e) => handleEditInputLocal("country", e.target.value)} />
            </label>
          </div>
        );

      case "astro":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Rashi</div>
              <input value={buffer.rashi || ""} onChange={(e) => handleEditInputLocal("rashi", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Nakshatra</div>
              <input value={buffer.nakshatra || ""} onChange={(e) => handleEditInputLocal("nakshatra", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Ascendant</div>
              <input value={buffer.ascendant || ""} onChange={(e) => handleEditInputLocal("ascendant", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Basic planetary position</div>
              <textarea rows="3" value={buffer.basicPlanetaryPosition || ""} onChange={(e) => handleEditInputLocal("basicPlanetaryPosition", e.target.value)} />
            </label>
          </div>
        );

      case "personal":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Full Name</div>
              <input value={buffer.fullName || `${buffer.firstName || ""} ${buffer.lastName || ""}`} onChange={(e) => handleEditInputLocal("fullName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">First Name</div>
              <input value={buffer.firstName || ""} onChange={(e) => handleEditInputLocal("firstName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Last Name</div>
              <input value={buffer.lastName || ""} onChange={(e) => handleEditInputLocal("lastName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Mobile Number</div>
              <input value={buffer.mobileNumber || ""} onChange={(e) => handleEditInputLocal("mobileNumber", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Date of Birth</div>
              <input type="date" value={buffer.dateOfBirth || ""} onChange={(e) => handleEditInputLocal("dateOfBirth", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Gender</div>
              <input value={buffer.gender || ""} onChange={(e) => handleEditInputLocal("gender", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Mother Tongue</div>
              <input value={buffer.motherTongue || ""} onChange={(e) => handleEditInputLocal("motherTongue", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Location</div>
              <input value={buffer.location || ""} onChange={(e) => handleEditInputLocal("location", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">About Yourself</div>
              <textarea rows="4" value={buffer.about || ""} onChange={(e) => handleEditInputLocal("about", e.target.value)} />
            </label>

            <div className="field">
              <div className="field-label">Hobbies</div>
              {(buffer.hobbies || []).map((h, i) => (
                <input key={i} className="hobby-input" value={h} onChange={(e) => updateHobbyInBuffer("hobbies", i, e.target.value)} placeholder={`Hobby ${i+1}`} />
              ))}
              <button type="button" className="add-hobby-btn" onClick={() => addHobbyToBuffer("hobbies")}><FaPlus /> Add Hobby</button>
            </div>
          </div>
        );

      case "partnerPrefs":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Age Range</div>
              <input value={buffer.ageRange || ""} onChange={(e) => handleEditInputLocal("ageRange", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Religion</div>
              <input value={buffer.religion || ""} onChange={(e) => handleEditInputLocal("religion", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Education</div>
              <input value={buffer.education || ""} onChange={(e) => handleEditInputLocal("education", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Work</div>
              <input value={buffer.work || ""} onChange={(e) => handleEditInputLocal("work", e.target.value)} />
            </label>

            <div className="field">
              <div className="field-label">Partner Hobbies</div>
              {(buffer.hobbies || []).map((h, i) => (
                <input key={i} className="hobby-input" value={h} onChange={(e) => updateHobbyInBuffer("hobbies", i, e.target.value)} placeholder={`Partner Hobby ${i+1}`} />
              ))}
              <button type="button" className="add-hobby-btn" onClick={() => addHobbyToBuffer("hobbies")}><FaPlus /> Add Hobby</button>
            </div>
          </div>
        );

      default:
        return <div>Editing not supported</div>;
    }
  }
}
