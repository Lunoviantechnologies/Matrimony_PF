import React from "react";
import "../styleSheets/sidebar.css";
import { communityList } from "../data/dataList";

const Sidebar = ({ filters, setFilters, onApply, onClear }) => {

    const hasFilters =
        Object.values(filters).some(
            (val) => Array.isArray(val) && val.length > 0
        ) ||
        Object.values(filters.otherValues || {}).some(
            (val) => val && val.trim() !== ""
        );

    const handleCheckboxChange = (category, value) => {
        setFilters((prev) => {
            const updated = prev[category].includes(value)
                ? prev[category].filter((v) => v !== value)
                : [...prev[category], value];

            return { ...prev, [category]: updated };
        });
    };

    const handleOtherChange = (category, value) => {
        setFilters((prev) => ({
            ...prev,
            otherValues: {
                ...prev.otherValues,
                [category]: value,
            },
        }));
    };

    const heightOptions = [];
    for (let ft = 4; ft <= 7; ft++) {
        for (let inch = 0; inch < 12; inch++) {
            if (ft === 7 && inch > 0) break;
            heightOptions.push(`${ft}'${inch}"`);
        }
    };

    const sections = [
        {
            title: "CreatedBy",
            category: "profileFor",
            options: ["Myself", "My Son", "My Daughter", "My Brother", "My Sister", "My Friend", "My Relative",],
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
            title: "Sub Community",
            category: "caste",
            type: "communityDropdown"
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
            options: ["Farmer", "IT", "Doctor", "Teacher", "Business", "Government", "Other",],
        },
        {
            title: "Lifestyle",
            category: "lifestyle",
            options: ["Vegetarian", "Non-Vegetarian", "Occasionally Non-Vegetarian", "Eggetarian",],
        },
        {
            title: "Habbits",
            category: "habbits",
            options: ["Smoking", "Drinking", "Both", "None"],
        },
        {
            title: "Height",
            category: "height",
            type: "dropdown"
        },
    ];

    return (
        <div className="sidebar">

            {/* HEADER */}
            <div className="sidebar-header">
                <h5 className="sidebar-title text-center">Search Filters</h5>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="sidebar-content">

                {sections.map((section) => (
                    <div key={section.category} className="filter-section">

                        <h6>{section.title}</h6>

                        {section.type === "dropdown" ? (

                            // HEIGHT DROPDOWN
                            <select
                                className="form-select"
                                value={filters.otherValues?.height || ""}
                                onChange={(e) => handleOtherChange("height", e.target.value)}
                            >
                                <option value="">Select Height</option>

                                {heightOptions.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}

                            </select>

                        ) : section.type === "communityDropdown" ? (

                            <>
                                <select
                                    className="form-select"
                                    value={filters.otherValues?.caste || ""}
                                    onChange={(e) => handleOtherChange("caste", e.target.value)}
                                >
                                    <option value="">Select Community</option>

                                    {communityList.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="Others">Others</option>
                                </select>

                                {filters.otherValues?.caste === "Others" && (
                                    <input
                                        type="text"
                                        className="form-control other-input mt-2"
                                        placeholder="Enter custom community"
                                        value={filters.customCaste || ""}
                                        onChange={(e) => setFilters(prev => ({...prev, customCaste: e.target.value}))
                                        }
                                    />
                                )}
                            </>

                        ) : (

                            section.options.map((item) => (
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

                                        <label className="form-check-label ms-1" htmlFor={`${section.category}-${item}`} >
                                            {item}
                                        </label>

                                    </div>

                                    {item === "Other" &&
                                        filters[section.category].includes("Other") && (
                                            <input
                                                type="text"
                                                className="form-control other-input"
                                                placeholder={`Enter ${section.title}`}
                                                value={ filters.otherValues?.[section.category] || "" }
                                                onChange={(e) => handleOtherChange( section.category, e.target.value )
                                                }
                                            />
                                        )}

                                </div>
                            ))

                        )}

                    </div>
                ))}

            </div>

            {/* FOOTER BUTTONS */}
            <div className="sidebar-footer">

                <button
                    className="btn btn-primary w-100"
                    disabled={!hasFilters}
                    onClick={onApply}
                >
                    Apply Filters
                </button>

                <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    disabled={!hasFilters}
                    onClick={onClear}
                >
                    Clear All
                </button>

            </div>

        </div>
    );
};

export default Sidebar;