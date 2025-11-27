import React, { useState } from "react";
import "../styleSheets/sidebar.css";

const Sidebar = () => {
    const [filters, setFilters] = useState({
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

    const sections = [
        {
            title: "Age",
            category: "age",
            options: ["18-25", "26-30", "31-35", "36-40", "40+"],
        },
        {
            title: "Religion",
            category: "religion",
            options: ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Other"],
        },
        {
            title: "Caste",
            category: "caste",
            options: ["Brahmin", "Kamma", "Reddy", "Yadav", "Other"],
        },
        {
            title: "Country",
            category: "country",
            options: ["India", "USA", "UK", "Canada", "Australia", "Other"],
        },
        {
            title: "Education",
            category: "education",
            options: ["B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "PhD"],
        },
        {
            title: "Profession",
            category: "profession",
            options: [
                "Farmer",
                "IT & Software",
                "Doctor",
                "Teacher",
                "Business",
                "Government",
                "Other",
            ],
        },
        {
            title: "Lifestyle",
            category: "lifestyle",
            options: ["Vegetarian", "Non-Vegetarian", "Occasionally Non-Veg"],
        },
    ];

    return (
        <div className="sidebar">
            <h5 className="sidebar-title text-center">Search Filters</h5>

            <button className="btn w-100 apply-btn" onClick={handleApplyFilters}>
                Apply Filters
            </button>

            {sections.map((section) => (
                <div key={section.category} className="filter-section">
                    <h6>{section.title}</h6>
                    {section.options.map((item) => (
                        <div key={item} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${section.category}-${item}`}
                                checked={filters[section.category].includes(item)}
                                onChange={() =>
                                    handleCheckboxChange(section.category, item)
                                }
                            />
                            <label className="form-check-label" htmlFor={`${section.category}-${item}`}>
                                {item}
                            </label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;