import React from "react";
import "../styleSheets/requestCSS/profileRequest.css";

const acceptedUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 26,
    city: "Hyderabad",
    image: "/mnt/data/PHOTO-2025-11-25-14-05-01.jpg"
  },
  {
    id: 2,
    name: "Anita Reddy",
    age: 24,
    city: "Bangalore",
    image: "/mnt/data/PHOTO-2025-11-25-14-05-01.jpg"
  }
];

const Accepted = () => {
  return (
    <div className="received-container">
      {acceptedUsers.map((user) => (
        <div className="received-card" key={user.id}>
          
          <div className="left-section">
            <img src={user.image} alt="profile" className="profile-img" />

            <div>
              <h3 className="name">{user.name}</h3>
              <p className="details">
                Age: {user.age} • City: {user.city}
              </p>
            </div>
          </div>

          <div className="btn-section">
            <button className="accept">Message</button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Accepted;
