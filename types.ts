
export type Currency = "ARS" | "USD";
export type DownPaymentMode = "pct" | "amount";

export interface FormDataState {
  totalAmount: string;
  currency: Currency;
  installments: string;
  startDate: string;
  useEcheqs: boolean;
  exchangeRate: string;
  downPaymentMode: DownPaymentMode;
  downPaymentPct: number;
  downPaymentAmount: string;
  roundInstallments: boolean;
}

export interface PaymentScheduleItem {
  type: 'Entrega' | string;
  date: string;
  amount: number;
  amountArs?: number;
}

export interface CalculationResult {
  total: number;
  downPayment: number;
  downPaymentPct: number;
  balance: number;
  installments: number;
  installmentValue: number;
  schedule: PaymentScheduleItem[];
  totalSum: number;
  totalSumArs?: number;
  currency: Currency;
  isEcheqs: boolean;
  exchangeRate: number | null;
  startDate: string;
}
