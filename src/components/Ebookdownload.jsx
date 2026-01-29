import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import '../styleSheets/Ebookdownload.css'

const EbookDownload = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    mobile: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onSuccess();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onSuccess]);
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.company || !form.email || !form.mobile) {
    alert("Please fill all details");
    return;
  }

  try {
    const response = await fetch(
      "/ebooks/Vivah_Jeevan_Premium_Spiritual_Matrimony_eBook.pdf"
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Vivah-Jeevan-Spiritual-Matrimony-eBook.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
    onSuccess();
  } catch {
    alert("Could not download PDF");
  }
};

  return (
    <div className="ebook-overlay" onClick={onSuccess}>
      <div
        className="ebook-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button className="ebook-close" onClick={onSuccess}>
          <FaTimes />
        </button>

        <h3>Download E-Book</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <button type="submit" className="navAuthBtn">
            Submit & Download
          </button>
        </form>
      </div>
    </div>
  );
};

export default EbookDownload;
