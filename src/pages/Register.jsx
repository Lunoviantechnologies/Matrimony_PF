import React, { useState } from "react";
import {
  FaUser,
  FaUserFriends,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaRing,
  FaShieldAlt,
  FaBookOpen,
} from "react-icons/fa";
import "../styleSheets/register.css";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileFor: "",
    friendGender: "",
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    religion: "Hindu",
    community: "Telugu",
    country: "India",
    city: "",
    livesWithFamily: "",
    subCommunity: "",
    highestQualification: "B.E / B.Tech",
    collegeName: "Jawaharlal Nehru Technological University",
    maritalStatus: "Never Married",
    height: "",
    diet: "",
    income: "₹ 7 to 10 Lakh yearly",
    workWith: "Private Company",
    workAs: "Software Developer / Programmer",
    companyName: "",
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
    console.log("Final Form Data Submitted:", formData);
    alert("Profile created successfully!");
  };

 const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <>
          <div className="step-icon"><FaUserFriends /></div>
          <h2>This Profile is for</h2>
          <div className="form-group">
            <div className="option-group" style={{ justifyContent: "center" }}>
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

                    // Ask for gender only if "Myself", "My Friend", or "My Relative"
                    if (
                      option === "My Friend" ||
                      option === "Myself" ||
                      option === "My Relative"
                    )
                      return;

                    setTimeout(nextStep, 300);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Show gender question for Friend, Myself, or Relative */}
          {(formData.profileFor === "My Friend" ||
            formData.profileFor === "Myself" ||
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
                      formData.friendGender === g ? "selected" : ""
                    }`}
                    onClick={() => {
                      handleOptionChange("friendGender", g);
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
      case 2:
        return (
          <>
            <div className="step-icon"><FaUser /></div>
            <h2>Your name</h2>
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                className="form-input"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of birth</label>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    name="dobDay"
                    className="form-input"
                    placeholder="DD"
                    value={formData.dobDay}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="dobMonth"
                    className="form-input"
                    placeholder="MM"
                    value={formData.dobMonth}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="dobYear"
                    className="form-input"
                    placeholder="YYYY"
                    value={formData.dobYear}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        );

      // keep remaining steps unchanged — just included navigation
      case 3:
        return (
          <>
            <div className="step-icon"><FaBookOpen /></div>
            <h2>Your religion</h2>
            <div className="form-group">
              <label className="form-label">Religion</label>
              <select
                name="religion"
                className="form-select"
                value={formData.religion}
                onChange={handleChange}
              >
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Community</label>
              <select
                name="community"
                className="form-select"
                value={formData.community}
                onChange={handleChange}
              >
                <option>Telugu</option>
                <option>Tamil</option>
                <option>Marathi</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Living in</label>
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleChange}
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </>
        );

      default:
        return <div>Continue other steps...</div>;
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

        {renderStep()}

        {/* ✅ Back / Next Buttons */}
        <div className="nav-buttons" style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          {step > 1 && (
            <button onClick={prevStep} className="back-btn">
              ⬅ Back
            </button>
          )}
          {step < totalSteps && (
            <button onClick={nextStep} className="next-btn">
              Next ➡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
