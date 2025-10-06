
import React, { useRef } from 'react';
import type { CalculationResult } from '../types';
import StatCard from './StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ResultsDisplayProps {
  result: CalculationResult | null;
  isExporting: boolean;
  exportRef: React.RefObject<HTMLDivElement>;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isExporting, exportRef }) => {
  if (!result) {
    return (
      <section className="bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent bg-[#101216] border border-[#1a1f27] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
        <div className="p-4 text-center text-[#9aa3ad]">
          Ingrese los datos y presione "Calcular" para ver el plan de pagos.
        </div>
      </section>
    );
  }

  const {
    total,
    downPayment,
    downPaymentPct,
    balance,
    installments,
    installmentValue,
    schedule,
    totalSum,
    totalSumArs,
    currency,
    isEcheqs,
    exchangeRate,
    startDate
  } = result;

  const showArsColumn = isEcheqs && exchangeRate && exchangeRate > 0;

  return (
    <section ref={exportRef} className={`${isExporting ? 'bg-[#0b0c10]' : ''}`}>
      <div className={`bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent bg-[#101216] border border-[#1a1f27] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden ${isExporting ? '!shadow-none bg-[#0b0c10]' : ''}`}>
        <div className="p-4">
          <div className="flex justify-between items-center gap-2.5 flex-wrap mb-2">
            <div className="text-2xl font-extrabold tracking-wider uppercase text-[#e6e7ea]">Forma de Pago</div>
            <span className="px-3 py-1.5 border border-[#1a1f27] rounded-full text-xs text-[#cfeee4]">
              Fecha de inicio: {startDate}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
            <StatCard label="Monto total" value={formatCurrency(total, currency)} />
            <StatCard label="Entrega" value={`${formatCurrency(downPayment, currency)} (${downPaymentPct}%)`} />
            <StatCard label="Saldo" value={formatCurrency(balance, currency)} />
            <StatCard label="Cuotas" value={String(installments)} />
            <StatCard label="Valor por cuota" value={formatCurrency(installmentValue, currency)} />
          </div>

          {isEcheqs && (
            <div className="mt-2 text-xs text-[#a6b3bf]">
              {exchangeRate && exchangeRate > 0
                ? `E-CHEQS activo · Tipo de cambio: ${exchangeRate.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARS/USD`
                : "E-CHEQS activo · Ingresá un tipo de cambio ARS/USD válido para ver importes en ARS."
              }
            </div>
          )}

          <div className="mt-3 w-full overflow-auto rounded-xl border border-[#1a1f27]">
            <table className="w-full border-collapse min-w-[560px]">
              <thead className={`${isExporting ? 'bg-[#0e1218]' : ''}`}>
                <tr>
                  <th className="sticky top-0 p-3 text-left text-sm font-semibold text-[#d1d7de] bg-[#0e1218] whitespace-nowrap">#</th>
                  <th className="sticky top-0 p-3 text-left text-sm font-semibold text-[#d1d7de] bg-[#0e1218] whitespace-nowrap">Fecha</th>
                  <th className="sticky top-0 p-3 text-left text-sm font-semibold text-[#d1d7de] bg-[#0e1218] whitespace-nowrap">Importe {showArsColumn ? `(${currency})` : ''}</th>
                  {showArsColumn && <th className="sticky top-0 p-3 text-left text-sm font-semibold text-[#d1d7de] bg-[#0e1218] whitespace-nowrap">Importe (ARS)</th>}
                </tr>
              </thead>
              <tbody className="text-[#e6e7ea]">
                {schedule.map((item, index) => (
                  <tr key={index} className="border-b border-[#1a1f27] last:border-b-0">
                    <td className="p-3 whitespace-nowrap">{item.type}</td>
                    <td className="p-3 whitespace-nowrap">{item.date}</td>
                    <td className="p-3 whitespace-nowrap">{formatCurrency(item.amount, currency)}</td>
                    {showArsColumn && <td className="p-3 whitespace-nowrap">{item.amountArs ? formatCurrency(item.amountArs, 'ARS') : '—'}</td>}
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-bold text-[#e6e7ea]">
                <tr>
                  <td colSpan={showArsColumn ? 3 : 2} className="p-3">Total (Entrega + Cuotas)</td>
                  <td className="p-3">{showArsColumn ? formatCurrency(totalSumArs || 0, 'ARS') : formatCurrency(totalSum, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-3 text-center text-xs text-[#9aa7b3]">
            Sin interés. Fechas: cada 30 días desde la fecha de inicio, moviendo a lunes si cae fin de semana.
            <div className="mt-1">⚠️ El tipo de cambio utilizado es referencial y puede variar sin previo aviso.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
