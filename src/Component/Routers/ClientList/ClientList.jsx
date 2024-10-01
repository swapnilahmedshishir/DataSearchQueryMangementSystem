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
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [UpazilaName, setUpazilaName] = useState("");

  const [open, setOpen] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 10;

  // all fack data
  // State
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [error, setError] = useState(null);

  // Fetch divisions from API
  const fetchDivisions = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setDivisions(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const endPoint = "https://bdapi.vercel.app/api/v.1/division";
    fetchDivisions(endPoint);
  }, []);

  // Handle division change
  const handleDivisionChange = async (divisionID) => {
    setDivision(divisionID); // Set the selected division ID
    // find the division name
    const selectedDivision = divisions.find((dv) => dv.id === divisionID);
    if (selectedDivision) {
      setDivisionName(selectedDivision.name); // Set the division name
    }
    try {
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${divisionID}`
      );
      const data = await res.json();
      setDistricts(data.data);
      setUpazillas([]);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle district change
  const handleDistrictChange = async (districtID) => {
    setDistrict(districtID); // Set the selected district ID
    // find the distic name
    const selectedDistictName = districts.find(
      (dist) => dist.id === districtID
    );
    if (selectedDistictName) {
      setDistrictName(selectedDistictName.name); // Set the division name
    }
    try {
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/upazilla/${districtID}`
      );
      const data = await res.json();
      setUpazillas(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  // find the upazila name  handleUpazilaName
  const handleUpazilaName = (upazilaID) => {
    // find the distic name
    const selectedUpazilaID = upazillas.find((up) => up.id === upazilaID);
    if (selectedUpazilaID) {
      setUpazilaName(selectedUpazilaID.name);
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
          setFilteredClientList(result.data.Result);
        } else {
          setErrorMessage(result.data.Error);
        }
      })
      .catch((err) => setErrorMessage(err.message));
  }, [state.port]);

  // Filter clients based on division, district, and upazila
  const handleFilter = (e) => {
    const filteredData = clientList.filter((client) => {
      return (
        client.districtName.toLowerCase() === e?.toLowerCase() ||
        client.upazillaName.toLowerCase() === e?.toLowerCase()
      );
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

  // pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(clientList.slice(startIndex, endIndex));
  }, [currentPage, clientList]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // execl file downlode
  function exportToCSV() {
    let table = document.getElementById("client-table");
    let rows = Array.from(table.rows);
    let csvContent = rows
      .map((row) => {
        return Array.from(row.cells)
          .map((cell) => {
            // Ensure that special characters are handled properly
            return cell.textContent.replace(/,/g, ""); // Remove any commas to avoid breaking CSV format
          })
          .join(",");
      })
      .join("\n");

    // Add BOM (Byte Order Mark) to ensure proper encoding for non-ASCII characters
    let csvBlob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    let link = document.createElement("a");
    let url = URL.createObjectURL(csvBlob);
    link.href = url;
    link.setAttribute("download", "ClientList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container dashboard_All">
      <ToastContainer />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <div className="flex text-right justify-between mt-1">
          <div>
            <Link to="/dashboard/client/create">
              <button className="button-62 mb-8" role="button">
                <span>New Client</span>
                <span>
                  <HiPlus />
                </span>
              </button>
            </Link>
          </div>
          <p className="success-message">{faqToDelete}</p>
          {/* Button to download Excel */}
          {/* <ReactHTMLTableToExcel
            id="export-table-xls-button"
            className="button-62 h-12"
            table="client-table"
            filename="ClientList"
            sheet="ClientData"
            buttonText="Download as Excel"
          /> */}

          <button className="button-62 h-12" onClick={exportToCSV}>
            Download as CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-8 gap-7">
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
                <option key={dv.id} value={dv.id}>
                  {dv.name}
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
              value={district} // Bind to state
              onChange={(e) => {
                handleDistrictChange(e.target.value);
                handleFilter(e.target.value);
              }}
            >
              <option value="">Choose District</option>
              {districts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
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
              value={upazila} // Bind to state
              onChange={(e) => {
                setUpazila(e.target.value);
                handleFilter(e.target.value);
                handleUpazilaName(e.target.value);
              }}
            >
              <option value="">Choose Upazilla</option>
              {upazillas.map((upa) => (
                <option key={upa.id} value={upa.id}>
                  {upa.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="my-7 text-xl">
          Total Result = {filteredClientList.length}
        </p>
        {/* exel table  */}
        <table id="client-table" className="hidden">
          <thead>
            <tr>
              <th>UnionName Name Bangla</th>
              <th>UnionName Name English</th>
              <th>Division</th>
              <th>District</th>
              <th>Upazilla</th>
              <th>WhatsApp</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientList.map((cl, index) => (
              <tr key={index}>
                <td>{cl.unNameBn}</td>
                <td>{cl.unNameEn}</td>
                <td>{divisionName}</td>
                <td>{districtName}</td>
                <td>{UpazilaName}</td>
                <td>{cl.upWhatsappNumber}</td>
                <td>{cl.UpEmail}</td>
                <td>{cl.upContactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Client List Display */}
        <div className="grid gird-cols-1 md:grid-cols-3 gap-5 ">
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
