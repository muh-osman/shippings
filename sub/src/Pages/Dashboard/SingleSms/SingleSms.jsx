import style from "./SingleSms.module.scss";
import { useRef, useState, useEffect } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
// Toastify
import { toast } from "react-toastify";
// Api
import { useSendSingleSmsApi } from "../../../API/useSendSingleSmsApi";

export default function SingleSms() {
  const singleFormRef = useRef();
  const [message, setMessage] = useState("");
  const { mutate, isPending, isSuccess } = useSendSingleSmsApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = singleFormRef.current.reportValidity();
    if (!validate) return;

    let formData = new FormData(singleFormRef.current);

    // Get telephone
    const mobile = formData.get("mobile");

    // Regular expression to check for letters
    const hasLetters = /[a-zA-Z]/;

    // Check if telephone contains letters
    if (hasLetters.test(mobile)) {
      toast.warn("Mobile number fields must not contain letters.");
      return; // Prevent form submission
    }

    // Submit data
    mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      //reset form and mobile number input
      setMessage("");
      singleFormRef.current.reset();
    }
  }, [isSuccess]);

  return (
    <div className={style.container}>
      <Avatar
        sx={{
          margin: "auto",
          marginBottom: "0px",
          bgcolor: "transparent",
          color: "#757575",
          width: "100px",
          height: "100px",
        }}
      >
        <PersonIcon sx={{ fontSize: "100px" }} />
      </Avatar>

      <Box
        ref={singleFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: { md: "400px" } }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              fullWidth
              autoFocus
              label="Mobile"
              type="tel"
              name="mobile"
              required
              placeholder="55-555-555"
              disabled={isPending}
              inputProps={{ minLength: 8, maxLength: 8 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+216</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              fullWidth
              label="Message"
              multiline
              rows={4}
              name="message"
              required
              disabled={isPending}
              value={message} // Bind the value to state
              onChange={(e) => setMessage(e.target.value)} // Update state on change
              InputProps={{
                // Display character count
                endAdornment: (
                  <InputAdornment position="end">
                    {message.length}/160
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s", color: "white" }}
        >
          Send
        </LoadingButton>
      </Box>
    </div>
  );
}
