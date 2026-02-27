import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/logo.png";

type ReportOptions = {
  title: string;
  subtitle?: string;
  tables: Array<{
    heading?: string;
    columns: string[];
    rows: (string | number)[][];
  }>;
  footer?: string;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const generateReport = async (options: ReportOptions) => {
  const { title, subtitle, tables, footer } = options;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Load & draw company logo
  try {
    const logo = await loadImage(logoUrl);
    const logoHeight = 20;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    doc.addImage(logo, "PNG", 14, 10, logoWidth, logoHeight);
  } catch {
    // fallback: text brand
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Greenworld", 14, 22);
  }

  // Company info (right aligned)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Greenworld Herbal Medicine", pageWidth - 14, 14, { align: "right" });
  doc.text("Professor Mabuya", pageWidth - 14, 19, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 24, { align: "right" });

  // Divider
  doc.setDrawColor(22, 163, 74); // green-600
  doc.setLineWidth(0.8);
  doc.line(14, 34, pageWidth - 14, 34);

  // Title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 44);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 51);
  }

  let startY = subtitle ? 58 : 52;

  // Render tables
  for (const table of tables) {
    if (table.heading) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(table.heading, 14, startY);
      startY += 6;
    }

    autoTable(doc, {
      startY,
      head: [table.columns],
      body: table.rows,
      theme: "grid",
      headStyles: {
        fillColor: [22, 163, 74],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 250, 245],
      },
      margin: { left: 14, right: 14 },
    });

    startY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      footer || "Confidential — Greenworld Herbal Medicine",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
