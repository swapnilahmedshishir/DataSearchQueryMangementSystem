import { Outlet, useNavigate } from "react-router-dom";
import { Button, Layout, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import ToggleThemeButton from "./SmallComponent/ToggleThemeButton";
import { useContext, useState } from "react";
import { Content, Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import Logout from "./SmallComponent/logout";
import axios from "axios";
import Logo from "./SmallComponent/logo";
import MenuList from "./MenuList/MenuList";
import Clock from "./SmallComponent/Clock";
import { AppContext } from "./SmallComponent/AppContext";

const Dashboard = () => {
  const { state } = useContext(AppContext);
  // handle logout function
  const anvigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get(`${state.port}/api/admin/logout`).then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        anvigate("/");
        location.reload("/");
      }
    });
  };

  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleClick = () => {
    toggleCollapsed();
  };
  return (
    <>
      <Layout>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          theme={darkTheme ? "dark" : "light"}
          className={`sidebar`}
        >
          <Logo />

          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Logout handleLogout={handleLogout} />
            <Button
              type="text"
              onClick={handleClick}
              className="toggle"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            />
            <Clock />
          </Header>

          <Content className="main_router">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
