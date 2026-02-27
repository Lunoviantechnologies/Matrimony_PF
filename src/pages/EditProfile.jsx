import React, { useState, useEffect, useRef } from "react";
import "../styleSheets/EditProfile.css";
import { FaCamera, FaChevronRight, FaEdit, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import imageCompression from "browser-image-compression";
import api from "../api/axiosInstance";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { gothramList } from "../data/dataList";
import serverURL from "../api/server";

export default function EditProfile() {
  const { id, myProfile } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [openModal, setOpenModal] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});
  const [cropOpen, setCropOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const PHOTO_SLOTS = ["updatePhoto", "updatePhoto1", "updatePhoto2", "updatePhoto3", "updatePhoto4",];
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const fileInputRef = useRef(null);

  console.log("profileData, id : ", profileData, id);

  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break;
      heightOptions.push(`${ft}'${inch}"`);
    }
  };

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

  useEffect(() => {
    if (myProfile) {
      setProfileData(myProfile);
    }
  }, [myProfile]);

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
      address: {
        country: profileData.country || "",
        state: profileData.state || "",
        district: profileData.district || "",
        city: profileData.city || "",
        residenceStatus: profileData.residenceStatus || ""
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
      dispatch(fetchMyProfile(id));
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
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setCropOpen(true);
  };

  const uploadPhoto = async (file) => {
    if (!file || !id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(0);

      const res = await api.put(`/profile-photos/updatePhoto/${id}`, formData, {
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

  const getImageUrl = (photo) => {
    if (!photo) return null;

    if (photo && typeof photo === "string" && photo.trim() !== "") {
      photo = photo.trim();

      if (photo.includes("/profile-photos/")) {
        return `${serverURL}${photo}`;
      }

      return `${serverURL}/profile-photos/${photo}`;
    }

    // Fallback to frontend placeholder
    return myProfile?.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
  };

  const Row = ({ label, value, onAction, actionText }) => (
    <div className="profile-row">
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
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(file);
      }, "image/jpeg");
    });
  }

  if (loading) return <div>Loading profile...</div>;

  const currentSlot = PHOTO_SLOTS[activePhotoIndex];
  console.log("Current Slot:", currentSlot);
  const currentPhoto = profileData?.[currentSlot];
  console.log("Current Photo:", currentPhoto);

  const nextPhoto = () => setActivePhotoIndex(i => (i + 1) % PHOTO_SLOTS.length);
  const prevPhoto = () => setActivePhotoIndex(i => i === 0 ? PHOTO_SLOTS.length - 1 : i - 1);

  const handlePhotoUpload = async (slot, file) => {
    try {
      // ✅ auto compress to ~300 KB
      let compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      });

      // ✅ hard cap enforcement (optional but recommended)
      while (compressed.size > 300 * 1024) {
        compressed = await imageCompression(compressed, {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 900,
          useWebWorker: true
        });
      }

      const formData = new FormData();
      formData.append("file", compressed);

      await api.put(`/profile-photos/${slot}/${id}`, formData);

      dispatch(fetchMyProfile(id));
      toast.success("Photo uploaded successfully");

    } catch (err) {
      console.error(err);
      toast.error("Photo upload failed");
    }
  };

  const handleDeletePhoto = async (slot) => {
    await api.delete(`/profile-photos/${slot}/${id}`);
    dispatch(fetchMyProfile(id));
    toast.success("Photo deleted success");
  };

  const spiritualSuggestions = [
    "ISKCON",
    "Vaishnav traditions",
    "Gaudiya Vaishnav",
    "Isha Foundation followers"
  ];

  return (
    <div className="edit-profile-page">
      <h3>Edit Profile</h3>

      <main className="page-content">
        <aside className="left-column">
          <div className="photo-card">
            <div className="photo-box" >

              {/* carousel nav */}
              <button className="carousel-btn left" onClick={prevPhoto}>‹</button>
              <button className="carousel-btn right" onClick={nextPhoto}>›</button>

              {currentPhoto ? (
                <img
                  src={getImageUrl(currentPhoto)}
                  alt="profile"
                  className="photo-preview"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className="photo-placeholder">+</div>
              )}

              <div className="photo-counter">
                {activePhotoIndex + 1} / {PHOTO_SLOTS.length}
              </div>

              {activePhotoIndex !== 0 && currentPhoto && (
                <button className="delete-icon" onClick={() => handleDeletePhoto(currentSlot)} >
                  ✕
                </button>
              )}

              {/* action overlay */}
              <div className="camera-action" onClick={() => fileInputRef.current.click()} >
                <FaCamera />

                <span>
                  {activePhotoIndex === 0 ? "Update" : currentPhoto ? "Replace" : "Add"}
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (activePhotoIndex === 0) {
                    handleFileChange(e); // existing crop + upload flow
                  } else {
                    handlePhotoUpload(currentSlot, file);
                  }
                }}
              />

            </div>

            <div className="photo-caption">
              <div className="photo-name">{profileData?.fullName || `${profileData?.firstName || ""} ${profileData?.lastName || "Null"}`}</div>
              <div className="photo-sub">Active member • Verified</div>
            </div>
          </div>

          <div className="boxed small-box">
            <div className="box-header">
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
            <div className="box-header">
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
            <div className="box-header">
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
            <div className="box-header">
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
              </div>

              <div className="right-col underlined-block">
                <Row label="Religion" value={profileData.religion} />
                <Row label="Sub Community" value={profileData.subCaste} />
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company" value={profileData.companyName} />
                <Row label="Sector" value={profileData.sector} />
                <Row label="Sports " value={profileData.sports} />
                <Row label="Living with Childrens" value={profileData.isChildrenLivingWithYou ? "Yes" : "No"} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header">
              Spiritual Path
              <button className="edit-inline" onClick={() => openSectionModal("spiritualPath")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your spiritual Path" value={profileData.spiritualPath} />
            </div>
          </div>

          <div className="boxed">
            <div className="box-header">
              Education & Career
              <button className="edit-inline" onClick={() => openSectionModal("educationCareer")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Highest Education" value={profileData.highestEducation} />
                <Row label="College Name" value={profileData.collegeName} />
                <Row label="Sector" value={profileData.sector} />
                <Row label="Working Experience" value={profileData.experience} />
                <Row label="Present Country" value={profileData.country} />
              </div>
              <div className="right-col underlined-block">
                <Row label="Occupation" value={profileData.occupation} />
                <Row label="Company Name" value={profileData.companyName} />
                <Row label="Annual Income" value={profileData.annualIncome} />
                <Row label="Work Location" value={profileData.workLocation} />
                <Row label="Present City" value={profileData.city} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header">
              Address
              <button className="edit-inline" onClick={() => openSectionModal("address")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body two-col">
              <div className="left-col underlined-block">
                <Row label="Country" value={profileData.country} />
                <Row label="State" value={profileData.state} />
                <Row label="Residence Status" value={profileData.residenceStatus} />
              </div>
              <div className="right-col underlined-block">
                <Row label="District" value={profileData.district} />
                <Row label="City" value={profileData.city} />
              </div>
            </div>
          </div>

          <div className="boxed">
            <div className="box-header">
              Hobbies
              <button className="edit-inline" onClick={() => openSectionModal("hobbies")}><FaEdit /> Edit</button>
            </div>
            <div className="box-body underlined-block">
              <Row label="Your Hobbies" value={(profileData.hobbies && profileData.hobbies.split?.(",")) || profileData.hobbies} />
            </div>
          </div>

          <div className="boxed">
            <div className="box-header">
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
      {/* ------------------ Crop Photo Modal ------------------ */}
      {
        cropOpen && selectedImage && (
          <div className="modal-overlay">
            <div className="modal-card" style={{ width: 420 }}>

              <div className="modal-header">
                <h3>Adjust your photo</h3>
                <button
                  className="modal-close"
                  onClick={() => setCropOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 300,
                  background: "#000"
                }}
              >
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={(z) => setZoom(Number(z))}
                  onCropComplete={(c, pixels) =>
                    setCroppedAreaPixels(pixels)
                  }
                />
              </div>

              <div style={{ padding: 12 }}>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="modal-footer-crop">
                <button className="btn-outline" onClick={() => setCropOpen(false)}>
                  Cancel
                </button>

                <button
                  className="btn-primary"
                  onClick={async () => {

                    if (!croppedAreaPixels) {
                      toast.error("Please adjust the photo");
                      return;
                    }

                    const croppedFile = await getCroppedImg(
                      selectedImage,
                      croppedAreaPixels
                    );

                    let compressed = await imageCompression(croppedFile, {
                      maxSizeMB: 0.3,
                      maxWidthOrHeight: 1024,
                      useWebWorker: true
                    });

                    while (compressed.size > 300 * 1024) {
                      compressed = await imageCompression(compressed, {
                        maxSizeMB: 0.25,
                        maxWidthOrHeight: 900,
                        useWebWorker: true
                      });
                    };

                    const previewUrl = URL.createObjectURL(compressed);
                    setPhoto(previewUrl);

                    await uploadPhoto(compressed);
                    dispatch(fetchMyProfile(id));
                    setCropOpen(false);
                  }}
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )
      }



      {/* ------------------ Modal ------------------ */}
      {
        openModal && (
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
                <button className="btn-outline btn-cancel" onClick={cancelEdit}>Cancel</button>
                <button className="btn-outline-primary btn-save" onClick={saveSection}>Save</button>
              </div>
            </div>
          </div>

        )
      }
    </div >
  );


  /* ------------------ helpers ------------------ */

  function modalTitleForKey(key) {
    const titles = {
      personal: "Personal Details",
      basics: "Basics & Lifestyle",
      educationCareer: "Education & Career",
      family: "Family Details",
      astro: "Astro / Religious",
      address: "Address",
      hobbies: "Hobbies",
      spiritualPath: "Spiritual Path",
      partnerPrefs: "Partner Preferences",
    };
    return titles[key] || "Details";
  };

  function addHobbyToBuffer(field = "hobbies") {
    setEditBuffer((p) => ({ ...p, [field]: [...(p[field] || []), ""] }));
  };

  function updateHobbyInBuffer(field, idx, val) {
    const arr = [...(editBuffer[field] || [])];
    arr[idx] = val;
    setEditBuffer((p) => ({ ...p, [field]: arr }));
  };

  function renderModalForm(key, buffer, handleEditInputLocal) {
    // Use buffer to render, handleEditInputLocal to update single key
    switch (key) {
      case "basics":
        return (
          <div className="modal-form">
            <label className="field">
              <div className="field-label">Height</div>
              <select value={buffer.height || ""} onChange={(e) => handleEditInputLocal("height", e.target.value)} >
                <option value="">Select Height</option>
                {heightOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
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
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Occasionally Non-Vegetarian">Occasionally Non-Vegetarian</option>
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

      case "address":
        return (
          <div className="modal-form">
            <label className="field"><div className="field-label">Country</div>
              <input value={buffer.country || ""} onChange={(e) => handleEditInputLocal("country", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">State</div>
              <input value={buffer.state || ""} onChange={(e) => handleEditInputLocal("state", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">District</div>
              <input value={buffer.district || ""} onChange={(e) => handleEditInputLocal("district", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">City</div>
              <input value={buffer.city || ""} onChange={(e) => handleEditInputLocal("city", e.target.value)} />
            </label>
            <label className="field"><div className="field-label">Residence Status</div>
              <input rows="3" value={buffer.residenceStatus || ""} onChange={(e) => handleEditInputLocal("residenceStatus", e.target.value)} />
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
            <label className="field">
              <div className="field-label">Gothram</div>
              <select
                value={buffer.gothram || ""}
                onChange={(e) => handleEditInputLocal("gothram", e.target.value)}
              >
                <option value="">Select Gothram</option>

                {gothramList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
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
              <input value={buffer.gender || ""} onChange={(e) => handleEditInputLocal("gender", e.target.value)} disabled />
            </label>

            <label className="field"><div className="field-label">Mother Tongue</div>
              <input value={buffer.motherTongue || ""} onChange={(e) => handleEditInputLocal("motherTongue", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Religion</div>
              <input value={buffer.religion || ""} onChange={(e) => handleEditInputLocal("religion", e.target.value)} />
            </label>

            <label className="field"><div className="field-label">Sub Community</div>
              <input value={buffer.subCaste || ""} onChange={(e) => handleEditInputLocal("subCaste", e.target.value)} />
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
            <label className="field">
              <div className="field-label">Spiritual Path</div>

              <input
                value={buffer.spiritualPath || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const onlyText = val.replace(/[0-9]/g, "");
                  handleEditInputLocal("spiritualPath", onlyText);
                }}
                placeholder="Type your spiritual path"
              />
            </label>

            {/* Suggestions */}
            <div className="spiritual-suggestions">
              {spiritualSuggestions.map((item, index) => (
                <span
                  key={index}
                  className="spiritual-chip"
                  onClick={() => handleEditInputLocal("spiritualPath", item)}
                >
                  {item}
                </span>
              ))}
            </div>
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