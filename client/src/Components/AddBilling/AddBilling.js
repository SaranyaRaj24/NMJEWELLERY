import React, { useState } from "react";
import "../AddBilling/AddBilling.css";
import Table from "react-bootstrap/esm/Table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";
import BarcodeReader from "react-barcode-reader";
import axios from "axios";
import Navbarr from "../Navbarr/Navbarr";

const AddBilling = () => {

  const [scannedProducts, setScannedProducts] = useState([]);
  const { bill_number, bill_type } = useParams();



  const exportPDF = async () => {
    const input = document.getElementById("page-to-pdf");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("billing_details.pdf");
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const handleScan = async (product_number) => {
    try {

    

      const response = await axios.get(`http://localhost:5000/api/products/getSerial/${bill_number}/${product_number}/${bill_type}`);

      if (response.status === 200) {
        setScannedProducts((prevProducts) => [
          ...prevProducts,
          response.data.product,
        ]);
      } else {
        console.error("Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <>
      <Navbarr />
      <div className="back-tab">
        <div id="page-to-pdf">
          <h2> Bill Details</h2>
          <BarcodeReader onScan={handleScan} />

          <Table striped bordered hover className="add-tab">
            <thead>
              <tr>
                <th> S.No </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} checked />{" "}
                  Product.No{" "}
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Before weight
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  After weight
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Difference
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Adjustment
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Final weight
                </th>
              </tr>
            </thead>
            <tbody>
              {scannedProducts.length > 0 ? (
                scannedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.product_number}</td>
                    <td>{product.before_weight}</td>
                    <td>{product.after_weight}</td>
                    <td>{product.difference}</td>
                    <td>{product.adjustment}</td>
                    <td>{product.final_weight}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No product scanned</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="button-save">
          <button className="savee">Save</button>
          <button className="pdf" onClick={exportPDF}>
            Export as PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default AddBilling;

