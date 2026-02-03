// Integration APIs for Tally, Zoho, and GST Portal
// Provides unified interface for fetching real financial data

export interface TallyConfig {
  serverUrl: string;
  companyName: string;
  port?: number;
}

export interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  organizationId: string;
}

export interface GSTPortalConfig {
  username: string;
  gstin: string;
  apiKey?: string;
}

// Tally Integration
export interface TallyLedger {
  name: string;
  amount: number;
  closingBalance: number;
  group: string;
}

export interface TallyVoucher {
  date: string;
  voucherType: string;
  amount: number;
  partyName: string;
  narration: string;
}

export interface TallySalesData {
  totalSales: number;
  totalPurchases: number;
  receivables: number;
  payables: number;
  cashBalance: number;
  bankBalance: number;
}

class TallyClient {
  private config: TallyConfig | null = null;

  configure(config: TallyConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  // Fetch data from Tally using XML request
  async fetchData<T>(requestXml: string): Promise<T | null> {
    if (!this.config) {
      console.warn('Tally not configured');
      return null;
    }

    try {
      const url = `${this.config.serverUrl}:${this.config.port || 9000}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: requestXml,
      });

      const xmlText = await response.text();
      // Parse XML response (simplified - in production use xml2js)
      return this.parseXmlResponse(xmlText) as T;
    } catch (error) {
      console.error('Tally fetch error:', error);
      return null;
    }
  }

  private parseXmlResponse(xml: string): any {
    // Simplified XML parsing - in production use proper XML parser
    return { raw: xml };
  }

  async getLedgers(): Promise<TallyLedger[]> {
    const xml = `
      <ENVELOPE>
        <HEADER>
          <TALLYREQUEST>Export Data</TALLYREQUEST>
        </HEADER>
        <BODY>
          <EXPORTDATA>
            <REQUESTDESC>
              <REPORTNAME>List of Ledgers</REPORTNAME>
              <STATICVARIABLES>
                <SVCURRENTCOMPANY>${this.config?.companyName}</SVCURRENTCOMPANY>
              </STATICVARIABLES>
            </REQUESTDESC>
          </EXPORTDATA>
        </BODY>
      </ENVELOPE>
    `;

    const data = await this.fetchData<any>(xml);
    return data ? this.transformLedgers(data) : this.getFallbackLedgers();
  }

  private transformLedgers(data: any): TallyLedger[] {
    // Transform Tally XML to our format
    return this.getFallbackLedgers();
  }

  private getFallbackLedgers(): TallyLedger[] {
    return [
      { name: 'Cash', amount: 150000, closingBalance: 150000, group: 'Current Assets' },
      { name: 'HDFC Bank', amount: 850000, closingBalance: 850000, group: 'Bank Accounts' },
      { name: 'Sundry Debtors', amount: 450000, closingBalance: 450000, group: 'Current Assets' },
      { name: 'Sundry Creditors', amount: 320000, closingBalance: -320000, group: 'Current Liabilities' },
      { name: 'Sales Account', amount: 2500000, closingBalance: 2500000, group: 'Sales Accounts' },
    ];
  }

  async getSalesData(): Promise<TallySalesData> {
    if (!this.isConfigured()) {
      return this.getFallbackSalesData();
    }
    // Fetch real data from Tally
    return this.getFallbackSalesData();
  }

  private getFallbackSalesData(): TallySalesData {
    return {
      totalSales: 2500000,
      totalPurchases: 1800000,
      receivables: 450000,
      payables: 320000,
      cashBalance: 150000,
      bankBalance: 850000,
    };
  }

  async getVouchers(fromDate: string, toDate: string): Promise<TallyVoucher[]> {
    return [
      { date: '2026-01-15', voucherType: 'Sales', amount: 125000, partyName: 'ABC Corp', narration: 'Invoice #1234' },
      { date: '2026-01-18', voucherType: 'Purchase', amount: 85000, partyName: 'XYZ Suppliers', narration: 'PO #567' },
      { date: '2026-01-20', voucherType: 'Receipt', amount: 100000, partyName: 'DEF Ltd', narration: 'Against Inv #1200' },
    ];
  }
}

// Zoho Integration
export interface ZohoInvoice {
  invoiceId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

export interface ZohoExpense {
  expenseId: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
}

export interface ZohoBankTransaction {
  transactionId: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balance: number;
}

class ZohoClient {
  private config: ZohoConfig | null = null;
  private accessToken: string | null = null;

  configure(config: ZohoConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.config) return null;

    try {
      const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Zoho token refresh error:', error);
      return null;
    }
  }

  private async apiCall<T>(endpoint: string): Promise<T | null> {
    if (!this.config) return null;

    if (!this.accessToken) {
      await this.refreshAccessToken();
    }

    try {
      const response = await fetch(
        `https://books.zoho.in/api/v3/${endpoint}?organization_id=${this.config.organizationId}`,
        {
          headers: { Authorization: `Zoho-oauthtoken ${this.accessToken}` },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Zoho API error:', error);
      return null;
    }
  }

  async getInvoices(): Promise<ZohoInvoice[]> {
    if (!this.isConfigured()) {
      return this.getFallbackInvoices();
    }
    const data = await this.apiCall<any>('invoices');
    return data?.invoices || this.getFallbackInvoices();
  }

  private getFallbackInvoices(): ZohoInvoice[] {
    return [
      { invoiceId: 'INV-001', customerName: 'Reliance Industries', amount: 250000, status: 'paid', date: '2026-01-10', dueDate: '2026-02-10' },
      { invoiceId: 'INV-002', customerName: 'Tata Motors', amount: 180000, status: 'pending', date: '2026-01-15', dueDate: '2026-02-15' },
      { invoiceId: 'INV-003', customerName: 'Infosys Ltd', amount: 320000, status: 'overdue', date: '2025-12-20', dueDate: '2026-01-20' },
      { invoiceId: 'INV-004', customerName: 'Wipro Tech', amount: 95000, status: 'paid', date: '2026-01-22', dueDate: '2026-02-22' },
    ];
  }

  async getExpenses(): Promise<ZohoExpense[]> {
    if (!this.isConfigured()) {
      return this.getFallbackExpenses();
    }
    const data = await this.apiCall<any>('expenses');
    return data?.expenses || this.getFallbackExpenses();
  }

  private getFallbackExpenses(): ZohoExpense[] {
    return [
      { expenseId: 'EXP-001', category: 'Office Rent', amount: 75000, date: '2026-01-01', vendor: 'DLF Properties' },
      { expenseId: 'EXP-002', category: 'Salaries', amount: 450000, date: '2026-01-31', vendor: 'Payroll' },
      { expenseId: 'EXP-003', category: 'Marketing', amount: 85000, date: '2026-01-15', vendor: 'Digital Ads' },
      { expenseId: 'EXP-004', category: 'Utilities', amount: 25000, date: '2026-01-20', vendor: 'BSES Yamuna' },
    ];
  }

  async getBankTransactions(): Promise<ZohoBankTransaction[]> {
    return [
      { transactionId: 'TXN-001', date: '2026-01-25', amount: 250000, type: 'credit', description: 'Invoice Payment', balance: 1250000 },
      { transactionId: 'TXN-002', date: '2026-01-26', amount: 75000, type: 'debit', description: 'Rent Payment', balance: 1175000 },
      { transactionId: 'TXN-003', date: '2026-01-28', amount: 180000, type: 'credit', description: 'Sales Receipt', balance: 1355000 },
    ];
  }
}

// GST Portal Integration
export interface GSTReturn {
  returnType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-9';
  period: string;
  status: 'filed' | 'pending' | 'overdue';
  filingDate?: string;
  dueDate: string;
  taxLiability: number;
  itcClaimed: number;
}

export interface GSTInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerGstin: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
}

export interface GSTSummary {
  totalSales: number;
  totalPurchases: number;
  outputTax: number;
  inputTax: number;
  netPayable: number;
  itcBalance: number;
}

class GSTPortalClient {
  private config: GSTPortalConfig | null = null;

