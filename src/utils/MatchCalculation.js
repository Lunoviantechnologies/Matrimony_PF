export const MatchCalculation = (myProfile, profile) => {
    if (!myProfile || !profile) return 0;

    const MATCH_RULES = [
        { key: "religion", weight: 20 },
        { key: "subCaste", weight: 15 },
        { key: "highestEducation", weight: 15 },
        { key: "sector", weight: 15 },
        { key: "country", weight: 15 },
        { key: "maritalStatus", weight: 10 },
        { key: "habbits", weight: 5 },
        { key: "hobbies", weight: 5 },
    ];

    let score = 0;

    MATCH_RULES.forEach(rule => {
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

        if (matched) score += rule.weight;
    });

    return score;
};