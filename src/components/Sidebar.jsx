import React, { useState } from "react"; 

const Sidebar = () => {
    const [filters, setFilters] = useState({
        gender: [],
        age: [],
        religion: [],
        caste: [],
        country: [],
        education: [],
        profession: [],
        lifestyle: [],
    });

    const handleCheckboxChange = (category, value) => {
        setFilters((prev) => {
            const updated = prev[category].includes(value)
                ? prev[category].filter((v) => v !== value)
                : [...prev[category], value];
            return { ...prev, [category]: updated };
        });
    };

    const handleApplyFilters = () => {
        console.log("Applied Filters:", filters);
    };

    return (
        <div
            style={{
                width: "260px",
                backgroundColor: "#fff",
                borderRight: "1px solid #ddd",
                height: "100vh",
                position: "sticky",
                top: "70px",
                padding: "20px",
                overflowY: "auto",
                boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
            }}
        >
            <h5 style={{ color: "#5C4218", marginBottom: 20 }}>Search Filters</h5>

            <button className="btn btn-primary w-100 mb-3" onClick={handleApplyFilters}>
                Apply Filters
            </button>

            {/* Gender */}
            <div className="mb-3">
                <h6>Gender</h6>
                {["Bride", "Groom"].map((item) => (
                    <div key={item} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={item}
                            checked={filters.gender.includes(item)}
                            onChange={() => handleCheckboxChange("gender", item)}
                        />
                        <label className="form-check-label" htmlFor={item}>
                            {item}
                        </label>
                    </div>
                ))}
            </div>

            {/* Age Range */}
            <div className="mb-3">
                <h6>Age</h6>
                {["18-25", "26-30", "31-35", "36-40", "40+"].map((range) => (
                    <div key={range} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={range}
                            checked={filters.age.includes(range)}
                            onChange={() => handleCheckboxChange("age", range)}
                        />
                        <label className="form-check-label" htmlFor={range}>
                            {range} Years
                        </label>
                    </div>
                ))}
            </div>

            {/* Religion */}
            <div className="mb-3">
                <h6>Religion</h6>
                {["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Other"].map(
                    (religion) => (
                        <div key={religion} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={religion}
                                checked={filters.religion.includes(religion)}
                                onChange={() => handleCheckboxChange("religion", religion)}
                            />
                            <label className="form-check-label" htmlFor={religion}>
                                {religion}
                            </label>
                        </div>
                    )
                )}
            </div>

            {/* Caste */}
            <div className="mb-3">
                <h6>Caste</h6>
                {["Brahmin", "Kamma", "Reddy", "Yadav", "Other"].map((caste) => (
                    <div key={caste} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={caste}
                            checked={filters.caste.includes(caste)}
                            onChange={() => handleCheckboxChange("caste", caste)}
                        />
                        <label className="form-check-label" htmlFor={caste}>
                            {caste}
                        </label>
                    </div>
                ))}
            </div>

            {/* Country */}
            <div className="mb-3">
                <h6>Country</h6>
                {["India", "USA", "UK", "Canada", "Australia", "Other"].map(
                    (country) => (
                        <div key={country} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={country}
                                checked={filters.country.includes(country)}
                                onChange={() => handleCheckboxChange("country", country)}
                            />
                            <label className="form-check-label" htmlFor={country}>
                                {country}
                            </label>
                        </div>
                    )
                )}
            </div>

            {/* Education */}
            <div className="mb-3">
                <h6>Education</h6>
                {["B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "PhD"].map((edu) => (
                    <div key={edu} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={edu}
                            checked={filters.education.includes(edu)}
                            onChange={() => handleCheckboxChange("education", edu)}
                        />
                        <label className="form-check-label" htmlFor={edu}>
                            {edu}
                        </label>
                    </div>
                ))}
            </div>

            {/* Profession */}
            <div className="mb-3">
                <h6>Profession</h6>
                {[ "Farmer", "IT & Software", "Doctor", "Teacher", "Business", "Government", "Other",].map((job) => (
                    <div key={job} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={job}
                            checked={filters.profession.includes(job)}
                            onChange={() => handleCheckboxChange("profession", job)}
                        />
                        <label className="form-check-label" htmlFor={job}>
                            {job}
                        </label>
                    </div>
                ))}
            </div>

            {/* Lifestyle */}
            <div className="mb-3">
                <h6>Lifestyle</h6>
                {["Vegetarian", "Non-Vegetarian", "Occasionally Non-Veg"].map(
                    (diet) => (
                        <div key={diet} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={diet}
                                checked={filters.lifestyle.includes(diet)}
                                onChange={() => handleCheckboxChange("lifestyle", diet)}
                            />
                            <label className="form-check-label" htmlFor={diet}>
                                {diet}
                            </label>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Sidebar;