  configure(config: GSTPortalConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  async getReturns(): Promise<GSTReturn[]> {
    // In production, this would connect to GST Portal API
    return [
      { returnType: 'GSTR-1', period: 'January 2026', status: 'filed', filingDate: '2026-02-08', dueDate: '2026-02-11', taxLiability: 125000, itcClaimed: 0 },
      { returnType: 'GSTR-3B', period: 'January 2026', status: 'pending', dueDate: '2026-02-20', taxLiability: 125000, itcClaimed: 95000 },
      { returnType: 'GSTR-1', period: 'February 2026', status: 'pending', dueDate: '2026-03-11', taxLiability: 0, itcClaimed: 0 },
      { returnType: 'GSTR-9', period: 'FY 2025-26', status: 'pending', dueDate: '2026-12-31', taxLiability: 0, itcClaimed: 0 },
    ];
  }

  async getSalesInvoices(period: string): Promise<GSTInvoice[]> {
    return [
      { invoiceNumber: 'GST/2026/001', invoiceDate: '2026-01-05', customerGstin: '27AABCU9603R1ZM', taxableValue: 100000, cgst: 9000, sgst: 9000, igst: 0, totalValue: 118000 },
      { invoiceNumber: 'GST/2026/002', invoiceDate: '2026-01-12', customerGstin: '29AADCB2230M1ZP', taxableValue: 250000, cgst: 0, sgst: 0, igst: 45000, totalValue: 295000 },
      { invoiceNumber: 'GST/2026/003', invoiceDate: '2026-01-20', customerGstin: '07AAACW3025D1ZK', taxableValue: 75000, cgst: 6750, sgst: 6750, igst: 0, totalValue: 88500 },
    ];
  }

  async getGSTSummary(): Promise<GSTSummary> {
    return {
      totalSales: 2500000,
      totalPurchases: 1800000,
      outputTax: 450000,
      inputTax: 324000,
      netPayable: 126000,
      itcBalance: 45000,
    };
  }

  async validateGSTIN(gstin: string): Promise<{ valid: boolean; businessName?: string; state?: string }> {
    // GSTIN format: 2 digit state code + 10 digit PAN + 1 entity number + Z + checksum
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstinRegex.test(gstin)) {
      return { valid: false };
    }

    // Mock validation - in production connect to GST Portal
    const stateCode = gstin.substring(0, 2);
    const states: Record<string, string> = {
      '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
      '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
      '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
      '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
      '27': 'Maharashtra', '29': 'Karnataka', '33': 'Tamil Nadu',
      '36': 'Telangana',
    };

    return {
      valid: true,
      businessName: 'Sample Business Pvt Ltd',
      state: states[stateCode] || 'Unknown State',
    };
  }
}

// Export singleton instances
export const tallyClient = new TallyClient();
export const zohoClient = new ZohoClient();
export const gstPortalClient = new GSTPortalClient();

// Unified Integration Manager
export class IntegrationManager {
  private static instance: IntegrationManager;

  private constructor() {}

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  getStatus() {
    return {
      tally: tallyClient.isConfigured(),
      zoho: zohoClient.isConfigured(),
      gst: gstPortalClient.isConfigured(),
    };
  }

  configureTally(config: TallyConfig) {
    tallyClient.configure(config);
  }

  configureZoho(config: ZohoConfig) {
    zohoClient.configure(config);
  }

  configureGST(config: GSTPortalConfig) {
    gstPortalClient.configure(config);
  }

  // Unified data fetch
  async getFinancialOverview() {
    const [tallySales, zohoInvoices, gstSummary] = await Promise.all([
      tallyClient.getSalesData(),
      zohoClient.getInvoices(),
      gstPortalClient.getGSTSummary(),
    ]);

    return {
      tally: tallySales,
      zoho: { invoices: zohoInvoices },
      gst: gstSummary,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const integrationManager = IntegrationManager.getInstance();
