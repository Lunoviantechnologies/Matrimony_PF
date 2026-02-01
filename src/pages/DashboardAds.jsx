import React, { useEffect, useState } from "react";
import { FaCrown, FaUserEdit } from "react-icons/fa";
import "../styleSheets/DashboardAds.css";
import { useNavigate } from "react-router-dom";

const adsData = [
  {
    title: "Improve your profile",
    desc: "Add your professional details to get better responses",
    cta: "Complete profile",
    type: "profile"
  },
  {
    title: "Upgrade to Premium",
    desc: "Unlock chats, photos and contact details",
    cta: "Upgrade now",
    type: "premium"
  },
  {
    title: "Boost your visibility",
    desc: "Get highlighted and appear on top of matches",
    cta: "Boost profile",
    type: "boost"
  }
];

const DashboardAds = () => {

  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % adsData.length);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  const ad = adsData[index];

 const handleClick = () => {

  if (ad.type === "premium") {
    navigate("/dashboard/premium");
  }

  else if (ad.type === "profile") {
    navigate("/dashboard/editProfile");
  }

  else if (ad.type === "boost") {
    navigate("/dashboard/matches/newmatches");
  }

};

  return (
    <div className={`promo-card promo-${ad.type}`}>
      <div className="promo-left">
        {ad.type === "premium" && <FaCrown size={36} />}
        {ad.type === "profile" && <FaUserEdit size={36} />}
        {ad.type === "boost" && <FaUserEdit size={36} />}
      </div>

      <div className="promo-right">
        <h4>{ad.title}</h4>
        <p>{ad.desc}</p>
        <button onClick={handleClick}>{ad.cta}</button>
      </div>
    </div>
  );
};

export default DashboardAds;
