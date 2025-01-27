import style from "./UploadedTable.module.scss";
import { useState, useEffect } from "react";
// React router
// import { useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAllUploadedClientsApi from "../../../API/useGetAllUploadedClientsApi";
import { useCheckStatusApi } from "../../../API/useCheckStatusApi";
// toast
import { toast } from "react-toastify";

export default function Uploaded() {
  const getStatusColor = (status) => {
    const statusColors = {
      "En attente": { color: "#fec107" },
      "En cours": { color: "#20a8d8" },
      "Livré": { color: "#27a844" },
      "Echange": { color: "purple" },
      "Retour Expéditeur": { color: "#d44837" },
      "Supprimé": { color: "black" },
      "Rtn client/agence": { color: "#d44837" },
      "Au magasin": { color: "navy" },
      "Rtn dépôt": { color: "#63c2de" },
      "A vérifier": { color: "#fec107" },
      "Retour reçu": { color: "#d44837" },
      "Rtn définitif": { color: "#f86c6b" },
      "Demande d'enlèvement": { color: "cyan" },
      "Demande d'enlèvement assignée": { color: "magenta" },
      "En cours d’enlèvement": { color: "coral" },
      "Enlevé": { color: "#4dbd73" },
      "Demande d'enlèvement annulé": { color: "lightgray" },
      "Retour assigné": { color: "lightblue" },
      "Retour en cours d'expédition": { color: "lightgreen" },
      "Retour enlevé": { color: "darkviolet" },
      "Retour Annulé": { color: "#d44837" },
    };

    return statusColors[status] || { color: "#757575" }; // Default color for unknown status
  };

  const columns = [
    {
      field: "barCode",
      headerName: "Barcode",
      flex: 1,
      minWidth: 125,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => {
        const statusStyle = getStatusColor(params.value);
        return params.value ? (
          <div style={statusStyle}>{params.value}</div>
        ) : (
          <div style={{ color: "#757575" }}>N/A</div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "governorate",
      headerName: "Governorate",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "telephone",
      headerName: "Telephone",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "telephone2",
      headerName: "Telephone 2",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => {
        return params.value ? (
          params.value
        ) : (
          <div style={{ color: "#757575" }}>N/A</div>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "numberOfItems",
      headerName: "Number Of Items",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => {
        return params.value ? (
          params.value
        ) : (
          <div style={{ color: "#757575" }}>N/A</div>
        );
      },
    },
    // {
    //   field: "item",
    //   headerName: "Item",
    //   flex: 1,
    //   minWidth: 200,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return params.value ? (
    //       params.value
    //     ) : (
    //       <div style={{ color: "#757575" }}>N/A</div>
    //     );
    //   },
    // },
    // {
    //   field: "numberOfExchanges",
    //   headerName: "Number Of Exchanges",
    //   flex: 1,
    //   minWidth: 175,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return params.value ? (
    //       params.value
    //     ) : (
    //       <div style={{ color: "#757575" }}>N/A</div>
    //     );
    //   },
    // },
  ];

  const { data: AllClients, fetchStatus } = useGetAllUploadedClientsApi();
  const {
    mutate: mutateCheckStatus,
    isPending: isCheckStatusPending,
    isSuccess: isCheckStatusSuccess,
  } = useCheckStatusApi();

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleSelectionChange = (newSelection) => {
    setSelectedRowId(newSelection[0]);
  };

  const rows =
    AllClients?.map((client) => ({
      barCode: client?.barCode,
      status: client?.status,
      id: client?.id,
      name: client?.name,
      governorate: client?.governorate,
      city: client?.city,
      address: client?.address,
      telephone: client?.telephone,
      telephone2: client?.telephone2,
      price: client?.price,
      designation: client?.designation,
      numberOfItems: client?.numberOfItems,
      comment: client?.comment,
      item: client?.item,
      numberOfExchanges: client?.numberOfExchanges,
    })) || [];

  // Color repeated phone numbers
  // Step 1: Identify repeated phone numbers
  const getRepeatedPhoneNumbers = (rows) => {
    const phoneCount = {};
    rows.forEach((row) => {
      const phone = row.telephone;
      if (phone) {
        phoneCount[phone] = (phoneCount[phone] || 0) + 1;
      }
    });
    return Object.keys(phoneCount).filter((phone) => phoneCount[phone] > 1);
  };

  // Step 2: Get repeated phone numbers
  const repeatedPhones = getRepeatedPhoneNumbers(rows);

  // Step 3: Define getRowClassName function
  const getRowClassName = (params) => {
    if (repeatedPhones.includes(params.row.telephone)) {
      return style.repeatedPhone; // Apply the CSS class for repeated phone numbers
    }
    return "";
  };

  // Responsive table
  const [containerWidth, setContainerWidth] = useState(
    window.innerWidth < 600 ? window.innerWidth - 48 : "100%"
  );

  const updateContainerWidth = () => {
    if (window.innerWidth < 600) {
      setContainerWidth(window.innerWidth - 48);
    } else {
      setContainerWidth("100%");
    }
  };

  useEffect(() => {
    // Set initial width
    updateContainerWidth();

    // Update width on window resize
    window.addEventListener("resize", updateContainerWidth);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  const checkStatus = () => {
    if (selectedRowId) {
      let dataId = { id: selectedRowId };
      mutateCheckStatus(dataId);
    } else {
      toast.warn("Select client");
    }
  };

  return (
    <div className={style.container}>
      {(fetchStatus === "fetching" || isCheckStatusPending) && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Stack
        sx={{ pb: 3, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        justifyContent="center"
        direction={{ xs: "column", sm: "row" }}
        alignItems="stretch"
      >
        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          variant="outlined"
          onClick={checkStatus}
        >
          Check status
        </Button>
      </Stack>

      <div
        className={style.datagrid_container}
        style={{
          width: containerWidth, // Set width dynamically
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableMultipleRowSelection
          // disableColumnFilter // Disable filtering
          // disableColumnSort // Disable sorting
          // disableMultipleColumnSorting // Disable multiple column sorting
          // disableColumnMenu // Hide column menu
          getRowClassName={getRowClassName}
          onRowSelectionModelChange={handleSelectionChange}
          style={{ width: "100%", height: "100%", overflowX: "auto" }}
        />
      </div>
    </div>
  );
}
