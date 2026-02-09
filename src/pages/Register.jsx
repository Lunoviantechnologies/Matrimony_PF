import React, { useState, useEffect } from "react";
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
  motherTongue: "",
  country: "",
  state: "",
  district: "",
  city: "",
  residenceStatus: "",
  maritalStatus: "",
  livingStatus: "",
  noOfChildren: "",
  highestEducation: "",
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
  signupReferralCode: "",
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
    firstName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed")
      .required("First name is Required"),

    lastName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed")
      .required("Last name is Required"),

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

    dobDay: Yup.number().nullable(),
    dobMonth: Yup.number().nullable(),
    dobYear: Yup.number().nullable(),
  }),

  // STEP 3
  Yup.object({
    religion: Yup.string().required("Religion is required"),
    subCaste: Yup.string().required("Sub-Community is required"),
  }),

  // STEP 4
  // STEP 4
  Yup.object({
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    city: Yup.string().required("City is required"),
    residenceStatus: Yup.string().when("country", {
      is: (c) => c && c !== "1",   // 1 = India id (adjust if needed)
      then: (s) => s.required("Residence status required"),
      otherwise: (s) => s.notRequired(),
    }),
  }),

  // STEP 5  ✅ Marital only
  Yup.object({
    maritalStatus: Yup.string().required("Marital status required"),
    livingStatus: Yup.string().when("maritalStatus", {
      is: (v) => ["Divorced", "Widowed", "Separated"].includes(v),
      then: (s) => s.required("Living status required"),
      otherwise: (s) => s.notRequired(),
    }),
  }),

  // STEP 6  ✅ Education
  Yup.object({
    highestEducation: Yup.string().required("Education required"),
  }),

  // STEP 7  ✅ Career
  Yup.object({
    sector: Yup.string().required("Required"),
    occupation: Yup.string().required("Required"),
    companyName: Yup.string().required("Required"),
  }),

  // STEP 8  ✅ Contact
  Yup.object({
    emailId: Yup.string().email("Invalid emailId").required("Email is Required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Enter 10-digit mobile")
      .required("Required"),
    createPassword: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    documentFile: Yup.mixed().required("Document is required"),
  }),

  // STEP 9
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
const HindusubCommunityList = [
  "Anavil Brahmin",
  "Audichya Brahmin",
  "Ayodhi",
  "Balija",
  "Balija Naidu",
  "Balija Setty",
  "Barendra Brahmin",
  "Bhoomanchi Reddy",
  "Boyar Kapu",
  "Brahmin – Not Specified",
  "Chitpavan Brahmin",
  "Chowdary",
  "Coastal Kapu",
  "Dakshina Kapu",
  "Deshastha Brahmin",
  "Desuru",
  "Dravida Brahmin",
  "Gandla",
  "Ganjam",
  "Gaur Brahmin",
  "Gavara",
  "Gavara Naidu",
  "General Kapu",
  "Golla Kapu",
  "Gone Kapu",
  "Goud Saraswat Brahmin",
  "Gudati",
  "Havyaka Brahmin",
  "Iyengar",
  "Iyer",
  "Kalinga Brahmin",
  "Kalinga Kapu",
  "Kamma Kapu",
  "Kanyakubja Brahmin",
  "Kapu",
  "Kapu Naicker",
  "Kapu Reddy",
  "Kapu Velama",
  "Karanakamma Brahmin",
  "Karhade Brahmin",
  "Khedaval Brahmin",
  "Konkani Brahmin",
  "Kota Brahmin",
  "Kulin Brahmin",
  "Kuruba Kapu",
  "Maithil Brahmin",
  "Madhwa Brahmin",
  "Modh Brahmin",
  "Motati",
  "Mulakanadu Brahmin",
  "Munnuru Kapu",
  "Nagar Brahmin",
  "Naidu Kapu",
  "Namboodiri",
  "Niyogi Brahmin",
  "Ontari",
  "Ontari Kapu",
  "Other Brahmin",
  "Other Kapu Sub-Caste",
  "Others",
  "Palle",
  "Palnati",
  "Panta",
  "Pedakanti",
  "Poknati",
  "Pushkarna Brahmin",
  "Rarhi Brahmin",
  "Rayalaseema Kapu",
  "Reddiyar",
  "Sajjana",
  "Sakaldwipi Brahmin",
  "Sanadhya Brahmin",
  "Saraswat Brahmin",
  "Saryuparin Brahmin",
  "Shrimali Brahmin",
  "Shivalli Brahmin",
  "Smartha Brahmin",
  "Telaga",
  "Telaga Kapu",
  "Tulu Brahmin",
  "Turpu Kapu",
  "Tyagi Brahmin",
  "Uttara Kapu",
  "Vaidiki Brahmin",
  "Vanni",
  "Velanadu Brahmin",
  "Velanati"
].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

