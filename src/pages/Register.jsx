  import React, { useState } from "react";
  import { Formik, Form, Field, ErrorMessage } from "formik";
  import * as Yup from "yup";
  import { FaUser, FaUserFriends, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaRing, FaBookOpen, FaUserCheck } from "react-icons/fa";
  import "../styleSheets/register.css";
  import axios from "axios";
  import backendIP from "../api/api";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";

  /* -------------------------------------------------------------
    INITIAL VALUES
  ------------------------------------------------------------- */
  const initialValues = {
    profileFor: "",
    gender: "",
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    dateOfBirth: "",
    age: "",
    religion: "",
    subCaste: "",
    subCasteOther: "",
    gothram: "",
    gothramOther: "",
    motherTongue: "",
    country: "",
    city: "",
    maritalStatus: "",
    noOfChildren: "",
    height: "",
    highestEducation: "",
    collegeName: "",
    sector: "",
    occupation: "",
    companyName: "",
    annualIncome: "",
    workLocation: "",
    emailId: "",
    mobileNumber: "",
    createPassword: "",
    documentFile: null,
    role: "USER",
  };

  /* -------------------------------------------------------------
    STEP-WISE VALIDATION
  ------------------------------------------------------------- */
  const validationSchemas = [
    // STEP 1
    Yup.object({
      profileFor: Yup.string().required("Select one"),

      gender: Yup.string()
        .nullable()
        .when("profileFor", (profileFor, schema) => {
          if (
            profileFor === "Myself" ||
            profileFor === "My Friend" ||
            profileFor === "My Relative"
          ) {
            return schema.required("Select gender");
          }
          return schema.notRequired();
        }),
    }),

    // STEP 2
    Yup.object({
      firstName: Yup.string().required("First name is Required"),
      lastName: Yup.string().required("Last name is Required"),

      // 👇 AGE: required ONLY if DOB is NOT fully provided
      age: Yup.number()
        .typeError("Age must be a number")
        .when(["dobDay", "dobMonth", "dobYear"], {
          is: (day, month, year) => !day || !month || !year,
          then: (schema) =>
            schema
              .required("Age is required")
              .min(18, "Minimum age is 18")
              .max(60, "Maximum age is 60"),
          otherwise: (schema) => schema.notRequired(),
        }),

      dobDay: Yup.number()
        .typeError("Date must be a number")
        .min(1, "Minimum date is 1")
        .max(31, "Maximum date is 31")
        .nullable(),

      dobMonth: Yup.number()
        .typeError("Month must be a number")
        .min(1, "Minimum month is 1")
        .max(12, "Maximum month is 12")
        .nullable(),

      dobYear: Yup.number()
        .typeError("Year must be a number")
        .integer("Year must be an integer")
        .min(1900, "Enter valid year")
        .max(new Date().getFullYear(), "Year cannot be in future")
        .nullable(),
    }),


    // STEP 3
    Yup.object({
      religion: Yup.string().required("Religion is required"),
      subCaste: Yup.string().required("Sub-Community is required"),
      gothram: Yup.string().required("Gothram is required"),
    }),


    // STEP 4
    Yup.object({
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
    }),

    // STEP 5
    Yup.object({
      maritalStatus: Yup.string().required("marital Status required"),
      height: Yup.string().required("Height is required"),
    }),

    // STEP 6
    Yup.object({
      highestEducation: Yup.string().required("Required"),
      collegeName: Yup.string().required("Required"),
    }),

    // STEP 7
    Yup.object({
      sector: Yup.string().required("Required"),
      occupation: Yup.string().required("Required"),
      companyName: Yup.string().required("Required"),
    }),

    // STEP 8
    Yup.object({
      emailId: Yup.string().email("Invalid emailId").required("Email is Required"),
      mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Enter 10-digit mobile")
        .required("Required"),
      createPassword: Yup.string().required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
      documentFile: Yup.mixed()
        .required("Document is required")
        .test("fileType", "Only JPG, PNG or PDF allowed", (value) => {
          return value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type);
        })
        .test("fileSize", "File too large (max 2MB)", (value) => {
          return value && value.size <= 2 * 1024 * 1024;
        }),
    }),

    // STEP 9 (NO validation)
    Yup.object({}),
  ];
  const calculateAge = (day, month, year) => {
    if (!day || !month || !year) return "";

    const dob = new Date(year, month - 1, day);
    const today = new Date();

    if (isNaN(dob.getTime())) return "";

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 0 ? age : "";
  };
  /* ---------------- SUB COMMUNITY LIST ---------------- */
  const subCommunityList = [
    "Ayodhi",
    "Bhoomanchi Reddy",
    "Chowdary",
    "Desuru",
    "Gandla",
    "Ganjam",
    "Gone Kapu",
    "Gudati",
    "Kapu",
    "Motati",
    "Palle",
    "Palnati",
    "Panta",
    "Pedakanti",
    "Poknati",
    "Reddiyar",
    "Sajjana",
    "Vanni",
    "Velanati",
    "Balija",
    "Balija Naidu",
    "Balija Setty",
    "Telaga",
    "Telaga Kapu",
    "Naidu Kapu",
    "Munnuru Kapu",
    "Ontari",
    "Ontari Kapu",
    "Kamma Kapu",
    "Turpu Kapu",
    "Rayalaseema Kapu",
    "Coastal Kapu",
    "Uttara Kapu",
    "Dakshina Kapu",
    "Golla Kapu",
    "Kuruba Kapu",
    "Boyar Kapu",
    "Gavara",
    "Gavara Naidu",
    "Kalinga Kapu",
    "Kapu Reddy",
    "Kapu Velama",
    "Kapu Naicker",
    "General Kapu",
    "Other Kapu Sub-Caste",
    "Others"
  ];

  /* ---------------- GOTHRA LIST ---------------- */
  const gothramList = [
  "Bharadwaj",
    "Kashyapa / Kaashyapa",
    "Gautam / Gouthama",
    "Vashishtha",
    "Vishwamitra",
    "Atri",
    "Angiras",
    "Bhrigu",
    "Parashar / Parashara",
    "Shandilya / Sandilyasa",
    "Kaushika / Kaushik",
    "Kaundinya / Koundanya",
    "Jamadagni",
    "Markendeya",
    "Moudgalya",
    "Manava",
    "Kapila",
    "Agastya",
    "Pulastya",
    "Pulaha",
    "Krishna Atreya",
    "Sage Durvasa",
    "Sage Lomasa",
    "Sage Narada",
    "Sage Valmiki",
    "Sage Vyasa",
    "Sage Dattatreya",
    "Sage Sanaka",
    "Sage Sanandana",
    "Sage Sanatana",
    "Sage Sanatkumara",
    "Athreya",
    "Kasyapa",
    "Bhardwaj",
    "Sandilya",
    "Goutham",
    "Vasishta",
    "Vishvamitra",
    "Koundinya",
    "Parasar",
    "Kausika",
    "Family Gothra",
    "Village Gothra",
    "Temple Gothra",
    "Traditional Gothra",
    "Unknown Gothra",
    "Not Sure",
    "Don’t know"
  ];



  const Register = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 9;
    const navigate = useNavigate();

    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Height calculations

    const heights = [];

    for (let cm = 122; cm <= 213; cm++) { // 4'0" to 7'0"
      const feet = Math.floor(cm / 30.48);
      const inches = Math.round((cm / 2.54) % 12);

      heights.push({
        label: `${feet} ft ${inches} in (${cm} cm)`,
        value: cm
      });
    };

    /* -------------------------------------------------------------
      NEXT STEP HANDLER
    ------------------------------------------------------------- */
    const nextStep = async (validateForm, setTouched) => {
      const allErrors = await validateForm();

      // Get only fields of current step
      const stepFields = Object.keys(validationSchemas[step - 1].fields);

      const stepErrors = {};
      stepFields.forEach((field) => {
        if (allErrors[field]) stepErrors[field] = allErrors[field];
      });

      // If current step has errors → touch only those
      if (Object.keys(stepErrors).length > 0) {
        const touchedFields = {};
        stepFields.forEach((field) => {
          touchedFields[field] = true;
        });

        setTouched((prev) => ({ ...prev, ...touchedFields }));
        return;
      }

      // Move to next step
      if (step < totalSteps) setStep(step + 1);
    };

    /* -------------------------------------------------------------
      PREVIOUS STEP
    ------------------------------------------------------------- */
    const prevStep = () => {
      if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (values) => {
      const profileData = {
        profileFor: values.profileFor,
        gender: values.gender,
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        dateOfBirth: values.dobDay && values.dobMonth && values.dobYear ? `${values.dobYear}-${values.dobMonth}-${values.dobDay}`: null,
        religion: values.religion,
        subCaste: values.subCaste,
        gothram: values.gothram,
        motherTongue: values.motherTongue,
        country: values.country,
        city: values.city,
        maritalStatus: values.maritalStatus,
        noOfChildren: values.noOfChildren,
        height: values.height,
        highestEducation: values.highestEducation,
        collegeName: values.collegeName,
        sector: values.sector,
        occupation: values.occupation,
        companyName: values.companyName,
        annualIncome: values.annualIncome,
        workLocation: values.workLocation,
        emailId: values.emailId,
        mobileNumber: values.mobileNumber,
        createPassword: values.createPassword,
        role: values.role
      };

      const formData = new FormData();

      // 👇 MUST MATCH @RequestParam("profile")
      formData.append("profile", JSON.stringify(profileData));

      // 👇 MUST MATCH @RequestParam("document")
      if (values.documentFile) {
        formData.append("document", values.documentFile);
      }

      console.log("Submitting registration:", profileData, values.documentFile);

      axios.post(`${backendIP}/profiles/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(() => {
          toast.success("Registration successful");
          navigate("/registration-success");
        })
        .catch((error) => {
          console.error("Upload error:", error.response?.data || error.message);
          toast.error("Registration failed");
        });
    };

    const sendEmailOtp = async (email) => {
      try {
        setLoading(true);
        await axios.post(`${backendIP}/auth/register/send-otp`, { email });
        setOtpSent(true);
        toast.success("OTP sent to your email");
      } catch (err) {
        toast.error("Failed to send OTP");
        console.log("error : ", err);
      } finally {
        setLoading(false);
      }
    };

    const verifyEmailOtp = async (email) => {
      try {
        setLoading(true);

        const res = await axios.post(`${backendIP}/auth/register/verify-otp`,
          {
            email: email,
            otp: Number(otp)
          }
        );
        console.log("OTP verification response:", email, otp, res.data);

        if (res.data === "Email verified successfully") {
          setEmailVerified(true);
          toast.success("Email verified successfully");
        } else {
          toast.error("Invalid OTP");
        }
      } catch (err) {
        toast.error("OTP verification failed");
      } finally {
        setLoading(false);
      }
    };

    /* -------------------------------------------------------------
      RENDER STEP CONTENT
    ------------------------------------------------------------- */
    const renderStep = (values, setFieldValue, setTouched) => {
      switch (step) {
        /* ---------------------- STEP 1 ----------------------- */
        case 1:
          return (
            <>
              <div className="step-icon"><FaUserFriends /></div>
              <h2>This profile is for</h2>

              {/* PROFILE FOR OPTIONS */}
              <div className="option-group">
                {["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative",].map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`option-btn ${values.profileFor === option ? "selected" : ""
                      }`}
                    onClick={() => {
                      setFieldValue("profileFor", option);
                      setTouched({ profileFor: true });

                      // AUTO-SET GENDER LOGIC
                      if (option === "My Son" || option === "My Brother") {
                        setFieldValue("gender", "Male");
                        setTouched({ gender: true });
                      } else if (option === "My Daughter" || option === "My Sister") {
                        setFieldValue("gender", "Female");
                        setTouched({ gender: true });
                      } else {
                        // For Myself / My Friend / My Relative → Manual gender selection
                        setFieldValue("gender", "");
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <ErrorMessage name="profileFor" component="div" className="error-text" />

              {/* MANUAL GENDER SELECTION ONLY FOR THESE */}
              {["Myself", "My Friend", "My Relative"].includes(values.profileFor) && (
                <>
                  <h3 className="mt-3">
                    {values.profileFor === "My Friend"
                      ? "Is your friend Male or Female?"
                      : values.profileFor === "My Relative"
                        ? "Is your relative Male or Female?"
                        : "Are you Male or Female?"}
                  </h3>

                  <div className="option-group">
                    {["Male", "Female"].map((g) => (
                      <button
                        type="button"
                        key={g}
                        className={`option-btn ${values.gender === g ? "selected" : ""
                          }`}
                        onClick={() => {
                          setFieldValue("gender", g);
                          setTouched({ gender: true });
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage name="gender" component="div" className="error-text" />
                </>
              )}
            </>
          );

        /* ---------------------- STEP 2 ----------------------- */
        case 2:
          return (
            <>
              <div className="step-icon"><FaUser /></div>
              <h2>Tell us about you</h2>

              {/* First Name */}
              <Field
                className="form-input"
                name="firstName"
                placeholder="First Name"
              />
              <ErrorMessage name="firstName" component="div" className="error-text" />

              {/* Last Name */}
              <Field
                className="form-input"
                name="lastName"
                placeholder="Last Name"
              />
              <ErrorMessage name="lastName" component="div" className="error-text" />

              {/* AGE (AUTO-CALCULATED) */}
              <Field
                className="form-input"
                name="age"
                placeholder="Age (Auto-calculated)"
                disabled={values.dobDay && values.dobMonth && values.dobYear}
              />
              <ErrorMessage name="age" component="div" className="error-text" />

              {/* DATE OF BIRTH */}
              <label className="form-label">Date of Birth</label>
              <div className="dob-fields">
                <Field
                  name="dobDay"
                  placeholder="DD"
                  className="form-input dobInput"
                  onChange={(e) => {
                    const day = e.target.value;
                    setFieldValue("dobDay", day);

                    if (day && values.dobMonth && values.dobYear) {
                      const dob = new Date(values.dobYear, values.dobMonth - 1, day);
                      const today = new Date();

                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();

                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                      }

                      setFieldValue("age", age);
                    }
                  }}
                />

                <Field
                  name="dobMonth"
                  placeholder="MM"
                  className="form-input dobInput"
                  onChange={(e) => {
                    const month = e.target.value;
                    setFieldValue("dobMonth", month);

                    if (values.dobDay && month && values.dobYear) {
                      const dob = new Date(values.dobYear, month - 1, values.dobDay);
                      const today = new Date();

                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();

                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                      }

                      setFieldValue("age", age);
                    }
                  }}
                />

                <Field
                  name="dobYear"
                  placeholder="YYYY"
                  className="form-input dobInput"
                  onChange={(e) => {
                    const year = e.target.value;
                    setFieldValue("dobYear", year);

                    if (values.dobDay && values.dobMonth && year) {
                      const dob = new Date(year, values.dobMonth - 1, values.dobDay);
                      const today = new Date();

                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();

                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                      }

                      setFieldValue("age", age);
                    }
                  }}
                />
              </div>

              <ErrorMessage name="dobDay" component="div" className="error-text" />
              <ErrorMessage name="dobMonth" component="div" className="error-text" />
              <ErrorMessage name="dobYear" component="div" className="error-text" />
            </>
          );


        /* ---------------------- STEP 3 ----------------------- */
        case 3:
          return (
            <>
              <div className="step-icon"><FaBookOpen /></div>
              <h2>Religion & Community</h2>

              {/* Religion */}
              <Field as="select" name="religion" className="form-select">
                <option value="" disabled>Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Jain">Jain</option>
                <option value="Buddhist">Buddhist</option>
              </Field>
              <ErrorMessage name="religion" component="div" className="error-text" />

              {/* Mother Tongue */}
              <Field as="select" name="motherTongue" className="form-select">
                <option value="" disabled>Select your Mother Tongue</option>
                {/* Major Indian Languages */}
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Urdu">Urdu</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Kannada">Kannada</option>
                <option value="Odia">Odia</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Assamese">Assamese</option>
                <option value="Konkani">Konkani</option>
                <option value="Sindhi">Sindhi</option>
                <option value="Nepali">Nepali</option>
                <option value="Kashmiri">Kashmiri</option>
                <option value="Manipuri">Manipuri</option>
                <option value="English">English</option>
              </Field>

              {/* ---------------- SUB COMMUNITY ---------------- */}
              <Field
                as="select"
                name="subCaste"
                className="form-select"
                onChange={(e) => {
                  setFieldValue("subCaste", e.target.value);
                  if (e.target.value !== "Others") {
                    setFieldValue("subCasteOther", "");
                  }
                }}
              >
                <option value="" disabled>Select Sub-Community</option>
                {subCommunityList.map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
                {/* <option value="Others">Others</option> */}
              </Field>
              <ErrorMessage name="subCaste" component="div" className="error-text" />

              {/* Sub Community Other */}
              {values.subCaste === "Others" && (
                <Field
                  name="subCasteOther"
                  className="form-input"
                  placeholder="Enter Sub-Community"
                />
              )}

              {/* ---------------- GOTHRAM ---------------- */}
              <Field
                as="select"
                name="gothram"
                className="form-select"
                onChange={(e) => {
                  setFieldValue("gothram", e.target.value);
                  if (e.target.value !== "Others" && e.target.value !== "Dont know") {
                    setFieldValue("gothramOther", "");
                  }
                }}
              >
                <option value="" disabled>Select Gothram</option>
                {gothramList.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
                <option value="Others">Others</option>
                {/* <option value="Dont know">Dont know</option> */}
              </Field>
              <ErrorMessage name="gothram" component="div" className="error-text" />

              {/* Gothram Other */}
              {(values.gothram === "Others" || values.gothram === "Dont know") && (
                <Field
                  name="gothramOther"
                  className="form-input"
                  placeholder="Enter Gothram"
                />
              )}
            </>
          );

        /* ---------------------- STEP 4 ----------------------- */
        case 4:
          return (
            <>
              <div className="step-icon"><FaMapMarkerAlt /></div>
              <h2>Where do you live?</h2>

              <Field as="select" name="country" className="form-select">
                <option value={""} disabled>Select your Country</option>
                <option value={"India"}>India</option>
                <option value={"USA"}>USA</option>
                <option value={"UK"}>UK</option>
                <option value={"Canada"}>Canada</option>
                <option value={"Australia"}>Australia</option>
              </Field>

              <Field name="city" className="form-input" placeholder="City" />
              <ErrorMessage name="city" component="div" className="error-text" />
            </>
          );

        /* ---------------------- STEP 5 ----------------------- */
        case 5:
          return (
            <>
              <div className="step-icon"><FaUserCheck /></div>
              <h2>Marital Status & Height</h2>
              <Field as="select" name="maritalStatus" className="form-select">
                <option value={""} disabled>Select your Marital Status</option>
                <option value={"Single"}>Single</option>
                <option value={"Divorced"}>Divorced</option>
                <option value={"Separated"}>Separated</option>
                <option value={"Widowed"}>Widowed</option>
              </Field>

              <Field name="noOfChildren" className="form-input" placeholder="Number Of Childern (Optional)" />

              <Field as="select" name="height" className="form-select">
                <option value={""} disabled>Select your Height</option>
                {heights.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </Field>
            </>
          )

        /* ---------------------- STEP 6 ----------------------- */
        case 6:
          return (
            <>
              <div className="step-icon"><FaGraduationCap /></div>
              <h2>Education</h2>

              <Field as="select" name="highestEducation" className="form-select">
                <option value={""} disabled>Select your higher Qualification</option>
                <option value="Tenth">10th</option>
                <option value="Twelfth">12th / Intermediate</option>
                <option value="Diploma">Diploma</option>
                <option value="B.A">B.A</option>
                <option value="B.Sc">B.Sc</option>
                <option value="B.Com">B.Com</option>
                <option value="B.E / B.Tech">B.E / B.Tech</option>
                <option value="MBBS">MBBS</option>
                <option value="LLB">LLB</option>
                <option value="M.A">M.A</option>
                <option value="M.Sc">M.Sc</option>
                <option value="M.Com">M.Com</option>
                <option value="M.E / M.Tech">M.E / M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
                <option value="CA">CA</option>
                <option value="CS">CS</option>
                <option value="ICWA">ICWA</option>
                <option value="PhD">PhD</option>
              </Field>

              <Field name="collegeName" className="form-input" placeholder="College / University Name" />
              <ErrorMessage name="collegeName" component="div" className="error-text" />
            </>
          );

        /* ---------------------- STEP 7 ----------------------- */
        case 7:
          return (
            <>
              <div className="step-icon"><FaBriefcase /></div>
              <h2>Career Details</h2>

              <Field as="select" name="sector" placeholder="Sector" className="form-select">
                <option value={""} disabled>Select your sector</option>
                <option value="Government">Government / PSU</option>
                <option value="Private">Private</option>
                <option value="Business">Business</option>
                <option value="Self-Employed">Self-Employed / Freelancer</option>
                <option value="Defense">Defense / Armed Forces</option>
                <option value="Not Working">Not Working</option>
              </Field>

              <Field name="occupation" className="form-input" placeholder="Your Profession" />
              <ErrorMessage name="occupation" component="div" className="error-text" />

              <Field name="companyName" className="form-input" placeholder="Company Name" />
              <ErrorMessage name="companyName" component="div" className="error-text" />

              <Field name="workLocation" className="form-input" placeholder="Enter your working Location" />

              <Field as="select" name="annualIncome" className="form-select">
                <option value={""} disabled>Select your yearly Income</option>
                <option value={"Below ₹ 1 Lakh yearly"}>Below ₹ 1 Lakh yearly</option>
                <option value={"₹ 1 to 3 Lakh yearly"}>₹ 1 to 3 Lakh yearly</option>
                <option value={"₹ 3 to 5 Lakh yearly"}>₹ 3 to 5 Lakh yearly</option>
                <option value={"₹ 5 to 7 Lakh yearly"}>₹ 5 to 7 Lakh yearly</option>
                <option value={"₹ 7 to 10 Lakh yearly"}>₹ 7 to 10 Lakh yearly</option>
                <option value={"₹ 10 to 15 Lakh yearly"}>₹ 10 to 15 Lakh yearly</option>
                <option value={"Above ₹ 15 Lakh yearly"}>Above ₹ 15 Lakh yearly</option>
              </Field>
            </>
          );

        /* ---------------------- STEP 8 ----------------------- */
        case 8:
          return (
            <>
              <div className="step-icon"><FaUser /></div>
              <h2>Contact Information</h2>

              {/* EMAIL */}
              <div className="email-verify-box">
                <Field
                  name="emailId"
                  className="form-input"
                  placeholder="Email Address"
                  disabled={emailVerified}
                  onChange={(e) => { setFieldValue("emailId", e.target.value); }}
                />

                {!emailVerified && (
                  <button
                    type="button"
                    className="verify-btn"
                    disabled={!values.emailId || loading}
                    onClick={() => sendEmailOtp(values.emailId)}
                  >
                    {
                      loading ? (
                        <span className="btn-loader" />
                      ) : otpSent ? ("Resend OTP") : ("Verify Email")
                    }
                  </button>
                )}

                {emailVerified && (
                  <span className="verified-text">✅ Verified</span>
                )}
              </div>

              <ErrorMessage name="emailId" component="div" className="error-text" />

              {/* OTP */}
              {otpSent && !emailVerified && (
                <div className="otp-box">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="verify-btn"
                    disabled={!otp || loading}
                    onClick={() => verifyEmailOtp(values.emailId)}
                  >
                    Confirm OTP
                  </button>
                </div>
              )}

              <Field name="mobileNumber" className="form-input" placeholder="Mobile Number" />
              <ErrorMessage name="mobileNumber" component="div" className="error-text" />

              <Field name="createPassword" className="form-input" placeholder="Create Password" />
              <ErrorMessage name="createPassword" component="div" className="error-text" />

              <label className="form-label mt-3">Upload Document (ID Proof Aadhar or PAN)</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                name="documentFile"
                className="form-input"
                onChange={(event) => {
                  setFieldValue("documentFile", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="documentFile" component="div" className="error-text" />
            </>
          );

        /* ---------------------- STEP 9 ----------------------- */
        case 9:
          return (
            <>
              <div className="step-icon"><FaRing /></div>
              <h2>Confirm & Submit</h2>
              <p>Please review your details and submit your profile.</p>

              <button type="submit" className="submit-btn">
                Create My Profile
              </button>
            </>
          );

        default:
          return null;
      }
    };

    /* -------------------------------------------------------------
      MAIN RETURN
    ------------------------------------------------------------- */
    return (
      <div className="matrimony-container">
        <div className="form-wrapper">

          {/* PROGRESS BAR */}
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[step - 1]}
            onSubmit={handleSubmit}
          >
            {({ values, validateForm, setTouched, setFieldValue }) => (
              <Form className="fade-in">

                {renderStep(values, setFieldValue, setTouched)}

                {/* NAVIGATION BUTTONS */}
                <div className="nav-buttons d-flex justify-content-evenly" style={{ marginTop: 25 }}>
                  {step > 1 && (
                    <button type="button" className="back-btn" onClick={prevStep}>
                      Back
                    </button>
                  )}
                  {step < totalSteps && (
                    <button
                      type="button"
                      className="next-btn"
                      disabled={(step === 8 && !emailVerified) || (step === 8 && !values.documentFile)}
                      onClick={() => nextStep(validateForm, setTouched)}
                    >
                      NEXT
                    </button>
                  )}
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  export default Register;