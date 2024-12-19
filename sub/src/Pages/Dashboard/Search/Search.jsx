import { useNavigate } from "react-router-dom"; // Import useNavigate
import style from "./Search.module.scss";
// MUI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search"; // Import your custom icon
// Custom Hook
import useGetAllClientsPhoneNumberApi from "../../../API/useGetAllClientsPhoneNumberApi";

export default function Search() {
  const { data, fetchStatus } = useGetAllClientsPhoneNumberApi();
  const navigate = useNavigate(); // Initialize the navigate function

  // Extract telephone numbers from the data
  const phoneNumbers = data
    ? data.map((client) => ({ id: client.id, telephone: client.telephone }))
    : [];

  // Handle phone number selection
  const handlePhoneNumberChange = (event, value) => {
    if (value) {
      // Navigate to the desired route with the selected phone number's id
      navigate(`${process.env.PUBLIC_URL}/dashboard/order/${value.id}`);
    }
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Autocomplete
        sx={{ width: 300 }}
        disablePortal
        options={phoneNumbers} // Use the extracted phone numbers
        getOptionLabel={(option) => option.telephone} // Display the telephone number
        renderInput={(params) => (
          <TextField
            {...params}
            label="Telephone"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),

              classes: {
                root: style.inputRoot, // Apply custom root styles
              },
            }}
          />
        )}
        // Use the id as the key for each option
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.telephone}
          </li>
        )}
        onChange={handlePhoneNumberChange} // Add the onChange handler
      />
    </div>
  );
}
