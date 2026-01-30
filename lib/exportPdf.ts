// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
// @ts-ignore
import type { Militant } from '@/types/militant';
import { normalizeSector } from '@/lib/fileUtils';

// ──────────────────────────────────────────────
// EXPORT MILITANTS AU FORMAT PDF
// ──────────────────────────────────────────────
export const exportToPDF = async (militants: Militant[]) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // Charger logo (essayez plusieurs extensions)
    let logoBase64: string | undefined;
    const logoCandidates = ['/photo1.png', '/photo1.PNG', '/photo1.jpg', '/photo1.jpeg'];
    for (const url of logoCandidates) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const blob = await res.blob();
        const reader = new FileReader();
        logoBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        if (logoBase64) break;
      } catch (e) {
        // ignore and try next
      }
    }

    const pageWidth = (doc as any).internal.pageSize.getWidth();

    // En-tête professionnel
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 40, 30, 60, 60);
    }
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text('COMITÉ DE VIGILANCE ET D\'ACTION VILLAGEOISE (CVAV)', pageWidth / 2, 48, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);
    doc.text('Liste des militants', pageWidth / 2, 66, { align: 'center' });
    doc.setFontSize(9);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} • Total: ${militants.length}`, pageWidth - 40, 66, { align: 'right' });

    // Préparation des données du tableau
    const tableData = militants.map((militant, index) => {
        const dateAjout = militant.createdAt ? new Date(militant.createdAt).toLocaleDateString('fr-FR') : '-';
        return [
            (index + 1).toString(),
            militant.prenom ?? '-',
            militant.nom ?? '-',
            militant.sexe === 'M' ? 'Homme' : militant.sexe === 'F' ? 'Femme' : '-',
            militant.paroisse ?? '-',
            normalizeSector(militant.secteur),
            militant.grade ?? '-',
            militant.quartier ?? '-',
            militant.telephone ?? '-',
            dateAjout
        ];
    });

    // Configuration du tableau
    (autoTable as any)(doc, {
        head: [
            ['#', 'Prénom', 'Nom', 'Sexe', 'Paroisse', 'Secteur', 'Grade', 'Quartier', 'Téléphone', 'Date ajout']
        ],
        body: tableData,
        startY: 100,
        theme: 'striped',
        headStyles: {
            fillColor: [20, 78, 162],
            textColor: 255,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [40, 40, 40],
            cellPadding: 4
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        styles: { cellWidth: 'wrap', lineColor: [209, 213, 219], lineWidth: 0.1 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 70 },
            2: { cellWidth: 80 },
            3: { cellWidth: 40 },
            4: { cellWidth: 90 },
            5: { cellWidth: 80 },
            6: { cellWidth: 70 },
            7: { cellWidth: 70 },
            8: { cellWidth: 70 },
            9: { cellWidth: 60 }
        },
        margin: { left: 40, right: 40, top: 100 }
    });

    // Pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${i} / ${pageCount} — CVAV`, pageWidth / 2, (doc as any).internal.pageSize.getHeight() - 30, { align: 'center' });
    }

    // Téléchargement
    doc.save(`Militants_CVAV_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ──────────────────────────────────────────────
// EXPORT D'UNE ATTESTATION AU FORMAT PDF
// ──────────────────────────────────────────────
export const exportAttestationToPDF = async (attestation: any) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = (doc as any).internal.pageSize.getWidth();

  // Charger logo si présent
  let logoBase64: string | undefined;
  const logoCandidates = ['/photo1.png', '/photo1.PNG', '/photo1.jpg', '/photo1.jpeg'];
  for (const url of logoCandidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      const reader = new FileReader();
      logoBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      if (logoBase64) break;
    } catch (e) {
      // ignore
    }
  }

  // Header
  if (logoBase64) doc.addImage(logoBase64, 'PNG', 40, 30, 60, 60);
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("COMITÉ DE VIGILANCE ET D'ACTION VILLAGEOISE (CVAV)", pageWidth / 2, 50, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Attestation officielle`, pageWidth / 2, 68, { align: 'center' });

  let cursorY = 110;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION', pageWidth / 2, cursorY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  cursorY += 30;

  // Watermark if draft
  if (!attestation.soumise) {
    doc.setTextColor(230, 80, 80);
    doc.setFontSize(72);
    doc.setGState?.({ opacity: 0.08 });
    try { (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 })); } catch (e) {}
    doc.text('BROUILLON', pageWidth / 2, (doc as any).internal.pageSize.getHeight() / 2, { align: 'center', angle: -35 });
    doc.setTextColor(30, 30, 30);
    try { (doc as any).setGState(new (doc as any).GState({ opacity: 1 })); } catch (e) {}
    cursorY += 10;
  }

  // Corps de l'attestation
  const fullName = `${attestation.prenom || '-'} ${attestation.nom || '-'}`;
  doc.setFontSize(12);
  const lines = [
    `Nous, soussignés, certifions que :`,
    '',
    `${fullName}`,
    '',
    `Originaire de la paroisse: ${attestation.paroisse || '-'}`,
    `Secteur: ${attestation.secteur || '-'}`,
    `Année fin de formation: ${attestation.anneeFinFormation ?? '-'}`,
    `Lieu dernier camp: ${attestation.lieuDernierCamp || '-'}`,
    '',
    `Numéro d'attestation: ${attestation.numeroAttestation || '—'}`,
    `Date de validation: ${attestation.dateValidation ? new Date(attestation.dateValidation).toLocaleDateString('fr-FR') : (attestation.dateSoumission ? new Date(attestation.dateSoumission).toLocaleDateString('fr-FR') : '—')}`,
  ];

  lines.forEach((ln) => {
    doc.text(ln, 72, cursorY);
    cursorY += 18;
  });

  cursorY += 12;

  // Signature block
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  const sigX = pageWidth - 220;
  const sigY = cursorY + 30;
  doc.line(sigX, sigY, sigX + 160, sigY);
  doc.setFontSize(10);
  doc.text('Signature de l’autorité', sigX, sigY + 14);

  // Optional scanned bulletin preview (if URL present)
  if (attestation.bulletinScanne && typeof attestation.bulletinScanne === 'string') {
    try {
      const res = await fetch(attestation.bulletinScanne);
      if (res.ok) {
        const blob = await res.blob();
        const reader = new FileReader();
        const imgBase64: string = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        doc.addImage(imgBase64, 'JPEG', 72, sigY + 40, 120, 120);
      }
    } catch (e) {
      // ignore image load errors
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} — CVAV`, pageWidth / 2, (doc as any).internal.pageSize.getHeight() - 30, { align: 'center' });

  // Save
  const name = (attestation.numeroAttestation) ? `Attestation_${attestation.numeroAttestation}.pdf` : `Attestation_${(attestation.prenom||'')}_${(attestation.nom||'')}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(name);
};

