import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MatchCalculation } from "../utils/MatchCalculation";

const MatchPreferences = ({ profile, setMatchPercent }) => {
    const { id, myProfile } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!myProfile && id) {
            dispatch(fetchMyProfile(id));
        }
    }, [id, myProfile, dispatch]);

    const MATCH_RULES = [
        { key: "religion", label: "Religion", weight: 20 },
        { key: "subCaste", label: "Caste", weight: 15 },
        { key: "highestEducation", label: "Education", weight: 15 },
        { key: "sector", label: "Profession", weight: 15 },
        { key: "country", label: "Country", weight: 15 },
        { key: "maritalStatus", label: "Marital Status", weight: 10 },
        { key: "habbits", label: "Habits", weight: 5 },
        { key: "hobbies", label: "Hobbies", weight: 5 },
    ];

    const matchResult = useMemo(() => {
        if (!myProfile || !profile) return { percentage: 0, breakdown: [] };

        const percentage = MatchCalculation(myProfile, profile);

        const breakdown = MATCH_RULES.map(rule => {
            const myValue = myProfile[rule.key];
            const otherValue = profile[rule.key];

            let matched = false;

            if (rule.key === "hobbies") {
                const myArr = myValue?.split(",").map(v => v.trim().toLowerCase()) || [];
                const otherArr = otherValue?.split(",").map(v => v.trim().toLowerCase()) || [];
                matched = myArr.some(h => otherArr.includes(h));
            } else {
                matched = myValue && otherValue && myValue === otherValue;
            }

            return { ...rule, matched};
        });

        return { percentage, breakdown };
    }, [myProfile, profile]);

    // 🔥 Sync with modal circle
    useEffect(() => {
        setMatchPercent(matchResult.percentage);
    }, [matchResult.percentage, setMatchPercent]);

    return (
        <div className="match-preferences card p-3">

            <div className="text-center mb-3">
                <h5>Compatibility Score</h5>
                <h2 className="text-success">{matchResult.percentage}%</h2>
            </div>

            <ul className="list-group">
                {matchResult.breakdown.map(item => (
                    <li
                        key={item.key}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>{item.label}</span>
                        {item.matched ? (
                            <FaCheckCircle className="text-success fs-5" />
                        ) : (
                            <FaTimesCircle className="text-danger fs-5" />
                        )}
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default MatchPreferences;