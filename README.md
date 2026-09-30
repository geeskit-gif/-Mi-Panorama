# Mi Panorama — Frontend V1 Actual

Spanish-first, mobile-first credit-card clarity app.

Visual: logo oficial como referencia primaria (verde bosque #0F1A16, acero-azul #3A6E9E, hueso #F6F4F0)

Estructura:
- MI PANORAMA: totales, disponible, utilización, fechas dinámicas, badges HECHO CONFIRMADO / VALOR DERIVADO / INFORMACIÓN DESCONOCIDA
- MIS TARJETAS: add/edit/delete, hasta 3 Free, últimos 4 opcional (nunca random), muestra INFORMACIÓN DESCONOCIDA, persistencia localStorage
- VOY A COMPRAR: comparación multi-tarjeta
- EXPLÍCAME: educación corta

Datos locales: localStorage mp_cards, mp_lang, mp_demo, mp_hasOnboarded. Sin backend, sin conexión bancaria, sin Stripe.

## Run
npm install
npm run dev

## Build
npm run build
npm run preview
