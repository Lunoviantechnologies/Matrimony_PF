import React from "react";
import "../styleSheets/requestCSS/profileRequest.css";
const rejectedUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 26,
    city: "Hyderabad",
    image: "https://static.vecteezy.com/system/resources/thumbnails/029/663/882/small/adorable-baby-with-vibrant-clothing-in-a-playful-pose-ai-generative-photo.jpg",
  },
  {
    id: 2,
    name: "Anita Reddy",
    age: 24,
    city: "Bangalore",
    image: "https://static.vecteezy.com/system/resources/thumbnails/029/663/882/small/adorable-baby-with-vibrant-clothing-in-a-playful-pose-ai-generative-photo.jpg",
  }
];

const Rejected = () => {
  return (
    <div className="received-container">
      {rejectedUsers.map((user) => (
        <div className="received-card" key={user.id}>

          <div className="left-section">
            <div className="img-box">
              <img src={user.image} alt="profile" className="profile-img" />
            </div>

            <div className="text-section">
              <h3 className="name">{user.name}</h3>
              <p className="details">Age: {user.age}</p>
              <p className="details">City: {user.city}</p>
              <p className="details" style={{ color: "#d62828", fontWeight: 600 }}>
                Rejected
              </p>
            </div>
          </div>

          <div className="btn-section">
            <button className="accept">Restore</button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Rejected;
