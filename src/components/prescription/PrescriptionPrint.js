import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PrescriptionPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prescriptionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prescriptionRes = await api.getPrescriptionById(id);
        console.log(prescriptionRes)
        if (!prescriptionRes.data) {
          throw new Error('No prescription data returned');
        }
        
        setPrescription(prescriptionRes.data);
        
        if (prescriptionRes.data && prescriptionRes.data.patientId) {
          const patientRes = await api.getPatientById(prescriptionRes.data.patientId);
          setPatient(patientRes.data);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load prescription data: ' + (err.message || 'Unknown error'));
        console.error('Error fetching prescription:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);


const handleDownloadPDF = (prescription) => {
  setLoading(true);

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  /* =====================
     CLINIC HEADER
  ===================== */
  doc.setTextColor(0, 123, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Sample Clinic", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Dr. Sample Name, MBBS, MD", pageWidth / 2, 28, { align: "center" });

  doc.setFontSize(10);
  doc.text(
    "123 Medical Street, City, State, ZIP",
    pageWidth / 2,
    34,
    { align: "center" }
  );
  doc.text(
    "Phone: +91 1234567890 | Reg. No.: REG123456",
    pageWidth / 2,
    40,
    { align: "center" }
  );

  // Divider
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(0.8);
  doc.line(14, 45, pageWidth - 14, 45);

  /* =====================
     PATIENT INFORMATION
  ===================== */
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 14, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Left column
  doc.text(`Name: ${prescription.patientName}`, 14, 63);
  doc.text(`Age: ${prescription.age || "-"}`, 14, 70);
  doc.text(`Contact: ${prescription.contact || "-"}`, 14, 77);

  // Right column
  doc.text(`ID: ${prescription.patientId}`, pageWidth - 80, 63);
  doc.text(`Gender: ${prescription.gender || "-"}`, pageWidth - 80, 70);

  // Date (right aligned)
  doc.text(
    `Date: ${prescription.visitDate}`,
    pageWidth - 14,
    85,
    { align: "right" }
  );

  // Divider
  doc.setDrawColor(200);
  doc.line(14, 90, pageWidth - 14, 90);

  /* =====================
     DIAGNOSIS
  ===================== */
  doc.setFont("helvetica", "bold");
  doc.text("DIAGNOSIS", 14, 100);

  doc.setFont("helvetica", "normal");
  doc.text(prescription.diagnosis || "—", 14, 108);

  // Divider
  doc.line(14, 115, pageWidth - 14, 115);

  /* =====================
     MEDICATIONS TABLE
  ===================== */
  doc.setFont("helvetica", "bold");
  doc.text("MEDICATIONS", 14, 125);

  const tableColumns = ["Medicine", "Dosage", "Frequency", "Duration", "Instructions"];
  const tableRows = prescription.prescriptionItems.map(item => [
    item.medicineName,
    item.dosage,
    item.frequency,
    item.duration,
    item.instructions || "-"
  ]);

  autoTable(doc, {
    startY: 130,
    head: [tableColumns],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 123, 255],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 249, 255],
    },
  });

  /* =====================
     SIGNATURE
  ===================== */
  const finalY = doc.lastAutoTable.finalY + 30;

  doc.line(pageWidth - 80, finalY, pageWidth - 14, finalY);
  doc.text(
    "Signature:",
    pageWidth - 80,
    finalY - 5
  );

  doc.setFont("helvetica", "bold");
  doc.text(
    "Dr. Sample Name, MBBS, MD",
    pageWidth - 80,
    finalY + 8
  );

  doc.save(`${prescription.prescriptionId}.pdf`);
  setLoading(false);
};


  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the prescription');
      return;
    }
    
    const printContent = prescriptionRef.current ? prescriptionRef.current.innerHTML : '';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription ${prescription && prescription.prescriptionId ? prescription.prescriptionId : ''}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; }
            .prescription-document { max-width: 800px; margin: 0 auto; }
            .signature-line { border-top: 1px solid #000; width: 200px; margin-left: auto; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="prescription-document">
            ${printContent}
          </div>
          <div class="no-print text-center mt-4">
            <button onclick="window.print();" class="btn btn-primary">Print</button>
            <button onclick="window.close();" class="btn btn-secondary ms-2">Close</button>
          </div>
          <script>
            window.onload = function() {
              try { window.print(); } catch (e) {}
              var btn = document.querySelector('.btn-primary');
              if (btn) { btn.focus(); }
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="text-center my-5">Loading prescription data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!prescription) return <div className="alert alert-warning">Prescription not found</div>;

  return (
    <Container className="my-4 prescription-print">
      <div className="d-print-none mb-4">
        {/* <Button variant="primary" onClick={handlePrint} className="me-2">
          Print Prescription
        </Button> */}
        <Button variant="success" onClick={handleDownloadPDF} className="me-2">
          Download PDF
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/prescriptions/view/${id}`)}>
          Back to View
        </Button>
      </div>
      
      <div className="prescription-document" ref={prescriptionRef}>
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">Medical Prescription</h2>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4>Prescription Details</h4>
                <p><strong>Prescription ID:</strong> {prescription.prescriptionId}</p>
                <p><strong>Date:</strong> {formatDate(prescription.visitDate || prescription.prescriptionDate)}</p>
              </Col>
              <Col md={6}>
                <h4>Patient Information</h4>
                {patient ? (
                  <>
                    <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
                    <p><strong>Patient ID:</strong> {patient.patientId}</p>
                    <p><strong>Age:</strong> {patient.age} years</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                  </>
                ) : (
                  <p>Patient information not available</p>
                )}
              </Col>
            </Row>
            
            <hr />
            
            <h4>Prescribed Medicines</h4>
            {(prescription.prescriptionItems || prescription.medicineItems) && 
             (prescription.prescriptionItems || prescription.medicineItems).length > 0 ? (
              <Table bordered className="mt-3">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(prescription.prescriptionItems || prescription.medicineItems).map((item, index) => (
                    <tr key={index}>
                      <td>{item.medicineName || item.medicineId}</td>
                      <td>{item.dosage}</td>
                      <td>{item.frequency}</td>
                      <td>{item.duration}</td>
                    </tr>
                  ))}
                 </tbody>
               </Table>
             ) : (
               <p>No medicines prescribed</p>
             )}
            
            <hr />
            
            <h4>Notes</h4>
            <p>{prescription.notes || 'No additional notes'}</p>
            
            <div className="mt-5 text-end">
              <p>Doctor's Signature</p>
              <div className="signature-line"></div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default PrescriptionPrint;