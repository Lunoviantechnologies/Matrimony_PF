import serverURL from "../api/server";

export const getProfileImage = (profile) => {
    if (!profile) return "/placeholder_boy.png";

    const formatPhoto = (photo) => {
        if (!photo || typeof photo !== "string") return null;

        photo = photo.trim();
        if (!photo) return null;

        if (photo.includes("/profile-photos/")) {
            return `${serverURL}${photo}`;
        }

        return `${serverURL}/profile-photos/${photo}`;
    };

    // 1️⃣ Main profile photo
    const mainPhoto = formatPhoto(profile.updatePhoto);
    if (mainPhoto) return mainPhoto;

    // 2️⃣ Friend photo
    const friendPhoto = formatPhoto(profile.friendPhoto);
    if (friendPhoto) return friendPhoto;

    // 3️⃣ Chat photo
    const chatPhoto = formatPhoto(profile.photo);
    if (chatPhoto) return chatPhoto;

    // 4️⃣ Fallback placeholder
    return profile.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png";
};