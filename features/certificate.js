function initCertificateDownload() {
  const generateBtn = document.getElementById("generateCertificateBtn");

  if (!generateBtn) {
    console.warn("⚠️ Certificate button not found.");
    return;
  }

  generateBtn.addEventListener("click", async function () {
    const name = document.getElementById("learnerName").value.trim();
    const messageArea = document.getElementById("name-message");
    if (!name) {
      messageArea.textContent = "Please enter your name to generate your certificate.";
      messageArea.style.color = "red";
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Certificate tool not ready. Please wait a moment and try again.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const completionData = JSON.parse(localStorage.getItem("course_completed"));
    const date = completionData
      ? new Date(completionData.timestamp).toLocaleDateString()
      : new Date().toLocaleDateString();

    const certContainer = document.createElement("div");
    certContainer.style.width = "800px";
    certContainer.style.height = "600px";
    certContainer.style.padding = "40px";
    certContainer.style.background = "white";
    certContainer.style.textAlign = "center";
    certContainer.style.fontFamily = "Georgia, serif";
    certContainer.style.border = "10px solid #005bb5";
    certContainer.style.display = "flex"; // new!
    certContainer.style.flexDirection = "column"; // new!
    certContainer.style.justifyContent = "center"; // new!

    certContainer.innerHTML = `
      <div style="
        border: 4px solid #ccc;
        flex: 1;
        margin: 10px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
      ">
        <h1 style="font-size: 2.5em; color: #005bb5;">Certificate of Completion</h1>
        <p style="font-size: 1.2em;">This certifies that</p>
        <h2 style="font-size: 2em; margin: 20px 0; color: #333;">${name}</h2>
        <p style="font-size: 1.2em;">has successfully completed the Identifying Learning Differences course</p>
        <p style="margin-top: 40px; font-size: 1em;">Date: ${date}</p>
      </div>
    `;

    document.body.appendChild(certContainer);

    const canvas = await html2canvas(certContainer);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [800, 600] });
    pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
    pdf.save("certificate.pdf");

    document.body.removeChild(certContainer);
  });
}

// ⚡ Trigger immediately if scripts were injected dynamically
initCertificateDownload();
