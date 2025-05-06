const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generateHealthReport(checkupData, outputPath) {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputPath, { flags: 'w' });
    doc.pipe(stream);

    // Eye-pleasing Background with Gradient
    const gradientSteps = 10;
    const pageHeight = doc.page.height;
    const stepHeight = pageHeight / gradientSteps;

    for (let i = 0; i < gradientSteps; i++) {
      const y = i * stepHeight;
      const r = 243 - (i * (243 - 224) / gradientSteps);
      const g = 229 - (i * (229 - 247) / gradientSteps);
      const b = 245 - (i * (245 - 233) / gradientSteps);
      const color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      doc
        .rect(0, y, doc.page.width, stepHeight)
        .fillColor(color)
        .fill();
    }

    // Subtle Pattern: Faint dots for depth
    doc
      .opacity(0.08)
      .fillColor('#81c784')
      .strokeColor('#81c784');

    for (let y = 0; y < doc.page.height; y += 60) {
      for (let x = 0; x < doc.page.width; x += 60) {
        doc
          .circle(x, y, 2)
          .fill();
      }
    }

    doc.opacity(1);

    // Header
    doc
      .rect(0, 0, doc.page.width, 100)
      .fillColor('#4caf50')
      .fill();

    doc
      .fontSize(28)
      .fillColor('white')
      .font('Helvetica-Bold')
      .text('Health Kiosk', 50, 30);

    doc
      .fontSize(18)
      .font('Helvetica')
      .text('Comprehensive Health Checkup Report', 50, 65);

    doc.fillColor('black');

    // Date & Time Box
    const currentDateTime = new Date();
    doc
      .roundedRect(50, 120, 495, 40, 8)
      .fillColor('white')
      .opacity(0.9)
      .fill();

    doc
      .opacity(1)
      .fontSize(12)
      .fillColor('black')
      .text(`📅 Date: ${currentDateTime.toLocaleDateString()}`, 60, 135)
      .text(`🕒 Time: ${currentDateTime.toLocaleTimeString()}`, 300, 135);

    // Patient Name Section
    doc
      .roundedRect(50, 180, 495, 40, 8)
      .fillColor('white')
      .opacity(0.9)
      .fill();

    doc
      .roundedRect(50, 180, 495, 40, 8)
      .strokeColor('#388e3c')
      .lineWidth(1)
      .stroke();

    doc
      .opacity(1)
      .fontSize(16)
      .fillColor('#388e3c')
      .font('Helvetica-Bold')
      .text('👤 Patient Name', 60, 195);

    doc
      .fontSize(12)
      .fillColor('black')
      .font('Helvetica')
      .text(`${checkupData.patientName || 'Not Provided'}`, 60, 215);

    // Checkup Details (shifted down)
    doc
      .roundedRect(50, 240, 495, 180, 8)
      .fillColor('white')
      .opacity(0.9)
      .fill();

    doc
      .roundedRect(50, 240, 495, 180, 8)
      .strokeColor('#388e3c')
      .lineWidth(1)
      .stroke();

    doc
      .opacity(1)
      .fontSize(16)
      .fillColor('#388e3c')
      .font('Helvetica-Bold')
      .text('🏥 Checkup Details', 60, 255);

    doc
      .fontSize(12)
      .fillColor('black')
      .font('Helvetica')
      .text(`⚖️ Weight: ${checkupData.weight} kg`, 60, 280)
      .text(`📏 Height: ${checkupData.height} cm`, 60, 300)
      .text(`💓 SpO₂: ${checkupData.oximeter}%`, 60, 320)
      .text(`🩺 Blood Pressure: ${checkupData.bloodPressureSys}/${checkupData.bloodPressureDia} mmHg`, 60, 340)
      .text(`🌡️ Temperature: ${checkupData.temperature} °C`, 60, 360);

    // Doctor Info (shifted down)
    doc
      .moveDown(2)
      .fontSize(16)
      .fillColor('#388e3c')
      .font('Helvetica-Bold')
      .text('👨‍⚕️ Doctor Information', 50, 440)
      .moveTo(50, 460)
      .lineTo(200, 460)
      .stroke();

    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Name: Dr. ${checkupData.doctorName}`, 60, 470);

    // Prescription Section (shifted down)
    doc
      .roundedRect(50, 510, 495, 100, 8)
      .fillColor('white')
      .opacity(0.9)
      .fill();

    doc
      .roundedRect(50, 510, 495, 100, 8)
      .strokeColor('#388e3c')
      .lineWidth(1)
      .stroke();

    doc
      .opacity(1)
      .fontSize(16)
      .fillColor('#388e3c')
      .font('Helvetica-Bold')
      .text('📝 Doctor\'s Prescription', 60, 525);

    doc
      .fontSize(12)
      .fillColor('black')
      .font('Helvetica')
      .text('Details to be filled by the doctor:', 60, 550)
      .text('(E.g., medications, dosage, instructions)', 60, 565);

    // Notes Section (shifted down)
    doc
      .roundedRect(50, 630, 495, 100, 8)
      .fillColor('white')
      .opacity(0.9)
      .fill();

    doc
      .roundedRect(50, 630, 495, 100, 8)
      .strokeColor('#388e3c')
      .lineWidth(1)
      .stroke();

    doc
      .opacity(1)
      .fontSize(16)
      .fillColor('#388e3c')
      .font('Helvetica-Bold')
      .text('📋 Additional Notes', 60, 645);

    doc
      .fontSize(12)
      .fillColor('black')
      .font('Helvetica')
      .text(checkupData.notes || 'No additional notes provided.', 60, 670, {
        width: 475,
        align: 'left'
      });

    // Footer
    doc
      .moveTo(50, 770)
      .lineTo(545, 770)
      .lineWidth(0.5)
      .strokeColor('#cccccc')
      .stroke();

    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .fillColor('gray')
      .text('Generated by Health Kiosk | Confidential Medical Document', 50, 780, {
        align: 'center'
      });

    doc.end();

    await new Promise((resolve, reject) => {
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
      stream.on('error', (err) => {
        stream.close();
        reject(err);
      });
    });

    console.log(`✅ PDF generated at: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error('❌ Error generating report:', err);
    throw err;
  }
}

module.exports = { generateHealthReport };
