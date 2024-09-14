import { AiOutlineLogout } from "react-icons/ai";

const logout = ({ handleLogout }) => {
  return (
    <div className="Logout_navigation" onClick={handleLogout}>
      <div className="logout_link button">
        <div className="logout_img">
          <AiOutlineLogout className="logout_icon" />
        </div>
        <div className="logout_txt">LOGOUT</div>
      </div>
    </div>
  );
};

export default logout;
