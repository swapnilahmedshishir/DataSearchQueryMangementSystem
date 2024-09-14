import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./Component/AdminLoginPage/AdminLogin";
import Dashboard from "./Dashbord/dashbord";
import PrivateRoute from "./Component/PivateRoute/PrivateRoute";
import MainDashbord from "./Dashbord/MainDashbord/MainDashbord";
// clinet list
import ClientList from "./Component/Routers/ClientList/ClientList";
import CreateClinetList from "./Component/Routers/ClientList/CreateClinetList";
import ShowClinetList from "./Component/Routers/ClientList/ShowClientList";
import EditClinetList from "./Component/Routers/ClientList/EditClientList";

// app provider
import { AppProvider } from "./Dashbord/SmallComponent/AppContext";
import SearchContactNumber from "./Component/Routers/ClientList/SearchConatactNumber";
import SearchUnionName from "./Component/Routers/ClientList/SearchUnionName";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<AdminLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="" element={<MainDashbord />} />

            {/* client list  */}
            <Route path="client" element={<ClientList />} />
            <Route path="contactNumber" element={<SearchContactNumber />} />
            <Route path="unionName" element={<SearchUnionName />} />
            <Route path="client/create" element={<CreateClinetList />} />
            <Route path="client/:id" element={<ShowClinetList />} />
            <Route path="client/edit/:id" element={<EditClinetList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
