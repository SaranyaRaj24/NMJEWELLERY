import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Products/View.css";
import jsPDF from "jspdf";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";

const WeightFormPopup = ({
  showPopup,
  closePopup,
  productId,
  product,
  productInfo,
  updateProductList,
}) => {
  console.log(product, "1111111111111111");
  // const ModProduct = product.filter((x) => x.id === productId);
  const [beforeWeight, setBeforeWeight] = useState(productInfo.before_weight);
  const [afterWeight, setAfterWeight] = useState(productInfo.after_weight);
  const [barcodeWeight, setBarcodeWeight] = useState(
    productInfo.barcode_weight
  );
  const [showBarcode, setShowBarcode] = useState(false);
  const [selectedProductNo, setSelectedProductNo] = useState(null);

  const barcodeRef = useRef(null);
  const beforeWeightRef = useRef(null);
  const afterWeightRef = useRef(null);
  const barcodeWeightRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      nextRef.current.focus();
    }
  };
const handleExportPdf = async () => {
  if (barcodeRef.current) {
    try {
      const canvas = await html2canvas(barcodeRef.current, {
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      console.log("Barcode Image Data:", imgData);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [55, 12],
      });
      pdf.addImage(imgData, "PNG", 2, 5, 45, 7);
      const pdfBlob = pdf.output("blob");
      console.log("PDF Blob Generated:", pdfBlob);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log("Generated PDF URL:", pdfUrl);

      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error exporting barcode as PDF:", error);
    }
  }
};
  console.log("hhhhhhhh", productInfo, productId);
  const handleGenerateBarcode = (productNo) => {
    if (!productNo) {
      console.error("Product number is undefined or invalid!");
      return;
    }

    setSelectedProductNo(productNo);
    setShowBarcode(true);

    console.log("Generating Barcode for Product No:", productNo);

    if (barcodeRef.current) {
      const doc = new jsPDF();

      html2canvas(barcodeRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 30);
        doc.save(`${productNo}_barcode.pdf`);
      });
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
      console.log("Updated Product Data:", updatedData);
      updateProductList();
      closePopup();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    const handleBarcodeScan = (e) => {
      setShowBarcode((prevData) => prevData + e.key);

      if (e.key === "Enter") {
        console.log("Scanned Barcode:", showBarcode);
        setShowBarcode("");
      }
    };

    window.addEventListener("keydown", handleBarcodeScan);

    return () => {
      window.removeEventListener("keydown", handleBarcodeScan);
    };
  }, [showBarcode]);

  useEffect(() => {
    console.log("Product Object: ", product);
    if (product && product.product_number) {
      console.log("Product Number: ", product.product_number);
    }
  }, [product]);

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
                onKeyDown={(e) => handleKeyDown(e, afterWeightRef)}
                ref={beforeWeightRef}
                placeholder="Enter Before Weight"
              />
            </div>
            <div>
              <label>After Weight:</label>
              <input
                type="number"
                value={afterWeight}
                onChange={(e) => setAfterWeight(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, barcodeWeightRef)}
                ref={afterWeightRef}
                placeholder="Enter After Weight"
              />
            </div>
            <div>
              <label>Barcode Weight:</label>
              <input
                type="number"
                value={barcodeWeight}
                onChange={(e) => setBarcodeWeight(e.target.value)}
                ref={barcodeWeightRef}
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

            {showBarcode && selectedProductNo && (
              <div ref={barcodeRef} style={{ marginTop: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <strong>{product.barcode_weight}</strong>
                </div>
                <Barcode value={selectedProductNo} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default WeightFormPopup;
