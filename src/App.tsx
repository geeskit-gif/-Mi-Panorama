import React, { useState, useMemo, useEffect } from 'react';
import logoUrl from "/logo.jpg";

type Tab = 'panorama' | 'tarjetas' | 'comprar' | 'explicame';
type Trust = 'hecho' | 'derivado' | 'desconocida';
type Lang = 'es' | 'en';
type Reporte = 'desconocido' | 'inicio_mes' | 'fecha_corte' | 'otro';

type CardData = {
  id: string;
  nombre: string;
  emisor: string;
  limite: number | null;
  saldo: number | null;
  corte: number | null;
  pago: number | null;
  last4: string | null;
  reporte: Reporte;
  isSample?: boolean;
};

const SAMPLE_CARDS: CardData[] = [
  { id: 'sample-a', nombre: 'Tarjeta Ejemplo A', emisor: 'Emisor de ejemplo', limite: 45000, saldo: 10250, corte: 15, pago: 5, last4: null, reporte: 'fecha_corte', isSample: true },
  { id: 'sample-b', nombre: 'Tarjeta Ejemplo B', emisor: 'Emisor de ejemplo', limite: 30000, saldo: 8400, corte: 22, pago: 12, last4: null, reporte: 'inicio_mes', isSample: true },
];

/* ===== i18n FULL V1 ===== */
const i18n = {
  es: {
    nav: {
      panorama: 'MI PANORAMA',
      tarjetas: 'MIS TARJETAS',
      comprar: 'VOY A COMPRAR',
      explicame: 'EXPLÍCAME',
      short: { panorama: 'PANORAMA', tarjetas: 'TARJETAS', comprar: 'COMPRAR', explicame: 'EXPLICA' }
    },
    trust: {
      hecho: 'HECHO CONFIRMADO',
      derivado: 'VALOR DERIVADO',
      desconocida: 'INFORMACIÓN DESCONOCIDA',
      hecho_desc: 'tú lo proporcionaste',
      derivado_desc: 'calculado localmente',
      desconocida_desc: 'no tenemos este dato'
    },
    truth: {
      datosLocales: 'DATOS LOCALES',
      sinConexion: 'SIN CONEXIÓN BANCARIA',
      almacenamiento: 'Los datos se guardan en este navegador.',
      frontendOnly: 'Frontend only — Sin conexión bancaria',
      footer: 'DATOS LOCALES · Los datos se guardan en este navegador. · SIN CONEXIÓN BANCARIA'
    },
    onboarding: {
      title: 'CREA TU PANORAMA',
      sub: 'Entiende tus tarjetas, tus fechas y lo que cambia cuando compras.',
      ctaPrimary: 'CREAR MI PANORAMA',
      ctaSecondary: 'EXPLORAR CON DATOS DE EJEMPLO',
      trustRow: 'DATOS LOCALES · Los datos se guardan en este navegador. · SIN CONEXIÓN BANCARIA',
    },
    demoBanner: {
      text: 'DATOS DE EJEMPLO — No son tus datos reales.',
      cta: 'Volver a mis datos',
      explore: 'Explorar datos de ejemplo',
    },
    panorama: {
      title: 'Tu panorama',
      subtitle: 'Información → Significado → Próxima acción',
      signals: 'Señales de tus tarjetas',
      signalsSub: 'Resumen calculado con lo que nos compartiste',
      attention: 'Atención — señales que conviene revisar',
      whatWeKnow: 'Lo que sabemos',
      whatWeDont: 'Lo que todavía no sabemos',
      instrument: 'Instrumento — Utilización',
      range: 'RANGO 0—100%',
      limite: 'LÍMITE',
      saldo: 'SALDO',
      disponible: 'DISPONIBLE',
      emptyTitle: 'Aún no tienes tarjetas',
      emptyDesc: 'Agrega tu primera tarjeta para ver tu panorama. Todo se guarda solo en este navegador.',
      addFirst: 'Agregar primera tarjeta',
      metrics: {
        creditoDisponible: 'Crédito disponible total',
        saldoTotal: 'Saldo actual total',
        utilizacion: 'Utilización global',
        proximoCorte: 'Próximo corte',
        proximoPago: 'Próximo pago',
        numTarjetas: 'Número de tarjetas',
        noteDisponible: 'Límite menos saldo actual',
        noteSaldo: 'Suma de saldos que registraste',
        noteUtil: 'Saldo / límite. No es calificación.',
        noteCorte: 'Día que registraste; la fecha mostrada es un cálculo local',
        notePago: 'Día que registraste; la fecha mostrada es un cálculo local',
        noteNum: 'Tarjetas registradas localmente',
      },
      listKnow: [
        'Los cálculos son límite menos saldo.',
        'Las fechas se calculan dinámicamente desde hoy.',
        'No inventamos tasas ni recompensas.',
      ],
      listDont: [
        'Tasa de interés, comisiones o anualidad reales.',
        'Fecha exacta en que cada emisor reporta al buró.',
        'Recompensas o beneficios específicos.',
      ],
    },
    tarjetas: {
      title: 'Mis tarjetas',
      subtitle: 'Información confirmada y vacíos visibles — sin suposiciones',
      add: 'Agregar tarjeta',
      freeProgress: 'de 3 tarjetas usadas',
      freeBadge: 'Plan Free',
      proSoon: 'PRO próximamente',
      empty: 'Sin tarjetas registradas',
      emptyDesc: 'Agrega tu primera tarjeta. Los datos se quedan en este navegador, sin conexión bancaria.',
      edit: 'Editar',
      delete: 'Eliminar',
      sampleTag: 'DATOS DE EJEMPLO',
      noLast4: 'Sin últimos 4',
      fields: {
        nombre: 'Nombre *',
        emisor: 'Banco / emisor *',
        limite: 'Límite',
        saldo: 'Saldo actual',
        corte: 'Fecha corte día',
        pago: 'Fecha pago día',
        last4: 'Últimos 4',
        reporte: 'Momento de reporte',
      },
      reporteOpts: {
        desconocido: 'Desconocido',
        inicio_mes: 'Inicio de mes',
        fecha_corte: 'Fecha de corte',
        otro: 'Otro',
      },
      requiredNote: '* requerido',
      last4Note: 'Opcional, 4 dígitos. Nunca inventamos.',
    },
    comprar: {
      title: 'Voy a comprar',
      subtitle: 'Simula el efecto de una compra — te mostramos el por qué, no te decimos qué hacer',
      datos: '¿Cuánto vas a comprar?',
      monto: 'Monto',
      montoHint: 'Cálculo local: disponible = límite − saldo − monto. No inventamos tasas ni recompensas.',
      noCards: 'Agrega al menos una tarjeta para simular.',
      exceeds: 'Esta compra supera el crédito disponible de esta tarjeta.',
      neutral1: 'Con esta tarjeta, tu saldo cambiaría de',
      neutral2: 'a',
      neutral3: 'Tu utilización pasaría de',
      truthNote: 'Comparamos alternativas con tus datos. No predecimos cuánto cambiará tu score ni inventamos información del emisor.',
      scoreLabel: 'Tu score crediticio',
      scoreHint: 'Opcional. Escríbelo tal como aparece en la fuente donde lo consultaste.',
      scoreUnknown: 'Sin score registrado',
      scoreNote: 'El score es un dato de contexto. No usamos un modelo propio para predecir cuánto cambiará.',
      alternativesTitle: 'Alternativas para esta compra',
      lowerImpact: 'Menor impacto conocido',
      reportTiming: 'Reporte',
      cutoff: 'Corte',
      payment: 'Pago',
      impact: 'Impacto conocido',
      utilizationChange: 'Cambio de utilización',
      unknownTiming: 'Momento de reporte desconocido',
      knownAtCutoff: 'Registrado en fecha de corte',
      unavailable: 'No calculable con los datos actuales',
      whyTitle: 'Qué podemos calcular sobre el momento',
      unknown: 'No tenemos fecha de corte para hacer este cálculo local.',
      listUnknown: [
        'No asumimos si tu emisor reporta el saldo justo en el corte o en otra fecha.',
        'No inventamos recompensas, intereses ni beneficios.',
        'La decisión final depende de tu flujo de efectivo.',
      ],
      saldoActual: 'Saldo actual',
      montoCompra: 'Monto compra',
      saldoNuevo: 'Saldo nuevo estimado',
      disponibleDesp: 'Disponible después',
      utilAntes: 'Util. antes',
      utilDesp: 'Util. después',
    },
    explicame: {
      title: 'Explícame',
      subtitle: 'Conceptos en español simple — sin jerga innecesaria',
      search: 'Buscar: corte, pago, utilización...',
      topics: 'temas',
      how: 'Cómo usamos la información',
      howDesc: 'No inventamos fechas, tasas ni recompensas. Si un dato es confirmado por ti, lo marcamos como hecho. Si es un cálculo, lo marcamos como derivado. Si no lo tenemos, lo dejamos como desconocido. Depende de tu emisor/banco para muchos casos.',
    },
    limitModal: {
      title: 'Límite Free alcanzado',
      desc: 'Has llegado al límite de 3 tarjetas del plan Free. Con Pro podrás agregar más tarjetas.',
      verPro: 'VER PRO',
      cancel: 'Entendido',
    },
    toasts: {
      proSoon: 'PRO próximamente',
      cardAdded: 'Tarjeta agregada',
      cardUpdated: 'Tarjeta actualizada',
      cardDeleted: 'Tarjeta eliminada',
    },
    common: {
      cancelar: 'Cancelar',
      guardar: 'Guardar',
      agregar: 'Agregar',
      editar: 'Editar',
      eliminar: 'Eliminar',
      close: 'Cerrar',
      hoy: 'hoy',
      en: 'en',
      dias: 'días',
      dia: 'día',
      hace: 'hace',
    }
  },
  en: {
    nav: {
      panorama: 'MY VIEW',
      tarjetas: 'MY CARDS',
      comprar: "I'M BUYING",
      explicame: 'EXPLAIN',
      short: { panorama: 'VIEW', tarjetas: 'CARDS', comprar: 'BUYING', explicame: 'EXPLAIN' }
    },
    trust: {
      hecho: 'CONFIRMED FACT',
      derivado: 'DERIVED VALUE',
      desconocida: 'UNKNOWN INFO',
      hecho_desc: 'you provided it',
      derivado_desc: 'calculated locally',
      desconocida_desc: 'we do not have this data',
    },
    truth: {
      datosLocales: 'LOCAL DATA',
      sinConexion: 'NO BANK CONNECTION',
      almacenamiento: 'Saved in this browser.',
      frontendOnly: 'Frontend only — No bank connection',
      footer: 'LOCAL DATA · Saved in this browser. · NO BANK CONNECTION'
    },
    onboarding: {
      title: 'CREATE YOUR PANORAMA',
      sub: 'Understand your cards, dates and what changes when you buy.',
      ctaPrimary: 'CREATE MY VIEW',
      ctaSecondary: 'EXPLORE WITH SAMPLE DATA',
      trustRow: 'LOCAL DATA · Saved in this browser. · NO BANK CONNECTION',
    },
    demoBanner: {
      text: 'SAMPLE DATA — Not your real data.',
      cta: 'Back to my data',
      explore: 'Explore sample data',
    },
    panorama: {
      title: 'Your view',
      subtitle: 'Information → Meaning → Next action',
      signals: 'Signals from your cards',
      signalsSub: 'Summary calculated from what you shared',
      attention: 'Attention — signals worth reviewing',
      whatWeKnow: 'What we know',
      whatWeDont: "What we don't know yet",
      instrument: 'Instrument — Utilization',
      range: 'RANGE 0—100%',
      limite: 'LIMIT',
      saldo: 'BALANCE',
      disponible: 'AVAILABLE',
      emptyTitle: 'No cards yet',
      emptyDesc: 'Add your first card to see your panorama. Everything stays in this browser.',
      addFirst: 'Add first card',
      metrics: {
        creditoDisponible: 'Total available credit',
        saldoTotal: 'Total current balance',
        utilizacion: 'Global utilization',
        proximoCorte: 'Next statement',
        proximoPago: 'Next payment',
        numTarjetas: 'Number of cards',
        noteDisponible: 'Limit minus current balance',
        noteSaldo: 'Sum of balances you entered',
        noteUtil: 'Balance / limit. Not a score.',
        noteCorte: 'Day you entered; displayed date is a local calculation',
        notePago: 'Day you entered; displayed date is a local calculation',
        noteNum: 'Cards stored locally',
      },
      listKnow: [
        'Calculations are limit minus balance.',
        'Dates are calculated dynamically from today.',
        'We do not invent rates or rewards.',
      ],
      listDont: [
        'Real interest rate, fees or annual fee.',
        'Exact date each issuer reports to bureau.',
        'Specific rewards or benefits.',
      ],
    },
    tarjetas: {
      title: 'My cards',
      subtitle: 'Confirmed information and visible gaps — no assumptions',
      add: 'Add card',
      freeProgress: 'of 3 cards used',
      freeBadge: 'Free plan',
      proSoon: 'PRO coming soon',
      empty: 'No cards registered',
      emptyDesc: 'Add your first card. Data stays in this browser, no bank connection.',
      edit: 'Edit',
      delete: 'Delete',
      sampleTag: 'SAMPLE DATA',
      noLast4: 'No last 4',
      fields: {
        nombre: 'Name *',
        emisor: 'Bank / issuer *',
        limite: 'Limit',
        saldo: 'Current balance',
        corte: 'Statement day',
        pago: 'Payment day',
        last4: 'Last 4',
        reporte: 'Reporting moment',
      },
      reporteOpts: {
        desconocido: 'Unknown',
        inicio_mes: 'Start of month',
        fecha_corte: 'Statement date',
        otro: 'Other',
      },
      requiredNote: '* required',
      last4Note: 'Optional, 4 digits. Never invented.',
    },
    comprar: {
      title: "I'm buying",
      subtitle: 'Simulate a purchase effect — we show the why, not what to do',
      datos: 'How much will you buy?',
      monto: 'Amount',
      montoHint: 'Local calc: available = limit − balance − amount. No rates invented.',
      noCards: 'Add at least one card to simulate.',
      exceeds: 'This purchase exceeds the available credit of this card.',
      neutral1: 'With this card, your balance would change from',
      neutral2: 'to',
      neutral3: 'Your utilization would go from',
      truthNote: 'We compare alternatives using your data. We do not predict score changes or invent issuer information.',
      scoreLabel: 'Your credit score',
      scoreHint: 'Optional. Enter it exactly as shown by the source where you checked it.',
      scoreUnknown: 'No score recorded',
      scoreNote: 'Your score is context. We do not use our own model to predict how it will change.',
      alternativesTitle: 'Alternatives for this purchase',
      lowerImpact: 'Lower known impact',
      reportTiming: 'Reporting',
      cutoff: 'Statement',
      payment: 'Payment',
      impact: 'Known impact',
      utilizationChange: 'Utilization change',
      unknownTiming: 'Reporting moment unknown',
      knownAtCutoff: 'Reported at statement date',
      unavailable: 'Not calculable with current data',
      whyTitle: 'What we can calculate about timing',
      unknown: 'We do not have a statement date for this local calculation.',
      listUnknown: [
        'We do not assume if issuer reports balance exactly at statement date.',
        'We do not invent rewards, interest or benefits.',
        'Final decision depends on your cash flow.',
      ],
      saldoActual: 'Current balance',
      montoCompra: 'Purchase amount',
      saldoNuevo: 'New balance est.',
      disponibleDesp: 'Available after',
      utilAntes: 'Util. before',
      utilDesp: 'Util. after',
    },
    explicame: {
      title: 'Explain',
      subtitle: 'Concepts in plain language — no unnecessary jargon',
      search: 'Search: statement, payment, utilization...',
      topics: 'topics',
      how: 'How we use information',
      howDesc: 'We do not invent dates, rates or rewards. If data is confirmed by you, we mark as fact. If calculated, as derived. If missing, as unknown. Depends on your issuer/bank in many cases.',
    },
    limitModal: {
      title: 'Free limit reached',
      desc: "You've reached the 3-card Free limit. Pro lets you add more.",
      verPro: 'VIEW PRO',
      cancel: 'Got it',
    },
    toasts: {
      proSoon: 'PRO coming soon',
      cardAdded: 'Card added',
      cardUpdated: 'Card updated',
      cardDeleted: 'Card deleted',
    },
    common: {
      cancelar: 'Cancel',
      guardar: 'Save',
      agregar: 'Add',
      editar: 'Edit',
      eliminar: 'Delete',
      close: 'Close',
      hoy: 'today',
      en: 'in',
      dias: 'days',
      dia: 'day',
      hace: '',
    }
  }
} as const;

