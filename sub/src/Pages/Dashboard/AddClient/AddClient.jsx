import style from "./AddClient.module.scss";
// React
import { useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
// toast
import { toast } from "react-toastify";
// Api
import { useAddClientApi } from "../../../API/useAddClientApi";
// governorate and city file
import { governorateOptions } from "../../../Utils/locations";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function AddClient() {
  // handle governorate and city
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");

  const handleGovernorateChange = (event) => {
    setGovernorate(event.target.value);
    setCity(""); // Reset city when governorate changes
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const selectedGovernorate = governorateOptions.find(
    (g) => g.value === governorate
  );
  const cityOptions = selectedGovernorate ? selectedGovernorate.cities : [];

  //
  const addFormRef = useRef();

  const { mutate, isPending } = useAddClientApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;

    let formData = new FormData(addFormRef.current);

    // Get telephone and telephone2 values
    const telephone = formData.get("telephone");
    const telephone2 = formData.get("telephone2");

    // Append Designation to formData with key 'item'
    let Designation = formData.get("designation");
    formData.append("item", Designation);

    // Regular expression to check for letters
    const hasLetters = /[a-zA-Z]/;

    // Check if telephone or telephone2 contains letters
    if (hasLetters.test(telephone) || hasLetters.test(telephone2)) {
      toast.warn("Telephone fields must not contain letters.");
      return; // Prevent form submission
    }

    // Submit data
    mutate(formData);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>
        <h1>Add Client</h1>
      </div>
      <Box
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              name="name"
              required
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="Governorate"
              name="governorate"
              value={governorate}
              onChange={handleGovernorateChange}
              disabled={isPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              {governorateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              label="City"
              name="city"
              value={city}
              onChange={handleCityChange}
              required
              disabled={isPending || governorate === ""}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem value={""}></MenuItem>
              {cityOptions.map((cityOption) => (
                <MenuItem key={cityOption} value={cityOption}>
                  {cityOption}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              type="text"
              name="address"
              required
              disabled={isPending}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Telephone"
              type="tel"
              name="telephone"
              required
              disabled={isPending}
              inputProps={{ minLength: 8, maxLength: 8 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Telephone 2 (optional)"
              type="tel"
              name="telephone2"
              disabled={isPending}
              inputProps={{ minLength: 8, maxLength: 8 }}
            />
          </Grid>

          <Root>
            <Divider sx={{ paddingLeft: "24px", marginTop: "24px" }}>
              Product
            </Divider>
          </Root>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              name="price"
              required
              disabled={isPending}
              inputProps={{ min: 0, max: 999 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Number Of Items"
              type="number"
              name="numberOfItems"
              defaultValue={1}
              required
              disabled={isPending}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              select
              fullWidth
              required
              label="Designation"
              name="designation"
              defaultValue={""}
              disabled={isPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem value={"Tisane Anti Constipation F"}>Tisane Anti Constipation F</MenuItem>
              <MenuItem value={"Tisane Anti Constipation N"}>Tisane Anti Constipation N</MenuItem>
              <MenuItem value={"Tisane Anti Constipation Z"}>Tisane Anti Constipation Z</MenuItem>
              <MenuItem value={"Tisane Anti Constipation S"}>Tisane Anti Constipation S</MenuItem>
              <MenuItem value={"Tisane Anti Constipation A"}>Tisane Anti Constipation A</MenuItem>
            </TextField>
          </Grid>

          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              label="Item"
              type="text"
              name="item"
              required
              disabled={isPending}
            />
          </Grid> */}

          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              label="Number Of Exchanges (optional)"
              type="number"
              name="numberOfExchanges"
              disabled={isPending}
              inputProps={{ min: 0 }}
            />
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment (optional)"
              type="text"
              name="comment"
              disabled={isPending}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s", color: "#fff" }}
        >
          Add
        </LoadingButton>
      </Box>
    </div>
  );
}