const muslimCommunityList = [
  "Shia",
  "Sunni",

  "Ansari",
  "Arain",
  "Awan",
  "Bohra",
  "Dekkani",
  "Dudekula",
  "Hanafi",
  "Jat",
  "Khoja",
  "Lebbai",
  "Malik",
  "Mapila",
  "Maraicar",
  "Memon",
  "Mughal",
  "Pathan",
  "Qureshi",
  "Rajput",
  "Rowther",
  "Shafi",
  "Sheikh",
  "Siddiqui",
  "Syed",
  "Others",
  "UnSpecified",

  "Other Caste",
  "Don't wish to specify"
];
const jainDigambarCommunityList = [
  "Jain - Agarwal",
  "Jain - Asati",
  "Jain - Ayodhyavasi",
  "Jain - Bagherwal",
  "Jain - Bania",
  "Jain - Barhiya",
  "Jain - Charanagare",
  "Jain - Chaturtha",
  "Jain - Dhakada",
  "Jain - Gahoi / Grihapati",
  "Jain - Golalare / Kharaua",
  "Jain - Golapurva",
  "Jain - Golsinghare",
  "Jain - Harada",
  "Jain - Humad / Humbad",
  "Jain - Intercaste",
  "Jain - Jaiswal",
  "Jain - KVO",
  "Jain - Kambhoja",
  "Jain - Kasar",
  "Jain - Kathanere",
  "Jain - Khandelwal",
  "Jain - Kharaua",
  "Jain - Kutchi",
  "Jain - Lamechu",
  "Jain - Nema",
  "Jain - Oswal",
  "Jain - Padmavati Porwal",
  "Jain - Palliwar",
  "Jain - Panchama",
  "Jain - Parmar",
  "Jain - Parwar / Paravara",
  "Jain - Porwad / Porwal",
  "Jain - Porwal",
  "Jain - Saitwal",
  "Jain - Samanar / Nayinar",
  "Jain - Samiya",
  "Jain - Sarak",
  "Jain - Shrimali",
  "Jain - Upadhyaya",
  "Jain - Vaishya",
  "Jain - Veerwal",
  "Jain - Others",
  "Jain - Unspecified",
  "Other Caste",
  "Don’t wish to specify"
];
const sikhFullCommunityList = [
  "Jat Sikh",
  "Khatri Sikh",
  "Arora Sikh",
  "Ramgarhia",
  "Ahluwalia",
  "Mazhabi Sikh",
  "Ravidassia",
  "Labana",
  "Saini Sikh",
  "Bhatra Sikh",
  "Nai Sikh",
  "Ravidasia Sikh",
  "Valmiki Sikh",
  "Sikh – Others",
  "Sikh – Not Specified"
];
const christianDivisionList = [
  "Roman Catholic",
  "Latin Catholic",
  "Syro Malabar",
  "Syro Malankara",
  "Malankara Catholic",
  "Orthodox",
  "Jacobite",
  "Marthoma",
  "Church of South India (CSI)",
  "Church of North India (CNI)",
  "Anglican / Episcopal",
  "Protestant",
  "Pentecost",
  "Brethren",
  "Baptist",
  "Evangelist",
  "Born Again",
  "Lutheran",
  "Methodist",
  "Presbyterian",
  "Seventh-day Adventist",
  "Adventist",
  "Assembly of God (AG)",
  "Church of God",
  "Church of Christ",
  "Reformed Baptist",
  "Reformed Presbyterian",
  "Mennonite",
  "Moravian",
  "Congregational",
  "Calvinist",
  "Apostolic",
  "Malabar Independent Syrian Church",
  "Knanaya Catholic",
  "Knanaya Jacobite",
  "Chaldean Syrian",
  "Melkite",
  "Jehovah’s Witness",
  "Latter Day Saints (LDS)",
  "Anglo-Indian",
  "Christian – Others",
  "Christian – Not Specified"
];
const christianCasteList = [
  // SC origin
  "Mala",
  "Madiga",
  "Adi Andhra",
  "Adi Dravida",
  "Adi Karnataka",
  "Pulaya",
  "Paraiyar",
  "Sambava",
  "Pallan / Devandra Kula Vellalar",
  "Rohit / Chamar",

  // BC / OBC origin
  "Kapu Christian",
  "Reddy Christian",
  "Balija Christian",
  "Telaga Christian",
  "Velama Christian",
  "Kamma Christian",
  "Gavara Christian",
  "Goud Christian",
  "Yadava Christian",
  "Vaddera Christian",
  "Perika Christian",
  "Kummari Christian",
  "Rajaka / Vannar Christian",

  // Forward / OC
  "Brahmin Christian",
  "Kshatriya Christian",
  "Vaishya Christian",

  // Regional
  "Latin Christian",
  "Syrian Christian",
  "Knanaya Christian",
  "Anglo-Indian Christian",

  // General
  "Christian – Others",
  "Christian – No Caste",
  "Christian – Not Specified"
];
const jainShwetambarCommunityList = [
  "Jain - Oswal",
  "Jain - Porwal",
  "Jain - Shrimali",
  "Jain - Khandelwal",
  "Jain - Agarwal",
  "Jain - Kutchi",
  "Jain - Others",
  "Jain - Unspecified",
  "Don’t wish to specify"
];

