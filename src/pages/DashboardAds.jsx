import React, { useEffect, useState } from "react";
import { FaCrown, FaUserEdit, FaCamera, FaBolt } from "react-icons/fa";
import "../styleSheets/DashboardAds.css";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";
import { useDispatch, useSelector } from "react-redux";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myProfile, id } = useSelector((state) => state.profiles);

  useEffect(() => {
    if (id) {
      dispatch(fetchMyProfile(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % adsData.length);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  const ad = adsData[index];

  const handleClick = (type) => {
    if (type === "premium") {
      navigate("/dashboard/premium");
    } else if (type === "profile") {
      navigate("/dashboard/editProfile");
    } else if (type === "boost") {
      navigate("/dashboard/matches/newmatches");
    } else if (type === "photo") {
      navigate("/dashboard/editProfile");
    }
  };

  return (
    <div className="dashboard-ads-wrapper">
      <div className={`promo-card promo-${ad.type}`}>
        <div className="promo-left">
          {ad.type === "premium" && <FaCrown size={36} />}
          {ad.type === "profile" && <FaUserEdit size={36} />}
          {ad.type === "boost" && <FaBolt size={36} />}
        </div>

        <div className="promo-right">
          <h4>{ad.title}</h4>
          <p>{ad.desc}</p>
          <button onClick={() => handleClick(ad.type)}>{ad.cta}</button>
        </div>
      </div>

      {/* 🔹 Separate Photo Card */}
      {!myProfile?.updatePhoto && (
        <div className="promo-card promo-photo">
          <div className="promo-left bg-secondary">
            <FaCamera size={36} />
          </div>

          <div className="promo-right">
            <h4>Add a Profile Photo</h4>
            <p>
              Profiles with photos receive significantly more interest.
              Upload a clear photo to improve your matches.
            </p>
            <button onClick={() => handleClick("photo")} >
              Add Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAds;
