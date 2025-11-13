import React from "react";
import "../styleSheets/profileCard.css"; 

const profiles = [
  {
    id: 1,
    name: "Aarushi Sharma",
    age: 24,
    job: "Software Engineer",
    education: "B.Tech",
    location: "Hyderabad",
    community: "Hindu | Brahmin",
    height: "5'4\"",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    id: 2,
    name: "Arjun Reddy",
    age: 27,
    job: "Business Analyst",
    education: "MBA",
    location: "Bangalore",
    community: "Hindu | Reddy",
    height: "5'9\"",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  },
  {
    id: 3,
    name: "Sneha Patil",
    age: 25,
    job: "Doctor",
    education: "MBBS",
    location: "Pune",
    community: "Hindu | Maratha",
    height: "5'5\"",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    id: 4,
    name: "Rohit Verma",
    age: 29,
    job: "Civil Engineer",
    education: "M.Tech",
    location: "Delhi",
    community: "Hindu | Kayastha",
    height: "6'0\"",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  },
  {
    id: 5,
    name: "Aditi Singh",
    age: 23,
    job: "HR Manager",
    education: "MBA",
    location: "Lucknow",
    community: "Hindu | Rajput",
    height: "5'3\"",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
  },
  {
    id: 6,
    name: "Vishal Kumar",
    age: 28,
    job: "Software Developer",
    education: "B.Tech",
    location: "Chennai",
    community: "Hindu | Yadav",
    height: "5'10\"",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 7,
    name: "Meera Nair",
    age: 26,
    job: "Fashion Designer",
    education: "BA Fashion",
    location: "Kochi",
    community: "Hindu | Nair",
    height: "5'5\"",
    image: "https://tse3.mm.bing.net/th/id/OIP.6GF79-gQ_49Ze3nGrUrsyAHaLH?pid=Api&P=0&h=180"
  },
  {
    id: 8,
    name: "Karan Mehta",
    age: 30,
    job: "Entrepreneur",
    education: "MBA",
    location: "Mumbai",
    community: "Hindu | Jain",
    height: "5'11\"",
    image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg"
  },
  {
    id: 9,
    name: "Priya Das",
    age: 24,
    job: "Teacher",
    education: "B.Ed",
    location: "Kolkata",
    community: "Hindu | Bengali",
    height: "5'2\"",
    image: "https://tse1.mm.bing.net/th/id/OIP.BnFxTdGXnR3aYi6NeQm41wHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 10,
    name: "Sandeep Gupta",
    age: 27,
    job: "Bank Officer",
    education: "B.Com",
    location: "Ahmedabad",
    community: "Hindu | Vaishya",
    height: "5'8\"",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  }
];

const ProfileCards = () => {
  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Top Matches For You</h2>

      <div className="profile-cards-wrapper">
        {profiles.map((profile) => (
          <div className="profile-card" key={profile.id}>
            <div className="image-box">
              <img src={profile.image} alt={profile.name} className="profile-img" />
            </div>

            <div className="profile-details">
              <h3>{profile.name}</h3>
              <span>{profile.age} yrs • {profile.height}</span>
              <p>{profile.job} • {profile.education}</p>
              <p>{profile.location}</p>
              <p>{profile.community}</p>

              <button className="connect-btn">View Profile</button>
              <button className="connect-btn">Send Request</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCards;
