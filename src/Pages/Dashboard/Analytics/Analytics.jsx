import style from "./Analytics.module.scss";
import { useRef } from "react";
// React router
// import { Link as RouterLink } from "react-router-dom";
// Mui
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
// API
import { useCheckPinApi } from "../../../API/useCheckPinApi";
// Context
import { useAuth } from "../../../Context/AuthContext";
//
import Charts from "../Charts/Charts";

export default function Analytics() {
  const formRef = useRef();

  const { mutate, isPending } = useCheckPinApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    const data = new FormData(e.currentTarget);
    mutate(data);
  };

  const { isAuthenticated, setIsAuthenticated } = useAuth(); // for PIN auth

  return (
    <div className={style.container}>
      {!isAuthenticated ? (
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Avatar
              sx={{
                margin: "auto",
                marginBottom: "8px",
                backgroundColor: "#757575",
              }}
            >
              <PasswordIcon />
            </Avatar>
            <Box
              ref={formRef}
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3, minWidth: "300px" }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="PIN"
                    name="pin_code"
                    type="text"
                    autoFocus
                    required
                    disabled={isPending}
                    sx={{
                      backgroundColor: "#fff",
                      minWidth: {
                        xs: "100%",
                        sm: "350px",
                      },
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
                sx={{ mt: 3, mb: 2, transition: "0.1s", color: "#fff" }}
              >
                Enter
              </LoadingButton>
            </Box>
          </Box>
        </Container>
      ) : (
        <Charts />
      )}
    </div>
  );
}
