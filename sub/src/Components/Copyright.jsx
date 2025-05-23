import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        component={RouterLink}
        to={`${process.env.PUBLIC_URL}/`}
        onMouseOver={(e) => (e.target.style.color = "#4FBA57")}
        onMouseOut={(e) => (e.target.style.color = "inherit")}
      >
        First Delivery
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
