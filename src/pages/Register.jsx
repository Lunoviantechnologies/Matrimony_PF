import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaUserFriends, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaRing, FaBookOpen, FaUserCheck } from "react-icons/fa";
import "../styleSheets/register.css";

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
  religion: "",
  community: "",
  subCommunity: "",
  country: "",
  city: "",
  maritalStatus: "",
  height: "",
  highestQualification: "",
  collegeName: "",
  workWith: "",
  workAs: "",
  companyName: "",
  income: "₹",
  email: "",
  mobile: "",
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
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dobDay: Yup.string().required("Required"),
    dobMonth: Yup.string().required("Required"),
    dobYear: Yup.string().required("Required"),
  }),

  // STEP 3
  Yup.object({
    religion: Yup.string().required("Required"),
    community: Yup.string().required("Required"),
  }),

  // STEP 4
  Yup.object({
    country: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  }),

  // STEP 5
  Yup.object({
    maritalStatus: Yup.string().required("Required"),
    height: Yup.string().required("Required"),
  }),

  // STEP 6
  Yup.object({
    highestQualification: Yup.string().required("Required"),
    collegeName: Yup.string().required("Required"),
  }),

  // STEP 7
  Yup.object({
    workWith: Yup.string().required("Required"),
    workAs: Yup.string().required("Required"),
    companyName: Yup.string().required("Required"),
  }),

  // STEP 8
  Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Enter 10-digit mobile")
      .required("Required"),
  }),

  // STEP 9 (NO validation)
  Yup.object({}),
];

const Register = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 9;

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

            <div className="option-group">
              {
                ["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative",].map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`option-btn ${values.profileFor === option ? "selected" : ""
                      }`}
                    onClick={() => {
                      setFieldValue("profileFor", option);
                      setTouched({ profileFor: true });
                    }}
                  >
                    {option}
                  </button>
                ))
              }
            </div>

            <ErrorMessage name="profileFor" component="div" className="error-text" />

            {/* Gender only for these 3 */}
            {(values.profileFor === "Myself" ||
              values.profileFor === "My Friend" ||
              values.profileFor === "My Relative") && (
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

                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="error-text"
                  />
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

            <Field className="form-input" name="firstName" placeholder="First Name" />
            <ErrorMessage name="firstName" component="div" className="error-text" />

            <Field className="form-input" name="lastName" placeholder="Last Name" />
            <ErrorMessage name="lastName" component="div" className="error-text" />

            <label className="form-label">Date of Birth</label>
            <div className="dob-fields">
              <Field name="dobDay" placeholder="DD" className="form-input dobInput" />
              <Field name="dobMonth" placeholder="MM" className="form-input dobInput" />
              <Field name="dobYear" placeholder="YYYY" className="form-input dobInput" />
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

            <Field as="select" name="religion" className="form-select">
              <option value="" disabled>Select your Religion</option>
              <option value={"Christian"}>Christian</option>
              <option value={"Hindu"}>Hindu</option>
              <option value={"Muslim"}>Muslim</option>
              <option value={"Sikh"}>Sikh</option>
            </Field>

            <ErrorMessage name="religion" component="div" className="error-text" />

            <Field as="select" name="community" className="form-select">
              <option value="" disabled>Select your Mother Tongue</option>
              <option value={"English"}>English</option>
              <option value={"Hindi"}>Hindi</option>
              <option value={"Kannada"}>Kannada</option>
              <option value={"Malayali"}>Malayali</option>
              <option value={"Marathi"}>Marathi</option>
              <option value={"Punjabi"}>Punjabi</option>
              <option value={"Tamil"}>Tamil</option>
              <option value={"Telugu"}>Telugu</option>
            </Field>

            <ErrorMessage name="community" component="div" className="error-text" />

            <Field name="subCommunity" className="form-input" placeholder="Sub-community (optional)"/>
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
              <option value={"Never Married"}>Divorced</option>
              <option value={"Widowed"}>Widowed</option>
            </Field>

            <Field as="select" name="height" className="form-select">
              <option value={""} disabled>Select your Height</option>
              <option value={"4 ft 5 in (134 cm)"}>4 ft 5 in (134 cm)</option>
              <option value={"5 ft 0 in (152 cm)"}>5 ft 0 in (152 cm)</option>
              <option value={"5 ft 5 in (165 cm)"}>5 ft 5 in (165 cm)</option>
              <option value={"6 ft 0 in (183 cm)"}>6 ft 0 in (183 cm)</option>
              <option value={"6 ft 5 in (196 cm)"}>6 ft 5 in (196 cm)</option>
            </Field>
          </>
        )

      /* ---------------------- STEP 6 ----------------------- */
      case 6:
        return (
          <>
            <div className="step-icon"><FaGraduationCap /></div>
            <h2>Education</h2>

            <Field as="select" name="highestQualification" className="form-select">
              <option value={""} disabled>Select your higher Qualification</option>
              <option value={"B.E / B.Tech"}>B.E / B.Tech</option>
              <option value={"Degree"}>Degree</option>
              <option value={"Intermediate"}>Intermediate</option>
              <option value={"M.E / M.Tech"}>M.E / M.Tech</option>
              <option value={"MBA"}>MBA</option>
              <option value={"PhD"}>PhD</option>
              <option value={"Tenth"}>Tenth</option>
            </Field>

            <Field
              name="collegeName"
              className="form-input"
              placeholder="College / University Name"
            />
            <ErrorMessage name="collegeName" component="div" className="error-text" />
          </>
        );

      /* ---------------------- STEP 7 ----------------------- */
      case 7:
        return (
          <>
            <div className="step-icon"><FaBriefcase /></div>
            <h2>Career Details</h2>

            <Field as="select" name="workWith"placeholder="Sector" className="form-select">
              <option value={""} disabled>Select your sector</option>
              <option value={"Bussiness"}>Bussiness</option>
              <option value={"Government"}>Government</option>
              <option value={"Private"}>Private</option>
              <option value={"Self Employeed"}>Self Employeed</option>
              <option value={"Not Working"}>Not Working</option>
            </Field>

            <Field name="workAs" className="form-input" placeholder="Your Profession" />
            <ErrorMessage name="workAs" component="div" className="error-text" />

            <Field name="companyName" className="form-input" placeholder="Company Name" />
            <ErrorMessage name="companyName" component="div" className="error-text" />

            <Field as="select" name="income" className="form-select">
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

            <Field name="email" className="form-input" placeholder="Email Address" />
            <ErrorMessage name="email" component="div" className="error-text" />

            <Field name="mobile" className="form-input" placeholder="Mobile Number" />
            <ErrorMessage name="mobile" component="div" className="error-text" />
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
          onSubmit={(values) => console.log("SUBMITTED:", values)}
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