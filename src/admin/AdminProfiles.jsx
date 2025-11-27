import React from "react";
import { Edit, Trash2 } from "lucide-react";
import "../styleSheets/AdminProfiles.css";

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
    name: "Rahul Sharma",
    age: 26,
    job: "Software Developer",
    education: "B.Tech",
    location: "Chennai",
    community: "Hindu | Brahmin",
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
    image: "https://tse3.mm.bing.net/th/id/OIP.6GF79-gQ_49Ze3nGrUrsyAHaLH"
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
    image: "https://tse1.mm.bing.net/th/id/OIP.BnFxTdGXnR3aYi6NeQm41wHaHa"
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
  },
  {
    id: 11,
    name: "Kavita Rao",
    age: 25,
    job: "Interior Designer",
    education: "Diploma",
    location: "Mangalore",
    community: "Hindu | Gowda",
    height: "5'4\"",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    id: 12,
    name: "Vikram Singh",
    age: 29,
    job: "Cyber Security Expert",
    education: "B.Tech",
    location: "Noida",
    community: "Hindu | Rajput",
    height: "5'11\"",
    image: "https://tse3.mm.bing.net/th/id/OIP.7Q8E1vH-mpx_1WUvDd3n4QAAAA"
  }
];

const AdminProfiles = () => {
  return (
    <div className="profile-main-container">
      <h2 className="profile-title">Admin – Manage All Profiles</h2>

      <div className="profile-cards-wrapper">
        {profiles.map((profile) => (
          <div className="profile-card" key={profile.id}>
            
            {/* Profile Image */}
            <div className="image-box">
              <img src={profile.image} alt={profile.name} className="profile-img" />
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <h3>{profile.name}</h3>
              <span>{profile.age} yrs • {profile.height}</span>
              <p>{profile.job} • {profile.education}</p>
              <p>{profile.location}</p>
              <p>{profile.community}</p>

              {/* Admin Action Buttons */}
              <div className="admin-actions">
                <button className="admin-btn edit">
                  <Edit size={16} /> Edit
                </button>

                <button className="admin-btn delete">
                  <Trash2 size={16} /> Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfiles;
