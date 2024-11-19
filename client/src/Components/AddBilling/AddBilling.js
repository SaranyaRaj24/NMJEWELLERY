import React, { useEffect, useState } from "react";
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
  const fetchBillNo=async ()=>{
    const response = await axios.get(`http://localhost:5000/bills/bills/`+bill_number).then(res=>{
      setScannedProducts(res.data.products)
    }).catch(x=>console.log(x));
    
  }
  useEffect(() => {
    fetchBillNo()
  }, [])
  
  console.log(scannedProducts,"llll")

  const handleScan = async (product_number) => {
    try {

    

      const response = await axios.get(`http://localhost:5000/api/v1/products/getSerial/${bill_number}/${product_number}/${bill_type}`);
      console.log(response)

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
                  Gross Weight
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Net Weight
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Stone Charges
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  HUD
                </th>
                <th>
                  <Checkbox {...label} style={{ color: "white" }} />
                  Length
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

