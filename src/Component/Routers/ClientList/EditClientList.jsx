import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { AppContext } from "../../../Dashbord/SmallComponent/AppContext";

const EditClinetList = () => {
  const { state } = useContext(AppContext);
  // Router
  const { id } = useParams();
  const navigate = useNavigate();

  //state
  const [clientInfo, setClientInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [error, setError] = useState(null);

  // Fetch divisions from API using fetch
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
    const endPoint = "https://bdapis.com/api/v1.2/divisions";
    fetchDivisions(endPoint);
  }, []);

  // Fetch districts based on selected division using fetch
  const handleDivisionChange = async (divisionName) => {
    try {
      const res = await fetch(
        `https://bdapis.com/api/v1.2/division/${divisionName}`
      );
      const data = await res.json();
      setDistricts(data.data);
      setUpazillas([]); // Clear upazillas when division changes
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch upazillas based on selected district using fetch
  const handleDistrictChange = async (districtName) => {
    try {
      const res = await fetch(
        `https://bdapis.com/api/v1.2/district/${districtName}`
      );
      const data = await res.json();
      setUpazillas(data.data.upazillas);
    } catch (error) {
      setError(error.message);
    }
  };

  // fetch data
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
  }, [state.port, id]);

  console.log(clientInfo);

  // use fromik method
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      division: clientInfo.division || "",
      district: clientInfo.district || "",
      upazilla: clientInfo.upazilla || "",
      unNameEn: clientInfo.unNameEn || "",
      unNameBn: clientInfo.unNameBn || "",
      unLinkOne: clientInfo.unLinkOne || "",
      unLinkTwo: clientInfo.unLinkTwo || "",
      upSecretaryName: clientInfo.upSecretaryName || "",
      UpEmail: clientInfo.UpEmail || "",
      upContactNumber: clientInfo.upContactNumber || "",
      upWhatsappNumber: clientInfo.upWhatsappNumber || "",
      gender: clientInfo.gender || "",
      unionInfo: clientInfo.unionInfo || "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.put(
          `${state.port}/api/admin/clientlist/edit/${id}`,
          values
        );
        if (response.data.Status) {
          setErrorMessage(null);
          toast.success(`Appointment Edit successfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          const delay = 1500; // 1.5 seconds delay
          const timer = setTimeout(() => {
            navigate("/dashboard/client");
          }, delay);
          // Clear the timer if the component unmounts before the delay is complete
          return () => clearTimeout(timer);
        }
      } catch (error) {
        setErrorMessage(`${error}`);
      }

      resetForm();
    },
  });

  return (
    <div className="container mx-auto px-4 py-6 dashboard_All">
      <ToastContainer />
      <h5>
        <Link to="/dashboard/client" className="route_link">
          {" "}
          <IoMdArrowRoundBack /> Back
        </Link>
      </h5>
      <h1 className="dashboard_name">Edit client list</h1>
      <hr />
      {/* <p>{formattedValue}</p> */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {/* form start */}
      {/* ++++++========part 1 =======++++++++ */}
      <div className="from_div">
        <form
          onSubmit={formik.handleSubmit}
          className="p-4"
          encType="multipart/form-data"
        >
          <div className="grid grid-col-1 md:grid-cols-6 gap-7">
            {/* Division */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="division">Division</label>

              <select
                name="division"
                id="division"
                className="text_input_field"
                value={formik.values.division}
                onChange={(e) => {
                  formik.setFieldValue("division", e.target.value);
                  handleDivisionChange(e.target.value);
                }}
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
            <div className="md:col-span-2 inputfield">
              <label htmlFor="district">District</label>

              <select
                name="district"
                id="district"
                className="text_input_field"
                value={formik.values.district}
                onChange={(e) => {
                  formik.setFieldValue("district", e.target.value);
                  handleDistrictChange(e.target.value);
                }}
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
            <div className="md:col-span-2 inputfield">
              <label htmlFor="upazilla">Upazilla</label>

              <select
                name="upazilla"
                id="upazilla"
                className="text_input_field"
                value={formik.values.upazilla}
                onChange={formik.handleChange}
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
            {/* up Name  english*/}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="unNameEn">union name english</label>

              <input
                className="text_input_field"
                type="text"
                name="unNameEn"
                onChange={formik.handleChange}
                placeholder="Write union name english"
                value={formik.values.unNameEn}
              />
            </div>

            {/* up Name  bangla*/}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="unNameBn">union name bangla</label>

              <input
                className="text_input_field"
                type="text"
                name="unNameBn"
                onChange={formik.handleChange}
                placeholder="Write union name bangla"
                value={formik.values.unNameBn}
              />
            </div>

            {/* up linke1 */}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="unLinkOne">union link 1</label>

              <input
                className="text_input_field"
                type="text"
                name="unLinkOne"
                onChange={formik.handleChange}
                placeholder="Give union link 1"
                value={formik.values.unLinkOne}
              />
            </div>
            {/* up linke2 */}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="unLinkTwo">union link 2 </label>

              <input
                className="text_input_field"
                type="text"
                name="unLinkTwo"
                onChange={formik.handleChange}
                placeholder="Give union link 2"
                value={formik.values.unLinkTwo}
              />
            </div>

            {/* up secretary(সচিব) Name  */}
            <div className="inputfield md:col-span-3">
              <label htmlFor="upSecretaryName">Union secretary name</label>

              <input
                className="text_input_field"
                type="text"
                name="upSecretaryName"
                onChange={formik.handleChange}
                placeholder="Write union secretary name"
                value={formik.values.upSecretaryName}
              />
            </div>

            {/* up secretary Email Address  */}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="UpEmail">email address</label>

              <input
                className="text_input_field"
                type="text"
                name="UpEmail"
                onChange={formik.handleChange}
                placeholder="Write email address"
                value={formik.values.UpEmail}
              />
            </div>

            {/* up secretary contact Number  */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="upContactNumber">contact Number</label>

              <input
                className="text_input_field"
                type="text"
                name="upContactNumber"
                onChange={formik.handleChange}
                placeholder="Write contact number"
                value={formik.values.upContactNumber}
              />
            </div>
            {/* up secretary Whatsapp Number  */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="upWhatsappNumber">WhatsApp Number</label>

              <input
                className="text_input_field"
                type="text"
                name="upWhatsappNumber"
                onChange={formik.handleChange}
                placeholder="Write Whatsapp number"
                value={formik.values.upWhatsappNumber}
              />
            </div>

            {/* up secretary gender */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="gender">gender</label>

              <select
                name="gender"
                id="gender"
                className="text_input_field"
                value={formik.values.gender}
                onChange={(e) => formik.setFieldValue("gender", e.target.value)}
              >
                <option value="" selected>
                  Choose gender
                </option>
                <option value="male" selected>
                  Male
                </option>
                <option value="female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* union info note */}
            <div className="md:col-span-6 inputfield">
              <h5 className="text-xl font-extrabold">union info note </h5>

              <Editor
                id="unionInfo"
                apiKey="heppko8q7wimjwb1q87ctvcpcpmwm5nckxpo4s28mnn2dgkb"
                textareaName="unionInfo"
                initialValue="Write union infomation"
                onEditorChange={(content) => {
                  formik.setFieldValue("unionInfo", content);
                }}
                init={{
                  height: 350,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo |fullscreen blocks|" +
                    "bold italic forecolor fontsize |code link image preview| alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | table | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size: 1rem;  color: #3f3e3e; }",
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="col-md-12 inputFiledMiddel">
              <button
                type="submit"
                className="button-62 cetificate_image_AddBtn "
                role="button"
              >
                ADD Clent
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClinetList;
