import style from "./Dashboard.module.scss";
import { useState, useEffect } from "react";
// React router
import { useNavigate } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
// API
import useGetAllClientsApi from "../../API/useGetAllClientsApi";
import { useDeleteClientApi } from "../../API/useDeleteClientApi";
import { useBulkCreateOrdresApi } from "../../API/useBulkCreateOrdresApi";

// toast
import { toast } from "react-toastify";

const columns = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 50,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 175,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "governorate",
    headerName: "Governorate",
    flex: 1,
    minWidth: 110,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "city",
    headerName: "City",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "telephone",
    headerName: "Telephone",
    flex: 1,
    minWidth: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "telephone2",
    headerName: "Telephone 2",
    flex: 1,
    minWidth: 100,
    sortable: false,
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
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "numberOfItems",
    headerName: "Number Of Items",
    flex: 1,
    minWidth: 150,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "designation",
    headerName: "Designation",
    flex: 1,
    minWidth: 200,
    sortable: false,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "comment",
    headerName: "Comment",
    flex: 1,
    minWidth: 200,
    sortable: false,
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

export default function Dashboard() {
  const { data: AllClients, fetchStatus } = useGetAllClientsApi();
  const {
    mutate,
    isPending,
    isSuccess: isDeleteSuccess,
  } = useDeleteClientApi();
  const {
    mutate: mutateBulkCreateOrdres,
    isPending: isBulkCreateOrdresPending,
    isSuccess: isBulkCreateOrdresSuccess,
  } = useBulkCreateOrdresApi();

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleSelectionChange = (newSelection) => {
    setSelectedRowId(newSelection[0]);
  };

  const navigate = useNavigate();
  const addBtn = () => {
    navigate(`/dashboard/add-client`);
  };

  const editBtn = () => {
    if (selectedRowId) {
      navigate(`/dashboard/edit-client/${selectedRowId}`);
    } else {
      toast.warn("Select client");
    }
  };

  const deleteBtn = () => {
    if (selectedRowId) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete the client?"
      );
      if (confirmDelete) {
        mutate(selectedRowId);
      }
    } else {
      toast.warn("Select client");
    }
  };

  const uploadAll = () => {
    if (AllClients?.length === 0 || AllClients === undefined) {
      toast.warn("No clients found.");
    } else {
      let confirmUpload = window.confirm(
        "Are you sure you want to upload all clients?"
      );
      if (confirmUpload) {
        mutateBulkCreateOrdres();
      }
    }
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Deleted successfully.");
      setSelectedRowId(null);
    }
  }, [isDeleteSuccess]);

  const rows =
    AllClients?.map((client) => ({
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

  return (
    <div className={style.container}>
      {(fetchStatus === "fetching" ||
        isPending ||
        isBulkCreateOrdresPending) && (
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
          color="success"
          variant="outlined"
          onClick={uploadAll}
        >
          Upload All
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="error"
          variant="outlined"
          onClick={deleteBtn}
        >
          Delete
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          color="secondary"
          variant="outlined"
          onClick={editBtn}
        >
          Edit
        </Button>

        <Button
          sx={{ width: "100%", flex: 1 }}
          size="large"
          variant="outlined"
          onClick={addBtn}
        >
          Add
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
