import style from "./EditClient.module.scss";
// React
import { useEffect, useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
// toast
import { toast } from "react-toastify";
// Api
import useGetOneClientDataApi from "../../../API/useGetOneClientDataApi";
import { useEditClientApi } from "../../../API/useEditClientApi";
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

export default function EditClient() {
  const addFormRef = useRef();

  const {
    data: client,
    fetchStatus,
    isSuccess,
    isPending: isFetchCientPending,
  } = useGetOneClientDataApi();
  const { mutate, isPending } = useEditClientApi();

  const [clientData, setClientData] = useState({
    name: "",
    governorate: "",
    city: "",
    address: "",
    telephone: "",
    telephone2: "",
    price: "",
    designation: "",
    numberOfItems: "",
    comment: "",
    item: "",
    numberOfExchanges: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setClientData({
        name: client.name ?? "",
        governorate: client.governorate ?? "",
        city: client.city ?? "",
        address: client.address ?? "",
        telephone: client.telephone ?? "",
        telephone2: client.telephone2 ?? "",
        price: client.price ?? "",
        designation: client.designation ?? "",
        numberOfItems: client.numberOfItems ?? "",
        comment: client.comment ?? "",
        item: client.item ?? "",
        numberOfExchanges: client.numberOfExchanges ?? "",
      });
    }
  }, [isSuccess, client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the governorate is changed, reset the city value
    if (name === "governorate") {
      setClientData((prevData) => ({
        ...prevData,
        [name]: value,
        city: "", // Reset city when governorate changes
      }));
    } else {
      setClientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

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

    mutate(formData);
  };

  // Get the selected governorate and its corresponding cities
  const selectedGovernorate = governorateOptions.find(
    (g) => g.value === clientData.governorate
  );
  const cityOptions = selectedGovernorate ? selectedGovernorate.cities : [];

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div className={style.title}>
        <h1>Edit Client</h1>
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
              value={clientData.name}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
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
              value={clientData.governorate}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              SelectProps={{
                MenuProps: {
                  disableScrollLock: true,
                },
              }}
            >
              <MenuItem value={""}></MenuItem>
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
              type="text"
              name="city"
              required
              value={clientData.city}
              onChange={handleInputChange}
              disabled={
                isPending ||
                isFetchCientPending ||
                clientData.governorate === ""
              }
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
              value={clientData.address}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Telephone"
              type="tel"
              name="telephone"
              required
              value={clientData.telephone}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              inputProps={{ minLength: 8, maxLength: 8 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Telephone 2 (optional)"
              type="tel"
              name="telephone2"
              value={clientData.telephone2}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
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
              value={clientData.price}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              inputProps={{ min: 0, max: 999 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Number Of Items"
              type="number"
              name="numberOfItems"
              required
              value={clientData.numberOfItems}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              fullWidth
              label="Designation"
              name="designation"
              select
              required
              value={clientData.designation}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
            >
              <MenuItem value={"Rhedol F"}>Rhedol F</MenuItem>
              <MenuItem value={"Rhedol N"}>Rhedol N</MenuItem>
              <MenuItem value={"Rhedol Z"}>Rhedol Z</MenuItem>
              <MenuItem value={"Rhedol S"}>Rhedol S</MenuItem>
              <MenuItem value={"Rhedol A"}>Rhedol A</MenuItem>
            </TextField>
          </Grid>

          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              label="Item"
              type="text"
              name="item"
              required
              value={clientData.item}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
            />
          </Grid> */}

          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              label="Number Of Exchanges (optional)"
              type="number"
              name="numberOfExchanges"
              value={clientData.numberOfExchanges}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
              inputProps={{ min: 0 }}
            />
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment (optional)"
              type="text"
              name="comment"
              value={clientData.comment}
              onChange={handleInputChange}
              disabled={isPending || isFetchCientPending}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          disabled={isFetchCientPending}
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s", color: "#fff" }}
        >
          Edit
        </LoadingButton>
      </Box>
    </div>
  );
}
