import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <div className="logo_icon">
        <Link to="/dashboard">
          <img
            className="max-w-full h-full"
            src="/data_3137834 (1).png"
            alt="logoImage"
          />
        </Link>
      </div>
    </div>
  );
};

export default Logo;
