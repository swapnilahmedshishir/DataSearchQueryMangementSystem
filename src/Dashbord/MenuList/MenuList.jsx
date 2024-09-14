import { Menu } from "antd";
import { Link } from "react-router-dom";
import { MdContacts } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import PropTypes from "prop-types";
import { MdContactPhone } from "react-icons/md";
import { RiUserSearchFill } from "react-icons/ri";

const MenuList = ({ darkTheme }) => {
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu_bar"
    >
      <Menu.Item key="home" icon={<RxDashboard className="dashbord_icon" />}>
        <Link to="/dashboard" className="route_link">
          Dashbord
        </Link>
      </Menu.Item>
      <Menu.Item
        key="contactNumber"
        icon={<MdContactPhone className="dashbord_icon" />}
      >
        <Link to="/dashboard/contactNumber" className="route_link">
          Search Contact
        </Link>
      </Menu.Item>

      <Menu.Item
        key="unionName"
        icon={<RiUserSearchFill className="dashbord_icon" />}
      >
        <Link to="/dashboard/unionName" className="route_link">
          Search Union name
        </Link>
      </Menu.Item>

      <Menu.Item
        key="contactCategory"
        icon={<MdContacts className="dashbord_icon" />}
      >
        <Link to="/dashboard/client" className="route_link">
          Client
        </Link>
      </Menu.Item>
    </Menu>
  );
};

MenuList.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
};

export default MenuList;
