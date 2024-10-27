import style from "./Order.module.scss";
import { useEffect, useState } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
// API
import useGetOrderDetailsApi from "../../../API/useGetOrderDetailsApi";

export default function Order() {
  const { data, fetchStatus } = useGetOrderDetailsApi();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-GB", options).replace(",", " at");
  };

   // Status color mapping
   const statusColors = {
    "En attente": "#fec107",
    "En cours": "#20a8d8",
    "Livré": "#27a844",
    "Echange": "purple",
    "Retour Expéditeur": "#d44837",
    "Supprimé": "black",
    "Rtn client/agence": "#d44837",
    "Au magasin": "navy",
    "Rtn dépôt": "#63c2de",
    "A vérifier": "#fec107",
    "Retour reçu": "#d44837",
    "Rtn définitif": "#f86c6b",
    "Demande d'enlèvement": "cyan",
    "Demande d'enlèvement assignée": "magenta",
    "En cours d’enlèvement": "coral",
    "Enlevé": "#4dbd73",
    "Demande d'enlèvement annulé": "lightgray",
    "Retour assigné": "lightblue",
    "Retour en cours d'expédition": "lightgreen",
    "Retour enlevé": "darkviolet",
    "Retour Annulé": "#d44837",
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {data && (
        <div className={style.table_container} dir="ltr">
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{data?.name && data.name}</td>
              </tr>

              <tr>
                <td>Barcode</td>
                <td>{data?.barCode && data.barCode}</td>
              </tr>

              <tr>
                <td>Status</td>
                <td
                  style={{
                    backgroundColor:
                      statusColors[data?.status] || "black",
                      color: "white",
                      fontWeight: "bold",
                  }}
                >
                  {data?.status && data.status}
                </td>
              </tr>

              <tr>
                <td>Governorate</td>
                <td>{data?.governorate && data.governorate}</td>
              </tr>

              <tr>
                <td>City</td>
                <td>{data?.city && data.city}</td>
              </tr>

              <tr>
                <td>Address</td>
                <td>{data?.address && data.address}</td>
              </tr>

              <tr>
                <td>Telephone</td>
                <td>{data?.telephone && data.telephone}</td>
              </tr>

              <tr>
                <td>Telephone2</td>
                <td>{data?.telephone2 ? data.telephone2 : "N/A"}</td>
              </tr>

              <tr>
                <td>Price</td>
                <td>{data?.price && data.price}</td>
              </tr>

              <tr>
                <td>Number Of Items</td>
                <td>{data?.numberOfItems && data.numberOfItems}</td>
              </tr>

              <tr>
                <td>Designation</td>
                <td>{data?.designation && data.designation}</td>
              </tr>

              <tr>
                <td>Comment</td>
                <td>{data?.comment ? data.comment : "N/A"}</td>
              </tr>

              <tr>
                <td>Upload order date</td>
                <td dir="ltr">
                  {data?.created_at && formatDate(data.created_at)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
