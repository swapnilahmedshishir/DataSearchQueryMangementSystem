import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { AppContext } from "../../../Dashbord/SmallComponent/AppContext";
import { FaWhatsapp } from "react-icons/fa6";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoIosMail } from "react-icons/io";

import {
  Dialog,
  useTheme,
  useMediaQuery,
  DialogContentText,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { BsExclamationCircle } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import Pagination from "../../Pagination/Pagination";

const ClientList = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [filteredClientList, setFilteredClientList] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const [open, setOpen] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 10;

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      const res = await fetch("https://bdapis.com/api/v1.2/divisions");
      const data = await res.json();
      setDivisions(data.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  // Fetch districts based on selected division
  const handleDivisionChange = async (divisionName) => {
    setDivision(divisionName);

    try {
      const res = await fetch(
        `https://bdapis.com/api/v1.2/division/${divisionName}`
      );
      const data = await res.json();
      setDistricts(data.data);
      setUpazillas([]);
      handleFilter();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Fetch upazillas based on selected district
  const handleDistrictChange = async (districtName) => {
    setDistrict(districtName);
    try {
      const res = await fetch(
        `https://bdapis.com/api/v1.2/district/${districtName}`
      );
      const data = await res.json();
      setUpazillas(data.data.upazillas);
      // handleFilter();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Fetch data from API
  useEffect(() => {
    axios
      .get(`${state.port}/api/admin/clientlist`)
      .then((result) => {
        if (result.data.Status) {
          setClientList(result.data.Result);
          // pagination
          setPaginatedData(result.data.Result.slice(0, itemsPerPage));
          setFilteredClientList(result.data.Result); // Initially display all data
        } else {
          setErrorMessage(result.data.Error);
        }
      })
      .catch((err) => setErrorMessage(err.message));
  }, [state.port]);

  // Filter clients based on division, district, and upazila
  const handleFilter = (e) => {
    const filteredData = clientList.filter((client) => {
      return client.upazillaName.toLowerCase() === e?.toLowerCase();
    });
    setFilteredClientList(filteredData);
  };

  // Deletion-related functions...
  const handleClickOpen = (id) => {
    setOpen(true);
    setDataDeleteId(id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // data delete and cancel function
  const handleCancel = () => {
    toast.error(`Cancel`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setOpen(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${state.port}/api/admin/clientlist/delete/` + dataDeleteId)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/client");
          setFaqToDelete("Deleted successfully");
          toast.success("Deleted successfully", { autoClose: 5000 });
        } else {
          setFaqToDelete(result.data.Error);
        }
      })
      .catch((err) => setFaqToDelete(err.message));
    setOpen(false);
  };

  const handleSectedDataRefresh = () => {
    // Reset all filters to default empty values
    setDivision("");
    setDistrict("");
    setUpazila("");

    // Reset the filtered client list to show all clients
    setFilteredClientList(clientList);
  };

  // pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(clientList.slice(startIndex, endIndex));
  }, [currentPage, clientList]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="container dashboard_All">
      <ToastContainer />
      <h1 className="dashboard_name">Client List</h1>
      <hr />

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div>
        <div>
          <Link to="/dashboard/client/create">
            <button className="button-62 mb-8" role="button">
              <span>New Client</span>
              <span>
                {" "}
                <HiPlus />
              </span>
            </button>
          </Link>

          <p className="success-message">{faqToDelete}</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-7">
          {/* Division */}
          <div className="col-span-2 inputfield">
            <label htmlFor="division">Division</label>
            <select
              name="division"
              id="division"
              className="text_input_field"
              value={division}
              onChange={(e) => handleDivisionChange(e.target.value)}
            >
              <option value="">Choose Division</option>
              {divisions.map((dv) => (
                <option key={dv.division} value={dv.division}>
                  {dv.division}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="col-span-2 inputfield">
            <label htmlFor="district">District</label>
            <select
              name="district"
              id="district"
              className="text_input_field"
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
            >
              <option value="">Choose District</option>
              {districts.map((dist) => (
                <option key={dist.district} value={dist.district}>
                  {dist.district}
                </option>
              ))}
            </select>
          </div>

          {/* Upazilla */}
          <div className="col-span-2 inputfield">
            <label htmlFor="upazilla">Upazilla</label>
            <select
              name="upazilla"
              id="upazilla"
              className="text_input_field"
              value={upazila}
              onChange={(e) => {
                setUpazila(e.target.value);
                handleFilter(e.target.value);
              }}
            >
              <option value="">Choose Upazilla</option>
              {upazillas &&
                upazillas.map((upa) => (
                  <option key={upa} value={upa}>
                    {upa}
                  </option>
                ))}
            </select>
          </div>
          {/* all sected data refresh  */}
          <div className="col-span-2 place-self-center">
            <button
              className="button-62"
              role="button"
              onClick={() => handleSectedDataRefresh()}
            >
              <span>Data Refresh</span>
            </button>
          </div>
        </div>

        <p className="mb-2 text-xl">
          Total Result = {filteredClientList.length}
        </p>
        {/* Client List Display */}
        <div className="grid gird-cols-1 md:grid-cols-4 gap-5 ">
          {filteredClientList.length > 0 ? (
            filteredClientList.map((cl, index) => (
              <div
                key={index}
                className="client-card p-3 rounded-lg allClinetDataShow"
              >
                <p className="text-center bg-[#0B6211] font-bold text-xl rounded-sm text-white">
                  {cl.unNameBn}
                </p>
                <div className="flex justify-between mx-4 mt-3">
                  <a
                    href={cl.unLinkOne}
                    target="_blank"
                    className="bg-purple-900 p-2 rounded-lg font-medium"
                  >
                    GOV Link
                  </a>
                  <a
                    href={cl.unLinkTwo}
                    target="_blank"
                    className="bg-purple-900 px-5 py-2 rounded-lg font-medium"
                  >
                    Link-2
                  </a>
                </div>
                <div className="my-7 grid grid-cols-3 gap-4 justify-center">
                  <a
                    href={`https://wa.me/${cl.upWhatsappNumber}`}
                    target="_blank"
                    className="bg-purple-900 px-5 py-2 place-self-center  rounded-lg font-medium"
                  >
                    <FaWhatsapp className="text-2xl text-[#30D14E]" />
                  </a>
                  <p
                    className="text-xl bg-purple-900 place-self-center  px-5 py-2 rounded-lg font-medium"
                    onClick={() => window.open(`mailto:${cl.UpEmail}`)}
                  >
                    <IoIosMail className="text-2xl text-[#D65246]" />
                  </p>
                  <p
                    className="text-xl bg-purple-900 place-self-center  px-5 py-2 rounded-lg font-medium"
                    onClick={() => window.open(`tel:${cl.upContactNumber}`)}
                  >
                    <BiSolidPhoneCall className="text-2xl text-[#16AAE1]" />
                  </p>
                </div>
                <div className="flex justify-between mt-7">
                  <Link
                    to={`/dashboard/client/edit/${cl.uuid}`}
                    className="routeLink bg-orange-400 p-2 rounded-lg font-medium"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/dashboard/client/${cl.uuid}`}
                    className="routeLink bg-green-400 p-2 rounded-lg font-medium"
                  >
                    Show
                  </Link>

                  <span
                    onClick={() => handleClickOpen(cl.uuid)}
                    className="actionBtn bg-rose-500 p-2 rounded-lg font-medium cursor-pointer"
                  >
                    Delete
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-7 text-gray-600 col-span-4">
              No clients found.
            </p>
          )}
        </div>
        <Pagination
          totalItems={clientList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle className="text-center">
          <BsExclamationCircle
            style={{
              color: "#F74340",
              fontSize: "100px",
              textAlign: "center",
              width: "100%",
            }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span className="flex justify-center font-bold">
              {" "}
              Are You Sure Want To Delete ?
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientList;
