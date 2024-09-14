import DashboardCard from "./Card/CountCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../SmallComponent/AppContext";

const MainDashbord = () => {
  const { state } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  // start
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalNews, setTotalNews] = useState(0);

  useEffect(() => {
    clinetCount();
  }, []);

  const clinetCount = () => {
    axios.get(`${state.port}/api/admin/client-count`).then((result) => {
      if (result.data.Status) {
        setTotalNews(result.data.Result[0].totalClient);
      } else {
        setErrorMessage(result.data.Error);
      }
    });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard_name">Welcome to Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <Link to="/dashboard/client" className="text-decoration-none">
            <DashboardCard title="Union" count={totalNews} />
          </Link>
        </div>
        <div>
          <Link
            to="/dashboard/teamMember"
            className="text-decoration-none"
          ></Link>
        </div>
      </div>{" "}
    </div>
  );
};

export default MainDashbord;
