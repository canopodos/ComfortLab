document.getElementById("project-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const imagenes = document.getElementById("imagenes").files;

  let y = 10;
  doc.setFontSize(16);
  doc.text("Informe de Proyecto - ConfortLab", 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Nombre: ${nombre}`, 10, y);
  y += 8;
  doc.text(`Email: ${email}`, 10, y);
  y += 8;
  if (telefono) {
    doc.text(`Teléfono: ${telefono}`, 10, y);
    y += 8;
  }
  doc.text("Descripción:", 10, y);
  y += 8;

  doc.setFontSize(11);
  const descLines = doc.splitTextToSize(descripcion, 180);
  doc.text(descLines, 10, y);
  y += descLines.length * 6;

  function addImageToPDF(i) {
    if (i >= imagenes.length) {
      // Guardar PDF cuando se hayan agregado todas las imágenes
      doc.save(`proyecto-confortlab-${nombre}.pdf`);
      return;
    }

    const file = imagenes[i];
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        const ratio = img.width / img.height;
        const maxWidth = 180;
        const maxHeight = 100;
        let imgWidth = maxWidth;
        let imgHeight = maxWidth / ratio;
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = maxHeight * ratio;
        }

        if (y + imgHeight + 10 > 290) {
          doc.addPage();
          y = 10;
        }

        doc.addImage(img, "JPEG", 10, y, imgWidth, imgHeight);
        y += imgHeight + 10;
        addImageToPDF(i + 1);
      };
    };
    reader.readAsDataURL(file);
  }

  if (imagenes.length > 0) {
    addImageToPDF(0);
  } else {
    doc.save(`proyecto-confortlab-${nombre}.pdf`);
  }
});
