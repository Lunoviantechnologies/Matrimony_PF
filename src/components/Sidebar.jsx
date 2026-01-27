import React, { useState } from "react";
import "../styleSheets/sidebar.css";

const Sidebar = ({ filters, setFilters, onApply, onClear }) => {

    const hasFilters = Object.values(filters).some(
        (arr) => Array.isArray(arr) && arr.length > 0
    );

    const handleCheckboxChange = (category, value) => {
        setFilters((prev) => {
            const updated = prev[category].includes(value)
                ? prev[category].filter((v) => v !== value)
                : [...prev[category], value];
            return { ...prev, [category]: updated };
        });
    };

    const sections = [
        {
            title:"CreatedBy",
            category:"profileFor",
            options:["myself", "My Son","My Daughter","My Brother","My Sister","My Friend","My Relative"]

        },
        {
            title: "Age",
            category: "age",
            options: ["18-25", "26-30", "31-35", "36-40", "40+"],
        },
        {
            title: "Marital Status",
            category: "maritalStatus",
            options: ["Single", "Divorced", "Separated", "Widowed"],
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
            options: ["B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "PhD", "Other"],
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
            options: ["Vegetarian", "Non-Vegetarian", "Occasionally Non-Veg","Eggtarian"],
        },
         {
            title: "Habbits",
            category: "habbits",
            options: ["Smoking","Drinking","Both","None"],
        },
    ];

    const handleOtherChange = (category, value) => {
        setFilters(prev => ({
            ...prev,
            otherValues: {
                ...prev.otherValues,
                [category]: value
            }
        }));
    };

    return (
        <div className="sidebar">
            <h5 className="sidebar-title text-center">Search Filters</h5>

            <div className="d-flex justify-content-evenly">
                <button className="btn btn-primary w-100 mb-2" disabled={!hasFilters} onClick={onApply}>
                    Apply Filters
                </button>

                <button className="btn btn-outline-secondary w-100 mb-2" disabled={!hasFilters} onClick={onClear}>
                    Clear All
                </button>
            </div>

            {sections.map((section) => (
                <div key={section.category} className="filter-section">
                    <h6>{section.title}</h6>
                    {section.options.map((item) => (
                        <div key={item} className="mb-2">
                            <div className="form-check d-flex align-items-center">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`${section.category}-${item}`}
                                    checked={filters[section.category].includes(item)}
                                    onChange={() =>
                                        handleCheckboxChange(section.category, item)
                                    }
                                />
                                <label className="form-check-label ms-1" htmlFor={`${section.category}-${item}`}>
                                    {item}
                                </label>
                            </div>

                            {item === "Other" && filters[section.category].includes("Other") && (
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        className="form-control other-input"
                                        placeholder={`Enter ${section.title}`}
                                        value={filters.otherValues?.[section.category] || ""}
                                        onChange={(e) =>
                                            handleOtherChange(section.category, e.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;