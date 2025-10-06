<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Forma de pago — Sin interés</title>
  <meta name="description" content="Calculadora de formas de pago sin interés con entrega, fechas cada 30 días, exportación a PNG y opción E-CHEQS con tipo de cambio. Optimizada para móviles con encabezado y aviso de tipo de cambio." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg:#0e0f12; --bg2:#0b0c10; --card:#101216; --edge:#1a1f27;
      --text:#e6e7ea; --muted:#9aa3ad; --accent:#10a37f; --accent-2:#2dd4bf; --accent-3:#0b7e62;
      --warn:#f59e0b;
    }
    @media (prefers-color-scheme: dark){ :root{ color-scheme: dark light; } }
    *{box-sizing:border-box}
    html,body{min-height:100%}
    body{
      margin:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,"Helvetica Neue",Arial;
      background:radial-gradient(1200px 600px at 20% -10%, rgba(16,163,127,.14), transparent 40%),
                 radial-gradient(800px 400px at 100% 10%, rgba(45,212,191,.10), transparent 50%),
                 linear-gradient(180deg,var(--bg),var(--bg2) 60%, var(--bg));
      color:var(--text); display:flex; align-items:flex-start; justify-content:center; padding:16px 16px 24px;
      -webkit-tap-highlight-color: transparent; background-attachment: fixed;
    }
    .app{width:100%; max-width:1140px}
    .grid{display:grid; gap:16px; grid-template-columns:1fr}
    @media(min-width:1000px){ .grid{grid-template-columns:1fr 1fr} }
    .card{ background:linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.00)), var(--card);
      border:1px solid var(--edge); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.35); overflow:hidden; }
    .content{ padding:16px }
    h1{ font-size:18px; margin:0; letter-spacing:.2px; display:flex; gap:10px; align-items:center; flex-wrap:wrap }
    .dot{ width:10px; height:10px; border-radius:999px; background:var(--accent); box-shadow:0 0 18px var(--accent) }
    h2{ font-size:18px; margin:4px 0 12px; font-weight:600; color: #e6e7ea;}
    label{ display:block; margin:8px 0 6px; font-weight:600; color:#d6dde4; font-size: 14px; }

    input[type="number"], select, input[type="range"], input[type="text"], input[type="date"]{
      width:100%; padding:14px; background:#0b0d11; border:1px solid var(--edge);
      color:#e6e7ea; border-radius:12px; outline:none; font-size:16px; transition: border-color .2s;
    }
    input:focus, select:focus { border-color: var(--accent-2); }
    input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin_button{ -webkit-appearance:none; margin:0 }
    .row{ display:grid; gap:16px; grid-template-columns: 1fr 1fr; }

    .chip{ border:1px solid var(--edge); background:#0c1014; padding:10px 14px; border-radius:12px; cursor:pointer;
      font-weight:600; color:#cdd6de; transition:.2s; user-select:none; touch-action:manipulation; text-align:center; }
    .chip:hover{ transform:translateY(-1px); border-color:#263142 } .chip.active{ background:#0d1519; border-color:#2a3a46; color:#e8f9f3 }
    .chips-container { display:flex; flex-wrap:wrap; gap:8px; }

    .segmented{ display:flex; gap:8px; background:#0c1014; border:1px solid var(--edge); border-radius:12px; padding:6px; overflow:auto }
    .segmented button{
      flex:1; padding:12px 14px; background:transparent; border:1px solid transparent; border-radius:8px;
      color:#cdd6de; cursor:pointer; font-weight:700; font-size:16px; min-width:140px; touch-action:manipulation;
    }
    .segmented button.active{ background:#0d1519; border-color:#2a3a46; color:#e8f9f3 }

    .switch{display:flex; align-items:center; gap:12px; margin-top:12px; cursor:pointer;}
    .switch input{ appearance:none; width:48px; height:26px; background:#12161c; border:1px solid #2a3442; border-radius:999px; position:relative; cursor:pointer; transition:.2s background-color; }
    .switch input:checked{ background:#113c32; border-color:#1b6b56 } .switch input::after{ content:""; position:absolute; top:2px; left:2px; width:20px; height:20px; background:#e5e7eb; border-radius:50%; transition:.2s left }
    .switch input:checked::after{ left:24px; }
    .muted{ color:#9aa3ad; font-size:14px }

    .btn{ padding:14px 16px; border-radius:12px; border:1px solid var(--edge);
      background:#0b0f14; color:#e5e7eb; cursor:pointer; font-weight:700; transition:.2s; font-size:16px; flex:1 1 auto; }
    .btn:hover{ transform:translateY(-1px); border-color: #263142; }
    .btn.primary{ background:linear-gradient(180deg,var(--accent),var(--accent-3)); border-color:#0d5d49 }
    .btn.bar{ display:flex; gap:10px; flex-wrap:wrap }

    .stat{ background:linear-gradient(180deg,#0f141a,#0c1117); border:1px solid var(--edge); border-radius:14px; padding:12px; flex: 1 1 0; }
    .stat .k{ font-size:13px; color:#b1bcc7 } .stat .v{ font-size:20px; font-weight:700; letter-spacing:.2px; word-break:break-word }
    .stats-grid { display:flex; flex-wrap:wrap; gap:10px; }

    .tableWrap{ width:100%; overflow:auto; -webkit-overflow-scrolling:touch; border-radius:12px; border:1px solid var(--edge) }
    table{ width:100%; border-collapse:collapse; min-width:560px; }
    th, td{ padding:12px; border-bottom:1px solid var(--edge); text-align:left; white-space:nowrap }
    th{ color:#d1d7de; font-weight:600; background:#0e1218; position:sticky; top:0 }
    tbody tr:last-child td { border-bottom: none; }
    tfoot td{ font-weight:700; border-top: 1px solid var(--edge); }
    .footer{ text-align:center; margin-top:12px; color:#9aa7b3; font-size:12px }

    .pct-badge{ padding:6px 10px; border-radius:10px; background:#0d1418; border:1px solid var(--edge);
      font-weight:700; color:#bfe7da; min-width:60px; text-align:center }
    .group{ border:1px dashed #1f2a34; border-radius:12px; padding:12px; margin-top:16px; }

    /* ---- PNG: asegurar fondo oscuro sólido ---- */
    .exporting #exportArea{ background:#0b0c10 !important; }
    .exporting #exportArea .card{ background:#0b0c10 !important; box-shadow:none !important; }
    .exporting #exportArea th{ background:#0e1218 !important; }
    
    #exportArea{ padding:16px; background-color: transparent; }
    .headerRow{ display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:12px }
    .brandTitle{ font-size:24px; font-weight:800; letter-spacing:.6px; text-transform:uppercase }
    .badge{ padding:6px 12px; border:1px solid var(--edge); border-radius:999px; font-size:12px; color:#cfeee4 }
    .note{ font-size:13px; color:#a6b3bf }
    .disclaimer{ margin-top:10px; font-size:12px; color:#a6b3bf }
    .hint{ font-size:13px; color:#c9d4df; margin-top: 8px; }
  </style>
<script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/"
  }
}
</script>
</head>
<body>
  <div class="app">
    <div class="grid">
      <section class="card">
        <div class="content">
          <h1><span class="dot"></span>Forma de pago — sin interés</h1>
          <h2>Ingreso de datos</h2>

          <label for="monto">Monto total</label>
          <input id="monto" type="number" min="0" step="0.01" placeholder="Ej.: 150000" value="150000" />

          <div class="row" style="margin-top:16px">
            <div>
              <label for="moneda">Moneda</label>
              <select id="moneda">
                <option value="ARS" selected>ARS — Pesos argentinos</option>
                <option value="USD">USD — Dólares</option>
              </select>
            </div>
            <div>
              <label for="cuotasCustom">Cuotas (n)</label>
              <input id="cuotasCustom" type="number" min="1" step="1" placeholder="Ej.: 6" value="6" />
            </div>
          </div>

          <div class="row" style="margin-top:16px; align-items: flex-end;">
            <div>
              <label for="fechaInicio">Fecha de inicio</label>
              <input id="fechaInicio" type="date" />
            </div>
            <div class="muted" style="padding-bottom: 12px;">Cuotas cada 30 días (mueve a lunes si cae fin de semana)</div>
          </div>

          <div class="group">
            <div style="display:flex; flex-wrap: wrap; justify-content:space-between; align-items:center; gap:16px">
              <label for="echeqsToggle" class="switch" style="margin:0;">
                <input id="echeqsToggle" type="checkbox" />
                <span class="muted" style="font-weight:600; color:#d6dde4">Pago con <strong>E-CHEQS</strong> (USD → ARS)</span>
              </label>
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:200px;">
                <label for="tipoCambio" style="margin:0; white-space:nowrap;">TC ARS/USD</label>
                <input id="tipoCambio" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Ej.: 1500.00" disabled />
              </div>
            </div>
            <div id="echeqHint" class="hint" style="display:none">Se cambió la moneda a <strong>USD</strong> para habilitar E-CHEQS. Ingresá el <strong>tipo de cambio</strong> y tocá <strong>Calcular</strong>.</div>
          </div>

          <div class="group">
            <div class="segmented" role="tablist" aria-label="Modo de entrega">
              <button id="tabPct" class="active" type="button" aria-selected="true">Entrega %</button>
              <button id="tabMonto" type="button" aria-selected="false">Entrega $</button>
            </div>

            <div id="panelPct" style="margin-top:12px">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label for="entregaPct" style="margin:0">Porcentaje de entrega</label>
                <span id="entregaPctBadge" class="pct-badge">30%</span>
              </div>
              <input id="entregaPct" type="range" min="0" max="90" step="5" value="30" style="width:100%; margin-top:10px;" />
              <div class="chips-container" id="chipsEntrega" style="margin-top:10px">
                <div class="chip" data-p="0">0%</div>
                <div class="chip" data-p="10">10%</div>
                <div class="chip" data-p="20">20%</div>
                <div class="chip active" data-p="30">30%</div>
                <div class="chip" data-p="40">40%</div>
                <div class="chip" data-p="50">50%</div>
              </div>
            </div>

            <div id="panelMonto" style="margin-top:12px; display:none">
              <label for="entregaMonto" style="margin-top:0">Monto de entrega (fijo)</label>
              <input id="entregaMonto" type="number" min="0" step="0.01" placeholder="Ej.: 45000" />
              <div class="muted" style="margin-top:6px">Si excede el total, se ajusta automáticamente.</div>
            </div>

            <div class="muted" style="margin-top:10px">La entrega se descuenta del total y el <strong>saldo</strong> se divide en n cuotas.</div>
          </div>

          <label for="redondear" class="switch">
            <input id="redondear" type="checkbox" />
            <span class="muted">Redondear cada cuota al entero más cercano</span>
          </label>

          <div class="btn bar" style="margin-top:16px">
            <button id="calcular" class="btn primary">Calcular</button>
            <button id="copiar" class="btn">Copiar</button>
            <button id="imprimir" class="btn">PNG</button>
            <button id="limpiar" class="btn">Limpiar</button>
          </div>
        </div>
      </section>

      <div id="exportArea">
        <section class="card">
          <div class="content">
            <div class="headerRow">
              <div class="brandTitle">FORMA DE PAGO</div>
              <span class="badge" id="badgeFecha"></span>
            </div>

            <div class="stats-grid">
              <div class="stat"><div class="k">Monto total</div><div id="statTotal" class="v">—</div></div>
              <div class="stat"><div class="k">Entrega</div><div id="statEntrega" class="v">—</div></div>
              <div class="stat"><div class="k">Saldo</div><div id="statSaldo" class="v">—</div></div>
              <div class="stat"><div class="k">Cuotas</div><div id="statCuotas" class="v">—</div></div>
              <div class="stat" style="flex-grow: 2;"><div class="k">Valor por cuota</div><div id="statCuota" class="v">—</div></div>
            </div>

            <div id="tcInfo" class="note" style="display:none; margin-top:10px"></div>

            <div class="tableWrap" style="margin-top:12px">
              <table id="tabla">
                <thead>
                  <tr id="theadRow">
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Importe</th>
                  </tr>
                </thead>
                <tbody></tbody>
                <tfoot>
                  <tr id="tfootRow">
                    <td colspan="2">Total (Entrega + Cuotas)</td>
                    <td id="tfootTotal">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="footer">
              Sin interés. Fechas: cada 30 días desde la fecha de inicio, moviendo a lunes si cae fin de semana.
              <div class="disclaimer">⚠️ El tipo de cambio utilizado es referencial y puede variar sin previo aviso.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script>
    const $ = (q) => document.querySelector(q);
    const montoEl = $("#monto");
    const monedaEl = $("#moneda");
    const cuotasCustomEl = $("#cuotasCustom");
    const fechaInicioEl = $("#fechaInicio");

    const echeqsToggle = $("#echeqsToggle");
    const tipoCambioEl = $("#tipoCambio");
    const tcInfo = $("#tcInfo");
    const echeqHint = $("#echeqHint");

    const tabPct = $("#tabPct");
    const tabMonto = $("#tabMonto");
    const panelPct = $("#panelPct");
    const panelMonto = $("#panelMonto");
    const chipsEl = $("#chipsEntrega");
    const entregaRangeEl = $("#entregaPct");
    const entregaBadgeEl = $("#entregaPctBadge");
    const entregaMontoEl = $("#entregaMonto");

    const redondearEl = $("#redondear");
    
    const statTotal = $("#statTotal");
    const statEntrega = $("#statEntrega");
    const statSaldo = $("#statSaldo");
    const statCuotas = $("#statCuotas");
    const statCuota = $("#statCuota");
    const tbody = $("#tabla tbody");
    const badgeFecha = $("#badgeFecha");
    const theadRow = $("#theadRow");
    const tfootRow = $("#tfootRow");

    function fmt(n, moneda) { try { return new Intl.NumberFormat('es-AR', { style:'currency', currency: moneda }).format(n); } catch(e){ return n.toLocaleString('es-AR', { minimumFractionDigits:2, maximumFractionDigits:2 }); } }
    function fmtDate(d){ try{ return new Intl.DateTimeFormat('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' }).format(d); } catch(e){ const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); return `${dd}/${mm}/${yyyy}`; } }
    
    function parseISODateUTC(value){ const [y,m,d] = value.split("-").map(Number); return new Date(Date.UTC(y, m-1, d)); }
    function addDaysUTC(date, days){ const d=new Date(date.getTime()); d.setUTCDate(d.getUTCDate()+days); return d; }
    function moveToBusinessDayUTC(date){ const dow=date.getUTCDay(); if (dow===0) return addDaysUTC(date,1); if (dow===6) return addDaysUTC(date,2); return date; }

    function setEntregaPct(p){ 
      const numericP = Number(p);
      [...chipsEl.querySelectorAll(".chip")].forEach(c => c.classList.toggle("active", c.dataset.p === String(numericP))); 
      entregaRangeEl.value = numericP; 
      entregaBadgeEl.textContent = `${numericP}%`; 
    }
    
    function switchTab(mode){ 
      const isPct = mode === 'pct';
      tabPct.classList.toggle("active", isPct);
      tabPct.setAttribute("aria-selected", isPct);
      tabMonto.classList.toggle("active", !isPct);
      tabMonto.setAttribute("aria-selected", !isPct);
      panelPct.style.display = isPct ? "" : "none";
      panelMonto.style.display = isPct ? "none" : "";
    }

    function updateEcheqsUI(){ 
      const isChecked = echeqsToggle.checked;
      if (isChecked && monedaEl.value !== "USD") { 
        monedaEl.value = "USD"; 
        echeqHint.style.display = ""; 
      } else { 
        echeqHint.style.display = "none"; 
      }
      const isUSD = monedaEl.value === "USD";
      const enableTC = isUSD && isChecked;
      tipoCambioEl.disabled = !enableTC; 
      if (enableTC) { 
        setTimeout(()=>{ tipoCambioEl.focus(); tipoCambioEl.select(); }, 0); 
      }
    }

    function calcular() {
      const moneda = monedaEl.value || "ARS";
      const total = parseFloat((montoEl.value || "0").replace(",", "."));
      const n = parseInt(cuotasCustomEl.value, 10) || 0;
      const mode = tabMonto.classList.contains("active") ? "monto" : "pct";
      
      if (isNaN(total) || total <= 0 || isNaN(n) || n < 1) {
        // Clear results if input is invalid
        statTotal.textContent = "—";
        statEntrega.textContent = "—";
        statSaldo.textContent = "—";
        statCuotas.textContent = "—";
        statCuota.textContent = "—";
        tbody.innerHTML = "";
        $("#tfootTotal").textContent = "—";
        badgeFecha.textContent = "";
        tcInfo.style.display = "none";
        return;
      }

      const fechaInicio = fechaInicioEl.value ? parseISODateUTC(fechaInicioEl.value) : new Date(new Date().setUTCHours(0,0,0,0));
      badgeFecha.textContent = `Fecha de inicio: ${fmtDate(fechaInicio)}`;

      let entrega = 0, p = 0;
      if(mode === "pct"){
        p = parseInt(entregaRangeEl.value, 10) || 0;
        entrega = +(total * p / 100).toFixed(2);
      } else {
        const rawEntrega = parseFloat((entregaMontoEl.value || "0").replace(",", ".")) || 0;
        entrega = Math.min(Math.max(rawEntrega, 0), total);
        p = total > 0 ? Math.round((entrega / total) * 100) : 0;
        setEntregaPct(p);
      }

      let saldo = +(total - entrega).toFixed(2);
      const base = n > 0 ? saldo / n : 0;
      const valorCuota = redondearEl.checked ? Math.round(base) : parseFloat(base.toFixed(2));

      const enableEcheqs = (moneda === "USD" && echeqsToggle.checked);
      const tc = parseFloat((tipoCambioEl.value || "0").replace(",", "."));
      
      if (enableEcheqs && (!tc || tc <= 0)) {
        tcInfo.style.display = ""; tcInfo.textContent = "E-CHEQS activo · Ingresá un tipo de cambio ARS/USD válido para ver importes en ARS.";
      } else if (enableEcheqs) {
        tcInfo.style.display = ""; tcInfo.textContent = `E-CHEQS activo · Tipo de cambio: ${tc.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})} ARS/USD`;
      } else {
        tcInfo.style.display = "none";
      }

      const showArsCol = enableEcheqs && tc > 0;
      theadRow.innerHTML = showArsCol ? `<th>#</th><th>Fecha</th><th>Importe (USD)</th><th>Importe (ARS)</th>` : `<th>#</th><th>Fecha</th><th>Importe</th>`;
      tfootRow.innerHTML = showArsCol ? `<td colspan="3">Total (Entrega + Cuotas)</td><td id="tfootTotal">—</td>` : `<td colspan="2">Total (Entrega + Cuotas)</td><td id="tfootTotal">—</td>`;
      const tfootTotalEl = $("#tfootTotal");

      statTotal.textContent = fmt(total, moneda);
      statEntrega.textContent = `${fmt(entrega, moneda)} (${p}%)`;
      statSaldo.textContent = fmt(saldo, moneda);
      statCuotas.textContent = `${n}`;
      statCuota.textContent = fmt(valorCuota, moneda);

      tbody.innerHTML = "";
      let sumaBase = 0, sumaArs = 0;

      if (entrega > 0){
        const fechaEntrega = moveToBusinessDayUTC(fechaInicio);
        const entregaARS = showArsCol ? +(entrega*tc).toFixed(2) : 0;
        const row = `<td>Entrega</td><td>${fmtDate(fechaEntrega)}</td><td>${fmt(entrega, moneda)}</td>` + (showArsCol ? `<td>${fmt(entregaARS,"ARS")}</td>` : '');
        tbody.innerHTML += `<tr>${row}</tr>`;
        sumaBase += entrega;
        sumaArs += entregaARS;
      }

      let acumuladoCuotas = 0;
      for (let i=1; i<=n; i++) {
        let cuota = (i === n) 
          ? (redondearEl.checked ? Math.round(saldo - acumuladoCuotas) : parseFloat((saldo - acumuladoCuotas).toFixed(2)))
          : valorCuota;
        
        acumuladoCuotas += cuota;
        sumaBase += cuota;
        
        const fechaCuota = moveToBusinessDayUTC(addDaysUTC(fechaInicio, 30*i));
        const cuotaARS = showArsCol ? +(cuota*tc).toFixed(2) : 0;
        sumaArs += cuotaARS;
        
        const row = `<td>Cuota ${i}</td><td>${fmtDate(fechaCuota)}</td><td>${fmt(cuota, moneda)}</td>` + (showArsCol ? `<td>${fmt(cuotaARS,"ARS")}</td>` : '');
        tbody.innerHTML += `<tr>${row}</tr>`;
      }

      tfootTotalEl.textContent = showArsCol ? fmt(sumaArs, "ARS") : fmt(sumaBase, moneda);
    }
    
    async function copyToClipboard() {
      const copiarBtn = $("#copiar");
      if (statTotal.textContent === "—") { 
        calcular(); 
        await new Promise(r => setTimeout(r, 50)); // Wait for DOM update
      }
      const moneda = monedaEl.value || "ARS";
      const tc = parseFloat((tipoCambioEl.value || "").replace(",", "."));
      const showArsCol = moneda === "USD" && echeqsToggle.checked && tc > 0;

      const headers = showArsCol ? ["#", "Fecha", "Importe (USD)", "Importe (ARS)"] : ["#", "Fecha", "Importe"];
      const tableRows = [...tbody.querySelectorAll("tr")].map(tr => [...tr.querySelectorAll("td")].map(td => td.textContent));
      const txtTabla = [headers, ...tableRows].map(r => r.join("\t")).join("\n");
      
      const tcLine = showArsCol ? `Tipo de cambio: ${tc.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})} ARS/USD\n` : "";
      const disclaimer = "⚠️ El tipo de cambio utilizado es referencial y puede variar sin previo aviso.";
      const resumen = `FORMA DE PAGO\n${tcLine}Fecha de inicio: ${badgeFecha.textContent.replace("Fecha de inicio: ","")}\nMoneda base: ${moneda}\nMonto total: ${statTotal.textContent}\nEntrega: ${statEntrega.textContent}\nSaldo: ${statSaldo.textContent}\nCuotas: ${statCuotas.textContent}\nValor por cuota: ${statCuota.textContent}\n\nDetalle:\n${txtTabla}\n\n${disclaimer}`;

      try { 
        await navigator.clipboard.writeText(resumen); 
        copiarBtn.textContent = "¡Copiado!"; 
        setTimeout(() => copiarBtn.textContent="Copiar", 1500); 
      } catch(e) { 
        alert("No se pudo copiar automáticamente."); 
      }
    }

    async function exportPNG(){
      const imprimirBtn = $("#imprimir");
      try{
        if (statTotal.textContent === "—") calcular();
        await (document.fonts?.ready || Promise.resolve());
        
        document.body.classList.add('exporting');
        imprimirBtn.textContent = "Generando...";
        
        const canvas = await html2canvas($("#exportArea"), {
          backgroundColor: '#0b0c10', scale: 2, useCORS: true,
        });
        
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `forma_de_pago_${new Date().toISOString().replace(/[:.]/g,"-")}.png`;
        a.click();
      }catch(e){
        alert("No se pudo generar el PNG. Probá nuevamente.");
      } finally {
        document.body.classList.remove('exporting');
        imprimirBtn.textContent = "PNG";
      }
    }

    function clearForm() {
      montoEl.value = "150000";
      monedaEl.value = "ARS";
      cuotasCustomEl.value = "6";
      const today = new Date();
      fechaInicioEl.value = today.toISOString().split('T')[0];
      echeqsToggle.checked = false;
      tipoCambioEl.value = "";
      setEntregaPct(30);
      switchTab('pct');
      entregaMontoEl.value = "";
      redondearEl.checked = false;
      updateEcheqsUI();
      calcular();
    }

    // Event Listeners Setup
    [montoEl, cuotasCustomEl, entregaMontoEl, redondearEl, fechaInicioEl, tipoCambioEl, monedaEl, echeqsToggle].forEach(el => {
      el.addEventListener("change", calcular);
    });
    [montoEl, cuotasCustomEl, entregaMontoEl, tipoCambioEl].forEach(el => {
      el.addEventListener("keyup", (ev)=>{ if (ev.key === "Enter") calcular(); });
    });
    
    monedaEl.addEventListener("change", updateEcheqsUI);
    echeqsToggle.addEventListener("change", updateEcheqsUI);
    
    chipsEl.addEventListener("click", (e)=>{ const chip = e.target.closest(".chip"); if (chip) { setEntregaPct(chip.dataset.p); calcular(); }});
    entregaRangeEl.addEventListener("input", (e)=>{ setEntregaPct(e.target.value); });
    entregaRangeEl.addEventListener("change", calcular);

    tabPct.addEventListener("click", ()=>{ switchTab('pct'); calcular(); });
    tabMonto.addEventListener("click", ()=>{ switchTab('monto'); calcular(); });

    $("#calcular").addEventListener("click", calcular);
    $("#copiar").addEventListener("click", copyToClipboard);
    $("#imprimir").addEventListener("click", exportPNG);
    $("#limpiar").addEventListener("click", clearForm);

    // Initial State
    clearForm();
  </script>
</body>
</html>
