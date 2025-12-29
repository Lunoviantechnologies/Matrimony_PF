import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ContactSupport = () => {

  const location = useLocation();
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  if (role?.[0].toUpperCase() === "ADMIN") return null;
  if (!isLoggedIn) return null;
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  };

  useEffect(() => {
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/69326d495e697c197ed8fe0d/1jbmflqh3";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ContactSupport;