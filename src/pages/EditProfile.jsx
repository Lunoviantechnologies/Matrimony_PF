import React, { useState, useEffect, useRef } from "react";
import "../styleSheets/EditProfile.css";
import { FaCamera, FaChevronRight, FaEdit, FaPlus } from "react-icons/fa";
import backendIP from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import imageCompression from "browser-image-compression";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function EditProfile() {
  const { id, myProfile } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [openModal, setOpenModal] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});

  const fileInputRef = useRef(null);

  console.log("profileData, id : ", profileData, id);

  /* ------------------ GET PROFILE ------------------ */
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    dispatch(fetchMyProfile(id))
      .then((data) => {
        setProfileData(data.payload);
        const remotePhoto =
          data.payload?.updatePhoto ||
          data.payload?.photoUrl ||
          data.payload?.image ||
          data.payload?.avatar ||
          null;
        if (remotePhoto) {
          setPhoto(remotePhoto);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [id, dispatch]);

  /* ------------------ Modal open ------------------ */
  const openSectionModal = (sectionKey) => {
    const sectionMap = {
      personal: {
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        mobileNumber: profileData.mobileNumber || "",
        dateOfBirth: profileData.dateOfBirth || profileData.dob || "",
        gender: profileData.gender || "",
        motherTongue: profileData.motherTongue || "",
        maritalStatus: profileData.maritalStatus || "",
        religion: profileData.religion || "",
        subCaste: profileData.subCaste || "",
        location: profileData.location || "",
        about: profileData.about || "",
        state: profileData.state || "",
        sports: profileData.sports || "",
        aboutYourself: profileData.aboutYourself || "",
        isChildrenLivingWithYou: profileData.isChildrenLivingWithYou ? "true" : "false" || "",
      },
      basics: {
        height: profileData.height || "",
        weight: profileData.weight || "",
        bodyType: profileData.bodyType || "",
        complexion: profileData.complexion || "",
        habbits: profileData.habbits || "",
        vegiterian: profileData.vegiterian || "",
      },
      educationCareer: {
        highestEducation: profileData.highestEducation || "",
        collegeName: profileData.collegeName || "",
        experience: profileData.experience || "",
        sector: profileData.sector || "",
        occupation: profileData.occupation || "",
        companyName: profileData.companyName || "",
        annualIncome: profileData.annualIncome || "",
        workLocation: profileData.workLocation || "",
        country: profileData.country || "",
        city: profileData.city || ""
      },
      family: {
        fatherName: profileData.fatherName || "",
        motherName: profileData.motherName || "",
        numberOfBrothers: profileData.numberOfBrothers || "",
        numberOfSisters: profileData.numberOfSisters || "",
        familyStatus: profileData.familyStatus || "",
        familyType: profileData.familyType || ""
      },
      astro: {
        rashi: profileData.rashi || "",
        nakshatra: profileData.nakshatra || "",
        dosham: profileData.dosham || "",
        ascendant: profileData.ascendant || "",
        basicPlanetaryPosition: profileData.basicPlanetaryPosition || "",
        gothram: profileData.gothram || ""
      },
      hobbies: {
        hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : (profileData.hobbies?.split?.(",") || []),
      },
      spiritualPath: {
        spiritualPath: profileData.spiritualPath || "",
      },
      partnerPrefs: {
        ageRange: profileData.partnerAgeRange || "",
        religion: profileData.partnerReligion || "",
        education: profileData.partnerEducation || "",
        work: profileData.partnerWork || "",
        partnerHobbies: Array.isArray(profileData.partnerHobbies) ? profileData.partnerHobbies : (profileData.partnerHobbies?.split?.(",") || [])
      }
    };

    setEditBuffer(sectionMap[sectionKey] || {});
    setOpenModal(sectionKey);
  };

  /* ------------------ Save edited section ------------------ */
  const saveSection = async () => {
    try {
      const updatedProfile = { ...profileData, ...editBuffer, id }; // ✅ fixed

      if (Array.isArray(updatedProfile.hobbies)) {
        updatedProfile.hobbies = updatedProfile.hobbies.join(",");
      }

      if (Array.isArray(updatedProfile.partnerHobbies)) {
        updatedProfile.partnerHobbies = updatedProfile.partnerHobbies.join(",");
      }

      const res = await api.put(`/admin/update/${id}`, updatedProfile);

      setProfileData(updatedProfile);
      setOpenModal(null);
      setEditBuffer({});
      toast.success("Save updated successfully");

    } catch (err) {
      console.error("Error saving section:", err);
      toast.error("Failed to save changes");
    }
  };

  const cancelEdit = () => {
    setOpenModal(null);
    setEditBuffer({});
  };

  const handleEditInput = (key, value) =>
    setEditBuffer((p) => ({ ...p, [key]: value }));

  /* ------------------ Photo upload (preview only) ------------------ */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional: limit max selected file size client side
    const MAX_ALLOWED_MB = 10; // you can change to 5 or 2
    if (file.size / (1024 * 1024) > MAX_ALLOWED_MB) {
      if (!window.confirm(`Selected file is > ${MAX_ALLOWED_MB}MB. Continue and compress?`)) {
        return;
      }
    }

    try {
      // compress
      const options = {
        maxSizeMB: 1,            // final max size in MB (tune as needed)
        maxWidthOrHeight: 1024,  // scale down big images
        useWebWorker: true,
        maxIteration: 10
      };
      const compressedFile = await imageCompression(file, options);

      // show preview from compressed blob (faster and smaller)
      const previewUrl = URL.createObjectURL(compressedFile);
      setPhoto(previewUrl); // temporary preview

      // upload compressed file
      await uploadPhoto(compressedFile);
    } catch (err) {
      console.error("Compression/upload failed", err);
      toast.error("Failed to compress or upload image");
    }
  };

  const uploadPhoto = async (file) => {
    if (!file || !id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(0);

      const res = await api.put(`/admin/photo/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.lengthComputable) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        timeout: 120000
      });

      // IMPORTANT: Prefer a response that returns a URL to the stored image (not Base64)
      // e.g. { photoUrl: "/uploads/users/123.jpg" } or full absolute url
      const payload = res?.data || {};
      const newUrlRaw = payload.updatePhoto || payload.photoUrl || payload.image || payload.avatar ||
        (payload.fileName ? `/profile-photos/${payload.fileName}` : null);

      if (newUrlRaw) {
        const img = new Image();
        img.src = newUrlRaw;

        img.onload = () => {
          setPhoto(newUrlRaw);
          setProfileData(p => ({ ...p, updatePhoto: newUrlRaw }));
        };

        // img.onerror = () => {
        //   toast.error("Image failed to load");
        // };
      }
      else {
        console.warn("Upload success but no returned URL from server. Using preview until refresh.");
      }

      toast.success("Photo uploaded successfully");

    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Photo upload failed");
    } finally {
      setUploadProgress(0);
    }
  };
  // console.log("updatePhoto : ", profileData.updatePhoto);

  const getProfileImage = () => {
    if (photo) return photo;

    if (profileData?.updatePhoto) return profileData.updatePhoto;

    return profileData?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
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
              <img
                key={photo}
                src={getProfileImage()}
                alt="Profile"
                className="photo-preview"
              />

              <div
                className="camera-action"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <FaCamera /> <span>Change</span>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

              {/* ✅ Show upload progress while uploading */}
              {
                uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-progress">
                    Uploading... {uploadProgress}%
                  </div>
                )
              }
            </div>

            <div className="photo-caption">
              <div className="photo-name">{profileData?.fullName || `${profileData?.firstName || ""} ${profileData?.lastName || "Null"}`}</div>
              <div className="photo-sub">Active member • Verified</div>
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
              <Row label="Height" value={profileData?.height} />
              <Row label="Weight" value={profileData.weight} />
              <Row label="Body Type" value={profileData.bodyType} />
              <Row label="Complexion" value={profileData.complexion} />
              <Row label="Habbits" value={profileData.habbits} />
              <Row label="Food Preference" value={profileData.vegiterian} />
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
              <Row label="Dosham" value={profileData.dosham} />
              <Row label="Ascendant" value={profileData.ascendant} />
              <Row label="Basic planetary position" value={profileData.basicPlanetaryPosition} />
              <Row label="Gothram" value={profileData.gothram} />
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header red">
              Family Details
              <button className="edit-inline" onClick={() => openSectionModal("family")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body">
              <Row label="Father Name" value={profileData.fatherName} />
              <Row label="Mother Name" value={profileData.motherName} />
              <Row label="Number of Brothers" value={profileData.numberOfBrothers} />
              <Row label="Number of Sisters" value={profileData.numberOfSisters} />
              <Row label="Family Status" value={profileData.familyStatus} />
              <Row label="Family Type" value={profileData.familyType} />
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
                <Row label="Religion" value={profileData.religion} />
                <Row label="Sub Caste" value={profileData.subCaste} />
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company" value={profileData.companyName} />
                <Row label="Sector" value={profileData.sector} />
                <Row label="Sports " value={profileData.sports} />
                <Row label="Living with Childrens" value={profileData.isChildrenLivingWithYou ? "Yes" : "No"} />
                <Row label="State" value={profileData.state} />
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
                <Row label="Sector" value={profileData.sector} />
                <Row label="Working Experience" value={profileData.experience} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company Name" value={profileData.companyName} />
                <Row label="Annual Income" value={profileData.annualIncome} />
                <Row label="Work Location" value={profileData.workLocation} />
                <Row label="Present Country" value={profileData.country} />
                <Row label="Present City" value={profileData.city} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Hobbies
              <button className="edit-inline" onClick={() => openSectionModal("hobbies")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your Hobbies" value={(profileData.hobbies && profileData.hobbies.split?.(",")) || profileData.hobbies} />
            </div>
          </div>

          <div className="boxed">
            <div className="box-header red">
              Spiritual Path
              <button className="edit-inline" onClick={() => openSectionModal("spiritualPath")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your spiritual Path" value={profileData.spiritualPath} />
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
      hobbies: "Hobbies",
      spiritualPath: "Spiritual Path",
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
              <input value={buffer.complexion || ""} onChange={(e) => handleEditInputLocal("complexion", e.target.value)} placeholder="Skin tone..." />
            </label>
            <select name="habbits" id="habbits" className="field" value={buffer.habbits || ""} onChange={(e) => handleEditInputLocal("habbits", e.target.value)}>
              <option value="">Select Habbits</option>
              <option value="Smoking">Smoking</option>
              <option value="Drinking">Drinking</option>
              <option value="Both">Both</option>
              <option value="None">None</option>
            </select>
            <select name="vegiterian" id="vegiterian" className="field" value={buffer.vegiterian || ""} onChange={(e) => handleEditInputLocal("vegiterian", e.target.value)}>
              <option value="">Select Food Preference</option>
              <option value="Vegiterian">Vegiterian</option>
              <option value="Non-Vegiterian">Non-Vegiterian</option>
              <option value="Occasionally Non-Vegiterian">Occasionally Non-Vegiterian</option>
              <option value="Eggetarian">Eggetarian</option>
            </select>
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
            <label className="field"><div className="field-label">Number of Brothers</div>
              <input value={buffer.numberOfBrothers || ""} onChange={(e) => handleEditInputLocal("numberOfBrothers", e.target.value)} placeholder="leave if no brothers..." />
            </label><label className="field"><div className="field-label">Number of Sisters</div>
              <input value={buffer.numberOfSisters || ""} onChange={(e) => handleEditInputLocal("numberOfSisters", e.target.value)} placeholder="leave if no sisters..." />
            </label>
            <label className="field"><div className="field-label">Family Status</div>
              <input value={buffer.familyStatus || ""} onChange={(e) => handleEditInputLocal("familyStatus", e.target.value)} placeholder="below or middle or above middle class..." />
            </label>
            <label className="field"><div className="field-label">Family Type</div>
              <input value={buffer.familyType || ""} onChange={(e) => handleEditInputLocal("familyType", e.target.value)} placeholder="nuclear or joint..." />
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

            <label className="field"><div className="field-label">Working experience</div>
              <input value={buffer.experience || ""} onChange={(e) => handleEditInputLocal("experience", e.target.value)} />
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

            <label className="field"><div className="field-label">Present City</div>
              <input value={buffer.city || ""} onChange={(e) => handleEditInputLocal("city", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Present Country</div>
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
            <label className="field"><div className="field-label">Dosham</div>
              <input value={buffer.dosham || ""} onChange={(e) => handleEditInputLocal("dosham", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Ascendant</div>
              <input value={buffer.ascendant || ""} onChange={(e) => handleEditInputLocal("ascendant", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Basic planetary position</div>
              <textarea rows="3" value={buffer.basicPlanetaryPosition || ""} onChange={(e) => handleEditInputLocal("basicPlanetaryPosition", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Gothram</div>
              <input value={buffer.gothram || ""} onChange={(e) => handleEditInputLocal("gothram", e.target.value)} />
            </label>
          </div>
        );

      case "personal":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Full Name</div>
              <input disabled value={buffer.fullName || `${buffer.firstName || ""} ${buffer.lastName || ""}`} onChange={(e) => handleEditInputLocal("fullName", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">First Name</div>
              <input value={buffer.firstName || ""} onChange={(e) => handleEditInputLocal("firstName", e.target.value)} disabled />
            </label>

            <label className="field"><div className="field-label">Last Name</div>
              <input value={buffer.lastName || ""} onChange={(e) => handleEditInputLocal("lastName", e.target.value)} disabled />
            </label>

            <label className="field"><div className="field-label">Mobile Number</div>
              <input value={buffer.mobileNumber || ""} onChange={(e) => handleEditInputLocal("mobileNumber", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Date of Birth</div>
              <input type="date" value={buffer.dateOfBirth || ""} disabled onChange={(e) => handleEditInputLocal("dateOfBirth", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Gender</div>
              <input value={buffer.gender || ""} onChange={(e) => handleEditInputLocal("gender", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Mother Tongue</div>
              <input value={buffer.motherTongue || ""} onChange={(e) => handleEditInputLocal("motherTongue", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Religion</div>
              <input value={buffer.religion || ""} onChange={(e) => handleEditInputLocal("religion", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Sub Caste</div>
              <input value={buffer.subCaste || ""} onChange={(e) => handleEditInputLocal("subCaste", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Location</div>
              <input value={buffer.location || ""} onChange={(e) => handleEditInputLocal("location", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">State</div>
              <input value={buffer.state || ""} onChange={(e) => handleEditInputLocal("state", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Sports</div>
              <input value={buffer.sports || ""} onChange={(e) => handleEditInputLocal("sports", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">About Yourself</div>
              <textarea rows="4" value={buffer.aboutYourself || ""} onChange={(e) => handleEditInputLocal("aboutYourself", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Living with Childrens</div>
              <input value={buffer.isChildrenLivingWithYou || ""} onChange={(e) => handleEditInputLocal("isChildrenLivingWithYou", e.target.value)} placeholder="If divorced or widow have childern with you type true or false..." />
            </label>
          </div>
        );

      case "hobbies":
        return (
          <div className="field">
            <div className="field-label">Hobbies</div>
            {(buffer.hobbies || []).map((h, i) => (
              <input key={i} className="hobby-input" value={h} onChange={(e) => updateHobbyInBuffer("hobbies", i, e.target.value)} placeholder={`Hobby ${i + 1}`} />
            ))}
            <button type="button" className="add-hobby-btn" onClick={() => addHobbyToBuffer("hobbies")}><FaPlus /> Add Hobby</button>
          </div>
        );

      case "spiritualPath":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Spiritual Path</div>
              <input value={buffer.spiritualPath || ""} onChange={(e) => handleEditInputLocal("spiritualPath", e.target.value)} />
            </label>
          </div>
        );

      case "partnerPrefs":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Age Range</div>
              <input value={buffer.partnerAgeRange || ""} onChange={(e) => handleEditInputLocal("partnerAgeRange", e.target.value)} placeholder="type like 18 - 25 etc..." />
            </label>

            <label className="field"><div className="field-label">Religion</div>
              <input value={buffer.partnerReligion || ""} onChange={(e) => handleEditInputLocal("partnerReligion", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Education</div>
              <input value={buffer.partnerEducation || ""} onChange={(e) => handleEditInputLocal("partnerEducation", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Work</div>
              <input value={buffer.partnerWork || ""} onChange={(e) => handleEditInputLocal("partnerWork", e.target.value)} />
            </label>

            <div className="field">
              <div className="field-label">Partner Hobbies</div>
              {(buffer.partnerHobbies || []).map((h, i) => (
                <input key={i} className="hobby-input" value={h} onChange={(e) => updateHobbyInBuffer("partnerHobbies", i, e.target.value)} placeholder={`Partner Hobby ${i + 1}`} />
              ))}
              <button type="button" className="add-hobby-btn" onClick={() => addHobbyToBuffer("partnerHobbies")}><FaPlus /> Add Hobby</button>
            </div>
          </div>
        );

      default:
        return <div>Editing not supported</div>;
    }
  }
};