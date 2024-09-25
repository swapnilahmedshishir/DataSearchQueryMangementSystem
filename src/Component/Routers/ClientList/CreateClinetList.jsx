import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../../Dashbord/SmallComponent/AppContext";
import { IoStarSharp } from "react-icons/io5";
import { Editor } from "@tinymce/tinymce-react";
import * as yup from "yup";

const CreateClientList = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  // State
  const [errorMessage, setErrorMessage] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [error, setError] = useState(null);

  // all fack data

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

  // Fetch districts based on division ID
  const handleDivisionChange = async (divisionID) => {
    try {
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${divisionID}`
      );
      const data = await res.json();
      setDistricts(data.data);
      setUpazillas([]); // Reset upazillas when division changes
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch upazillas based on district ID
  const handleDistrictChange = async (districtID) => {
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

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      division: "",
      district: "",
      upazilla: "",
      unNameEn: "",
      unNameBn: "",
      unLinkOne: "",
      unLinkTwo: "",
      upSecretaryName: "",
      UpEmail: "",
      upContactNumber: "",
      upWhatsappNumber: "",
      gender: "",
      unionInfo: "",
    },
    validationSchema: yup.object({
      division: yup.string().required("Please select a division"),
      district: yup.string().required("Please select a district"),
      upazilla: yup.string().nullable(),
      unionInfo: yup
        .string()
        .max(1000, "Union Info must be under 1000 characters")
        .nullable(),
      unNameEn: yup
        .string()
        .min(3, "Union name must be at least 3 characters")
        .max(299, "Union name must be under 299 characters")
        .required("Union name is required"),
      unNameBn: yup
        .string()
        .min(3, "Union name must be at least 3 characters")
        .max(299, "Union name must be under 299 characters")
        .required("Union name is required"),
      UpEmail: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      upContactNumber: yup
        .string()
        .matches(/^\d{11}$/, "Contact number should be 11 digits")
        .required("Contact number is required"),
      upWhatsappNumber: yup
        .string()
        .matches(/^\d{11}$/, "Whatsapp number should be 11 digits")
        .nullable(),
      unLinkOne: yup
        .string()
        .url("Invalid URL format (use https://)")
        .required("Link 1 is required"),
      unLinkTwo: yup
        .string()
        .url("Invalid URL format (use https://)")
        .nullable(),
      upSecretaryName: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(150, "Name must be under 150 characters")
        .required("Secretary name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(
          `${state.port}/api/admin/clientlist/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const result = await response.json();
        if (result.Status) {
          toast.success("Client created successfully", {
            position: "top-right",
            autoClose: 5000,
          });
          setTimeout(() => {
            navigate("/dashboard/client");
          }, 1500);
        }
      } catch (error) {
        setErrorMessage(`Error: ${error}`);
      }
      resetForm();
    },
  });

  return (
    <div className="container mx-auto px-4 py-6 dashboard_All">
      <ToastContainer />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form_div">
        <form onSubmit={formik.handleSubmit} className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-7">
            {/* Division */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="division">
                Division <IoStarSharp className="reqired_symbole" />
              </label>
              {formik.touched.division && formik.errors.division && (
                <span className="error-message">{formik.errors.division}</span>
              )}
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
                  <option key={dv.id} value={dv.id}>
                    {dv.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="district">
                District <IoStarSharp className="reqired_symbole" />
              </label>
              {formik.touched.district && formik.errors.district && (
                <span className="error-message">{formik.errors.district}</span>
              )}
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
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazilla */}
            <div className="md:col-span-2 inputfield">
              <label htmlFor="upazilla">
                Upazilla <IoStarSharp className="reqired_symbole" />
              </label>
              {formik.touched.upazilla && formik.errors.upazilla && (
                <span className="error-message">{formik.errors.upazilla}</span>
              )}
              <select
                name="upazilla"
                id="upazilla"
                className="text_input_field"
                value={formik.values.upazilla}
                onChange={formik.handleChange}
              >
                <option value="">Choose Upazilla</option>
                {upazillas.map((upa) => (
                  <option key={upa.id} value={upa.name}>
                    {upa.name}
                  </option>
                ))}
              </select>
            </div>
            {/* up Name  english*/}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="unNameEn">
                union name english <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.unNameEn && formik.errors.unNameEn && (
                <span className="error-message">{formik.errors.unNameEn}</span>
              )}
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
              <label htmlFor="unNameBn">
                union name bangla <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.unNameBn && formik.errors.unNameBn && (
                <span className="error-message">{formik.errors.unNameBn}</span>
              )}
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
              <label htmlFor="unLinkOne">
                union link 1 <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.unLinkOne && formik.errors.unLinkOne && (
                <span className="error-message">{formik.errors.unLinkOne}</span>
              )}
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

              {formik.touched.unLinkTwo && formik.errors.unLinkTwo && (
                <span className="error-message">{formik.errors.unLinkTwo}</span>
              )}
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
              <label htmlFor="upSecretaryName">
                Union secretary name
                <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.upSecretaryName &&
                formik.errors.upSecretaryName && (
                  <span className="error-message">
                    {formik.errors.upSecretaryName}
                  </span>
                )}
              <input
                className="text_input_field"
                type="text"
                name="upSecretaryName"
                onChange={formik.handleChange}
                placeholder="Write union secretary name"
                value={formik.values.upSecretaryName}
                required
              />
            </div>

            {/* up secretary Email Address  */}
            <div className="md:col-span-3 inputfield">
              <label htmlFor="UpEmail">
                email address <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.UpEmail && formik.errors.UpEmail && (
                <span className="error-message">{formik.errors.UpEmail}</span>
              )}
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
              <label htmlFor="upContactNumber">
                contact Number <IoStarSharp className="reqired_symbole" />
              </label>

              {formik.touched.upContactNumber &&
                formik.errors.upContactNumber && (
                  <span className="error-message">
                    {formik.errors.upContactNumber}
                  </span>
                )}
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

              {formik.touched.upWhatsappNumber &&
                formik.errors.upWhatsappNumber && (
                  <span className="error-message">
                    {formik.errors.upWhatsappNumber}
                  </span>
                )}
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

              {formik.touched.gender && formik.errors.gender && (
                <span className="error-message">{formik.errors.gender}</span>
              )}
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

              {formik.touched.unionInfo && formik.errors.unionInfo && (
                <span className="error-message">{formik.errors.unionInfo}</span>
              )}
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
            <div className="md:col-span-6 inputFiledMiddel">
              <button
                type="submit"
                className="button-62 cetificate_image_AddBtn"
              >
                ADD Client
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClientList;
