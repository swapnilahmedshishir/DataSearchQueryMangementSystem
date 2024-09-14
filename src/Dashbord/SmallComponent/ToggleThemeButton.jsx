import { Button } from "antd";
import { HiSun, HiMoon } from "react-icons/hi";
import PropTypes from "prop-types";

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle_theme_btn">
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiMoon /> : <HiSun />}
      </Button>
    </div>
  );
};

ToggleThemeButton.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ToggleThemeButton;
