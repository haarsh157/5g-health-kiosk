const fs = require('fs').promises;
const path = require('path');
const { generateHealthReport } = require('./create_pdf.cjs');
const { connectToWhatsApp } = require('./index.cjs');

async function sendHealthReport() {
  let sock;
  try {
    // Define health checkup parameters with patient name
    console.log('Defining health checkup parameters...');
    const checkupData = {
      patientName: 'Alex Johnson',
      weight: 72,
      height: 170,
      oximeter: 97,
      bloodPressureSys: 118,
      bloodPressureDia: 78,
      temperature: 36.8,
      doctorName: 'Jane Doe',
      notes: 'Patient should increase water intake and schedule a follow-up in 1 month.'
    };

    // Generate the PDF
    console.log('Generating PDF...');
    const pdfPath = path.join(__dirname, 'health_checkup_report.pdf');
    await generateHealthReport(checkupData, pdfPath);
    console.log('Health report PDF generated successfully at:', pdfPath);

    // Connect to WhatsApp
    console.log('Connecting to WhatsApp...');
    sock = await connectToWhatsApp();
    console.log('WhatsApp connection established');

    // Recipient details
    const number = '918956052157';
    const jid = `${number}@s.whatsapp.net`;
    console.log('Recipient JID:', jid);

    // Send a test text message
    console.log('Sending test message...');
    await sock.sendMessage(jid, { text: 'Hello! Here is your health checkup report.' })
      .then(() => console.log('Test message sent successfully'))
      .catch((err) => {
        console.error('Error sending test message:', err);
        throw err;
      });

    // Send the generated PDF
    console.log('Preparing to send PDF...');
    try {
      console.log('Reading PDF file...');
      const pdfBuffer = await fs.readFile(pdfPath);
      console.log('PDF file read successfully, size:', pdfBuffer.length, 'bytes');

      console.log('Sending PDF...');
      await sock.sendMessage(jid, {
        document: pdfBuffer,
        mimetype: 'application/pdf',
        fileName: 'Health_Checkup_Report.pdf'
      })
        .then(() => console.log('Health report PDF sent successfully'))
        .catch((err) => {
          console.error('Error sending health report PDF:', err);
          throw err;
        });

      // Add a small delay to ensure WhatsApp API processes the messages
      console.log('Waiting for WhatsApp API to process messages...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clean up: Delete the PDF file after sending
      console.log('Cleaning up: Deleting PDF file...');
      await fs.unlink(pdfPath).catch((err) => console.error('Error deleting PDF:', err));
    } catch (err) {
      console.error('Error in PDF sending block:', err);
      throw err;
    }

    // Mark the connection as intentionally closed
    console.log('Marking connection as intentionally closed...');
    sock.markAsIntentionallyClosed();

    // Close the WhatsApp connection
    console.log('Closing WhatsApp connection...');
    await sock.end();

    // Exit the process
    console.log('Script completed. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('Error in sendHealthReport:', err);
    if (sock) {
      // Mark the connection as intentionally closed in case of error
      sock.markAsIntentionallyClosed();
      await sock.end().catch((err) => console.error('Error closing WhatsApp connection:', err));
    }
    // Clean up: Delete the PDF file if it exists
    const pdfPath = path.join(__dirname, 'health_checkup_report.pdf');
    await fs.unlink(pdfPath).catch((err) => console.error('Error deleting PDF during cleanup:', err));
    process.exit(1);
  }
}

// Run the script
sendHealthReport().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});


// const { generateHealthReport } = require('./create_pdf');
// const { connectToWhatsApp } = require('./index');

// async function sendHealthReport() {
//   try {
//     // Define health checkup parameters with patient name
//     const checkupData = {
//       patientName: 'Alex Johnson',
//       weight: 72,
//       height: 170,
//       oximeter: 97,
//       bloodPressureSys: 118,
//       bloodPressureDia: 78,
//       temperature: 36.8,
//       doctorName: 'Jane Doe',
//       notes: 'Patient should increase water intake and schedule a follow-up in 1 month.'
//     };

//     // Generate the PDF
//     const pdfPath = path.join(__dirname, 'health_checkup_report.pdf');
//     await generateHealthReport(checkupData, pdfPath);
//     console.log('Health report PDF generated successfully');

//     // Connect to WhatsApp
//     const sock = await connectToWhatsApp();
//     console.log('WhatsApp connection established');

//     // Recipient details
//     const number = '917083505744';
//     const jid = `${number}@s.whatsapp.net`;

//     // Send a test text message
//     await sock.sendMessage(jid, { text: 'Hello! Here is your health checkup report.' })
//       .then(() => console.log('Test message sent'))
//       .catch((err) => console.error('Error sending message:', err));

//     // Send the generated PDF
//     try {
//       const pdfBuffer = await fs.readFile(pdfPath);
      
//       await sock.sendMessage(jid, {
//         document: pdfBuffer,
//         mimetype: 'application/pdf',
//         fileName: 'Health_Checkup_Report.pdf'
//       })
//         .then(() => console.log('Health report PDF sent successfully'))
//         .catch((err) => console.error('Error sending health report PDF:', err));

//       // Clean up: Delete the PDF file after sending
//       await fs.unlink(pdfPath).catch((err) => console.error('Error deleting PDF:', err));
//     } catch (err) {
//       console.error('Error sending health report PDF:', err);
//     }
//   } catch (err) {
//     console.error('Error in sendHealthReport:', err);
//   }
// }

// // Run the script
// sendHealthReport().catch((err) => console.error('Startup error:', err));
// const fs = require('fs').promises;
// const path = require('path');
// const { generateHealthReport } = require('./create_pdf');
// const { connectToWhatsApp } = require('./index');

// async function sendHealthReport() {
//   try {
//     // Define health checkup parameters
//     const checkupData = {
//       weight: 72,
//       height: 170,
//       oximeter: 97,
//       bloodPressureSys: 118,
//       bloodPressureDia: 78,
//       temperature: 36.8,
//       doctorName: 'Jane Doe',
//       notes: 'Patient should increase water intake and schedule a follow-up in 1 month.'
//     };

//     // Generate the PDF
//     const pdfPath = path.join(__dirname, 'health_checkup_report.pdf');
//     await generateHealthReport(checkupData, pdfPath);
//     console.log('Health report PDF generated successfully');

//     // Connect to WhatsApp
//     const sock = await connectToWhatsApp();
//     console.log('WhatsApp connection established');

//     // Recipient details
//     const number = '917083505744';
//     const jid = `${number}@s.whatsapp.net`;

//     // Send a test text message
//     await sock.sendMessage(jid, { text: 'Hello! Here is your health checkup report.' })
//       .then(() => console.log('Test message sent'))
//       .catch((err) => console.error('Error sending message:', err));

//     // Send the generated PDF
//     try {
//       const pdfBuffer = await fs.readFile(pdfPath);
      
//       await sock.sendMessage(jid, {
//         document: pdfBuffer,
//         mimetype: 'application/pdf',
//         fileName: 'Health_Checkup_Report.pdf'
//       })
//         .then(() => console.log('Health report PDF sent successfully'))
//         .catch((err) => console.error('Error sending health report PDF:', err));

//       // Clean up: Delete the PDF file after sending
//       await fs.unlink(pdfPath).catch((err) => console.error('Error deleting PDF:', err));
//     } catch (err) {
//       console.error('Error sending health report PDF:', err);
//     }
//   } catch (err) {
//     console.error('Error in sendHealthReport:', err);
//   }
// }

// // Run the script
// sendHealthReport().catch((err) => console.error('Startup error:', err));