const buddhistCommunityList = [
  "Theravada",
  "Mahayana",
  "Vajrayana",
  "Navayana",
  "Buddhist – Others",
  "Buddhist – Not Specified"
];
const jewishCommunityList = [
  "Ashkenazi",
  "Sephardi",
  "Mizrahi",
  "Jewish – Others",
  "Jewish – Not Specified"
];

const parsiCommunityList = [
  "Parsi Zoroastrian",
  "Irani Zoroastrian",
  "Parsi – Others",
  "Parsi – Not Specified"
];

const noReligionCommunityList = [
  "No Religion",
  "Atheist",
  "Agnostic",
  "Spiritual but not religious"
];

const interReligionCommunityList = [
  "Inter-Religion",
  "Inter-Caste",
  "Mixed Religion Family"
];


/* ---------------- SUB COMMUNITY LIST ---------------- */
const religionSubCommunityMap = {
  Hindu: HindusubCommunityList,
  Muslim: muslimCommunityList,
  Christian: christianCasteList,
  Sikh: sikhFullCommunityList,
  "Jain - Digambar": jainDigambarCommunityList,
  "Jain - Shwetambar": jainShwetambarCommunityList,
  Buddhist: buddhistCommunityList,
  Jewish: jewishCommunityList,
  Parsi: parsiCommunityList,
  "No Religion": noReligionCommunityList,
  "Inter-Religion": interReligionCommunityList
};

const fetchCountries = async () => {
  const res = await axios.get(`${backendIP}/locations/countries`);
  // console.log("res country: ", res.data);
  return res.data || [];
};

const fetchStatesByCountryId = async (countryId) => {
  const res = await axios.get(`${backendIP}/locations/states/${countryId}`);
  console.log("res state: ", res.data);
  return res.data || [];
};

// const fetchDistrictsByStateId = async (stateId) => {
//   const res = await axios.get(
//     `${backendIP}/locations/districts/${stateId}`
//   );
//   return res.data || [];
// };

const fetchCitiesByDistrictId = async (districtId) => {
  const res = await axios.get(
    `${backendIP}/locations/cities/${districtId}`
  );
  return res.data || [];
};
const allowOnlyLetters = (value) => value.replace(/[^a-zA-Z\s]/g, "");
const allowOnlyNumbers = (value) => value.replace(/[^0-9]/g, "");

