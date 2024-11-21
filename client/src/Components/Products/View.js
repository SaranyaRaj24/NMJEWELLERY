import React, { useState, useRef } from "react";
import axios from "axios";
import "../Products/View.css";
import jsPDF from "jspdf";
import Barcode from "react-qr-code";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";

const WeightFormPopup = ({
  showPopup,
  closePopup,
  productId,
  product,
  productInfo,
  updateProductList,
}) => {
  console.log(productInfo);
  const [beforeWeight, setBeforeWeight] = useState(productInfo.before_weight);
  const [afterWeight, setAfterWeight] = useState(productInfo.after_weight);
  const [stone_charge, setStoneCharge] = useState(productInfo.difference);
  const [hud, sethud] = useState(productInfo.adjustment);
  const [length, setlength] = useState(productInfo.final_weight);
  const [product_number, setProductNumber] = useState(
    productInfo.product_number
  );
  const [showBarcode, setShowBarcode] = useState(false);
  const [selectedProductNo, setSelectedProductNo] = useState(null);
  const barcodeRef = useRef(null);

  const handleGenerateBarcode = (productNo) => {
    if (!productNo) {
      console.error("Product number is undefined or invalid!");
      return;
    }
    setSelectedProductNo(productNo);
    setShowBarcode(true);
  };

  const handleExportPdf = async () => {
    if (barcodeRef.current) {
      try {
        const canvas = await html2canvas(barcodeRef.current, {
          backgroundColor: null,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [55, 12],
        });
        pdf.addImage(imgData, "PNG", 13, 3, 45, 7);
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");
      } catch (error) {
        console.error("Error exporting barcode as PDF:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        before_weight: parseFloat(beforeWeight),
        after_weight: parseFloat(afterWeight),
        stone_charge: parseFloat(stone_charge),
        hud: parseFloat(hud),
        length: parseFloat(length),
        product_number: product_number,
      };

      const net = await axios.put(
        `http://localhost:5000/api/v1/products/update/${productId}`,
        updatedData
      );
      console.log(net, "ttttttttttttttttt");

      const updatedProduct = {
        ...product,
        before_weight: updatedData.before_weight,
        after_weight: updatedData.after_weight,
        stone_charge: updatedData.stone_charge,
        hud: updatedData.hud,
        stone_charge: updatedData.stone_charge,
      };

      alert("Product updated successfully!");

      window.location.reload();
      closePopup();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    showPopup && (
      <div className="popup-1">
        <div className="popup-content">
          <div className="close">
            <b onClick={closePopup} className="close-button">
              X
            </b>
          </div>
          <form className="in-position">
            <div>
              <label>Gross Weight:</label>
              <input
                type="number"
                value={beforeWeight}
                onChange={(e) => setBeforeWeight(e.target.value)}
                placeholder="Enter Gross Weight"
              />
            </div>
            <div>
              <label>Net Weight:</label>
              <input
                type="number"
                value={afterWeight}
                onChange={(e) => setAfterWeight(e.target.value)}
                placeholder="Enter Net Weight"
              />
            </div>
            <div>
              <label>Stone Charges:</label>
              <input
                type="number"
                value={stone_charge}
                onChange={(e) => setStoneCharge(e.target.value)}
                placeholder="Enter Stone Charges"
              />
            </div>
            <div>
              <label>HUD:</label>
              <input
                type="number"
                value={hud}
                onChange={(e) => sethud(e.target.value)}
                placeholder="Enter HUD"
              />
            </div>
            <div>
              <label>Length:</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setlength(e.target.value)}
                placeholder="Enter Length"
              />
            </div>
            <div>
              <label>Product Number:</label>
              <input
                type="text"
                value={product_number}
                onChange={(e) => setProductNumber(e.target.value)}
                placeholder="Enter Product Number"
              />
            </div>
          </form>
          <br></br>
          <div
            className="button-group"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              onClick={handleSave}
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#25274D",
                color: "white",
                width: "20%",
              }}
            >
              Save
            </Button>
            <br></br>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => handleGenerateBarcode(product.product_number)}
                variant="contained"
                size="small"
                style={{ backgroundColor: "#25274D", color: "white" }}
              >
                Generate QR
              </Button>
              <Button
                onClick={handleExportPdf}
                variant="contained"
                size="small"
                style={{ backgroundColor: "#25274D", color: "white" }}
              >
                Export as PDF
              </Button>
            </div>
          </div>
          <div></div>
          {showBarcode && (
            <div
              ref={barcodeRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "3rem",
                marginLeft: "0.7rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    marginRight: "10rem",
                    fontWeight: "bolder",
                    height: "40px",
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "3rem",
                    marginLeft: "-60px",
                  }}
                >
                  <span style={{ fontSize: "40px" }}>NMC</span>

                  <span style={{ fontSize: "23px" }}>{product_number}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "20px",
                  marginLeft: "2rem",
                  fontWeight: "bolder",
                  display: "flex",
                  gap: "12px",
                  marginLeft: "-80px",
                }}
              >
                <Barcode value={selectedProductNo || ""} size={80} />
                <div>
                  <div>GW: {beforeWeight}</div>
                  <div>NW: {afterWeight}</div>
                  <div>SC: {stone_charge}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default WeightFormPopup;
