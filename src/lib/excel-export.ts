// Excel Export Utility for NeoBI India
// Generates XLSX files from business data

export interface ExcelSheet {
  name: string;
  data: any[];
  columns: { header: string; key: string; width?: number }[];
}

export interface ExcelExportOptions {
  filename: string;
  sheets: ExcelSheet[];
  includeTimestamp?: boolean;
}

// Convert data to CSV format (simple fallback)
function arrayToCSV(data: any[], columns: { header: string; key: string }[]): string {
  const headers = columns.map(c => c.header).join(',');
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );
  return [headers, ...rows].join('\n');
}

// Generate XML for XLSX format
function generateXLSX(sheets: ExcelSheet[]): string {
  // XLSX is essentially a ZIP file with XML content
  // For browser compatibility, we'll generate a simpler XML spreadsheet format
  const sheetContent = sheets.map((sheet, sheetIndex) => {
    const rows = sheet.data.map((row, rowIndex) => {
      const cells = sheet.columns.map((col, colIndex) => {
        const value = row[col.key];
        const cellRef = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
        const cellType = typeof value === 'number' ? 'n' : 's';
        return `<c r="${cellRef}" t="${cellType}"><v>${escapeXml(String(value ?? ''))}</v></c>`;
      }).join('');
      return `<row r="${rowIndex + 2}">${cells}</row>`;
    });

    // Header row
    const headerCells = sheet.columns.map((col, colIndex) => {
      const cellRef = `${String.fromCharCode(65 + colIndex)}1`;
      return `<c r="${cellRef}" t="s" s="1"><v>${escapeXml(col.header)}</v></c>`;
    }).join('');
    const headerRow = `<row r="1">${headerCells}</row>`;

    return { name: sheet.name, content: [headerRow, ...rows].join('') };
  });

  return sheetContent.map(s => s.content).join('\n');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Browser-compatible XLSX generation using XML Spreadsheet format
export function generateExcelXML(sheets: ExcelSheet[]): string {
  const worksheets = sheets.map(sheet => {
    const headerRow = `<Row ss:StyleID="Header">${
      sheet.columns.map((col, i) =>
        `<Cell ss:Index="${i + 1}"><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>`
      ).join('')
    }</Row>`;

    const dataRows = sheet.data.map(row => {
      const cells = sheet.columns.map((col, i) => {
        const value = row[col.key];
        const type = typeof value === 'number' ? 'Number' : 'String';
        return `<Cell ss:Index="${i + 1}"><Data ss:Type="${type}">${escapeXml(String(value ?? ''))}</Data></Cell>`;
      }).join('');
      return `<Row>${cells}</Row>`;
    }).join('\n');

    const colWidths = sheet.columns.map((col, i) =>
      `<Column ss:Index="${i + 1}" ss:AutoFitWidth="1" ss:Width="${col.width || 100}"/>`
    ).join('\n');

    return `
      <Worksheet ss:Name="${escapeXml(sheet.name)}">
        <Table>
          ${colWidths}
          ${headerRow}
          ${dataRows}
        </Table>
      </Worksheet>
    `;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Font ss:FontName="Arial" ss:Size="11"/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Arial" ss:Size="11" ss:Bold="1"/>
      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF"/>
    </Style>
    <Style ss:ID="Currency">
      <NumberFormat ss:Format="₹#,##0.00"/>
    </Style>
  </Styles>
  ${worksheets}
</Workbook>`;
}

// Main export function
export function exportToExcel(options: ExcelExportOptions): void {
  const { filename, sheets, includeTimestamp = true } = options;

  const xml = generateExcelXML(sheets);
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });

  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const fullFilename = `${filename}${timestamp}.xls`;

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Pre-built export templates for NeoBI data

export function exportBusinessProfile(profile: any): void {
  exportToExcel({
    filename: 'NeoBI_BusinessProfile',
    sheets: [{
      name: 'Business Profile',
      columns: [
        { header: 'Field', key: 'field', width: 150 },
        { header: 'Value', key: 'value', width: 200 },
      ],
      data: [
        { field: 'Company Name', value: profile.companyName || 'N/A' },
        { field: 'Industry', value: profile.industry || 'N/A' },
        { field: 'Location', value: profile.location || 'N/A' },
        { field: 'MRR (₹)', value: profile.mrr || 0 },
        { field: 'Team Size', value: profile.teamSize || 0 },
        { field: 'Founded Year', value: profile.foundedYear || 'N/A' },
        { field: 'Revenue Stage', value: profile.revenueStage || 'N/A' },
      ],
    }],
  });
}

export function exportFinancialReport(data: {
  cashflow: any[];
  gst: any;
  invoices: any[];
}): void {
  exportToExcel({
    filename: 'NeoBI_FinancialReport',
    sheets: [
      {
        name: 'Cash Flow',
        columns: [
          { header: 'Period', key: 'period', width: 100 },
          { header: 'Inflow (₹)', key: 'inflow', width: 120 },
          { header: 'Outflow (₹)', key: 'outflow', width: 120 },
          { header: 'Net (₹)', key: 'net', width: 120 },
          { header: 'Balance (₹)', key: 'balance', width: 120 },
        ],
        data: data.cashflow,
      },
      {
        name: 'GST Summary',
        columns: [
          { header: 'Metric', key: 'metric', width: 150 },
          { header: 'Value (₹)', key: 'value', width: 150 },
        ],
        data: [
          { metric: 'Total Sales', value: data.gst.totalSales || 0 },
          { metric: 'Output Tax', value: data.gst.outputTax || 0 },
          { metric: 'Input Tax Credit', value: data.gst.inputTax || 0 },
          { metric: 'Net Payable', value: data.gst.netPayable || 0 },
          { metric: 'ITC Balance', value: data.gst.itcBalance || 0 },
        ],
      },
      {
        name: 'Invoices',
        columns: [
          { header: 'Invoice ID', key: 'invoiceId', width: 100 },
          { header: 'Customer', key: 'customerName', width: 150 },
          { header: 'Amount (₹)', key: 'amount', width: 120 },
          { header: 'Status', key: 'status', width: 100 },
          { header: 'Date', key: 'date', width: 100 },
          { header: 'Due Date', key: 'dueDate', width: 100 },
        ],
        data: data.invoices,
      },
    ],
  });
}

export function exportCompetitorAnalysis(data: {
  userCompany: any;
  competitors: any[];
}): void {
  const allCompanies = [data.userCompany, ...data.competitors];

  exportToExcel({
    filename: 'NeoBI_CompetitorAnalysis',
    sheets: [{
      name: 'Competitor Benchmark',
      columns: [
        { header: 'Company', key: 'name', width: 150 },
        { header: 'Market Share (%)', key: 'marketShare', width: 120 },
        { header: 'Revenue (₹L)', key: 'revenue', width: 120 },
        { header: 'Growth Rate (%)', key: 'growthRate', width: 120 },
        { header: 'Customer Satisfaction', key: 'customerSatisfaction', width: 140 },
        { header: 'Price Competitiveness', key: 'priceCompetitiveness', width: 140 },
        { header: 'Product Quality', key: 'productQuality', width: 120 },
        { header: 'Brand Strength', key: 'brandStrength', width: 120 },
        { header: 'Digital Presence', key: 'digitalPresence', width: 120 },
        { header: 'Innovation Score', key: 'innovation', width: 120 },
      ],
      data: allCompanies,
    }],
  });
}

export function exportRoadmapDecisions(decisions: any[]): void {
  exportToExcel({
    filename: 'NeoBI_RoadmapDecisions',
    sheets: [{
      name: 'Decision History',
      columns: [
        { header: 'Step', key: 'step', width: 60 },
        { header: 'Decision', key: 'decision', width: 250 },
        { header: 'Risk Level', key: 'risk', width: 100 },
        { header: 'Expected ROI', key: 'roi', width: 120 },
        { header: 'Timeline', key: 'timeline', width: 100 },
        { header: 'Timestamp', key: 'timestamp', width: 150 },
      ],
      data: decisions.map((d, i) => ({
        step: i + 1,
        decision: d.title || d.decision,
        risk: d.risk || 'Medium',
        roi: d.roi || 'N/A',
        timeline: d.timeline || 'N/A',
        timestamp: d.timestamp || new Date().toISOString(),
      })),
    }],
  });
}

export function exportMarketAnalysis(data: {
  targetState: any;
  alternatives: any[];
  riskFactors: any[];
}): void {
  exportToExcel({
    filename: 'NeoBI_MarketAnalysis',
    sheets: [
      {
        name: 'State Comparison',
        columns: [
          { header: 'State', key: 'name', width: 120 },
          { header: 'Market Size (₹Cr)', key: 'marketSize', width: 130 },
          { header: 'Regulatory Ease', key: 'regulatoryEase', width: 120 },
          { header: 'Infrastructure Score', key: 'infrastructureScore', width: 140 },
          { header: 'Digital Penetration', key: 'digitalPenetration', width: 140 },
          { header: 'ROI Potential (%)', key: 'roiPotential', width: 120 },
        ],
        data: [data.targetState, ...data.alternatives],
      },
      {
        name: 'Risk Factors',
        columns: [
          { header: 'Risk', key: 'risk', width: 200 },
          { header: 'Severity', key: 'severity', width: 100 },
          { header: 'Mitigation', key: 'mitigation', width: 300 },
        ],
        data: data.riskFactors,
      },
    ],
  });
}

export function exportWorkforcePlan(data: {
  monthlyProjection: any[];
  roles: any[];
}): void {
  exportToExcel({
    filename: 'NeoBI_WorkforcePlan',
    sheets: [
      {
        name: 'Monthly Projection',
        columns: [
          { header: 'Month', key: 'month', width: 100 },
          { header: 'Required Staff', key: 'required', width: 120 },
          { header: 'Current Staff', key: 'current', width: 120 },
          { header: 'Gap', key: 'gap', width: 80 },
          { header: 'Festival Impact', key: 'festivalImpact', width: 120 },
        ],
        data: data.monthlyProjection,
      },
      {
        name: 'Role Requirements',
        columns: [
          { header: 'Role', key: 'role', width: 150 },
          { header: 'Needed', key: 'needed', width: 80 },
          { header: 'Priority', key: 'priority', width: 100 },
          { header: 'Monthly Cost (₹)', key: 'monthlyCost', width: 130 },
          { header: 'Hire By', key: 'hireBy', width: 100 },
        ],
        data: data.roles,
      },
    ],
  });
}
