import style from "./Sms.module.scss";
import { useState } from "react";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
// Components
import SingleSms from "../SingleSms/SingleSms";
import MultipleSms from "../MultipleSms/MultipleSms";

export default function Sms() {
  const [selectedButton, setSelectedButton] = useState("single");

  const singleSms = () => {
    setSelectedButton("single");
  };

  const multipleSms = () => {
    setSelectedButton("multiple");
  };

  return (
    <div className={style.container}>
      <Stack
        sx={{ pb: 3, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        justifyContent="center"
        direction={{ xs: "column", sm: "row" }}
        alignItems="stretch"
      >
        <Button
          sx={{
            width: "100%",
            flex: 1,
            color: selectedButton === "single" ? "#fff" : "#4FBA57",
          }}
          size="large"
          variant={selectedButton === "single" ? "contained" : "outlined"}
          onClick={singleSms}
        >
          Single SMS
        </Button>

        <Button
          sx={{
            width: "100%",
            flex: 1,
            color: selectedButton === "multiple" ? "#fff" : "#4FBA57",
          }}
          size="large"
          variant={selectedButton === "multiple" ? "contained" : "outlined"}
          onClick={multipleSms}
        >
          Multiple SMS
        </Button>
      </Stack>

      <Divider />

      <div>{selectedButton === "single" ? <SingleSms /> : <MultipleSms />}</div>
    </div>
  );
}
