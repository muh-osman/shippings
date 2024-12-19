import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// React router
import { Outlet } from "react-router-dom";

function DrawerAppBar(props) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Outlet */}
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default DrawerAppBar;