function getStorage<T>(key: string, fallback: T): T {
  try {
    const v = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (v === null) return fallback;
    return JSON.parse(v) as T;
  } catch { return fallback; }
}

function getStoredCards(): CardData[] {
  try {
    const raw = localStorage.getItem('mp_cards');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c): c is CardData => c && typeof c === 'object' && typeof c.id === 'string' && typeof c.nombre === 'string' && typeof c.emisor === 'string')
      .map(c => ({
        id: c.id,
        nombre: c.nombre.trim(),
        emisor: c.emisor.trim(),
        limite: typeof c.limite === 'number' && isFinite(c.limite) && c.limite >= 0 ? c.limite : null,
        saldo: typeof c.saldo === 'number' && isFinite(c.saldo) && c.saldo >= 0 ? c.saldo : null,
        corte: typeof c.corte === 'number' && isFinite(c.corte) && c.corte >= 1 && c.corte <= 31 ? c.corte : null,
        pago: typeof c.pago === 'number' && isFinite(c.pago) && c.pago >= 1 && c.pago <= 31 ? c.pago : null,
        last4: typeof c.last4 === 'string' && /^\\d{4}$/.test(c.last4) ? c.last4 : null,
        reporte: c.reporte === 'inicio_mes' || c.reporte === 'fecha_corte' || c.reporte === 'otro' ? c.reporte : 'desconocido',
        isSample: c.isSample === true,
      }))
      .filter(c => c.nombre.length > 0 && c.emisor.length > 0);
  } catch {
    return [];
  }
}
function setStorage(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function formatMoney(v: number | null, lang: Lang): string {
  if (v === null || !isFinite(v)) return '—';
  const loc = lang === 'es' ? 'es-MX' : 'en-US';
  return `$${Math.round(v).toLocaleString(loc)}`;
}

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

function getNextOccurrence(day: number | null): { date: Date; daysUntil: number } | null {
  if (day === null || !isFinite(day) || day < 1 || day > 31) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  let y = today.getFullYear();
  let m = today.getMonth();

  // Never silently convert an impossible day (e.g. 31) to another day.
  for (let i = 0; i < 24; i++) {
    const maxDay = daysInMonth(y, m);
    if (day <= maxDay) {
      const cand = new Date(y, m, day);
      cand.setHours(0,0,0,0);
      if (cand >= today) {
        const diff = Math.round((cand.getTime() - today.getTime()) / 86400000);
        return { date: cand, daysUntil: diff };
      }
    }
    m++;
    if (m > 11) { m = 0; y++; }
  }

  return null;
}

function formatNextDate(info: { date: Date; daysUntil: number } | null, lang: Lang, t: any): string {
  if (!info) return t.trust.desconocida;
  const { date, daysUntil } = info;
  const monthsEs = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const monthsEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = date.getMonth();
  const d = date.getDate();
  const monthStr = lang === 'es' ? monthsEs[m] : monthsEn[m];
  if (daysUntil === 0) return lang === 'es' ? `${d} de ${monthStr} — ${t.common.hoy}` : `${monthStr} ${d} — ${t.common.hoy}`;
  if (daysUntil < 0) {
    const abs = Math.abs(daysUntil);
    const dayLabel = lang === 'es' ? (abs === 1 ? t.common.dia : t.common.dias) : (abs === 1 ? 'day' : 'days');
    return lang === 'es' ? `${d} de ${monthStr} — ${t.common.hace} ${abs} ${dayLabel}` : `${monthStr} ${d} — ${abs} ${dayLabel} ago`;
  }
  const dayLabel = lang === 'es' ? (daysUntil === 1 ? t.common.dia : t.common.dias) : (daysUntil === 1 ? 'day' : 'days');
  const prefix = lang === 'es' ? `${t.common.en}` : 'in';
  return lang === 'es' ? `${d} de ${monthStr} — ${prefix} ${daysUntil} ${dayLabel}` : `${monthStr} ${d} — ${prefix} ${daysUntil} ${dayLabel}`;
}

function TrustBadge({ type, lang, compact = false }: { type: Trust; lang: Lang; compact?: boolean }) {
  const label = i18n[lang].trust[type];
  const border = type === 'hecho' ? '#101A16' : type === 'derivado' ? '#2A4A3A' : '#9A9590';
  const bg = type === 'derivado' ? '#2A4A3A' : type === 'hecho' ? '#101A16' : 'transparent';
  return (
    <div className={`inline-flex items-center gap-[7px] flex-wrap ${compact ? 'p-0 bg-transparent border-0' : 'px-[10px] py-[4px] rounded-full border bg-[#FBFAF7] max-w-full'}`} style={{ borderColor: compact ? 'transparent' : '#D6D2CC', boxShadow: compact ? 'none' : 'inset 0 1px 0 #E8E4DE' }}>
      {type === 'hecho' && <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: bg }} />}
      {type === 'derivado' && <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: bg }} />}
      {type === 'desconocida' && <span className="w-[8px] h-[8px] inline-block border border-dashed rounded-[1px]" style={{ borderColor: border }} />}
      {!compact && <span className="text-[9px] tracking-[0.12em] font-mono text-[#5E6A70] uppercase leading-none break-words">{label}</span>}
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, isFinite(value) ? value : 0));
  const angle = (pct / 100) * 270 - 135;
  return (
    <div className="relative w-[220px] h-[220px] md:w-[192px] md:h-[192px] mx-auto touch-manipulation">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="steelV1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3A6E9E" />
            <stop offset="100%" stopColor="#2E5A8A" />
          </linearGradient>
        </defs>
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = 86, r2 = i % 3 === 0 ? 76 : 82;
          const x1 = 100 + Math.cos(a) * r1, y1 = 100 + Math.sin(a) * r1;
          const x2 = 100 + Math.cos(a) * r2, y2 = 100 + Math.sin(a) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C2E27" strokeWidth={i % 9 === 0 ? 1 : 0.5} opacity={i % 3 === 0 ? 0.6 : 0.22} />;
        })}
        <circle cx="100" cy="100" r="62" fill="none" stroke="#1E2F27" strokeWidth={0.9} opacity={0.85} />
        <circle
          cx="100" cy="100" r="62"
          fill="none"
          stroke="url(#steelV1)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 389} 389`}
          transform="rotate(-135 100 100)"
          opacity={0.95}
          style={{ filter: 'drop-shadow(0 0 8px rgba(58,110,158,0.35))' }}
        />
        <g transform={`rotate(${angle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="40" stroke="#D6D2CC" strokeWidth={1.2} />
          <circle cx="100" cy="100" r="4.5" fill="#F6F4F0" stroke="#8A8D8B" strokeWidth={0.8} />
        </g>
        <g>
          <circle cx="100" cy="100" r="26" fill="#0F1A16" stroke="#2F4A3D" strokeWidth={0.8} />
          <text x="100" y="104" textAnchor="middle" className="fill-[#EDE9E3] text-[13px] font-mono tracking-[0.02em]">{Math.round(pct)}%</text>
        </g>
      </svg>
    </div>
  );
}

function CompassIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="7" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" />
      <path d="M10 3.5V5.2M10 14.8V16.5M3.5 10H5.2M14.8 10H16.5" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <path d="M11.8 8.2L8.2 11.8" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.2" fill={active ? "#3A6E9E" : "#8BA3B8"} />
    </svg>
  );
}
function CardsStackIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <rect x="3.5" y="6.5" width="11" height="8" rx="1.5" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" />
      <rect x="5.5" y="4.5" width="11" height="8" rx="1.5" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" opacity={active ? 1 : 0.85} />
      <path d="M7 8.5H12" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
function PlusCircleIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="7" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" />
      <path d="M10 7V13M7 10H13" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function QuestionIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="7" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" />
      <path d="M8.2 8.1C8.2 6.9 9.1 6 10.2 6C11.3 6 12.2 6.9 12.2 8.1C12.2 9.2 11.2 9.8 10.5 10.3C10.1 10.6 10 10.9 10 11.4" stroke={active ? "#3A6E9E" : "#8BA3B8"} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="13.6" r="0.9" fill={active ? "#3A6E9E" : "#8BA3B8"} />
    </svg>
  );
}

function WireframeArc() {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none h-[78px] md:h-[96px] opacity-[0.14]" style={{}}>
      <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
        <path d="M -120 28 Q 720 -28 1560 28" stroke="#3A6E9E" strokeWidth={1} fill="none" opacity={0.9} />
        <path d="M -120 42 Q 720 -12 1560 42" stroke="#3A6E9E" strokeWidth={0.8} fill="none" strokeDasharray="5 7" opacity={0.6} />
        <path d="M -120 56 Q 720 6 1560 56" stroke="#2A4A3A" strokeWidth={0.6} fill="none" opacity={0.5} />
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 40 + i * 78;
          return <path key={i} d={`M ${x} 0 Q ${x + 8} 48 ${x + 2} 96`} stroke="#5A7A8A" strokeWidth={0.45} fill="none" opacity={0.28} />;
        })}
        <circle cx="720" cy="20" r="38" stroke="#2E5A8A" strokeWidth={0.8} fill="none" opacity={0.32} />
        <circle cx="720" cy="20" r="22" stroke="#C8A86A" strokeWidth={0.6} fill="none" strokeDasharray="2 5" opacity={0.28} />
        <g opacity={0.18}>
          <path d="M 705 20 L 720 4 L 735 20 L 720 36 Z" stroke="#3A6E9E" strokeWidth={0.7} fill="none" />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('mp_lang');
      if (saved === 'en' || saved === 'es') return saved as Lang;
    } catch {}
    return 'es';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('mp_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });
  const t = i18n[lang];

  const [tab, setTab] = useState<Tab>('panorama');
  const [cards, setCards] = useState<CardData[]>(() => getStoredCards());
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    try {
      const demo = localStorage.getItem('mp_demo') === 'true';
      const stored = getStoredCards();
      const hasSampleData = stored.some(c => c.isSample === true);
      return demo && hasSampleData;
    } catch { return false; }
  });
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    try { return localStorage.getItem('mp_hasOnboarded') === 'true'; } catch { return false; }
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const onboarded = localStorage.getItem('mp_hasOnboarded') === 'true';
      if (onboarded) return false;
      const c = localStorage.getItem('mp_cards');
      const parsed = c ? JSON.parse(c) : [];
      const demo = localStorage.getItem('mp_demo') === 'true';
      const hasCards = Array.isArray(parsed) && parsed.length > 0;
      return !hasCards && !demo;
    } catch { return true; }
  });

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<CardData>>({ nombre: '', emisor: '', limite: null, saldo: null, corte: null, pago: null, last4: null, reporte: 'desconocido' });
  const [monto, setMonto] = useState<number>(2500);
  const [creditScore, setCreditScore] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem('mp_creditScore');
      const n = raw === null ? NaN : Number(raw);
      return isFinite(n) && n >= 300 && n <= 850 ? n : null;
    } catch { return null; }
  });
  const [glossaryQ, setGlossaryQ] = useState('');
  const [openGlos, setOpenGlos] = useState<string | null>('corte');
  const [showLimit, setShowLimit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { try { localStorage.setItem('mp_lang', lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem('mp_theme', theme); } catch {} }, [theme]);
  useEffect(() => { setStorage('mp_cards', cards); }, [cards]);
  useEffect(() => { try { localStorage.setItem('mp_demo', String(isDemo)); } catch {} }, [isDemo]);
  useEffect(() => { try { localStorage.setItem('mp_hasOnboarded', String(hasOnboarded)); } catch {} }, [hasOnboarded]);
  useEffect(() => {
    try {
      if (creditScore === null) localStorage.removeItem('mp_creditScore');
      else localStorage.setItem('mp_creditScore', String(creditScore));
    } catch {}
  }, [creditScore]);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(null), 2800); return () => clearTimeout(id); } }, [toast]);

  const totalLimite = useMemo(() => cards.reduce((a, c) => a + (c.limite ?? 0), 0), [cards]);
  const totalSaldo = useMemo(() => cards.reduce((a, c) => a + (c.saldo ?? 0), 0), [cards]);
  const hasLimite = useMemo(() => cards.length > 0 && cards.every(c => c.limite !== null && isFinite(c.limite as number)), [cards]);
  const hasSaldo = useMemo(() => cards.length > 0 && cards.every(c => c.saldo !== null && isFinite(c.saldo as number)), [cards]);
  const totalDisponible = hasLimite && hasSaldo ? totalLimite - totalSaldo : null;
  const utilizacionGlobal = hasLimite && hasSaldo && totalLimite > 0 ? (totalSaldo / totalLimite) * 100 : 0;

  const nextCortes = useMemo(() => cards.map(c => ({ id: c.id, info: getNextOccurrence(c.corte), card: c })).filter(x => x.info !== null) as { id: string; info: { date: Date; daysUntil: number }; card: CardData }[], [cards]);
  const nextPagos = useMemo(() => cards.map(c => ({ id: c.id, info: getNextOccurrence(c.pago), card: c })).filter(x => x.info !== null) as { id: string; info: { date: Date; daysUntil: number }; card: CardData }[], [cards]);
  const nearestCorte = useMemo(() => nextCortes.length ? nextCortes.reduce((min, cur) => cur.info.daysUntil < min.info.daysUntil ? cur : min) : null, [nextCortes]);
  const nearestPago = useMemo(() => nextPagos.length ? nextPagos.reduce((min, cur) => cur.info.daysUntil < min.info.daysUntil ? cur : min) : null, [nextPagos]);

  const glossary = useMemo(() => lang === 'es' ? [
    { id: 'limite', title: 'Límite', text: 'Es el monto máximo que tu emisor te permite usar en esa tarjeta. No incluye intereses futuros. Cada banco decide cómo y cuándo lo ajusta, depende de tu emisor.' },
    { id: 'saldo', title: 'Saldo', text: 'Es lo que debes actualmente según compras y pagos. No es lo mismo que el mínimo a pagar. Tu emisor es la fuente definitiva, depende de tu banco.' },
    { id: 'disponible', title: 'Crédito disponible', text: 'Lo que te queda por usar: límite menos saldo. Es un valor derivado, no un hecho aparte. Si tu saldo cambia, este también.' },
    { id: 'utilizacion', title: 'Utilización', text: 'Porcentaje del límite que estás usando: saldo dividido entre límite. No es calificación, pero es señal que miran emisores y burós. Cambia cada vez que cambia tu saldo.' },
    { id: 'corte', title: 'Fecha de corte', text: 'Día en que tu emisor cierra el periodo y genera tu estado de cuenta. Lo que compras antes entra en ese estado; después, en el siguiente. Depende de tu emisor y contrato.' },
    { id: 'pago', title: 'Fecha de pago', text: 'Es la fecha que tu emisor indica como límite de pago. Las consecuencias de pagar después dependen de tu contrato y emisor; no asumimos un plazo universal.' },
    { id: 'reporte', title: 'Momento de reporte', text: 'Cuándo tu emisor comparte tu información con el buró. Puede ser en el corte, inicio de mes u otro día. Depende de tu emisor, no lo asumimos.' },
    { id: 'minimo', title: 'Pago mínimo', text: 'Cantidad mínima que debes pagar para no tener recargos. No es el total del estado. Si solo pagas el mínimo, el resto genera intereses. Depende de tu emisor.' },
    { id: 'saldo_corte', title: 'Pagar saldo del corte', text: 'Si pagas el total que aparece en tu estado de corte antes de la fecha de pago, evitas intereses en ese periodo. Es distinto a pagar solo el mínimo, depende de tu banco.' },
    { id: 'pago_tiempo', title: 'Por qué pagar a tiempo no significa saldo reportado en cero', text: 'Aunque pagues a tiempo, tu reporte puede mostrar saldo porque el buró toma una foto en una fecha distinta a tu pago. Por ejemplo, si reportan en tu fecha de corte y tú pagas después, verán el saldo del corte. Depende de tu emisor.' },
  ] : [
    { id: 'limite', title: 'Credit limit', text: 'Maximum amount your issuer allows on that card. Does not include future interest. Each bank decides adjustments, depends on your issuer.' },
    { id: 'saldo', title: 'Balance', text: 'What you currently owe based on purchases and payments. Not same as minimum. Issuer is definitive source, depends on your bank.' },
    { id: 'disponible', title: 'Available credit', text: 'What remains: limit minus balance. Derived value, not separate fact.' },
    { id: 'utilizacion', title: 'Utilization', text: 'Percentage of limit you are using: balance divided by limit. Not a score, but signal issuers and bureaus watch.' },
    { id: 'corte', title: 'Statement date', text: 'Day issuer closes period and creates statement. Purchases before cut enter that statement; after, next one. Depends on your issuer.' },
    { id: 'pago', title: 'Payment date', text: 'The date your issuer gives as the payment deadline. Consequences of paying after it depend on your contract and issuer; we do not assume a universal timing.' },
    { id: 'reporte', title: 'Reporting moment', text: 'When your issuer shares info with bureau. May be at cut, start of month or other day. Depends on issuer, we do not assume.' },
    { id: 'minimo', title: 'Minimum payment', text: 'Minimum you must pay to avoid fees. Not total statement. Paying only minimum generates interest on rest. Depends on issuer.' },
    { id: 'saldo_corte', title: 'Paying statement balance', text: 'If you pay total statement before due date, you avoid interest that period. Different from paying only minimum, depends on your bank.' },
    { id: 'pago_tiempo', title: 'Why paying on time does not mean zero reported balance', text: 'Even if you pay on time, report may show balance because bureau snapshots on different date than payment. E.g., if they report at statement date and you pay after, they see statement balance. Depends on issuer.' },
  ], [lang]);

  const filteredGlossary = glossary.filter(g => g.title.toLowerCase().includes(glossaryQ.toLowerCase()) || g.text.toLowerCase().includes(glossaryQ.toLowerCase()));

  const navItems: { id: Tab; label: string; shortLabel: string; Icon: React.FC<{active?: boolean}> }[] = [
    { id: 'panorama', label: t.nav.panorama, shortLabel: t.nav.short.panorama, Icon: CompassIcon },
    { id: 'tarjetas', label: t.nav.tarjetas, shortLabel: t.nav.short.tarjetas, Icon: CardsStackIcon },
    { id: 'comprar', label: t.nav.comprar, shortLabel: t.nav.short.comprar, Icon: PlusCircleIcon },
    { id: 'explicame', label: t.nav.explicame, shortLabel: t.nav.short.explicame, Icon: QuestionIcon },
  ];

  const openAddModal = () => {
    if (cards.length >= 3 && !editingId) { setShowLimit(true); return; }
    setDraft({ nombre: '', emisor: '', limite: null, saldo: null, corte: null, pago: null, last4: null, reporte: 'desconocido' });
    setEditingId(null);
    setShowAdd(true);
  };
  const openEditModal = (card: CardData) => {
    setDraft({ ...card });
    setEditingId(card.id);
    setShowAdd(true);
  };

  const validateDraft = (): boolean => {
    if (!draft.nombre || !String(draft.nombre).trim()) return false;
    if (!draft.emisor || !String(draft.emisor).trim()) return false;
    if (draft.limite !== null && draft.limite !== undefined && String(draft.limite) !== '' && (isNaN(Number(draft.limite)) || Number(draft.limite) < 0)) return false;
    if (draft.saldo !== null && draft.saldo !== undefined && String(draft.saldo) !== '' && (isNaN(Number(draft.saldo)) || Number(draft.saldo) < 0)) return false;
    if (draft.corte !== null && draft.corte !== undefined && String(draft.corte) !== '' && (isNaN(Number(draft.corte)) || Number(draft.corte) < 1 || Number(draft.corte) > 31)) return false;
    if (draft.pago !== null && draft.pago !== undefined && String(draft.pago) !== '' && (isNaN(Number(draft.pago)) || Number(draft.pago) < 1 || Number(draft.pago) > 31)) return false;
    if (draft.last4 !== null && draft.last4 !== undefined && String(draft.last4).trim() !== '' && !/^\d{4}$/.test(String(draft.last4))) return false;
    return true;
  };

  const handleSaveCard = () => {
    if (!validateDraft()) { setToast(lang === 'es' ? 'Revisa los campos requeridos' : 'Check required fields'); return; }
    const base: CardData = {
      id: editingId || `card-${Date.now()}-${String(draft.nombre).toLowerCase().replace(/\s+/g,'-')}`,
      nombre: String(draft.nombre).trim(),
      emisor: String(draft.emisor).trim(),
      limite: draft.limite === null || draft.limite === undefined || String(draft.limite) === '' ? null : Number(draft.limite),
      saldo: draft.saldo === null || draft.saldo === undefined || String(draft.saldo) === '' ? null : Number(draft.saldo),
      corte: draft.corte === null || draft.corte === undefined || String(draft.corte) === '' ? null : Number(draft.corte),
      pago: draft.pago === null || draft.pago === undefined || String(draft.pago) === '' ? null : Number(draft.pago),
      last4: draft.last4 === null || draft.last4 === undefined || String(draft.last4).trim() === '' ? null : String(draft.last4).trim(),
      reporte: (draft.reporte as Reporte) || 'desconocido',
      isSample: false,
    };
    if (editingId) {
      setCards(prev => prev.map(c => c.id === editingId ? { ...base, isSample: prev.find(p=>p.id===editingId)?.isSample && isDemo ? true : false } : c));
      setToast(t.toasts.cardUpdated);
    } else {
      if (cards.length >= 3) { setShowLimit(true); return; }
      setCards(prev => [...prev, base]);
      setToast(t.toasts.cardAdded);
    }
    setShowAdd(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setToast(t.toasts.cardDeleted);
    setShowAdd(false);
    setEditingId(null);
    setShowDeleteConfirm(null);
  };

  const handleCreatePanorama = () => {
    let restored: CardData[] = [];
    try {
      const raw = localStorage.getItem('mp_real_cards');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) restored = parsed.filter((c: any) => c && c.isSample !== true);
    } catch {}
    setIsDemo(false);
    setCards(restored);
    setHasOnboarded(true);
    setShowOnboarding(false);
    try {
      localStorage.setItem('mp_demo', 'false');
      localStorage.setItem('mp_cards', JSON.stringify(restored));
      localStorage.setItem('mp_hasOnboarded','true');
    } catch {}
    setTab('tarjetas');
  };
  const handleExploreSample = () => {
    if (!isDemo) {
      try { localStorage.setItem('mp_real_cards', JSON.stringify(cards.filter(c => c.isSample !== true))); } catch {}
    }
    setIsDemo(true);
    setHasOnboarded(true);
    setCards(SAMPLE_CARDS);
    setShowOnboarding(false);
    try { localStorage.setItem('mp_demo','true'); localStorage.setItem('mp_hasOnboarded','true'); } catch {}
    setTab('panorama');
  };
  const handleClearDemo = () => {
    handleCreatePanorama();
  };

  const freeCount = cards.length;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden text-[#1A1A1A] antialiased selection:bg-[#3A6E9E]/20 theme-${theme}`} style={{ background: 'radial-gradient(120% 85% at 50% 0%, #121E1B 0%, #0F1A16 42%, #0C1511 100%)', paddingTop: 'var(--safe-area-inset-top, 0px)', scrollPaddingTop: 'calc(var(--safe-area-inset-top, 0px) + 56px)' }}>
      {/* subtle vignette */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[520px] opacity-[0.22] overflow-hidden" style={{ background: 'radial-gradient(70% 50% at 50% -5%, rgba(46,90,138,0.18) 0%, rgba(21,33,28,0.0) 58%), radial-gradient(40% 35% at 22% 12%, rgba(200,168,106,0.09) 0%, transparent 62%)' }} />

      {/* ONBOARDING FULLSCREEN */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 overflow-y-auto" style={{ background: 'radial-gradient(110% 90% at 50% 0%, #121E1B 0%, #0F1A16 34%, #0C1511 100%)', paddingTop: 'var(--safe-area-inset-top, 0px)' }}>
          <div className="w-full max-w-[560px] flex flex-col items-center text-center py-8">
            <div className="relative">
              <div className="absolute -inset-12 rounded-full opacity-25 blur-[32px]" style={{ background: 'radial-gradient(circle, rgba(46,90,138,0.38) 0%, rgba(200,168,106,0.14) 44%, transparent 72%)' }} />
              {/* PRIMARY VISUAL REFERENCE - exact as uploaded, max 340px */}
              <img src={logoUrl} alt="Mi Panorama - Eagle Compass Credit Cards" className="relative w-[320px] max-w-[84vw] h-auto object-contain select-none" style={{ maxWidth: '340px', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.55)) drop-shadow(0 0 20px rgba(46,90,138,0.28))' }} />
            </div>
            <h1 className="mt-8 text-[30px] md:text-[38px] leading-[0.95] tracking-[0.12em] font-[800] text-[#EDE9E3]" style={{ fontFamily: '"Instrument Sans", Inter, system-ui, sans-serif' }}>{t.onboarding.title}</h1>
            <p className="mt-4 max-w-[38ch] font-mono text-[13px] tracking-[0.02em] leading-[1.7] text-[#A9B8BB]">{t.onboarding.sub}</p>

            <div className="mt-10 w-full max-w-[380px] grid gap-3">
              <button onClick={handleCreatePanorama} className="w-full h-[48px] min-h-[48px] rounded-full bg-[#3A6E9E] border border-[#2E5A8A] text-[11px] tracking-[0.16em] uppercase font-[800] text-[#EDE9E3] hover:bg-[#2E5A8A] transition active:scale-[0.98] shadow-[0_8px_24px_rgba(46,90,138,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]">
                {t.onboarding.ctaPrimary}
              </button>
              <button onClick={handleExploreSample} className="w-full h-[48px] min-h-[48px] rounded-full bg-transparent border text-[11px] tracking-[0.14em] uppercase font-[700] text-[#D6D2CC] hover:bg-[#15211C] transition active:scale-[0.98]" style={{ borderColor: '#D6D2CC' }}>
                {t.onboarding.ctaSecondary}
              </button>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-[#101A16]/80 backdrop-blur" style={{ borderColor: '#1E2F27' }}>
              <span className="w-[5px] h-[5px] rounded-full bg-[#3A6E9E] shadow-[0_0_8px_rgba(58,110,158,0.6)]" />
              <span className="font-mono text-[9px] tracking-[0.12em] text-[#8FA0A3] uppercase">{t.onboarding.trustRow}</span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className="flex items-center rounded-full border p-[3px] bg-[#101A16]" style={{ borderColor: '#2A3F4A' }}>
                <button onClick={() => setLang('es')} className={`h-[30px] min-h-[30px] px-4 rounded-full text-[10px] tracking-[0.12em] font-mono uppercase font-[700] transition ${lang === 'es' ? 'bg-[#F6F4F0] text-[#101A16] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]' : 'text-[#8BA3B8] hover:text-[#D6D2CC]'}`}>ES</button>
                <button onClick={() => setLang('en')} className={`h-[30px] min-h-[30px] px-4 rounded-full text-[10px] tracking-[0.12em] font-mono uppercase font-[700] transition ${lang === 'en' ? 'bg-[#F6F4F0] text-[#101A16] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]' : 'text-[#8BA3B8] hover:text-[#D6D2CC]'}`}>EN</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky z-40 backdrop-blur-[16px] border-b w-full overflow-hidden" style={{ top: 'var(--safe-area-inset-top, 0px)', background: 'rgba(15,26,22,0.92)', borderColor: '#1E2F27', height: '56px' }}>
        <div className="max-w-[1240px] mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-3 w-full box-border">
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            {/* 32px circular mark */}
            <div className="w-[32px] h-[32px] rounded-full overflow-hidden border bg-[#0E1714] shrink-0 grid place-items-center" style={{ borderColor: '#D6D2CC', boxShadow: '0 0 0 1px rgba(46,90,138,0.22), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
              <img src={logoUrl} alt="logo mark" className="w-full h-full object-cover scale-[1.55] origin-center" />
            </div>
            <div className="flex items-baseline gap-[10px]">
              <span className="font-[800] tracking-[0.12em] text-[12px] text-[#EDE9E3]">MI PANORAMA</span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full border bg-[#121E1B] text-[9px] tracking-[0.12em] font-mono text-[#8FA0A3] uppercase" style={{ borderColor: '#2A3F4A' }}>
                <span className="w-[4px] h-[4px] rounded-full" style={{ background: '#3A6E9E' }} /> FREE · {freeCount} / 3
              </span>
            </div>
          </div>

          <nav className="hidden md:flex flex-1 md:flex-none items-center overflow-x-auto no-scrollbar gap-1 ml-2 md:ml-10">
            {navItems.map(n => {
              const active = tab === n.id;
              return (
                <button
                  key={n.id}
                  aria-pressed={active}
                  onClick={() => { setTab(n.id as Tab); window.scrollTo({ top: 0 }); }}
                  className={`relative h-[56px] min-h-[56px] px-[18px] whitespace-nowrap text-[11px] tracking-[0.12em] font-[700] transition active:scale-[0.98] uppercase ${active ? 'text-[#EDE9E3]' : 'text-[#8BA3B8] hover:text-[#D6D2CC]'}`}
                >
                  {n.label}
                  {active && <span className="absolute bottom-0 left-[18px] right-[18px] h-[1.5px] bg-[#3A6E9E] shadow-[0_0_10px_rgba(58,110,158,0.55)]" />}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-[#121E1B]" style={{ borderColor: '#2A3F4A' }}>
              <span className="w-[4px] h-[4px] rounded-full bg-[#C8A86A]" />
              <span className="font-mono text-[9px] tracking-[0.12em] text-[#8FA0A3] uppercase">{t.truth.datosLocales}</span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="h-[34px] min-h-[34px] w-[34px] rounded-full border bg-[#121E1B] text-[#D6D2CC] grid place-items-center text-[15px] transition hover:opacity-80 active:scale-[0.96]"
              style={{ borderColor: '#2A3F4A' }}
            >
              {theme === 'dark' ? '☀︎' : '☾'}
            </button>
            <div className="flex items-center rounded-full border p-[3px] bg-[#121E1B]" style={{ borderColor: '#2A3F4A' }}>
              <button onClick={() => setLang('es')} className={`h-[28px] min-h-[28px] px-[12px] rounded-full text-[10px] font-mono tracking-[0.12em] font-[700] transition ${lang === 'es' ? 'bg-[#F6F4F0] text-[#101A16]' : 'text-[#8BA3B8] hover:text-[#D6D2CC]'}`}>ES</button>
              <button onClick={() => setLang('en')} className={`h-[28px] min-h-[28px] px-[12px] rounded-full text-[10px] font-mono tracking-[0.12em] font-[700] transition ${lang === 'en' ? 'bg-[#F6F4F0] text-[#101A16]' : 'text-[#8BA3B8] hover:text-[#D6D2CC]'}`}>EN</button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-full overflow-hidden">
        <div className="max-w-[1240px] mx-auto overflow-hidden">
          <WireframeArc />
        </div>
      </div>

      {!isDemo && !showOnboarding && (
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 mt-2 flex justify-end">
          <button onClick={handleExploreSample} className="h-[34px] min-h-[34px] px-3.5 rounded-full border bg-[#121E1B] text-[9px] tracking-[0.12em] uppercase font-[700] text-[#8BA3B8] hover:text-[#D6D2CC] hover:bg-[#15211C] active:scale-[0.98]" style={{ borderColor: '#2A3F4A' }}>{t.demoBanner.explore}</button>
        </div>
      )}

      {isDemo && !showOnboarding && (
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 mt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border bg-[#F6F4F0] px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
            <div className="flex items-center gap-2.5">
              <span className="w-[6px] h-[6px] rounded-full bg-[#C8A86A] shadow-[0_0_8px_rgba(200,168,106,0.6)]" />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5A6A70]">{t.demoBanner.text}</span>
            </div>
            <button onClick={handleClearDemo} className="h-[36px] min-h-[36px] px-4 rounded-full bg-[#101A16] border text-[10px] tracking-[0.12em] uppercase font-[700] text-[#EDE9E3] hover:bg-[#15211C] active:scale-[0.98]" style={{ borderColor: '#2A3F4A' }}>{t.demoBanner.cta}</button>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-6 pb-[112px] md:pb-20 w-full box-border overflow-hidden">
        <div className="hidden md:flex justify-between text-[9px] font-mono tracking-[0.12em] text-[#5A6A70] uppercase mb-3 mt-3">
          <span>{t.truth.datosLocales} // {t.truth.almacenamiento}</span>
          <span className="flex items-center gap-2"><span className="w-[4px] h-[4px] rounded-full bg-[#3A6E9E]" /> {t.truth.sinConexion} — {t.truth.almacenamiento}</span>
        </div>

        {tab === 'panorama' && (
          <div className="animate-[fade_0.35s_ease]">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[30px] md:text-[44px] leading-[0.95] tracking-[-0.01em] font-[800] text-[#EDE9E3]" style={{ fontFamily: '"Instrument Sans", Inter, system-ui, sans-serif' }}>{t.panorama.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-[#8BA3B8] uppercase">{t.panorama.subtitle}</span>
                  {isDemo && <span className="ml-1 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-[#121E1B]/70 text-[9px] font-mono tracking-[0.12em] text-[#8FA0A3] uppercase" style={{ borderColor: '#2A3F4A' }}><span className="w-1 h-1 rounded-full bg-[#C8A86A]" /> {t.tarjetas.sampleTag}</span>}
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#8BA3B8]">
                <span className="px-2.5 py-1 rounded-full border bg-[#121E1B] tracking-[0.12em]" style={{ borderColor: '#2A3F4A' }}>{t.panorama.instrument} {hasLimite ? `${utilizacionGlobal.toFixed(1)}%` : '—'}</span>
                <span className="px-2.5 py-1 rounded-full border bg-[#121E1B]" style={{ borderColor: '#2A3F4A' }}>{cards.length} {lang === 'es' ? 'TARJETAS' : 'CARDS'}</span>
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-[16px] border bg-[#F6F4F0] p-10 md:p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                <div className="w-[64px] h-[64px] mx-auto rounded-full overflow-hidden border" style={{ borderColor: '#D6D2CC' }}><img src={logoUrl} alt="logo" className="w-full h-full object-cover scale-[1.4]" /></div>
                <h3 className="mt-5 text-[18px] font-[700] tracking-[-0.01em] text-[#101A16]">{t.panorama.emptyTitle}</h3>
                <p className="mt-2 font-mono text-[12px] leading-[1.6] text-[#6B7C7F] max-w-[42ch] mx-auto">{t.panorama.emptyDesc}</p>
                <button onClick={openAddModal} className="mt-6 h-[48px] min-h-[48px] px-6 rounded-full bg-[#101A16] border text-[11px] tracking-[0.12em] uppercase font-[700] text-[#EDE9E3] hover:bg-[#15211C] active:scale-[0.98]" style={{ borderColor: '#2A3F4A' }}>{t.panorama.addFirst}</button>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4 md:gap-[18px]">
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 md:gap-[18px]">
                  <div className="rounded-[16px] border bg-[#F6F4F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                    <div className="p-[22px] md:p-[26px] border-b flex items-center justify-between" style={{ borderColor: '#D6D2CC' }}>
                      <div>
                        <h2 className="text-[13px] tracking-[0.12em] font-[800] uppercase text-[#101A16]">{t.panorama.signals}</h2>
                        <p className="mt-1 font-mono text-[11px] text-[#6B7C7F]">{t.panorama.signalsSub}</p>
                      </div>
                      <div className="hidden md:flex w-[44px] h-[44px] rounded-full border bg-[#FBFAF7] items-center justify-center" style={{ borderColor: '#D6D2CC' }}>
                        <div className="w-[26px] h-[26px] rounded-full border grid place-items-center" style={{ borderColor: '#3A6E9E' }}><span className="w-[6px] h-[6px] rounded-full bg-[#3A6E9E]" /></div>
                      </div>
                    </div>
                    <div className="flex flex-col divide-y" style={{ borderColor: '#D6D2CC' }}>
                      {[
                        { k: t.panorama.metrics.creditoDisponible, v: totalDisponible !== null ? formatMoney(totalDisponible, lang) : '—', trust: 'derivado' as Trust, note: t.panorama.metrics.noteDisponible },
                        { k: t.panorama.metrics.saldoTotal, v: hasSaldo ? formatMoney(totalSaldo, lang) : '—', trust: 'hecho' as Trust, note: t.panorama.metrics.noteSaldo },
                        { k: t.panorama.metrics.utilizacion, v: hasLimite && totalLimite>0 ? `${utilizacionGlobal.toFixed(1)}%` : '—', trust: 'derivado' as Trust, note: t.panorama.metrics.noteUtil },
                        { k: t.panorama.metrics.numTarjetas, v: `${cards.length}`, trust: 'hecho' as Trust, note: t.panorama.metrics.noteNum },
                        { k: t.panorama.metrics.proximoCorte, v: nearestCorte ? formatNextDate(nearestCorte.info, lang, t) : t.trust.desconocida, trust: (nearestCorte ? 'hecho' : 'desconocida') as Trust, note: `${t.panorama.metrics.noteCorte}${nearestCorte ? ` · ${nearestCorte.card.emisor} ${nearestCorte.card.nombre}` : ''}` },
                        { k: t.panorama.metrics.proximoPago, v: nearestPago ? formatNextDate(nearestPago.info, lang, t) : t.trust.desconocida, trust: (nearestPago ? 'hecho' : 'desconocida') as Trust, note: `${t.panorama.metrics.notePago}${nearestPago ? ` · ${nearestPago.card.emisor} ${nearestPago.card.nombre}` : ''}` },
                      ].map(row => (
                        <div key={row.k} className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 px-[20px] md:px-[26px] py-[15px] bg-white md:bg-[#F6F4F0]">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-[700] text-[#101A16] tracking-[-0.01em]">{row.k}</span>
                              <TrustBadge type={row.trust} lang={lang} compact />
                            </div>
                            <div className="font-mono text-[11px] text-[#6B7C7F] mt-[2px] leading-[1.5]">{row.note}</div>
                          </div>
                          <div className="text-left md:text-right shrink-0">
                            <div className="text-[14px] font-[700] font-mono text-[#101A16] leading-[1.4]">{row.v}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[16px] border bg-[#F6F4F0] p-[20px] md:p-[26px]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                    <h3 className="text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.panorama.attention}</h3>
                    <div className="mt-4 grid md:grid-cols-2 gap-3">
                      {nearestCorte ? (
                        <div className="rounded-[12px] border bg-[#FBFAF7] p-3 flex gap-3 min-h-[64px]" style={{ borderColor: '#D6D2CC' }}>
                          <div className="w-[28px] h-[28px] rounded-full bg-[#101A16] border grid place-items-center shrink-0" style={{ borderColor: '#2A3F4A' }}><span className="w-[5px] h-[5px] rounded-full bg-[#EDE9E3]" /></div>
                          <div>
                            <div className="text-[12px] font-[700] text-[#101A16]">{lang === 'es' ? `Corte en ${nearestCorte.info.daysUntil} días — ${nearestCorte.card.nombre}` : `Statement in ${nearestCorte.info.daysUntil} days — ${nearestCorte.card.nombre}`}</div>
                            <div className="text-[11px] font-mono leading-[1.5] text-[#6B7C7F] mt-1">{lang === 'es' ? `Tu fecha de corte registrada es el día ${nearestCorte.card.corte}. El momento exacto en que una compra entra en un ciclo depende de cuándo el emisor procesa la operación.` : `Your recorded statement day is ${nearestCorte.card.corte}. The exact cycle for a purchase depends on when the issuer processes the transaction.`}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[12px] border border-dashed bg-[#F6F4F0] p-3 flex gap-3 min-h-[64px]" style={{ borderColor: '#D6D2CC' }}>
                          <div className="w-[28px] h-[28px] rounded-full border border-dashed grid place-items-center shrink-0" style={{ borderColor: '#9A9590' }}><span className="w-[7px] h-[7px] border" style={{ borderColor: '#9A9590' }} /></div>
                          <div>
                            <div className="text-[12px] font-[700] text-[#101A16]">{t.trust.desconocida}</div>
                            <div className="text-[11px] font-mono leading-[1.5] text-[#6B7C7F] mt-1">{lang === 'es' ? 'No sabemos fecha de corte. No asumimos en qué ciclo entra tu compra.' : 'No statement date. We do not assume which cycle purchase enters.'}</div>
                          </div>
                        </div>
                      )}
                      <div className="rounded-[12px] border border-dashed bg-[#F6F4F0] p-3 flex gap-3 min-h-[64px]" style={{ borderColor: '#D6D2CC' }}>
                        <div className="w-[28px] h-[28px] rounded-full border border-dashed grid place-items-center shrink-0" style={{ borderColor: '#9A9590' }}><span className="w-[7px] h-[7px] border" style={{ borderColor: '#9A9590' }} /></div>
                        <div>
                          <div className="text-[12px] font-[700] text-[#101A16]">{lang === 'es' ? 'Información por confirmar' : 'Information to confirm'}</div>
                          <div className="text-[11px] font-mono leading-[1.5] text-[#6B7C7F] mt-1">{lang === 'es' ? 'Momento de reporte a buró depende de tu emisor. No lo asumimos.' : 'Bureau reporting moment depends on issuer. We do not assume.'}</div>
                          <div className="mt-2"><TrustBadge type="desconocida" lang={lang} /></div>
                        </div>
                      </div>
                      {utilizacionGlobal > 70 && (
                        <div className="rounded-[12px] border bg-[#FFF8F0] p-3 flex gap-3 md:col-span-2" style={{ borderColor: '#C8A86A' }}>
                          <div className="w-[28px] h-[28px] rounded-full bg-[#C8A86A] grid place-items-center shrink-0"><span className="text-[14px]">!</span></div>
                          <div>
                            <div className="text-[12px] font-[700] text-[#101A16]">{lang==='es'?'Utilización alta':'High utilization'}</div>
                            <div className="text-[11px] font-mono leading-[1.5] text-[#6B7C7F] mt-1">{lang==='es'?`Tu utilización global es ${utilizacionGlobal.toFixed(1)}%. Revisar pagos puede ayudar, depende de tu emisor.`:`Your global utilization is ${utilizacionGlobal.toFixed(1)}%. Reviewing payments may help, depends on issuer.`}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 md:gap-[18px]">
                  <div className="rounded-[16px] border bg-[#121E1B] overflow-hidden w-full" style={{ borderColor: '#2A3F4A', boxShadow: '0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(46,90,138,0.14) inset' }}>
                    <div className="px-[20px] py-[14px] border-b flex items-center justify-between" style={{ borderColor: '#1E2F27' }}>
                      <span className="text-[10px] tracking-[0.12em] uppercase font-mono text-[#8BA3B8]">{t.panorama.instrument}</span>
                      <span className="text-[9px] tracking-[0.12em] font-mono text-[#5A6A70]">{t.panorama.range}</span>
                    </div>
                    <div className="p-[18px] pt-[20px] flex flex-col items-center">
                      <Gauge value={utilizacionGlobal} />
                      <div className="mt-2 flex items-center gap-2"><TrustBadge type="derivado" lang={lang} /></div>
                      <div className="mt-6 grid grid-cols-3 gap-2 text-center w-full">
                        <div className="rounded-[10px] bg-[#101A16] border py-3 flex flex-col justify-center" style={{ borderColor: '#263A33' }}><div className="font-mono text-[10px] text-[#8BA3B8] tracking-[0.12em] uppercase">{t.panorama.limite}</div><div className="text-[13px] font-mono text-[#EDE9E3] mt-1">{hasLimite ? `$${totalLimite.toLocaleString(lang==='es'?'es-MX':'en-US')}` : '—'}</div></div>
                        <div className="rounded-[10px] bg-[#101A16] border py-3 flex flex-col justify-center" style={{ borderColor: '#263A33' }}><div className="font-mono text-[10px] text-[#8BA3B8] tracking-[0.12em] uppercase">{t.panorama.saldo}</div><div className="text-[13px] font-mono text-[#EDE9E3] mt-1">{hasSaldo ? `$${totalSaldo.toLocaleString(lang==='es'?'es-MX':'en-US')}` : '—'}</div></div>
                        <div className="rounded-[10px] bg-[#101A16] border py-3 flex flex-col justify-center" style={{ borderColor: '#263A33' }}><div className="font-mono text-[10px] text-[#8BA3B8] tracking-[0.12em] uppercase">{t.panorama.disponible}</div><div className="text-[13px] font-mono text-[#EDE9E3] mt-1">{totalDisponible !== null ? `$${totalDisponible.toLocaleString(lang==='es'?'es-MX':'en-US')}` : '—'}</div></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[16px] border bg-[#F6F4F0] p-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                    <h4 className="text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.panorama.whatWeKnow}</h4>
                    <ul className="mt-3 space-y-2.5">
                      {t.panorama.listKnow.map(tx => (<li key={tx} className="flex gap-2 text-[12.5px] leading-[1.5] text-[#1A2B23]"><span className="mt-[6px] w-[5px] h-[5px] rounded-full bg-[#2A4A3A] shrink-0" />{tx}</li>))}
                    </ul>
                    <h4 className="mt-6 text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.panorama.whatWeDont}</h4>
                    <ul className="mt-3 space-y-2.5">
                      {t.panorama.listDont.map(tx => (<li key={tx} className="flex gap-2 text-[12.5px] leading-[1.5] text-[#5A6A70]"><span className="mt-[3px] w-[12px] h-[12px] border border-dashed shrink-0 rounded-[1px]" style={{ borderColor: '#9A9590' }} />{tx}</li>))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-dashed" style={{ borderColor: '#D6D2CC' }}>
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]"><span className="w-[6px] h-[6px] rounded-full bg-[#101A16]" /> {t.trust.hecho}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]"><span className="w-[6px] h-[6px] rounded-full bg-[#2A4A3A]" /> {t.trust.derivado}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]"><span className="w-[7px] h-[7px] border border-dashed" style={{ borderColor: '#9A9590' }} /> {t.trust.desconocida}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'tarjetas' && (
          <div className="animate-[fade_0.35s_ease]">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[30px] md:text-[40px] leading-[0.95] tracking-[-0.02em] font-[800] text-[#EDE9E3]" style={{ fontFamily: '"Instrument Sans", Inter, system-ui, sans-serif' }}>{t.tarjetas.title}</h1>
                <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#8BA3B8] uppercase">{t.tarjetas.subtitle}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[84px] h-[4px] rounded-full bg-[#121E1B] border overflow-hidden" style={{ borderColor: '#2A3F4A' }}>
                      <div className="h-full bg-[#3A6E9E] transition-all" style={{ width: `${(freeCount/3)*100}%` }} />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-[#8BA3B8] uppercase">{freeCount} {t.tarjetas.freeProgress}</span>
                  </div>
                  <span className="px-2 py-[2px] rounded-full border bg-[#121E1B] text-[9px] font-mono tracking-[0.12em] text-[#8FA0A3] uppercase" style={{ borderColor: '#2A3F4A' }}>{t.tarjetas.freeBadge}</span>
                </div>
              </div>
              <button onClick={openAddModal} className="min-h-[48px] h-[48px] px-6 rounded-full border bg-[#F6F4F0] text-[#101A16] text-[11px] tracking-[0.12em] uppercase font-[800] hover:bg-white transition active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" style={{ borderColor: '#D6D2CC' }}>{t.tarjetas.add}</button>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-[16px] border bg-[#F6F4F0] p-10 text-center" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                <div className="text-[13px] font-[700] text-[#101A16]">{t.tarjetas.empty}</div>
                <div className="mt-2 font-mono text-[11px] text-[#6B7C7F]">{t.tarjetas.emptyDesc}</div>
                <button onClick={openAddModal} className="mt-5 h-[48px] min-h-[48px] px-6 rounded-full bg-[#101A16] border text-[#EDE9E3] text-[11px] tracking-[0.12em] uppercase font-[700]" style={{ borderColor: '#2A3F4A' }}>{t.tarjetas.add}</button>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-none md:grid md:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] md:overflow-visible md:snap-none">
                {cards.map(card => {
                  const disponible = card.limite !== null && card.saldo !== null ? card.limite - card.saldo : null;
                  const utiliz = card.limite && card.saldo !== null && card.limite>0 ? (card.saldo / card.limite) * 100 : null;
                  return (
                    <button key={card.id} type="button" onClick={() => openEditModal(card)} className="group text-left shrink-0 w-[82%] sm:w-[58%] snap-start md:w-full md:min-w-0 md:snap-none">
                      <div className="relative rounded-[16px] border bg-[#101A16] p-[18px] overflow-hidden h-[204px] transition-transform duration-200 group-hover:-translate-y-[2px] group-active:scale-[0.99]" style={{ borderColor: '#2A3F4A', boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(46,90,138,0.12) inset, inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                        <div className="absolute inset-0 opacity-[0.38]" style={{ background: 'radial-gradient(58% 82% at 18% 18%, rgba(58,110,158,0.34) 0%, transparent 60%), radial-gradient(42% 62% at 84% 82%, rgba(200,168,106,0.11) 0%, transparent 60%), linear-gradient(128deg, rgba(42,74,58,0.18) 0%, transparent 36%)' }} />
                        <div className="absolute -right-10 -bottom-10 w-[96px] h-[96px] rounded-full border opacity-20" style={{ borderColor: '#3A6E9E' }} />
                        <div className="absolute -right-4 -bottom-4 w-[72px] h-[72px] rounded-full border border-dashed opacity-20" style={{ borderColor: '#C8A86A' }} />
                        <div className="absolute left-[-8px] top-[28px] w-[3px] h-[48px] bg-[#2A4A3A] opacity-60 rounded-full" />
                        <div className="relative flex justify-between items-start">
                          <div className="w-[36px] h-[26px] rounded-[4px] bg-gradient-to-br from-[#EDE9E3] to-[#D6D2CC] border grid place-items-center" style={{ borderColor: '#D6D2CC' }}>
                            <div className="w-[22px] h-[16px] grid grid-cols-2 gap-[2px]"><div className="bg-[#101A16]/30 rounded-[1px]" /><div className="bg-[#101A16]/30 rounded-[1px]" /><div className="bg-[#101A16]/30 rounded-[1px]" /><div className="bg-[#101A16]/30 rounded-[1px]" /></div>
                          </div>
                          <div className="w-[24px] h-[24px] rounded-full overflow-hidden border bg-[#0E1714]" style={{ borderColor: '#D6D2CC' }}><img src={logoUrl} alt="" className="w-full h-full object-cover scale-[1.6]" /></div>
                        </div>
                        <div className="relative mt-[38px] font-mono text-[16px] tracking-[0.12em] text-[#EDE9E3]">{card.last4 ? `•••• ${card.last4}` : t.tarjetas.noLast4}</div>
                        <div className="relative mt-2 flex items-end justify-between">
                          <div>
                            <div className="text-[10px] tracking-[0.12em] uppercase font-mono text-[#8BA3B8]">{card.emisor} — {card.nombre} {card.isSample && <span className="ml-1 px-1.5 py-[1px] rounded-full border text-[8px]" style={{ borderColor: '#C8A86A', color: '#C8A86A' }}>{t.tarjetas.sampleTag}</span>}</div>
                            <div className="mt-1 text-[11px] font-mono text-[#8BA3B8]">{utiliz !== null ? `${lang==='es'?'Utilización':'Utilization'} ${utiliz.toFixed(1)}%` : lang==='es'?'Sin datos suficientes':'Not enough data'}</div>
                          </div>
                          <span className="min-h-[32px] h-[32px] px-3 rounded-full border bg-[#121E1B]/60 grid place-items-center text-[10px] font-mono tracking-[0.12em] uppercase text-[#8BA3B8]" style={{ borderColor: '#2A3F4A' }}>{lang === 'es' ? 'VER' : 'VIEW'}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'comprar' && (
          <div className="animate-[fade_0.35s_ease]">
            <h1 className="text-[30px] md:text-[40px] leading-[0.95] tracking-[-0.02em] font-[800] text-[#EDE9E3]" style={{ fontFamily: '"Instrument Sans", Inter, system-ui, sans-serif' }}>{t.comprar.title}</h1>
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#8BA3B8] uppercase">{t.comprar.subtitle}</p>

            <div className="mt-6 grid grid-cols-12 gap-5 md:gap-[18px]">
              <div className="col-span-12 lg:col-span-5">
                <div className="rounded-[16px] border bg-[#F6F4F0] p-[22px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                  <div className="text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.comprar.datos}</div>
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.scoreLabel}</label>
                      <input
                        type="number"
                        value={creditScore ?? ''}
                        onChange={e => {
                          const raw = e.target.value;
                          if (raw === '') { setCreditScore(null); return; }
                          const next = Number(raw);
                          setCreditScore(isFinite(next) && next >= 300 && next <= 850 ? next : null);
                        }}
                        min={300}
                        max={850}
                        step="1"
                        placeholder="300–850"
                        className="mt-2 w-full h-[48px] rounded-[12px] border bg-white px-4 font-mono text-[16px] text-[#101A16] focus:outline-none focus:border-[#3A6E9E]"
                        style={{ borderColor: '#D6D2CC' }}
                        inputMode="numeric"
                      />
                      <div className="mt-1.5 font-mono text-[9px] leading-[1.5] text-[#6B7C7F]">{t.comprar.scoreHint}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.monto} MXN</label>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-[28px] leading-none text-[#101A16]">$</span>
                        <input
                          type="number"
                          value={monto}
                          onChange={e => {
                            const raw = e.target.value;
                            if (raw === '') { setMonto(0); return; }
                            const next = Number(raw);
                            setMonto(isFinite(next) && next >= 0 ? next : 0);
                          }}
                          min={0}
                          step="0.01"
                          className="w-full h-[64px] rounded-[12px] border bg-white px-4 font-mono text-[28px] leading-none text-[#101A16] focus:outline-none focus:border-[#3A6E9E]"
                          style={{ borderColor: '#D6D2CC' }}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono leading-[1.5] text-[#6B7C7F]">{t.comprar.montoHint}</div>
                    {cards.length === 0 && <div className="rounded-[12px] border border-dashed bg-[#FBFAF7] p-3 font-mono text-[11px] text-[#6B7C7F]" style={{ borderColor: '#D6D2CC' }}>{t.comprar.noCards}</div>}
                  </div>
                </div>
                <div className="mt-4 rounded-[16px] border bg-[#121E1B]/70 p-4 flex gap-3" style={{ borderColor: '#2A3F4A' }}>
                  <div className="w-[28px] h-[28px] rounded-full bg-[#101A16] border grid place-items-center shrink-0" style={{ borderColor: '#2A3F4A' }}><span className="text-[12px] text-[#8BA3B8]">i</span></div>
                  <div className="text-[11px] font-mono leading-[1.6] text-[#8BA3B8]">{t.comprar.truthNote}</div>
                </div>
                <div className="mt-4 rounded-[16px] border bg-[#F6F4F0] p-4" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
                  <div className="text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.comprar.whyTitle}</div>
                  <ul className="mt-2 space-y-1.5">
                    {t.comprar.listUnknown.map(tx => (<li key={tx} className="flex gap-2 text-[11px] leading-[1.5] font-mono text-[#6B7C7F]"><span className="mt-[6px] w-[4px] h-[4px] rounded-full bg-[#3A6E9E] shrink-0" />{tx}</li>))}
                  </ul>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-7">
                <div className="grid gap-3">
                  {cards.length === 0 ? (
                    <div className="rounded-[16px] border bg-[#121E1B] p-8 text-center" style={{ borderColor: '#2A3F4A' }}>
                      <div className="font-mono text-[12px] text-[#8BA3B8]">{t.comprar.noCards}</div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-[16px] border bg-[#F6F4F0] p-4" style={{ borderColor: '#D6D2CC' }}>
                        <div className="text-[11px] tracking-[0.12em] uppercase font-[800] text-[#101A16]">{t.comprar.alternativesTitle}</div>
                        <div className="mt-2 font-mono text-[10px] leading-[1.5] text-[#6B7C7F]">{t.comprar.truthNote}</div>
                      </div>
                      {[...cards].sort((a, b) => {
                        const score = (card: CardData) => {
                          if (card.saldo === null || card.limite === null || card.limite <= 0) return Number.POSITIVE_INFINITY;
                          const after = ((card.saldo + monto) / card.limite) * 100;
                          const before = (card.saldo / card.limite) * 100;
                          const delta = after - before;
                          const exceeds = card.saldo + monto > card.limite;
                          return (exceeds ? 100000 : 0) + delta;
                        };
                        return score(a) - score(b);
                      }).map((card, rank) => {
                    const saldo = card.saldo;
                    const limite = card.limite;
                    const nuevoSaldo = saldo !== null ? saldo + monto : null;
                    const dispDesp = limite !== null && nuevoSaldo !== null ? limite - nuevoSaldo : null;
                    const utilAntes = limite && saldo !== null && limite>0 ? (saldo/limite)*100 : null;
                    const utilDesp = limite && nuevoSaldo !== null && limite>0 ? (nuevoSaldo/limite)*100 : null;
                    const exceeds = dispDesp !== null && dispDesp < 0;
                    const missingData = saldo === null || limite === null;
                    const cutoffInfo = getNextOccurrence(card.corte);
                    const paymentInfo = getNextOccurrence(card.pago);
                    const reportLabel = card.reporte === 'fecha_corte'
                      ? t.comprar.knownAtCutoff
                      : card.reporte === 'desconocido'
                        ? t.comprar.unknownTiming
                        : t.tarjetas.reporteOpts[card.reporte] || t.comprar.unknownTiming;
                    const utilizationDelta = utilAntes !== null && utilDesp !== null ? utilDesp - utilAntes : null;
                    return (
                      <div key={card.id} className="rounded-[16px] border bg-[#121E1B] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.28)]" style={{ borderColor: exceeds ? '#8B3A3A' : '#2A3F4A' }}>
                        {rank === 0 && !exceeds && !missingData && (
                          <div className="mb-3 flex items-center justify-between gap-2 rounded-[10px] border px-3 py-2" style={{ borderColor: '#3A6E9E', background: 'rgba(58,110,158,0.10)' }}>
                            <span className="text-[9px] tracking-[0.12em] uppercase font-mono text-[#AFC7DB]">{t.comprar.lowerImpact}</span>
                            <span className="text-[9px] font-mono text-[#8BA3B8]">{t.comprar.utilizationChange}: {utilDesp !== null && utilAntes !== null ? `${utilDesp - utilAntes >= 0 ? '+' : ''}${(utilDesp - utilAntes).toFixed(1)} pp` : '—'}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[12px] font-[700] text-[#EDE9E3]">{card.emisor} {card.nombre} {card.last4 ? `•••• ${card.last4}` : `(${t.tarjetas.noLast4})`}</div>
                          {exceeds && <span className="px-2 py-[2px] rounded-full bg-[#8B3A3A]/20 border border-[#8B3A3A]/40 text-[9px] font-mono tracking-[0.12em] uppercase text-[#E8A0A0]">{lang==='es'?'Supera':'Exceeds'}</span>}
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px]">
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[8px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.cutoff}</div>
                            <div className="mt-1 text-[#D6D2CC]">{cutoffInfo ? formatNextDate(cutoffInfo, lang, t) : t.trust.desconocida}</div>
                          </div>
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[8px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.payment}</div>
                            <div className="mt-1 text-[#D6D2CC]">{paymentInfo ? formatNextDate(paymentInfo, lang, t) : t.trust.desconocida}</div>
                          </div>
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[8px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.reportTiming}</div>
                            <div className="mt-1 text-[#D6D2CC]">{reportLabel}</div>
                          </div>
                        </div>
                        <div className="mt-2 rounded-[10px] border bg-[#101A16] p-2.5 font-mono text-[10px]" style={{ borderColor: '#263A33' }}>
                          <span className="text-[#6B7C7F] uppercase tracking-[0.12em]">{t.comprar.impact}: </span>
                          <span className="text-[#D6D2CC]">{utilizationDelta !== null ? `${t.comprar.utilizationChange}: ${utilizationDelta >= 0 ? '+' : ''}${utilizationDelta.toFixed(1)} pp` : t.comprar.unavailable}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.saldoActual}</div>
                            <div className="mt-1 text-[#D6D2CC]">{saldo!==null ? formatMoney(saldo, lang) : '—'}</div>
                          </div>
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.montoCompra}</div>
                            <div className="mt-1 text-[#EDE9E3] font-[700]">{formatMoney(monto, lang)}</div>
                          </div>
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: '#263A33' }}>
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.saldoNuevo}</div>
                            <div className="mt-1 text-[#EDE9E3]">{nuevoSaldo!==null ? formatMoney(nuevoSaldo, lang) : '—'}</div>
                          </div>
                          <div className="rounded-[10px] bg-[#101A16] border p-2.5" style={{ borderColor: exceeds ? '#8B3A3A' : '#263A33' }}>
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.comprar.disponibleDesp}</div>
                            <div className={`mt-1 ${exceeds ? 'text-[#E8A0A0] font-[700]' : 'text-[#D6D2CC]'}`}>{dispDesp!==null ? formatMoney(dispDesp, lang) : '—'}</div>
                          </div>
                        </div>
                        <div className="mt-5 rounded-[12px] border bg-[#121E1B] p-3" style={{ borderColor: '#2A3F4A' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] tracking-[0.12em] uppercase font-mono text-[#8BA3B8]">{t.comprar.scoreLabel}</div>
                    <div className="font-mono text-[15px] font-[700] text-[#EDE9E3]">{creditScore ?? t.comprar.scoreUnknown}</div>
                  </div>
                  <div className="mt-2 text-[9px] leading-[1.5] font-mono text-[#6B7C7F]">{t.comprar.scoreNote}</div>
                </div>
                <div className="mt-3 rounded-[12px] border bg-[#F6F4F0] p-3" style={{ borderColor: '#D6D2CC', boxShadow: 'inset 0 1px 0 #E8E4DE' }}>
                          {missingData ? (
                            <div className="flex items-center gap-2">
                              <TrustBadge type="desconocida" lang={lang} />
                              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#6B7C7F]">{t.trust.desconocida} — {lang==='es'?'Falta límite o saldo para calcular':'Missing limit or balance'}</span>
                            </div>
                          ) : exceeds ? (
                            <span className="text-[11px] leading-[1.5] font-[600] text-[#8B3A3A]">{t.comprar.exceeds}</span>
                          ) : (
                            <div className="text-[11px] leading-[1.5] text-[#101A16]">
                              {t.comprar.neutral1} <span className="font-[700]">{saldo!==null ? formatMoney(saldo, lang) : '—'}</span> {t.comprar.neutral2} <span className="font-[700]">{nuevoSaldo!==null ? formatMoney(nuevoSaldo, lang) : '—'}</span>. {t.comprar.neutral3} <span className="font-[700]">{utilAntes!==null ? `${utilAntes.toFixed(1)}%` : '—'}</span> {t.comprar.neutral2} <span className="font-[700]">{utilDesp!==null ? `${utilDesp.toFixed(1)}%` : '—'}</span>.
                            </div>
                          )}
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <TrustBadge type="derivado" lang={lang} />
                            <TrustBadge type={saldo!==null && limite!==null ? 'hecho' : 'desconocida'} lang={lang} />
                          </div>
                        </div>
                      </div>
                    );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'explicame' && (
          <div className="animate-[fade_0.35s_ease] max-w-[880px]">
            <h1 className="text-[30px] md:text-[40px] leading-[0.95] tracking-[-0.02em] font-[800] text-[#EDE9E3]" style={{ fontFamily: '"Instrument Sans", Inter, system-ui, sans-serif' }}>{t.explicame.title}</h1>
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#8BA3B8] uppercase">{t.explicame.subtitle}</p>

            <div className="mt-6 flex items-center gap-3 sticky z-20 backdrop-blur-[10px] py-3 -mx-4 px-4 md:mx-0 md:px-0" style={{ top: 'calc(var(--safe-area-inset-top, 0px) + 56px)', background: 'rgba(15,26,22,0.88)' }}>
              <div className="flex-1 relative">
                <input
                  value={glossaryQ}
                  onChange={e => setGlossaryQ(e.target.value)}
                  placeholder={t.explicame.search}
                  className="w-full h-[48px] min-h-[48px] rounded-full border bg-[#121E1B] pl-11 pr-4 font-mono text-[12px] text-[#EDE9E3] placeholder:text-[#5A6A70] focus:outline-none focus:border-[#3A6E9E]"
                  style={{ borderColor: '#2A3F4A' }}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6A70]">⌕</span>
              </div>
              <span className="inline-flex h-[48px] min-h-[48px] items-center px-4 rounded-full border bg-[#121E1B] text-[10px] tracking-[0.12em] uppercase font-mono text-[#8BA3B8]" style={{ borderColor: '#2A3F4A' }}>{filteredGlossary.length} {t.explicame.topics}</span>
            </div>

            <div className="mt-5 rounded-[16px] border bg-[#F6F4F0] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 #E8E4DE' }}>
              {filteredGlossary.map(item => {
                const open = openGlos === item.id;
                return (
                  <div key={item.id} className="border-b last:border-b-0" style={{ borderColor: '#D6D2CC' }}>
                    <button onClick={() => setOpenGlos(open ? null : item.id)} className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-[18px] min-h-[52px] text-left hover:bg-[#FBFAF7] transition active:scale-[0.99]">
                      <div className="flex items-center gap-3">
                        <span className={`w-[28px] h-[28px] rounded-full border grid place-items-center transition shrink-0 ${open ? 'bg-[#101A16] border-[#101A16] text-[#EDE9E3]' : 'bg-white border-[#D6D2CC] text-[#6B7C7F]'}`}>{open ? '−' : '+'}</span>
                        <span className="text-[13px] font-[700] tracking-[-0.01em] text-[#101A16]">{item.title}</span>
                      </div>
                      <span className="hidden md:inline text-[10px] tracking-[0.12em] uppercase font-mono text-[#6B7C7F]">{open ? (lang==='es'?'Abierto':'Open') : (lang==='es'?'Ver':'View')}</span>
                    </button>
                    {open && (
                      <div className="px-5 md:px-6 pb-5 pl-[56px] md:pl-[62px]">
                        <div className="text-[13px] leading-[1.6] text-[#1A2B23]">{item.text}</div>
                        <div className="mt-3 inline-flex">
                          <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F] border bg-white px-2.5 py-1 rounded-full" style={{ borderColor: '#D6D2CC' }}>{lang==='es'?'Depende de tu emisor — no es igual para todos':'Depends on issuer — not same for all'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredGlossary.length === 0 && (
                <div className="p-8 text-center font-mono text-[12px] text-[#6B7C7F]">{lang==='es'?'No encontramos ese tema.':'No results.'}</div>
              )}
            </div>

            <div className="mt-6 rounded-[16px] border bg-[#121E1B] p-5" style={{ borderColor: '#2A3F4A' }}>
              <div className="text-[11px] tracking-[0.12em] uppercase font-mono text-[#8BA3B8]">{t.explicame.how}</div>
              <div className="mt-2 text-[12px] leading-[1.6] font-mono text-[#6B7C7F]">{t.explicame.howDesc}</div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-6 border-t flex flex-wrap justify-between gap-3 text-[9px] font-mono tracking-[0.12em] uppercase text-[#5A6A70]" style={{ borderColor: '#1E2F27' }}>
          <span>Mi Panorama — Clarity Instrument © 2025 — {t.truth.footer}</span>
          <span className="flex items-center gap-2"><span className="w-[5px] h-[5px] rounded-full bg-[#3A6E9E]" /> {t.truth.frontendOnly}</span>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex h-[68px] border-t" style={{ background: '#0F1A16', borderColor: '#1E2F27', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="w-full max-w-[1240px] mx-auto flex h-full">
          {navItems.map(n => {
            const active = tab === n.id;
            const Icon = n.Icon;
            return (
              <button
                key={n.id}
                onClick={() => { setTab(n.id as Tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex-1 relative flex flex-col items-center justify-center gap-[4px] min-h-[68px] transition active:scale-[0.98] touch-manipulation ${active ? 'text-[#EDE9E3]' : 'text-[#5A6A70]'}`}
              >
                {active && <span className="absolute top-0 left-[18%] right-[18%] h-[1.5px] bg-[#3A6E9E] shadow-[0_0_8px_rgba(58,110,158,0.45)]" />}
                <Icon active={active} />
                <span className={`text-[9px] tracking-[0.12em] uppercase font-[700] leading-none ${active ? 'text-[#EDE9E3]' : 'text-[#5A6A70]'}`}>{n.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex md:grid md:place-items-center items-end md:items-center p-0 md:p-4">
          <div className="absolute inset-0 bg-[#060A0B]/70 backdrop-blur-[6px]" onClick={() => setShowAdd(false)} />
          <div className="relative w-full md:max-w-[560px] rounded-t-[20px] md:rounded-[16px] border-t md:border bg-[#F6F4F0] shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-6 pb-[calc(24px+env(safe-area-inset-bottom,0px))] md:pb-6 max-h-[92vh] overflow-y-auto" style={{ borderColor: '#D6D2CC', boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 #E8E4DE' }}>
            <div className="md:hidden w-[36px] h-[4px] rounded-full bg-[#D6D2CC] mx-auto mb-4" />
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[14px] font-[800] tracking-[0.12em] uppercase text-[#101A16]">{editingId ? (lang==='es'?'Editar tarjeta':'Edit card') : (lang==='es'?'Agregar tarjeta':'Add card')}</h3>
              <button onClick={() => setShowAdd(false)} className="w-[36px] h-[36px] min-h-[36px] rounded-full border grid place-items-center text-[#6B7C7F] active:scale-[0.98]" style={{ borderColor: '#D6D2CC' }}>✕</button>
            </div>
            <p className="mt-2 font-mono text-[11px] text-[#6B7C7F] leading-[1.5]">{lang==='es'?'Solo en este navegador. Nunca generamos últimos 4 aleatorios. Los datos se guardan localmente.':'Only in this browser. Never generate random last 4. Data stays local.'} <span className="text-[#101A16] font-[700]">{t.tarjetas.requiredNote}</span></p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { k: 'nombre', label: t.tarjetas.fields.nombre, ph: lang==='es'?'Oro, LikeU...':'Gold, LikeU...', type: 'text' },
                { k: 'emisor', label: t.tarjetas.fields.emisor, ph: lang==='es'?'Ej. banco o emisor':'e.g. bank or issuer', type: 'text' },
                { k: 'limite', label: t.tarjetas.fields.limite, ph: '30000', type: 'number' },
                { k: 'saldo', label: t.tarjetas.fields.saldo, ph: '8500', type: 'number' },
                { k: 'corte', label: t.tarjetas.fields.corte, ph: '15', type: 'number' },
                { k: 'pago', label: t.tarjetas.fields.pago, ph: '5', type: 'number' },
                { k: 'last4', label: t.tarjetas.fields.last4, ph: '1234', type: 'text' },
              ].map(f => (
                <div key={f.k} className={f.k === 'nombre' || f.k === 'emisor' ? 'col-span-2 md:col-span-1' : 'col-span-1'}>
                  <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    value={(draft as any)[f.k] ?? ''}
                    onChange={e => setDraft(s => ({ ...s, [f.k]: e.target.value === '' ? null : (f.type === 'number' ? Number(e.target.value) : e.target.value) }))}
                    className="mt-1.5 w-full h-[48px] min-h-[48px] rounded-[12px] border bg-white px-3 font-mono text-[13px] text-[#101A16] focus:outline-none focus:border-[#3A6E9E]"
                    style={{ borderColor: '#D6D2CC' }}
                  />
                  {f.k === 'last4' && <div className="mt-1 font-mono text-[9px] text-[#8FA0A3]">{t.tarjetas.last4Note}</div>}
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-[10px] font-mono tracking-[0.12em] uppercase text-[#6B7C7F]">{t.tarjetas.fields.reporte}</label>
                <select value={draft.reporte || 'desconocido'} onChange={e => setDraft(s => ({ ...s, reporte: e.target.value as Reporte }))} className="mt-1.5 w-full h-[48px] min-h-[48px] rounded-[12px] border bg-white px-3 font-mono text-[13px] text-[#101A16] focus:outline-none focus:border-[#3A6E9E]" style={{ borderColor: '#D6D2CC' }}>
                  <option value="desconocido">{t.tarjetas.reporteOpts.desconocido}</option>
                  <option value="inicio_mes">{t.tarjetas.reporteOpts.inicio_mes}</option>
                  <option value="fecha_corte">{t.tarjetas.reporteOpts.fecha_corte}</option>
                  <option value="otro">{t.tarjetas.reporteOpts.otro}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-between">
              <div>
                {editingId && <button onClick={() => setShowDeleteConfirm(editingId)} className="min-h-[48px] h-[48px] px-4 rounded-full border bg-white text-[11px] tracking-[0.12em] uppercase font-[700] text-[#8B3A3A]" style={{ borderColor: '#D6D2CC' }}>{t.tarjetas.delete}</button>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="min-h-[48px] h-[48px] px-4 rounded-full border bg-white text-[11px] tracking-[0.12em] uppercase font-[700] text-[#101A16]" style={{ borderColor: '#D6D2CC' }}>{t.common.cancelar}</button>
                <button onClick={handleSaveCard} className="min-h-[48px] h-[48px] px-5 rounded-full bg-[#101A16] border text-[#EDE9E3] text-[11px] tracking-[0.12em] uppercase font-[800] active:scale-[0.98]" style={{ borderColor: '#2A3F4A' }}>
                  {editingId ? t.common.guardar : t.common.agregar}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#060A0B]/70 backdrop-blur-[6px]" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative w-full max-w-[380px] rounded-[16px] border bg-[#F6F4F0] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]" style={{ borderColor: '#D6D2CC' }}>
            <h3 className="text-[13px] font-[800] tracking-[0.12em] uppercase text-[#101A16]">{lang==='es'?'¿Eliminar tarjeta?':'Delete card?'}</h3>
            <p className="mt-2 font-mono text-[12px] leading-[1.5] text-[#5A6A70]">{lang==='es'?'Esta acción no se puede deshacer. Los datos se eliminan solo de este navegador.':'This cannot be undone. Data removed only from this browser.'}</p>
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setShowDeleteConfirm(null)} className="min-h-[44px] h-[44px] px-4 rounded-full border bg-white text-[11px] tracking-[0.12em] uppercase font-[700] text-[#101A16]" style={{ borderColor: '#D6D2CC' }}>{t.common.cancelar}</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="min-h-[44px] h-[44px] px-5 rounded-full bg-[#8B3A3A] border text-[#FFF5F5] text-[11px] tracking-[0.12em] uppercase font-[800]" style={{ borderColor: '#8B3A3A' }}>{t.tarjetas.delete}</button>
            </div>
          </div>
        </div>
      )}

      {showLimit && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#060A0B]/70 backdrop-blur-[6px]" onClick={() => setShowLimit(false)} />
          <div className="relative w-full max-w-[420px] rounded-[16px] border bg-[#F6F4F0] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]" style={{ borderColor: '#D6D2CC', boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 #E8E4DE' }}>
            <h3 className="text-[14px] font-[800] tracking-[0.12em] uppercase text-[#101A16]">{t.limitModal.title}</h3>
            <p className="mt-2 font-mono text-[12px] leading-[1.6] text-[#5A6A70]">{t.limitModal.desc}</p>
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setShowLimit(false)} className="min-h-[44px] h-[44px] px-4 rounded-full border bg-white text-[11px] tracking-[0.12em] uppercase font-[700] text-[#101A16]" style={{ borderColor: '#D6D2CC' }}>{t.limitModal.cancel}</button>
              <button onClick={() => { setShowLimit(false); setToast(t.toasts.proSoon); }} className="min-h-[44px] h-[44px] px-5 rounded-full bg-[#101A16] border text-[#EDE9E3] text-[11px] tracking-[0.12em] uppercase font-[800]" style={{ borderColor: '#2A3F4A' }}>{t.limitModal.verPro}</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-[92px] md:bottom-8 left-1/2 -translate-x-1/2 z-[80] px-4 py-2.5 rounded-full border bg-[#101A16] text-[#EDE9E3] font-mono text-[11px] tracking-[0.12em] uppercase shadow-[0_12px_32px_rgba(0,0,0,0.45)]" style={{ borderColor: '#2A3F4A' }}>
          {toast}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Instrument+Sans:wght@500;700;800&display=swap');
        html,body{ max-width:100%; overflow-x:hidden; margin:0; padding:0; box-sizing:border-box; }
        *{ font-family: "Instrument Sans", Inter, system-ui, sans-serif; box-sizing:border-box; max-width:100%; }
        img,svg{ max-width:100%; }
        .font-mono{ font-family: "JetBrains Mono", ui-monospace, monospace !important; }
        @keyframes fade{ from{ opacity:0; transform:translateY(6px)} to{ opacity:1; transform:translateY(0)} }
        .no-scrollbar::-webkit-scrollbar{ display:none }
        .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none }
        button{ touch-action: manipulation; }

        /* Light mode: same layout and components, lighter visual treatment. */
        .theme-light{ color:#18221F !important; background:#F3F6F5 !important; }
        .theme-light header{ background:rgba(246,249,248,0.94) !important; border-color:#D7E0DD !important; }
        .theme-light main{ color:#18221F !important; }
        .theme-light [class*="text-[#EDE9E3]"]{ color:#18221F !important; }
        .theme-light [class*="text-[#D6D2CC]"]{ color:#33443F !important; }
        .theme-light [class*="text-[#A9B8BB]"]{ color:#52635F !important; }
        .theme-light [class*="text-[#8BA3B8]"]{ color:#58706B !important; }
        .theme-light [class*="text-[#8FA0A3]"]{ color:#647570 !important; }
        .theme-light [class*="text-[#6B7C7F]"]{ color:#65736F !important; }
        .theme-light [class*="text-[#5A6A70]"]{ color:#6B7773 !important; }
        .theme-light [class*="text-[#1A2B23]"]{ color:#24342F !important; }
        .theme-light [class*="bg-[#121E1B]"]{ background:#FFFFFF !important; }
        .theme-light [class*="bg-[#101A16]"]{ background:#E8EFEC !important; }
        .theme-light [class*="bg-[#0F1A16]"]{ background:#F3F6F5 !important; }
        .theme-light [class*="bg-[#0E1714]"]{ background:#E8EFEC !important; }
        .theme-light [class*="bg-[#060A0B]"]{ background:#DCE5E2 !important; }
        .theme-light [class*="border-[#2A3F4A]"]{ border-color:#C8D5D1 !important; }
        .theme-light [style*="background: 'radial-gradient"]{ background:#F3F6F5 !important; }
        .theme-light [style*="background: 'rgba(15,26,22"]{ background:rgba(246,249,248,0.94) !important; }
        .theme-light [style*="background: '#0F1A16'"]{ background:#F3F6F5 !important; }
        .theme-light [style*="background: '#121E1B'"]{ background:#FFFFFF !important; }
        .theme-light [style*="background: '#101A16'"]{ background:#E8EFEC !important; }
        .theme-light nav[style*="background: '#0F1A16'"]{ background:#F8FAF9 !important; border-color:#D7E0DD !important; }
        .theme-light input, .theme-light select{ background:#FFFFFF !important; color:#18221F !important; border-color:#C8D5D1 !important; }
        .theme-light [class*="shadow-[0_4px_24px"]{ box-shadow:0 4px 24px rgba(24,34,31,0.08) !important; }
      `}</style>
    </div>
  );
}
