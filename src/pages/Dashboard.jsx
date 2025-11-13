import React from "react"; 
import "../styleSheets/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard_body">
      {/* ====== Matches Section ====== */}
      <section className="matchSection">
        <h2 style={{ color: "#695019", marginBottom: 15 }}>
          New Profile Matches
        </h2>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((i) => (
            <div className="matchSection_map" key={i}>
              <img src={`https://picsum.photos/80?random=${i + 30}`} alt={`Profile ${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(80%)", }} />
              <div
                style={{ position: "absolute", bottom: 15, left: 0, right: 0, textAlign: "center", color: "#fff", }}>
                <div style={{ fontWeight: "bold", fontSize: 18 }}>Julia Ann</div>
                <div style={{ fontSize: 14 }}>New York • 22 Years old</div>
              </div>
              {/* Online Indicator */}
              <div
                style={{
                  position: "absolute", top: 10, right: 10, width: 14, height: 14, borderRadius: "50%", background: "#2ECC71",
                  border: "2px solid #fff",
                }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Request Section ====== */}
      <section
        style={{
          background: "#fff",
          borderRadius: 15,
          padding: 24,
          marginBottom: 32,
          boxShadow: "0 1px 6px #ddd",
        }}
      >
        <h2 style={{ color: "#695019", marginBottom: 15 }}>Interest Requests</h2>

        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          {["New requests", "Accepted", "Denied"].map((text, i) => (
            <button
              key={i}
              style={{
                fontWeight: "bold",
                color: i === 0 ? "green" : "#000",
                background: i === 0 ? "#e8fff2" : "#F8F6F1",
                border: "none",
                padding: "10px 20px",
                borderRadius: 25,
              }}
            >
              {text}
            </button>
          ))}
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 22,
              background: "#fff",
              padding: 10,
              borderRadius: 10,
              boxShadow: "0 1px 6px #ddd",
            }}
          >
            <img
              src={`https://picsum.photos/110?random=${i}`}
              alt="User"
              style={{ width: 110, height: 90, borderRadius: 15, marginRight: 22, objectFit: "cover",}}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 20 }}>John Smith</div>
              <div style={{ margin: "6px 0" }}>
                City: <b>Illinois</b> • Age: <b>21</b> • Height: <b>5.7</b> • Job:{" "}
                <b>Engineer</b>
              </div>
              <div style={{ color: "#7A6B4E" }}>
                Request on: 10:30 AM, 18 August 2024
              </div>
              <button
                style={{
                  marginTop: 12,
                  borderRadius: 8,
                  padding: "5px 18px",
                  border: "1px solid #BDB197",
                  background: "#fff",
                }}
              >
                View full profile
              </button>
            </div>
            <div>
              <button
                style={{
                  marginRight: 8,
                  background: "#117A65",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 18px",
                }}
              >
                Accept
              </button>
              <button
                style={{
                  background: "#F25C5C",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 18px",
                }}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ====== Plan and Chat Section ====== */}
      <section style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Plan Details */}
        <div className="planSection">
          <h3 style={{ color: "#695019" }}>Plan Details</h3>
          <img
            src="https://img.icons8.com/emoji/96/gift-emoji.png"
            alt="Plan"
            style={{ margin: "20px auto" }}
          />
          <p style={{ fontWeight: "bold" }}>Plan Name: Standard</p>
          <p>Validity: 6 Months</p>
        </div>

        {/* Recent Chat List */}
        <div className="chatList">
          <h3 style={{ color: "#695019", marginBottom: 20 }}>
            Recent Chat List
          </h3>

          {[1, 2, 3, 4].map((i) => (
            <div className="chatList_map" key={i}>
              <img
                src={`https://picsum.photos/60?random=${i + 50}`}
                alt="User"
                style={{ width: 60, height: 60, borderRadius: 15, objectFit: "cover", marginRight: 15, }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#5C4218", }}>
                  Julia Ann
                </div>
                <div style={{ color: "#8A6F47" }}>Illinois, United States</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

// import React from "react";

// const Dashboard = () => {
//   return (
//     <div
//       style={{
//         fontFamily: "serif",
//         background: "#FAF8F2",
//         minHeight: "100vh",
//         padding: 20,
//       }}
//     >
//       {/* ====== Matches Section ====== */}
//       <section
//         style={{
//           background: "#fff",
//           borderRadius: 15,
//           padding: 24,
//           marginBottom: 32,
//           boxShadow: "0 1px 6px #ddd",
//         }}
//       >
//         <h2 style={{ color: "#695019", marginBottom: 15 }}>
//           New Profile Matches
//         </h2>

//         <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div
//               key={i}
//               style={{
//                 width: 180,
//                 height: 220,
//                 borderRadius: 18,
//                 overflow: "hidden",
//                 position: "relative",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//             >
//               <img
//                 src={`https://picsum.photos/80?random=${i + 30}`}
//                 alt={`Profile ${i}`}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   filter: "brightness(80%)",
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 15,
//                   left: 0,
//                   right: 0,
//                   textAlign: "center",
//                   color: "#fff",
//                 }}
//               >
//                 <div style={{ fontWeight: "bold", fontSize: 18 }}>Julia Ann</div>
//                 <div style={{ fontSize: 14 }}>New York • 22 Years old</div>
//               </div>
//               {/* Online Indicator */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 10,
//                   right: 10,
//                   width: 14,
//                   height: 14,
//                   borderRadius: "50%",
//                   background: "#2ECC71",
//                   border: "2px solid #fff",
//                 }}
//               ></div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ====== Request Section ====== */}
      

//       {/* ====== Plan and Chat Section ====== */}
//       <section style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
//         {/* Plan Details */}
//         <div
//           style={{
//             flex: 1,
//             background: "#fff",
//             borderRadius: 18,
//             padding: 24,
//             minWidth: 280,
//             boxShadow: "0 1px 6px #ddd",
//             textAlign: "center",
//           }}
//         >
//           <h3 style={{ color: "#695019" }}>Plan Details</h3>
//           <img
//             src="https://img.icons8.com/emoji/96/gift-emoji.png"
//             alt="Plan"
//             style={{ margin: "20px auto" }}
//           />
//           <p style={{ fontWeight: "bold" }}>Plan Name: Standard</p>
//           <p>Validity: 6 Months</p>
//         </div>

//         {/* Recent Chat List */}
//         <div
//           style={{
//             flex: 1,
//             background: "#fff",
//             borderRadius: 18,
//             padding: 24,
//             minWidth: 320,
//             boxShadow: "0 1px 6px #ddd",
//           }}
//         >
//           <h3 style={{ color: "#695019", marginBottom: 20 }}>
//             Recent Chat List
//           </h3>

//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: 18,
//                 borderBottom: "1px solid #eee",
//                 paddingBottom: 15,
//               }}
//             >
//               <img
//                 src={`https://picsum.photos/60?random=${i + 50}`}
//                 alt="User"
//                 style={{
//                   width: 60,
//                   height: 60,
//                   borderRadius: 15,
//                   objectFit: "cover",
//                   marginRight: 15,
//                 }}
//               />
//               <div>
//                 <div
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: 18,
//                     color: "#5C4218",
//                   }}
//                 >
//                   Julia Ann
//                 </div>
//                 <div style={{ color: "#8A6F47" }}>Illinois, United States</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;