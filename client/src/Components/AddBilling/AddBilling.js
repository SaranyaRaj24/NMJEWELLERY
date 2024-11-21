import React, { useState, useEffect } from "react";
import "../AddBilling/AddBilling.css";
import Table from "react-bootstrap/esm/Table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams,useNavigate } from "react-router-dom";
import BarcodeReader from "react-barcode-reader";
import axios from "axios";

import Navbarr from "../Navbarr/Navbarr";

const AddBilling = () => {
  const navigate=useNavigate()
  const [scannedProducts, setScannedProducts] = useState([]);
  const [billName, setBillName] = useState("");
  const [checkedProducts, setCheckedProducts] = useState([]);
  const { bill_number, bill_type } = useParams();

  const exportPDF = async () => {
    const input = document.getElementById("page-to-pdf");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    const pdfName = billName.trim() ? `${billName}.pdf` : "billing_details.pdf";
    pdf.save(pdfName);
  };

  const fetchBillNo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/bills/bills/` + bill_number
      );
      setScannedProducts(response.data.products);
    } catch (error) {
      console.log("Error fetching bill data:", error);
    }
  };

  useEffect(() => {
    fetchBillNo();
  }, []);

  const handleScan = async (product_number) => {
    try {
      console.log(product_number);

      const response = await axios.get(
        `http://localhost:5000/api/v1/products/getSerial/${bill_number}/${product_number}/${bill_type}`
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


    const handleCheckboxChange = (productId, id) => {
      setCheckedProducts((prevCheckedProducts) => {
        let updatedCheckedProducts;
         const isProductChecked = prevCheckedProducts.some(
           (product) => product.productId === productId
         );

        if (isProductChecked) {
          updatedCheckedProducts = prevCheckedProducts.filter(
            (id) => id.productId !== productId
          );
        } else {
          updatedCheckedProducts = [...prevCheckedProducts, { productId, id }];
        }
        console.log("Updated checked products:", updatedCheckedProducts);

        console.log(updatedCheckedProducts,"pppppppppp")
        return updatedCheckedProducts;
      });
    };

  const handleSellApprove = async (value) => {
    try {

      console.log(value,"llllllllllllllllllllll");
      const response = await axios.post("http://localhost:5000/bills/bill-details", {
        button: value,
        bill_name: billName,
        selected_products: checkedProducts,
        
      });

      if (response.status === 200) {
        alert("Bill sold successfully!");
        navigate(`/billing/${response.data.bill.bill_number}`);
        
      }
    } catch (error) {
      console.error("Error sending Sell data:", error);
      alert("Error selling bill.");
    }
  };

  

  const handleApproval = async () => {
    try {
      const response = await axios.post("http://localhost:5000/bills/update", {
        bill_number,
        bill_type,
        button: "Approval",
        bill_name: billName,
        selected_products: checkedProducts,
      });
      if (response.status === 200) {
        alert("Bill approved ");
      }
    } catch (error) {
      console.error("Error sending Approval data:", error);
      alert("Error approving bill.");
    }
  };

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




    console.log(checkedProducts,"oooooooooooo")

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
                <th>Product.No </th>
                <th>Gross Weight</th>
                <th>Net Weight</th>
                <th>Stone Charges</th>
                <th>HUD</th>
                <th>Length</th>
                {bill_number === "bill" && <th>Checkbox</th>}
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
                    {bill_number === "bill" && (
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedProducts.some(
                            (item) => item.productId === product.product_number
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              product.product_number,
                              product.id
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No products found.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">
                  <b>Total Weight </b>
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

          
              </tr>
            </tfoot>
          </Table>

          {bill_number === "bill" && (
            <div className="pdf-btn">
              <input
                type="text"
                className="bill-name-input"
                placeholder="Enter bill name"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
              />
              <button className="pdf" onClick={() => handleSellApprove("Sell")}>
                Sell
              </button>
              <button
                className="pdf"
                onClick={() => handleSellApprove("Approve")}
              >
                Approval
              </button>
            </div>
          )}
        </div>
        {bill_number !== "bill" && (
          <button className="pdf" onClick={exportPDF}>
            Export as PDF
          </button>
        )}
      </div>
    </>
  );
};

export default AddBilling;


