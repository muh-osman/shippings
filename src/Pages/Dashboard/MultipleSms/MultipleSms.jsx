import style from "./MultipleSms.module.scss";
import { useRef, useState, useEffect } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
// Toastify
import { toast } from "react-toastify";
// Api
import { useSendMultipleSmsApi } from "../../../API/useSendMultipleSmsApi";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function MultipleSms() {
  const multipleFormRef = useRef();
  const { mutate, isPending, isSuccess } = useSendMultipleSmsApi();

  const [message, setMessage] = useState("");
  const [mobileNumbers, setMobileNumbers] = useState([]);

  // Handle add number
  const handleAddNumber = () => {
    const mobileInput = document.querySelector('input[name="mobile"]');
    const number = mobileInput.value;

    if (!number) {
      toast.warn("Please enter a mobile number");
      return;
    }

    // Check if number already exists
    if (mobileNumbers.includes(number)) {
      toast.warn("This number is already in the list");
      return;
    }

    // Check if number length 8
    if (number.length !== 8) {
      toast.warn("Mobile number must be 8 digits long");
      return;
    }

    // Regular expression to check for letters
    const hasLetters = /[a-zA-Z]/;
    if (hasLetters.test(number)) {
      toast.warn("Mobile number must not contain letters");
      return;
    }

    setMobileNumbers((prev) => [number, ...prev]);
    mobileInput.value = ""; // Clear input after adding
  };

  // Handle delete number
  const handleDeleteNumber = (indexToDelete) => {
    setMobileNumbers((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = multipleFormRef.current.reportValidity();
    if (!validate) return;

    // check if mobileNumbers is empty
    if (mobileNumbers.length === 0) {
      toast.warn("Please add at least one mobile number");
      return;
    }

    let formData = new FormData(multipleFormRef.current);

    formData.append("mobileNumbers", mobileNumbers.join(","));

    // Submit data
    mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      //reset form and mobile numbers
      setMessage("");
      setMobileNumbers([]);
      const mobileInput = document.querySelector('input[name="mobile"]');
      mobileInput.value = "";
      multipleFormRef.current.reset();
    }
  }, [isSuccess]);

  return (
    <Box sx={{ flexGrow: 1 }}>
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
        <GroupAddIcon sx={{ fontSize: "75px" }} />
      </Avatar>

      <Grid container spacing={10}>
        <Grid item xs={12} md={6}>
          <Box
            ref={multipleFormRef}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ m: "auto", mt: 3 }}
          >
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  sx={{ backgroundColor: "#fff" }}
                  autoFocus
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff", mt: 3, mb: 2 }}
              fullWidth
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddNumber}
                      edge="end"
                      disabled={isPending}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Demo>
            <List
              dense={true}
              sx={{ border: "1px solid #0000002d", borderRadius: "4px" }}
            >
              {mobileNumbers.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    color: "text.secondary",
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No phone numbers added yet
                  </Typography>
                </Box>
              ) : (
                mobileNumbers.map((number, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        disabled={isPending}
                        onClick={() => handleDeleteNumber(index)}
                        sx={{
                          "&:hover": {
                            color: isPending ? "inherit" : "error.main", // Prevent hover effect when disabled
                          },
                          transition: "color 0.2s",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{
                      "&:hover": {
                        bgcolor: isPending ? "transparent" : "action.hover", // Prevent hover effect when disabled
                      },
                      transition: "background-color 0.2s",
                      opacity: isPending ? 0.5 : 1, // Reduce opacity when disabled
                      pointerEvents: isPending ? "none" : "auto", // Prevent interaction when disabled
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PhoneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          +216 {number}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {`Number ${mobileNumbers.length - index}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}
