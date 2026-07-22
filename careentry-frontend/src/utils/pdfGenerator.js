import jsPDF from 'jspdf';

export const generateAnamnesePDF = (formData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CareEntry', 20, 20);
  
  doc.setFontSize(16);
  doc.text('Anamnesebogen', 20, 30);
  
  // Datum
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, 40);
  
  // Linie
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  let yPos = 55;
  
  // Persönliche Daten
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Persönliche Daten', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const personalData = [
    ['Vorname:', formData.vorname || '-'],
    ['Nachname:', formData.nachname || '-'],
    ['Geburtsdatum:', formData.geburtsdatum ? new Date(formData.geburtsdatum).toLocaleDateString('de-DE') : '-'],
    ['Geschlecht:', formData.geschlecht || '-'],
    ['Telefon:', formData.telefon || '-'],
    ['E-Mail:', formData.email || '-'],
  ];
  
  personalData.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Medizinische Angaben
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Medizinische Angaben', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Vorerkrankungen
  doc.setFont('helvetica', 'bold');
  doc.text('Vorerkrankungen:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  const vorerkrankungenText = formData.vorerkrankungen || 'Keine angegeben';
  const vorerkrankungenLines = doc.splitTextToSize(vorerkrankungenText, 170);
  doc.text(vorerkrankungenLines, 20, yPos);
  yPos += vorerkrankungenLines.length * 6 + 5;
  
  // Medikamente
  doc.setFont('helvetica', 'bold');
  doc.text('Aktuelle Medikamente:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  const medikamenteText = formData.medikamente || 'Keine';
  const medikamenteLines = doc.splitTextToSize(medikamenteText, 170);
  doc.text(medikamenteLines, 20, yPos);
  yPos += medikamenteLines.length * 6 + 5;
  
  // Allergien
  doc.setFont('helvetica', 'bold');
  doc.text('Allergien:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  const allergienText = formData.allergien || 'Keine bekannt';
  const allergienLines = doc.splitTextToSize(allergienText, 170);
  doc.text(allergienLines, 20, yPos);
  yPos += allergienLines.length * 6 + 5;
  
  // Check if new page needed
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Aktuelle Beschwerden
  doc.setFont('helvetica', 'bold');
  doc.text('Aktuelle Beschwerden:', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  const beschwerdenText = formData.aktuelle_beschwerden || 'Keine angegeben';
  const beschwerdenLines = doc.splitTextToSize(beschwerdenText, 170);
  doc.text(beschwerdenLines, 20, yPos);
  yPos += beschwerdenLines.length * 6 + 10;
  
  // Datenschutz
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('☑ Datenschutzerklärung wurde akzeptiert', 20, yPos);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CareEntry - Digitale Patientenverwaltung', 105, 285, { align: 'center' });
  
  // Download
  const filename = `Anamnese_${formData.nachname}_${formData.vorname}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};