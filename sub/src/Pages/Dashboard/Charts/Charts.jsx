import style from "./Charts.module.scss";
import { useState, useMemo } from "react";
// MUI
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Divider } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import LinearProgress from "@mui/material/LinearProgress";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
//
import dayjs from "dayjs";
// API
import useGetAnalyticsApi from "../../../API/useGetAnalyticsApi";

export default function Charts() {
  // State for Start Date and End Date
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Use the analytics API with the selected dates
  const { data: analyticsData, fetchStatus } = useGetAnalyticsApi(
    startDate ? startDate.format("YYYY-MM-DD") : null,
    endDate ? endDate.format("YYYY-MM-DD") : null
  );

  // Chart 1
  const chart1Data = useMemo(
    () =>
      Object.entries(analyticsData?.allCounts || {}).map(([key, value]) => ({
        order: key,
        value: isNaN(Number(value)) ? 0 : Number(value),
      })),
    [analyticsData?.allCounts]
  );

  // Chart 2
  const chart2Data = useMemo(
    () =>
      Object.entries(analyticsData?.statusCounts || {}).map(([key, value]) => ({
        order: key,
        Livré: Number(value?.["Livré"] || 0),
        Retour: Number(value?.["Retour reçu"] || 0),
      })),
    [analyticsData?.statusCounts]
  );

  // Chart 3
  const locationPercentageData = useMemo(() => {
    return chart2Data.map((item) => {
      const total = item.Livré + item.Retour;
      return {
        location: item.order,
        data:
          total > 0
            ? [
                {
                  id: 0,
                  value: Math.round((item.Livré / total) * 100),
                  label: "Livré",
                  color: "#27a844",
                },
                {
                  id: 1,
                  value: Math.round((item.Retour / total) * 100),
                  label: "Retour reçu",
                  color: "#d44837",
                },
              ]
            : [
                { id: 0, value: 0, label: "Livré" },
                { id: 1, value: 0, label: "Retour reçu" },
              ],
      };
    });
  }, [chart2Data]);

  // Chart 4
  const pieChartData = useMemo(() => {
    const totalOrders =
      (Number(analyticsData?.totalLivréCount) || 0) +
      (Number(analyticsData?.totalRetourReçu) || 0);

    return [
      {
        id: 1,
        value: Number(analyticsData?.totalLivréCount || 0),
        label: "Livré",
        color: "#27a844",
      },
      {
        id: 2,
        value: Number(analyticsData?.totalRetourReçu || 0),
        label: "Retour reçu",
        color: "#d44837",
      },
    ].map((item) => ({
      ...item,
      percentage:
        totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0,
    }));
  }, [analyticsData]);

  // Chart Setting
  const chartSetting = {
    xAxis: [{ label: "All Uploaded Orders (in selected date range)" }],
    height: 400,
  };

  const setting = {
    yAxis: [{ label: "Order" }],
    height: 500,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  const pieParams = {
    height: 200,
    margin: { right: 5 },
    slotProps: { legend: { hidden: true } },
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <div className={style.datePickerContainer}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Start Date"
              format="DD/MM/YYYY"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={dayjs()}
            />
            <DatePicker
              label="End Date"
              format="DD/MM/YYYY"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              maxDate={dayjs()}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <Divider />

      {analyticsData && (
        <div>
          {/* Chart 1 */}
          {chart1Data.length > 0 && (
            <BarChart
              dataset={chart1Data}
              yAxis={[{ scaleType: "band", dataKey: "order" }]}
              series={[{ dataKey: "value", valueFormatter: (v) => v }]}
              layout="horizontal"
              grid={{ vertical: true }}
              {...chartSetting}
            />
          )}

          <Divider sx={{ margin: "24px 0" }} />

          {/* Chart 2 */}
          {chart2Data.length > 0 && (
            <BarChart
              dataset={chart2Data}
              xAxis={[{ scaleType: "band", dataKey: "order" }]}
              series={[
                { dataKey: "Livré", label: "Livré", color: "#27a844" },
                {
                  dataKey: "Retour",
                  label: "Retour reçu",
                  color: "#d44837",
                },
              ]}
              {...setting}
            />
          )}

          <Divider sx={{ margin: "24px 0" }} />

          {/* Chart 3 */}
          <Stack direction="row" width="100%" textAlign="center" spacing={2}>
            {locationPercentageData.map((locationData) => (
              <Box key={locationData.location} flexGrow={1}>
                <Typography>{locationData.location}</Typography>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      data: locationData.data,
                      highlightScope: { faded: "global", trigger: "none" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  {...pieParams}
                />
              </Box>
            ))}
          </Stack>

          <Divider sx={{ margin: "24px 0" }} />

          {/* Chart 4 */}
          <Typography sx={{ textAlign: "center" }}>
            All Uploaded Orders (in selected date range)
          </Typography>
          {pieChartData.some((item) => item.value > 0) && (
            <PieChart
              series={[
                {
                  data: pieChartData,
                  arcLabel: (item) => `${item.value} (${item.percentage}%)`,
                  highlightScope: { faded: "global", trigger: "none" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={400}
            />
          )}
        </div>
      )}
    </div>
  );
}
