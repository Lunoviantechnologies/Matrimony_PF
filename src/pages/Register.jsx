import React, { useState } from "react";
import {
  FaUserFriends,
  FaUser,
  FaBookOpen,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaRing,
} from "react-icons/fa";
import "../styleSheets/register.css";

const Register = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    profileFor: "",
    gender: "",
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    religion: "Hindu",
    community: "Telugu",
    subCommunity: "",
    country: "India",
    city: "",
    maritalStatus: "Never Married",
    height: "",
    highestQualification: "B.E / B.Tech",
    collegeName: "",
    workWith: "Private Company",
    workAs: "",
    companyName: "",
    income: "₹ 7 to 10 Lakh yearly",
    email: "",
    mobile: "",
  });

  const totalSteps = 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  // ------------------------ STEP RENDERING ------------------------
  const renderStep = () => {
    switch (step) {
      // STEP 1: Profile For
      case 1:
        return (
          <>
            <div className="step-icon"><FaUserFriends /></div>
            <h2>This profile is for</h2>
            <div className="option-group">
              {[
                "Myself",
                "My Son",
                "My Daughter",
                "My Brother",
                "My Sister",
                "My Friend",
                "My Relative",
              ].map((option) => (
                <button
                  key={option}
                  className={`option-btn ${
                    formData.profileFor === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    handleOptionChange("profileFor", option);
                    if (
                      option === "Myself" ||
                      option === "My Friend" ||
                      option === "My Relative"
                    )
                      return; // show gender next
                    setTimeout(nextStep, 300);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {(formData.profileFor === "Myself" ||
              formData.profileFor === "My Friend" ||
              formData.profileFor === "My Relative") && (
              <div className="form-group fade-in">
                <h3>
                  {formData.profileFor === "My Friend"
                    ? "Is your friend Male or Female?"
                    : formData.profileFor === "My Relative"
                    ? "Is your relative Male or Female?"
                    : "Are you Male or Female?"}
                </h3>
                <div className="option-group">
                  {["Male", "Female"].map((g) => (
                    <button
                      key={g}
                      className={`option-btn ${
                        formData.gender === g ? "selected" : ""
                      }`}
                      onClick={() => {
                        handleOptionChange("gender", g);
                        setTimeout(nextStep, 300);
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      // STEP 2: Basic Details
      case 2:
        return (
          <>
            <div className="step-icon"><FaUser /></div>
            <h2>Tell us about you</h2>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
            />

            <label className="form-label">Date of Birth</label>
            <div className="dob-fields">
              <input
                type="text"
                name="dobDay"
                placeholder="DD"
                maxLength="2"
                className="form-input small"
                value={formData.dobDay}
                onChange={handleChange}
              />
              <input
                type="text"
                name="dobMonth"
                placeholder="MM"
                maxLength="2"
                className="form-input small"
                value={formData.dobMonth}
                onChange={handleChange}
              />
              <input
                type="text"
                name="dobYear"
                placeholder="YYYY"
                maxLength="4"
                className="form-input medium"
                value={formData.dobYear}
                onChange={handleChange}
              />
            </div>
          </>
        );

      // STEP 3: Religion / Community
      case 3:
        return (
          <>
            <div className="step-icon"><FaBookOpen /></div>
            <h2>Religion & Community</h2>
            <div className="form-group">
              <label>Religion</label>
              <select
                name="religion"
                className="form-select"
                value={formData.religion}
                onChange={handleChange}
              >
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Community</label>
              <select
                name="community"
                className="form-select"
                value={formData.community}
                onChange={handleChange}
              >
                <option>Telugu</option>
                <option>Tamil</option>
                <option>Malayalam</option>
                <option>Kannada</option>
                <option>Marathi</option>
                <option>Hindi</option>
              </select>
            </div>

            <input
              type="text"
              name="subCommunity"
              placeholder="Sub-community (optional)"
              className="form-input"
              value={formData.subCommunity}
              onChange={handleChange}
            />
          </>
        );

      // STEP 4: Location
      case 4:
        return (
          <>
            <div className="step-icon"><FaMapMarkerAlt /></div>
            <h2>Where do you live?</h2>
            <div className="form-group">
              <label>Country</label>
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleChange}
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
            />
          </>
        );

      // STEP 5: Education
      case 5:
        return (
          <>
            <div className="step-icon"><FaGraduationCap /></div>
            <h2>Education</h2>
            <div className="form-group">
              <label>Highest Qualification</label>
              <select
                name="highestQualification"
                className="form-select"
                value={formData.highestQualification}
                onChange={handleChange}
              >
                <option>B.E / B.Tech</option>
                <option>M.E / M.Tech</option>
                <option>MBA</option>
                <option>PhD</option>
                <option>Other</option>
              </select>
            </div>
            <input
              type="text"
              name="collegeName"
              placeholder="College / University Name"
              className="form-input"
              value={formData.collegeName}
              onChange={handleChange}
            />
          </>
        );

      // STEP 6: Career
      case 6:
        return (
          <>
            <div className="step-icon"><FaBriefcase /></div>
            <h2>Career Details</h2>
            <div className="form-group">
              <label>Working With</label>
              <select
                name="workWith"
                className="form-select"
                value={formData.workWith}
                onChange={handleChange}
              >
                <option>Private Company</option>
                <option>Government</option>
                <option>Self Employed</option>
                <option>Not Working</option>
              </select>
            </div>
            <input
              type="text"
              name="workAs"
              placeholder="Your Profession"
              className="form-input"
              value={formData.workAs}
              onChange={handleChange}
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="form-input"
              value={formData.companyName}
              onChange={handleChange}
            />
            <div className="form-group">
              <label>Annual Income</label>
              <select
                name="income"
                className="form-select"
                value={formData.income}
                onChange={handleChange}
              >
                <option>₹ 3 to 5 Lakh yearly</option>
                <option>₹ 5 to 7 Lakh yearly</option>
                <option>₹ 7 to 10 Lakh yearly</option>
                <option>₹ 10 to 15 Lakh yearly</option>
                <option>Above ₹ 15 Lakh yearly</option>
              </select>
            </div>
          </>
        );

      // STEP 7: Contact Info
      case 7:
        return (
          <>
            <div className="step-icon"><FaUser /></div>
            <h2>Contact Information</h2>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              className="form-input"
              value={formData.mobile}
              onChange={handleChange}
            />
          </>
        );

      // STEP 8: Final Confirmation
      case 8:
        return (
          <>
            <div className="step-icon"><FaRing /></div>
            <h2>Confirm & Submit</h2>
            <p>Please review your details and submit your profile.</p>
            <button className="submit-btn" onClick={handleSubmit}>
              Create My Profile
            </button>
          </>
        );

      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="matrimony-container">
      <div className="form-wrapper">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          {renderStep()}
        </form>

        <div
          className="nav-buttons"
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {step > 1 && (
            <button type="button" onClick={prevStep} className="back-btn">
              ⬅ Back
            </button>
          )}
          {step < totalSteps && (
            <button type="button" onClick={nextStep} className="next-btn" >
              Next ➡
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Register;
