import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./../../Dashbord/SmallComponent/AppContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { state } = useContext(AppContext);

  axios.defaults.withCredentials = true;
  //state
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${state.port}/api/admin/adminlogin`, values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative h-full loginPage">
      <div className="loginForm w-3/6 bg-[#060044] py-[3.5rem] px-[1.2rem] border-solid border-[1px] border-[#f5deb3] border-2xl">
        <h2 className="text-center text-3xl font-bold text-white">
          Login Admin
        </h2>
        <br />
        <div className="text-red-800">{error && error}</div>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong className="text-white">Email:</strong>
            </label>
            <br />
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Admin Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong className="text-white">Password:</strong>
            </label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="input input-bordered w-full"
            />
          </div>
          <button className="custombtn">Log in</button>
          <div className="mb-1">
            <input
              type="checkbox"
              name="tick"
              id="tick"
              className="mt-2 text-white"
            />
            <label htmlFor="password" className="text-white">
              You are Agree with terms & conditions
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
