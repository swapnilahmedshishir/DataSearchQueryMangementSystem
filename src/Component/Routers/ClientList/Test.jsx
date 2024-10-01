import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { AppContext } from "../../../Dashbord/SmallComponent/AppContext";
import Pagination from "../../Pagination/Pagination";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ClientListData = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [filteredClientList, setFilteredClientList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${state.port}/api/admin/clientlist`)
      .then((result) => {
        if (result.data.Status) {
          setClientList(result.data.Result);
          setPaginatedData(result.data.Result.slice(0, itemsPerPage));
          setFilteredClientList(result.data.Result);
        } else {
          setErrorMessage(result.data.Error);
        }
      })
      .catch((err) => setErrorMessage(err.message));
  }, [state.port]);

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
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div>
        <div className="flex justify-between mb-4">
          <Link to="/dashboard/client/create">
            <button className="button-62" role="button">
              New Client
            </button>
          </Link>
          {/* Button to download Excel */}
          <ReactHTMLTableToExcel
            id="export-table-xls-button"
            className="button-62"
            table="client-table"
            filename="ClientList"
            sheet="ClientData"
            buttonText="Download as Excel"
          />
        </div>

        <table id="client-table" className="hidden">
          <thead>
            <tr>
              <th>Client Name</th>
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
                <td>{cl.districtName}</td>
                <td>{cl.upazillaName}</td>
                <td>{cl.upWhatsappNumber}</td>
                <td>{cl.UpEmail}</td>
                <td>{cl.upContactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
          {filteredClientList.map((cl, index) => (
            <div
              key={index}
              className="client-card p-3 rounded-lg allClinetDataShow"
            >
              {/* Client details and other logic */}
            </div>
          ))}
        </div>

        <Pagination
          totalItems={clientList.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ClientListData;
