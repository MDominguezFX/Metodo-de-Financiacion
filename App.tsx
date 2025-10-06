
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormDataState, CalculationResult } from './types';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import { formatCurrency, formatDate } from './utils/formatters';
import { parseISODate, addDays, moveToBusinessDay } from './utils/date';

// FIX: Add global declaration for html2canvas to resolve TypeScript errors.
declare global {
  interface Window {
    html2canvas: any;
  }
}

const getInitialFormData = (): FormDataState => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  return {
    totalAmount: '150000',
    currency: 'ARS',
    installments: '6',
    startDate: `${yyyy}-${mm}-${dd}`,
    useEcheqs: false,
    exchangeRate: '',
    downPaymentMode: 'pct',
    downPaymentPct: 30,
    downPaymentAmount: '',
    roundInstallments: false,
  };
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>(getInitialFormData());
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copiar');
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  
  const handleCalculate = useCallback(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const n = parseInt(formData.installments, 10) || 0;
    const startDate = formData.startDate ? parseISODate(formData.startDate) : new Date(Date.now() + new Date().getTimezoneOffset() * 60000);

    if (total <= 0 || n < 1) {
      setResult(null);
      return;
    }
    
    let downPayment = 0;
    let downPaymentPct = 0;

    if (formData.downPaymentMode === 'pct') {
      downPaymentPct = formData.downPaymentPct;
      downPayment = parseFloat((total * downPaymentPct / 100).toFixed(2));
    } else {
      const rawDownPayment = parseFloat(formData.downPaymentAmount) || 0;
      downPayment = Math.min(Math.max(rawDownPayment, 0), total);
      downPaymentPct = total > 0 ? Math.round((downPayment / total) * 100) : 0;
    }

    const balance = parseFloat((total - downPayment).toFixed(2));
    const baseInstallment = balance > 0 && n > 0 ? balance / n : 0;
    const installmentValue = formData.roundInstallments ? Math.round(baseInstallment) : parseFloat(baseInstallment.toFixed(2));
    
    const isEcheqs = formData.currency === 'USD' && formData.useEcheqs;
    const exchangeRate = parseFloat(formData.exchangeRate) || null;

    const schedule: CalculationResult['schedule'] = [];
    let totalSum = 0;
    let totalSumArs = 0;

    if (downPayment > 0) {
      const dpItem = {
        type: 'Entrega' as const,
        date: formatDate(moveToBusinessDay(startDate)),
        amount: downPayment,
        amountArs: isEcheqs && exchangeRate ? parseFloat((downPayment * exchangeRate).toFixed(2)) : undefined
      };
      schedule.push(dpItem);
      totalSum += dpItem.amount;
      if (dpItem.amountArs) totalSumArs += dpItem.amountArs;
    }

    let accumulatedInstallments = 0;
    for (let i = 1; i <= n; i++) {
      let currentInstallment = installmentValue;
      if (i === n && !formData.roundInstallments) {
          const remaining = balance - accumulatedInstallments;
          currentInstallment = parseFloat(remaining.toFixed(2));
      } else if (i === n && formData.roundInstallments) {
          currentInstallment = balance - accumulatedInstallments;
      }


      accumulatedInstallments += currentInstallment;

      const instItem = {
        type: `Cuota ${i}`,
        date: formatDate(moveToBusinessDay(addDays(startDate, 30 * i))),
        amount: currentInstallment,
        amountArs: isEcheqs && exchangeRate ? parseFloat((currentInstallment * exchangeRate).toFixed(2)) : undefined
      };
      schedule.push(instItem);
      totalSum += instItem.amount;
      if(instItem.amountArs) totalSumArs += instItem.amountArs;
    }

    setResult({
      total,
      downPayment,
      downPaymentPct,
      balance,
      installments: n,
      installmentValue,
      schedule,
      totalSum,
      totalSumArs,
      currency: formData.currency,
      isEcheqs,
      exchangeRate,
      startDate: formatDate(startDate)
    });

  }, [formData]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);
  
  useEffect(() => {
    if (formData.useEcheqs && formData.currency !== 'USD') {
      setFormData(prev => ({ ...prev, currency: 'USD' }));
    }
  }, [formData.useEcheqs, formData.currency]);


  const handleCopy = async () => {
    if (!result) return;
    
    const { currency, isEcheqs, exchangeRate, total, downPayment, downPaymentPct, balance, installments, installmentValue, schedule, startDate } = result;

    const showArsColumn = isEcheqs && exchangeRate && exchangeRate > 0;
    const headers = showArsColumn ? ["#", "Fecha", `Importe (${currency})`, "Importe (ARS)"] : ["#", "Fecha", "Importe"];
    
    const tableLines = [headers.join("\t")];
    schedule.forEach(item => {
      const row = [item.type, item.date, formatCurrency(item.amount, currency)];
      if(showArsColumn) row.push(item.amountArs ? formatCurrency(item.amountArs, 'ARS') : '—');
      tableLines.push(row.join("\t"));
    });
    const tableText = tableLines.join("\n");
    
    const tcLine = showArsColumn ? `Tipo de cambio: ${exchangeRate.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})} ARS/USD\n` : "";
    const disclaimer = "⚠️ El tipo de cambio utilizado es referencial y puede variar sin previo aviso.\n";
    
    const summary = `FORMA DE PAGO\n${tcLine}Fecha de inicio: ${startDate}\nMoneda base: ${currency}\nMonto total: ${formatCurrency(total, currency)}\nEntrega: ${formatCurrency(downPayment, currency)} (${downPaymentPct}%)\nSaldo: ${formatCurrency(balance, currency)}\nCuotas: ${installments}\nValor por cuota: ${formatCurrency(installmentValue, currency)}\n\nDetalle:\n${tableText}\n\n${disclaimer}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopyButtonText("¡Copiado!");
      setTimeout(() => setCopyButtonText("Copiar"), 1500);
    } catch (e) {
      alert("No se pudo copiar el texto.");
    }
  };

  const handleExport = async () => {
    if (!exportRef.current || !window.html2canvas) return;
    setIsExporting(true);
    
    // Brief delay to allow DOM to update with 'exporting' styles
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const canvas = await window.html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0b0c10',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = dataUrl;
      a.download = `forma_de_pago_${stamp}.png`;
      a.click();
    } catch (e) {
      console.error("Error exporting to PNG:", e);
      alert("No se pudo generar el PNG.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    setFormData(getInitialFormData());
    setResult(null);
  };

  return (
    <div className="bg-[#0e0f12] text-[#e6e7ea] min-h-screen bg-fixed" style={{
        background: `radial-gradient(1200px 600px at 20% -10%, rgba(16,163,127,.14), transparent 40%),
                     radial-gradient(800px 400px at 100% 10%, rgba(45,212,191,.10), transparent 50%),
                     linear-gradient(180deg, #0e0f12, #0b0c10 60%, #0e0f12)`
    }}>
      <main className="max-w-7xl mx-auto p-3 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <CalculatorForm 
            formData={formData}
            setFormData={setFormData}
            handleCalculate={handleCalculate}
            handleCopy={handleCopy}
            handleExport={handleExport}
            handleClear={handleClear}
            copyButtonText={copyButtonText}
          />
          <ResultsDisplay 
            result={result}
            isExporting={isExporting}
            exportRef={exportRef}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