// ──────────────────────────────────────────────
// EXPORT STATISTIQUES AU FORMAT PDF
// ──────────────────────────────────────────────
export const exportStatsToPDF = async (stats: any) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = (doc as any).internal.pageSize.getWidth();

  // Charger logo si présent
  let logoBase64: string | undefined;
  const logoCandidates = ['/photo1.png', '/photo1.PNG', '/photo1.jpg', '/photo1.jpeg'];
  for (const url of logoCandidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      const reader = new FileReader();
      logoBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      if (logoBase64) break;
    } catch (e) {
      // ignore
    }
  }

  // Header
  if (logoBase64) doc.addImage(logoBase64, 'PNG', 40, 30, 60, 60);
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('COMITÉ DE VIGILANCE ET D\'ACTION VILLAGEOISE (CVAV)', pageWidth / 2, 50, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Rapport synthétique — Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 66, { align: 'center' });

  let cursorY = 90;

  // Métriques principales
  const metrics = [
    { label: 'Utilisateurs', value: stats.statsGenerales?.totalUtilisateurs ?? '-' },
    { label: 'Militants', value: stats.statsGenerales?.totalMilitants ?? '-' },
    { label: 'Attestations (total)', value: stats.statsAttestations?.total ?? '-' },
    { label: 'Cérémonies (total)', value: stats.statsCeremonies?.total ?? '-' },
  ];

  doc.setFontSize(11);
  metrics.forEach((m, i) => {
    const x = 40 + (i % 2) * (pageWidth / 2 - 60);
    if (i > 0 && i % 2 === 0) cursorY += 48;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(m.label, x, cursorY + 10);
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text(String(m.value), x, cursorY + 30);
  });
  cursorY += 80;

  // Répartition par secteur (table)
  if (stats.repartitionParSecteur && stats.repartitionParSecteur.length) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Répartition par Secteur', 40, cursorY);
    cursorY += 8;

    const sectorTable = (stats.repartitionParSecteur || []).map((s: any) => [
      normalizeSector(s.secteur),
      String(s.militants || 0),
      String(s.attestations || 0)
    ]);
    (autoTable as any)(doc, {
      startY: cursorY + 8,
      head: [['Secteur', 'Militants', 'Attestations']],
      body: sectorTable,
      styles: { fontSize: 9 },
      margin: { left: 40, right: 40 }
    });
    cursorY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : cursorY + 120;
  }

  // Top paroisses
  if (stats.repartitionParParoisse && stats.repartitionParParoisse.length) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Top Paroisses', 40, cursorY);
    cursorY += 8;

    const paroisseTable = (stats.repartitionParParoisse || []).slice(0, 20).map((p: any, i: number) => [
      String(i + 1),
      p.paroisse,
      String(p.militants || 0),
      String(p.attestations || 0)
    ]);
    (autoTable as any)(doc, {
      startY: cursorY + 8,
      head: [['#', 'Paroisse', 'Militants', 'Attestations']],
      body: paroisseTable,
      styles: { fontSize: 9 },
      margin: { left: 40, right: 40 }
    });
    cursorY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : cursorY + 220;
  }

  // Footer: page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${i} / ${pageCount} — CVAV`, pageWidth / 2, (doc as any).internal.pageSize.getHeight() - 30, { align: 'center' });
  }

  doc.save(`Statistiques_CVAV_${new Date().toISOString().slice(0, 10)}.pdf`);
};
