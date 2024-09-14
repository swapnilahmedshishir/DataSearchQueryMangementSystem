import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { AppContext } from "../../../Dashbord/SmallComponent/AppContext";

const ShowClinetList = () => {
  const { state } = useContext(AppContext);
  // Router
  const { id } = useParams();
  // state
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientInfo, setClientInfo] = useState({});

  //Data Fetching
  useEffect(() => {
    axios
      .get(`${state.port}/api/admin/clientlist/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setClientInfo({
            ...clientInfo,
            division: result.data.Result[0].divisionName,
            district: result.data.Result[0].districtName,
            upazilla: result.data.Result[0].upazillaName,
            unNameEn: result.data.Result[0].unNameEn,
            unNameBn: result.data.Result[0].unNameBn,
            unLinkOne: result.data.Result[0].unLinkOne,
            unLinkTwo: result.data.Result[0].unLinkTwo,
            upSecretaryName: result.data.Result[0].upSecretaryName,
            UpEmail: result.data.Result[0].UpEmail,
            upContactNumber: result.data.Result[0].upContactNumber,
            upWhatsappNumber: result.data.Result[0].upWhatsappNumber,
            gender: result.data.Result[0].gender,
            unionInfo: result.data.Result[0].unionInfo,
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => setErrorMessage(err));
  }, [id, state.port]);
  return (
    <div className="container mx-auto px-4 py-6 dashboard_All">
      <div>
        <Link
          to="/dashboard/client"
          className="route_link flex items-center text-xl"
        >
          {" "}
          <IoMdArrowRoundBack className="mr-3" /> Back
        </Link>
      </div>
      <h1 className="dashboard_name">Client Details </h1>
      <hr />
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="from_div">
        <div className="text-right">
          <Link to={`/dashboard/client/edit/${id}`}>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              type="button"
            >
              Edit
            </button>
          </Link>
        </div>

        <br />
        <div
          key={clientInfo.uuid}
          className="grid_container_div overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-solid divide-gray-200">
            <tbody className="bg-[#353181] divide-solid  divide-y divide-gray-200 text-2xl">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union name english </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.unNameEn}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union name bangla </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.unNameBn}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union upazilla </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.upazilla}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union district </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.district}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union division</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.division}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union Link One </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  <a href={clientInfo.unLinkOne} target="_blank">
                    {clientInfo.unLinkOne}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union Link two </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  <a href={clientInfo.unLinkTwo} target="_blank">
                    {clientInfo.unLinkTwo}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union secretary Name </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.upSecretaryName}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union secretary Email </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.UpEmail}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union secretary Number </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.upContactNumber}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union secretary WhatsApp Number </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.upWhatsappNumber}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span> Union secretary gender </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  {clientInfo.gender}
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                  <span>Union Infomation</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(clientInfo.unionInfo),
                    }}
                  ></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowClinetList;
