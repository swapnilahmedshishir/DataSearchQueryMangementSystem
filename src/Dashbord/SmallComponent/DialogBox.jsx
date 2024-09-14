import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BsExclamationCircle } from "react-icons/bs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const DialogBox = () => {
  // all state
  const [open, setOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState();
  // matrial dialog box
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // diolog box open and cloge function
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // data delete and cancel function
  const handleCancel = () => {
    setOpen(false);
  };
  const handleDelete = (img) => {
    if (img) {
      axios
        .delete(`https://api.tojoglobal.com/api/admin/certificate/${img.uuid}`)
        .then((result) => {
          if (result.data.Status) {
            setCertificateToDelete(`${img.imageTitle} deleted successfully`);
          } else {
            setCertificateToDelete(result.data.Error);
          }
        })
        .catch((err) => console.error(err));
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title " className="icon_div">
          <div style={{ textAlign: "center" }}>
            <BsExclamationCircle className="icon" />
            <h3 style={{ paddingTop: "20px" }}>Are You sure? </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure delete the &quot;Certificate&quot; Image
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} style={{ color: "#E16565" }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus style={{ color: "#E16565" }}>
            Yes,delete it!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogBox;
