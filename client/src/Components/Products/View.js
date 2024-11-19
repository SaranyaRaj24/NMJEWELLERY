import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Products/View.css";
import jsPDF from "jspdf";
import Barcode from "react-qr-code";
import html2canvas from "html2canvas";

const WeightFormPopup = ({
  showPopup,
  closePopup,
  productId,
  product,
  productInfo,
  updateProductList,
}) => {
  const [beforeWeight, setBeforeWeight] = useState(productInfo.before_weight);
  const [afterWeight, setAfterWeight] = useState(productInfo.after_weight);
  const [barcodeWeight, setBarcodeWeight] = useState(
    productInfo.barcode_weight
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
        pdf.addImage(imgData, "PNG", 10, 3, 45, 7);
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the generated PDF in a new tab
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
        barcode_weight: parseFloat(barcodeWeight),
      };
      await axios.put(
        `http://localhost:5000/api/v1/products/update/${productId}`,
        updatedData
      );
      updateProductList();
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
              <label>Before Weight:</label>
              <input
                type="number"
                value={beforeWeight}
                onChange={(e) => setBeforeWeight(e.target.value)}
                placeholder="Enter Before Weight"
              />
            </div>
            <div>
              <label>After Weight:</label>
              <input
                type="number"
                value={afterWeight}
                onChange={(e) => setAfterWeight(e.target.value)}
                placeholder="Enter After Weight"
              />
            </div>
            <div>
              <label>Barcode Weight:</label>
              <input
                type="number"
                value={barcodeWeight}
                onChange={(e) => setBarcodeWeight(e.target.value)}
                placeholder="Enter Barcode Weight"
              />
            </div>
          </form>
          <div className="savee-buttonn">
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => handleGenerateBarcode(product.product_number)}
            >
              Generate Barcode
            </button>
            <button onClick={handleExportPdf}>Export as PDF </button>

            {showBarcode && (
              <div
                ref={barcodeRef}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "1rem",
                 
                  // backgroundColor:'blue'
                }}
              >
                <div style={{display:'flex',justifyContent:"center",alignItems:"center"}}> 
                <div style={{ marginRight:'3rem', fontSize: "20px" ,fontWeight:'bold',height:'40px',display:"flex",flexDirection:"column"}}><span>Navamithra</span><span>Jewellery</span></div>
                <Barcode value={selectedProductNo || ""} size={80}  /> </div>
                <div style={{  fontSize: "18px",marginLeft:'2rem' , fontWeight:'bold'}}>
                  <div>GW: {beforeWeight}</div>
                  <div>NW: {afterWeight}</div>
                  <div>SGG3</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default WeightFormPopup;