const Register = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 9;
  const [statesList, setStatesList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const navigate = useNavigate();

  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountriesList(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadCountries();
  }, []);

  /* -------------------------------------------------------------
    PREVIOUS STEP
  ------------------------------------------------------------- */
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (values) => {

    const selectedCountry = countriesList.find(c => c.id === Number(values.country));
    const selectedState = statesList.find(s => s.id === Number(values.state));

    const profileData = {
      profileFor: values.profileFor,
      gender: values.gender,
      firstName: values.firstName,
      lastName: values.lastName,
      age: values.age,

      dateOfBirth:
        values.dobDay && values.dobMonth && values.dobYear
          ? `${values.dobYear}-${String(values.dobMonth).padStart(2, '0')}-${String(values.dobDay).padStart(2, '0')}`
          : null,

      religion: values.religion,

      // ✅ FIXED : send typed value when Others is selected
      subCaste: values.subCaste === "Others" ? values.subCasteOther : values.subCaste,
      motherTongue: values.motherTongue,
      country: selectedCountry?.name,
      state: selectedState?.name,
      district: values.district,
      city: values.city,
      residenceStatus: values.residenceStatus,
      maritalStatus: values.maritalStatus,
      noOfChildren: values.noOfChildren,
      highestEducation: values.highestEducation,
      sector: values.sector,
      occupation: values.occupation,
      companyName: values.companyName,
      annualIncome: values.annualIncome,
      workLocation: values.workLocation,
      emailId: values.emailId,
      mobileNumber: values.mobileNumber,
      createPassword: values.createPassword,
      role: values.role,
      signupReferralCode: values.signupReferralCode || null,
    };

    const formData = new FormData();

    formData.append("profile", JSON.stringify(profileData));

    if (values.documentFile) {
      formData.append("document", values.documentFile);
    }

    console.log("Submitting registration:", profileData);

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

            {/* Optional referral code at registration */}
            <Field
              name="signupReferralCode"
              className="form-input mt-3"
              placeholder="Referral code (optional)"
            />

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
            <Field name="firstName">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input"
                  placeholder="First Name"
                  onChange={(e) => {
                    setFieldValue(
                      "firstName",
                      allowOnlyLetters(e.target.value)
                    );
                  }}
                />
              )}
            </Field>

            <Field name="lastName">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input"
                  placeholder="Last Name"
                  onChange={(e) => {
                    setFieldValue(
                      "lastName",
                      allowOnlyLetters(e.target.value)
                    );
                  }}
                />
              )}
            </Field>

            {/* DATE OF BIRTH */}
            <Field name="dobDay">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input dobInput"
                  placeholder="DD"
                  onChange={(e) => {
                    const day = allowOnlyNumbers(e.target.value);
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
              )}
            </Field>


            <Field name="dobMonth">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input dobInput"
                  placeholder="MM"
                  onChange={(e) => {
                    const month = allowOnlyNumbers(e.target.value);
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
              )}
            </Field>

            <Field name="dobYear">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input dobInput"
                  placeholder="YYYY"
                  onChange={(e) => {
                    const year = allowOnlyNumbers(e.target.value);
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
              )}
            </Field>

            <ErrorMessage name="dobDay" component="div" className="error-text" />
            <ErrorMessage name="dobMonth" component="div" className="error-text" />
            <ErrorMessage name="dobYear" component="div" className="error-text" />

            <Field name="age">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input"
                  placeholder="Age (Auto-calculated)"
                  disabled={values.dobDay && values.dobMonth && values.dobYear}
                  onChange={(e) => {
                    setFieldValue(
                      "age",
                      allowOnlyNumbers(e.target.value)
                    );
                  }}
                />
              )}

            </Field>
            <ErrorMessage name="age" component="div" className="error-text" />
          </>
        );


      /* ---------------------- STEP 3 ----------------------- */
      case 3:
        return (
          <>
            <div className="step-icon"><FaBookOpen /></div>
            <Field as="select" name="religion" className="form-select">
              <option value="" disabled>Select Religion</option>

              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>

              <option value="Jain - Digambar">Jain - Digambar</option>
              <option value="Jain - Shwetambar">Jain - Shwetambar</option>

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
              <option value="No particular caste">No particular caste</option>
              {(religionSubCommunityMap[values.religion] || []).map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </Field>
            <div>
              <input
                type="checkbox"
                checked={values.subCaste === "No particular caste"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("subCaste", "No particular caste");
                    setFieldValue("subCasteOther", "");
                  } else {
                    setFieldValue("subCaste", "");
                  }
                }}
              />
              &nbsp; No particular caste



            </div>

            <ErrorMessage name="subCaste" component="div" className="error-text" />

            {/* Sub Community Other */}
            {values.subCaste === "Others" && (
              <Field
                name="subCasteOther"
                className="form-input"
                placeholder="Enter Sub-Community"
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

            {/* Country */}
            <Field
              as="select"
              name="country"
              className="form-select"
              onChange={async (e) => {
                const countryId = e.target.value;
                console.log("countryId: ", countryId)
                setFieldValue("country", countryId);
                setFieldValue("state", "");
                setFieldValue("stateId", "");
                setFieldValue("districtId", "");
                setFieldValue("city", "");

                setStatesList([]);
                setDistrictsList([]);
                setCitiesList([]);

                if (countryId) {
                  const states = await fetchStatesByCountryId(countryId);
                  setStatesList(states);
                }
              }}
            >
              <option value="" disabled>Select your Country</option>

              {countriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Field>

            <Field
              as="select"
              name="state"
              className="form-select"
              disabled={!values.country}
            >
              <option value="" disabled>Select State</option>

              {statesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Field>

            <Field name="district" className="form-input" placeholder="Enter your District" />
            <Field name="city" className="form-input" placeholder="Enter your City" />

            <ErrorMessage name="city" component="div" className="error-text" />

            {/* Residence status */}
            {values.country && values.country !== "1" && (
              <Field as="select" name="residenceStatus" className="form-select">
                <option value="" disabled>Residence Status</option>
                <option value="Citizen">Citizen</option>
                <option value="NRI">NRI</option>
                <option value="H1">H1</option>
                <option value="Green Card">Green Card</option>
              </Field>
            )}
            <ErrorMessage name="residenceStatus" component="div" className="error-text" />
          </>
        );


      /* ---------------------- STEP 5 ----------------------- */
      case 5:
        return (
          <>
            <div className="step-icon"><FaUserCheck /></div>
            <h2>Marital Status</h2>
            <Field as="select" name="maritalStatus" className="form-select">
              <option value="" disabled>Select your Marital Status</option>
              <option value="Single">Single</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </Field>
            {["Divorced", "Widowed", "Separated"].includes(values.maritalStatus) && (
              <Field as="select" name="livingStatus" className="form-select">
                <option value="" disabled>Living status</option>
                <option value="Staying with parents">Staying with parents</option>
                <option value="Living separately">Living separately</option>
              </Field>
            )}

            {values.maritalStatus && values.maritalStatus !== "Single" && (
              <Field name="noOfChildren">
                {({ field }) => (
                  <input
                    {...field}
                    className="form-input"
                    placeholder="Number Of Children"
                    onChange={(e) => {
                      setFieldValue(
                        "noOfChildren",
                        allowOnlyNumbers(e.target.value)
                      );
                    }}
                  />
                )}
              </Field>
            )}
          </>
        )
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

          </>
        );
      /* ---------------------- STEP 6 ----------------------- */
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
              <option value={"₹ 15 to 20 Lakh yearly"}>₹ 15 to 20 Lakh yearly</option>
              <option value={"₹ 20 to 30 Lakh yearly"}>₹ 20 to 30 Lakh yearly</option>
              <option value={"Above ₹ 30 Lakh yearly"}>Above ₹ 30 Lakh yearly</option>
            </Field>
          </>
        );

      /* ---------------------- STEP 7 ----------------------- */
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

            <Field name="mobileNumber">
              {({ field }) => (
                <input
                  {...field}
                  className="form-input"
                  placeholder="Mobile Number"
                  maxLength={10}
                  onChange={(e) => {
                    setFieldValue(
                      "mobileNumber",
                      allowOnlyNumbers(e.target.value)
                    );
                  }}
                />
              )}
            </Field>

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

      /* ---------------------- STEP 8----------------------- */
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
                    disabled={
                      (step === 8 && !emailVerified) || (step === 8 && !values.documentFile)
                      || (step === 2 && Number(values.age) < 18)
                    }
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