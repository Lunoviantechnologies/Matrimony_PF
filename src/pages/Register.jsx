import React, { useState } from "react";
import { FaUser, FaUserFriends, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaRing, FaShieldAlt, FaBookOpen, } from "react-icons/fa";
import "../styleSheets/register.css";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileFor: "",
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
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Form Data Submitted:", formData);
    alert("Profile created successfully!");
    // Here you would typically send the data to a server
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="step-icon">
              <FaUserFriends />
            </div>
            <h2>This Profile is for</h2>
            <div className="form-group">
              <div className="option-group" style={{ justifyContent: "center" }}>
                {["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative"].map((option) => (
                  <button
                    key={option}
                    className={`option-btn ${formData.profileFor === option ? "selected" : ""}`}
                    onClick={() => {
                      handleOptionChange("profileFor", option);
                      setTimeout(nextStep, 250);
                    }}
                  > 
                  
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="step-icon">
              <FaUser />
            </div>
            <h2>Your name</h2>
            <div className="form-group">
              <input type="text" name="firstName" className="form-input" placeholder="First name" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input type="text" name="lastName" className="form-input" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Date of birth</label>
              <div className="row">
                <div className="col"><input type="text" name="dobDay" className="form-input" placeholder="DD" value={formData.dobDay} onChange={handleChange} /></div>
                <div className="col"><input type="text" name="dobMonth" className="form-input" placeholder="MM" value={formData.dobMonth} onChange={handleChange} /></div>
                <div className="col"><input type="text" name="dobYear" className="form-input" placeholder="YYYY" value={formData.dobYear} onChange={handleChange} /></div>
              </div>
            </div>
            <button onClick={nextStep} className="action-btn" disabled={!formData.firstName || !formData.lastName || !formData.dobYear}>
              Continue
            </button>
          </>
        );
      case 3:
        return (
          <>
            <div className="step-icon"><FaBookOpen /></div>
            <h2>Your religion</h2>
            <div className="form-group">
              <label className="form-label">Religion</label>
              <select name="religion" className="form-select" value={formData.religion} onChange={handleChange}>
                <option>Hindu</option> <option>Muslim</option> <option>Christian</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Community</label>
              <select name="community" className="form-select" value={formData.community} onChange={handleChange}>
                <option>Telugu</option> <option>Tamil</option> <option>Marathi</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Living in</label>
              <select name="country" className="form-select" value={formData.country} onChange={handleChange}>
                <option>India</option> <option>USA</option> <option>UK</option>
              </select>
            </div>
            <button onClick={nextStep} className="action-btn">Continue</button>
          </>
        );
      case 4:
        return (
          <>
            <div className="step-icon" style={{ color: "#e85c5c", backgroundColor: "#ffebeb" }}><FaMapMarkerAlt /></div>
            <p className="step-header">Now let's build your Profile</p>
            <h2>Location Details</h2>
            <div className="form-group">
              <label className="form-label">City you live in?</label>
              <input type="text" name="city" className="form-input" placeholder="Enter the city you live in" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">You live with your family?</label>
              <div className="option-group">
                <button className={`option-btn ${formData.livesWithFamily === "Yes" ? "selected" : ""}`} onClick={() => handleOptionChange("livesWithFamily", "Yes")}>Yes</button>
                <button className={`option-btn ${formData.livesWithFamily === "No" ? "selected" : ""}`} onClick={() => handleOptionChange("livesWithFamily", "No")}>No</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Sub-community</label>
              <select name="subCommunity" className="form-select" value={formData.subCommunity} onChange={handleChange}>
                <option value="">Your Sub-community</option> <option>Community A</option>
              </select>
            </div>
            <button onClick={nextStep} className="action-btn">Continue</button>
          </>
        );
      case 5:
        return (
          <>
            <div className="step-icon" style={{ color: "#4a90e2", backgroundColor: "#eef6ff" }}><FaGraduationCap /></div>
            <p className="step-header">Great! Few more details</p>
            <h2>Highest qualification</h2>
            <div className="form-group">
              <label className="form-label">Your highest qualification *</label>
              <input type="text" name="highestQualification" className="form-input" value={formData.highestQualification} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">College name</label>
              <input type="text" name="collegeName" className="form-input" placeholder="College you attended" value={formData.collegeName} onChange={handleChange} />
            </div>
            <button onClick={nextStep} className="action-btn">Continue</button>
          </>
        );
      case 6:
        return (
          <>
            <div className="step-icon" style={{ color: "#7e6cca", backgroundColor: "#f2f0ff" }}><FaRing /></div>
            <h2>Personal Details</h2>
            <div className="form-group">
              <label className="form-label">Your Marital status *</label>
              <select name="maritalStatus" className="form-select" value={formData.maritalStatus} onChange={handleChange}>
                <option>Never Married</option> <option>Divorced</option> <option>Widowed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Your Height *</label>
              <select name="height" className="form-select" value={formData.height} onChange={handleChange}>
                <option value="">Select Height</option> <option>5'5" (165 cm)</option> <option>6'0" (183 cm)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Diet</label>
              <div className="option-group">
                {["Veg", "Non-Veg", "Occasionally Non-Veg", "Eggetarian", "Jain", "Vegan"].map((d) => (
                  <button key={d} className={`option-btn ${formData.diet === d ? "selected" : ""}`} onClick={() => handleOptionChange("diet", d)}>{d}</button>
                ))}
              </div>
            </div>
            <button onClick={nextStep} className="action-btn">Continue</button>
          </>
        );
      case 7:
        return (
          <>
            <div className="step-icon" style={{ color: "#28a745", backgroundColor: "#eaf6ec" }}><FaBriefcase /></div>
            <p className="step-header">You are almost done!</p>
            <h2>Work Details</h2>
            <div className="form-group">
              <label className="form-label">Select your income*</label>
              <select name="income" className="form-select" value={formData.income} onChange={handleChange}>
                <option>₹ 7 to 10 Lakh yearly</option> <option>₹ 10 to 15 Lakh</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">You work with</label>
              <select name="workWith" className="form-select" value={formData.workWith} onChange={handleChange}>
                <option>Private Company</option> <option>Government / Public Sector</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">You work as</label>
              <select name="workAs" className="form-select" value={formData.workAs} onChange={handleChange}>
                <option>Software Developer / Programmer</option> <option>Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Your current company name</label>
              <input type="text" name="companyName" className="form-input" placeholder="Specify current organization" value={formData.companyName} onChange={handleChange} />
            </div>
            <button onClick={nextStep} className="action-btn">Create Profile</button>
          </>
        );
      case 8:
        return (
          <>
            <div className="step-icon" style={{ backgroundColor: "#fffbe6", color: "#f0ad4e" }}><FaShieldAlt /></div>
            <p className="step-header" style={{ maxWidth: "350px", margin: "0 auto 25px" }}>
              An active email ID & phone no. are required to secure your Profile
            </p>
            <div className="form-group">
              <label className="form-label">Email ID</label>
              <input type="email" name="email" className="form-input" placeholder="Email ID" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile no.</label>
              <div className="row">
                <div style={{ flex: '0 0 90px' }}>
                  <select className="form-select"><option>+91</option></select>
                </div>
                <div className="col">
                  <input type="tel" name="mobile" className="form-input" placeholder="Mobile no." value={formData.mobile} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="action-btn" disabled={!formData.email || !formData.mobile}>Submit</button>
            <p className="footer-text">By creating account, you agree to our <a href="#">Privacy Policy</a> and <a href="#">T&C</a>.</p>
          </>
        );
      default:
        return <div>All steps completed!</div>;
    }
  };

  return (
    <>
      <div className="matrimony-container">
        <div className="form-wrapper">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default Register;