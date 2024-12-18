import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from './Context/AuthContext'; // for PIN
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// MUI theme
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// React cookie
import { CookiesProvider } from "react-cookie";
// React query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#4FBA57",
    },
    // ... other colors
  },
  // ... other theme options
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={defaultTheme}>
    <CookiesProvider>
      <QueryClientProvider client={qc}>
        <ToastContainer />
        <ScopedCssBaseline>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ScopedCssBaseline>
      </QueryClientProvider>
    </CookiesProvider>
  </ThemeProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
