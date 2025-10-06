
import React from 'react';
import type { FormDataState, Currency, DownPaymentMode } from '../types';

interface CalculatorFormProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleCalculate: () => void;
  handleCopy: () => Promise<void>;
  handleExport: () => void;
  handleClear: () => void;
  copyButtonText: string;
}

const Chip: React.FC<{ value: number; current: number; onClick: (value: number) => void }> = ({ value, current, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`border border-[#1a1f27] bg-[#0c1014] py-2 px-3.5 rounded-xl cursor-pointer font-semibold text-[#cdd6de] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#263142] ${current === value ? 'bg-[#0d1519] border-[#2a3a46] text-[#e8f9f3]' : ''}`}
  >
    {value}%
  </button>
);


const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formData,
  setFormData,
  handleCalculate,
  handleCopy,
  handleExport,
  handleClear,
  copyButtonText,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    setFormData(prev => ({ ...prev, currency: newCurrency }));
  };
  
  const handleDownPaymentModeChange = (mode: DownPaymentMode) => {
    setFormData(prev => ({...prev, downPaymentMode: mode}));
  };

  const handleDownPaymentPctChange = (value: number) => {
    setFormData(prev => ({ ...prev, downPaymentPct: value, downPaymentMode: 'pct' }));
  };

  const isEcheqsEnabled = formData.currency === 'USD' && formData.useEcheqs;
  const showEcheqHint = formData.useEcheqs && formData.currency !== 'USD';

  return (
    <section className="bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent bg-[#101216] border border-[#1a1f27] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-bold tracking-wide text-[#e6e7ea] flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10a37f] shadow-[0_0_18px_#10a37f]"></span>
          Forma de pago — sin interés
        </h1>
        <h2 className="text-lg font-semibold text-[#e6e7ea]">Ingreso de datos</h2>

        <div>
          <label htmlFor="totalAmount" className="block mb-1.5 text-sm font-semibold text-[#d6dde4]">Monto total</label>
          <input id="totalAmount" type="number" min="0" step="0.01" placeholder="Ej.: 150000" value={formData.totalAmount} onChange={handleInputChange} className="w-full p-3.5 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base focus:border-[#2dd4bf]/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className="block mb-1.5 text-sm font-semibold text-[#d6dde4]">Moneda</label>
            <select id="currency" value={formData.currency} onChange={handleCurrencyChange} className="w-full p-3.5 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base focus:border-[#2dd4bf]/50">
              <option value="ARS">ARS — Pesos argentinos</option>
              <option value="USD">USD — Dólares</option>
            </select>
          </div>
          <div>
            <label htmlFor="installments" className="block mb-1.5 text-sm font-semibold text-[#d6dde4]">Cuotas (n)</label>
            <input id="installments" type="number" min="1" step="1" placeholder="Ej.: 6" value={formData.installments} onChange={handleInputChange} className="w-full p-3.5 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base focus:border-[#2dd4bf]/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="startDate" className="block mb-1.5 text-sm font-semibold text-[#d6dde4]">Fecha de inicio</label>
            <input id="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="w-full p-3.5 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base focus:border-[#2dd4bf]/50" />
          </div>
          <div className="text-sm text-[#9aa3ad] pb-1">Cuotas cada 30 días (mueve a lunes si cae fin de semana)</div>
        </div>

        <div className="border border-dashed border-[#1f2a34] rounded-xl p-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label htmlFor="useEcheqs" className="flex items-center gap-2 cursor-pointer">
              <input id="useEcheqs" type="checkbox" checked={formData.useEcheqs} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-[48px] h-[26px] bg-[#12161c] peer-checked:bg-[#113c32] rounded-full relative transition-colors border border-[#2a3442] peer-checked:border-[#1b6b56]">
                <div className="w-5 h-5 bg-[#e5e7eb] rounded-full absolute top-0.5 left-0.5 peer-checked:left-[26px] transition-all"></div>
              </div>
              <span className="font-semibold text-[#d6dde4]">Pago con <strong>E-CHEQS</strong> (USD → ARS)</span>
            </label>
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <label htmlFor="exchangeRate" className="text-sm font-semibold text-[#d6dde4]">TC ARS/USD</label>
              <input id="exchangeRate" type="number" min="0" step="0.01" placeholder="Ej.: 1500.00" value={formData.exchangeRate} onChange={handleInputChange} disabled={!isEcheqsEnabled} className="w-full p-2 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#2dd4bf]/50" />
            </div>
          </div>
           {showEcheqHint && <div className="text-xs text-[#c9d4df]">Se cambió la moneda a <strong>USD</strong> para habilitar E-CHEQS. Ingresá el <strong>tipo de cambio</strong> y tocá <strong>Calcular</strong>.</div>}
        </div>
        
        <div className="border border-dashed border-[#1f2a34] rounded-xl p-2.5 space-y-2">
            <div className="flex gap-2 bg-[#0c1014] border border-[#1a1f27] rounded-xl p-1.5">
                <button type="button" onClick={() => handleDownPaymentModeChange('pct')} className={`flex-1 p-3 rounded-lg font-bold text-base transition-colors ${formData.downPaymentMode === 'pct' ? 'bg-[#0d1519] border border-[#2a3a46] text-[#e8f9f3]' : 'text-[#cdd6de] border border-transparent'}`}>Entrega %</button>
                <button type="button" onClick={() => handleDownPaymentModeChange('amount')} className={`flex-1 p-3 rounded-lg font-bold text-base transition-colors ${formData.downPaymentMode === 'amount' ? 'bg-[#0d1519] border border-[#2a3a46] text-[#e8f9f3]' : 'text-[#cdd6de] border border-transparent'}`}>Entrega $</button>
            </div>

            {formData.downPaymentMode === 'pct' ? (
                 <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="downPaymentPct" className="text-sm font-semibold text-[#d6dde4]">Porcentaje</label>
                        <span className="px-2.5 py-1.5 rounded-lg bg-[#0d1418] border border-[#1a1f27] font-bold text-[#bfe7da] min-w-[56px] text-center">{formData.downPaymentPct}%</span>
                    </div>
                    <input id="downPaymentPct" type="range" min="0" max="90" step="5" value={formData.downPaymentPct} onChange={e => setFormData(p => ({...p, downPaymentPct: Number(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[0, 10, 20, 30, 40, 50].map(p => <Chip key={p} value={p} current={formData.downPaymentPct} onClick={handleDownPaymentPctChange} />)}
                    </div>
                 </div>
            ) : (
                <div className="pt-2">
                     <label htmlFor="downPaymentAmount" className="block mb-1.5 text-sm font-semibold text-[#d6dde4]">Monto de entrega (fijo)</label>
                     <input id="downPaymentAmount" type="number" min="0" step="0.01" placeholder="Ej.: 45000" value={formData.downPaymentAmount} onChange={handleInputChange} className="w-full p-3.5 bg-[#0b0d11] border border-[#1a1f27] text-[#e6e7ea] rounded-xl outline-none text-base focus:border-[#2dd4bf]/50" />
                     <p className="mt-1.5 text-xs text-[#9aa3ad]">Si excede el total, se ajusta automáticamente.</p>
                </div>
            )}
             <p className="text-xs text-[#9aa3ad]">La entrega se descuenta del total y el <strong>saldo</strong> se divide en n cuotas.</p>
        </div>


        <label htmlFor="roundInstallments" className="flex items-center gap-2.5 mt-4 cursor-pointer">
          <input id="roundInstallments" type="checkbox" checked={formData.roundInstallments} onChange={handleInputChange} className="sr-only peer" />
          <div className="w-[48px] h-[26px] bg-[#12161c] peer-checked:bg-[#113c32] rounded-full relative transition-colors border border-[#2a3442] peer-checked:border-[#1b6b56]">
            <div className="w-5 h-5 bg-[#e5e7eb] rounded-full absolute top-0.5 left-0.5 peer-checked:left-[26px] transition-all"></div>
          </div>
          <span className="text-sm text-[#9aa3ad]">Redondear cada cuota al entero más cercano</span>
        </label>
        
        <div className="flex flex-wrap gap-2.5 mt-4">
            <button onClick={handleCalculate} className="flex-1 btn primary bg-gradient-to-b from-[#10a37f] to-[#0b7e62] border-[#0d5d49]">Calcular</button>
            <button onClick={handleCopy} className="flex-1 btn">{copyButtonText}</button>
            <button onClick={handleExport} className="flex-1 btn">PNG</button>
            <button onClick={handleClear} className="flex-1 btn">Limpiar</button>
        </div>

      </div>
    </section>
  );
};

export default CalculatorForm;
