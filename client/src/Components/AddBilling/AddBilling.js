
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
  const [selectedColumns, setSelectedColumns] = useState({
    product_number: true,
    before_weight: false,
    after_weight: false,
    difference: false,
    adjustment: false,
    final_weight: false,
  });

  
  const totalBeforeWeight = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.before_weight || 0), 0)
    .toFixed(3);
  const totalAfterWeight = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.after_weight || 0), 0)
    .toFixed(3);
  const totalDifference = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.difference || 0), 0)
    .toFixed(3);
  const totalAdjustment = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.adjustment || 0), 0)
    .toFixed(3);
  const totalFinalWeight = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.final_weight || 0), 0)
    .toFixed(3);
  const totalBarcodeWeight = scannedProducts
    .reduce((acc, product) => acc + parseFloat(product.barcode_weight || 0), 0)
    .toFixed(3);

  const { bill_number, bill_type } = useParams();

  const exportPDF = async () => {
    const input = document.createElement("div");
    input.style.padding = "20px";
    input.style.backgroundColor = "white";
    input.innerHTML = `
      <h2>Bill Details</h2>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">S.No</th>
            ${
              selectedColumns.product_number
                ? `<th style="border: 1px solid #ddd; padding: 8px;">Product No</th>`
                : ""
            }
            ${
              selectedColumns.before_weight
                ? `<th style="border: 1px solid #ddd; padding: 8px;">Gross Weight</th>`
                : ""
            }
            ${
              selectedColumns.after_weight
                ? `<th style="border: 1px solid #ddd; padding: 8px;">Net Weight</th>`
                : ""
            }
            ${
              selectedColumns.difference
                ? `<th style="border: 1px solid #ddd; padding: 8px;">Stone Charges</th>`
                : ""
            }
            ${
              selectedColumns.adjustment
                ? `<th style="border: 1px solid #ddd; padding: 8px;">HUD</th>`
                : ""
            }
            ${
              selectedColumns.final_weight
                ? `<th style="border: 1px solid #ddd; padding: 8px;">Length</th>`
                : ""
            }
          </tr>
        </thead>
        <tbody>
          ${scannedProducts
            .map(
              (product, index) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                index + 1
              }</td>
              ${
                selectedColumns.product_number
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.product_number}</td>`
                  : ""
              }
              ${
                selectedColumns.before_weight
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.before_weight}</td>`
                  : ""
              }
              ${
                selectedColumns.after_weight
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.after_weight}</td>`
                  : ""
              }
              ${
                selectedColumns.difference
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.difference}</td>`
                  : ""
              }
              ${
                selectedColumns.adjustment
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.adjustment}</td>`
                  : ""
              }
              ${
                selectedColumns.final_weight
                  ? `<td style="border: 1px solid #ddd; padding: 8px;">${product.final_weight}</td>`
                  : ""
              }
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    document.body.appendChild(input);

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("billing_details.pdf");

    document.body.removeChild(input);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const fetchBillNo=async ()=>{
    const response = await axios.get(`http://localhost:5000/bills/bills/`+bill_number).then(res=>{
      setScannedProducts(res.data.products)
    }).catch(x=>console.log(x));
    
  }
  useEffect(() => {
    fetchBillNo()
  }, [])
  
 
  const handleColumnSelection = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleScan = async (product_number) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/getSerial/${bill_number}/${product_number}/${bill_type}`
      );
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
                  <Checkbox
                    checked={selectedColumns.product_number}
                    onChange={() => handleColumnSelection("product_number")}
                  />
                  Product No
                </th>
                <th>
                  <Checkbox
                    checked={selectedColumns.before_weight}
                    onChange={() => handleColumnSelection("before_weight")}
                  />
                  Gross Weight
                </th>
                <th>
                  <Checkbox
                    checked={selectedColumns.after_weight}
                    onChange={() => handleColumnSelection("after_weight")}
                  />
                  Net Weight
                </th>
                <th>
                  <Checkbox
                    checked={selectedColumns.difference}
                    onChange={() => handleColumnSelection("difference")}
                  />
                  Stone Charges
                </th>
                <th>
                  <Checkbox
                    checked={selectedColumns.adjustment}
                    onChange={() => handleColumnSelection("adjustment")}
                  />
                  HUD
                </th>
                <th>
                  <Checkbox
                    checked={selectedColumns.final_weight}
                    onChange={() => handleColumnSelection("final_weight")}
                  />
                  Length
                </th>
              </tr>
            </thead>
            <tbody>
              {scannedProducts.length > 0 ? (
                scannedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    {selectedColumns.product_number && (
                      <td>{product.product_number}</td>
                    )}
                    {selectedColumns.before_weight && (
                      <td>{product.before_weight}</td>
                    )}
                    {selectedColumns.after_weight && (
                      <td>{product.after_weight}</td>
                    )}
                    {selectedColumns.difference && (
                      <td>{product.difference}</td>
                    )}
                    {selectedColumns.adjustment && (
                      <td>{product.adjustment}</td>
                    )}
                    {selectedColumns.final_weight && (
                      <td>{product.final_weight}</td>
                    )}

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No product scanned</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">
                  <b>Total Weight = </b>
                </td>
                <td>
                  <b>{totalBeforeWeight}</b>
                </td>
                <td>
                  <b>{totalAfterWeight}</b>
                </td>
                <td>
                  <b>{totalDifference}</b>
                </td>
                <td>
                  <b>{totalAdjustment}</b>
                </td>
                <td>
                  <b>{totalFinalWeight}</b>
                </td>

                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>
        <div className="button-save">
          {/* <button className="savee">Save</button> */}
          <button className="pdf" onClick={exportPDF}>
            Export as PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default AddBilling;

