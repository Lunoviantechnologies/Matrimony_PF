import React, { useState } from "react";

const MatchesImageCarousel = ({ profile, isPremiumUser, onUpgrade }) => {
    const images = [profile.updatePhoto, profile.updatePhoto1, profile.updatePhoto2, profile.updatePhoto3, profile.updatePhoto4].filter(Boolean);
    const [index, setIndex] = useState(0);

    const locked = !isPremiumUser && index > 0;

    const next = () => { setIndex(i => (i + 1) % images.length);};
    const prev = () => { setIndex(i => (i - 1 + images.length) % images.length) };

    return (
        <div className="carousel">

            <img
                src={images[index] ? images[index] : profile.gender === "Female" ? "/placeholder_girl.png" : "/placeholder_boy.png"}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className={locked ? "blur-image" : ""}
            />

            {locked && (
                <div className="premium-overlay" onClick={onUpgrade}>
                    🔒 Upgrade to Premium
                </div>
            )}

            {images.length > 1 && (
                <>
                    <button className="nav left" onClick={prev}>‹</button>
                    <button className="nav right" onClick={next}>›</button>
                </>
            )}
        </div>
    );
};

export default MatchesImageCarousel;