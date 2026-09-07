/* ============================================================
   CamPick — 아이콘 원본 모음
   아이콘은 CSS mask-image로 색을 입혀 쓴다. 그런데 원격 URL을
   mask로 쓰면 file:// 로 열었을 때 브라우저가 막아 아이콘이
   전부 사라진다(http/https에서는 정상). 그래서 SVG를 여기에
   담아 data URI로 만들어 쓴다 — 서버 없이 열어도, 오프라인에서도
   똑같이 보인다. 원본: Iconify (iconoir / mdi / material-symbols)
   ============================================================ */

const ICON_SVG = {
  'iconoir:badge-check':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.521 2.624a2 2 0 0 1 2.958 0l1.02 1.12a2 2 0 0 0 1.572.651l1.513-.07a2 2 0 0 1 2.092 2.09l-.071 1.514a2 2 0 0 0 .651 1.572l1.12 1.02a2 2 0 0 1 0 2.958l-1.12 1.02a2 2 0 0 0-.651 1.572l.07 1.513a2 2 0 0 1-2.09 2.092l-1.514-.071a2 2 0 0 0-1.572.651l-1.02 1.12a2 2 0 0 1-2.958 0l-1.02-1.12a2 2 0 0 0-1.572-.651l-1.513.07a2 2 0 0 1-2.092-2.09l.071-1.514a2 2 0 0 0-.651-1.572l-1.12-1.02a2 2 0 0 1 0-2.958l1.12-1.02a2 2 0 0 0 .651-1.572l-.07-1.513a2 2 0 0 1 2.09-2.092l1.514.071a2 2 0 0 0 1.572-.651z"/><path stroke-linecap="round" stroke-linejoin="round" d="m9 12l2 2l4-4"/></g></svg>',
  'iconoir:bell':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 8.4c0-1.697-.632-3.325-1.757-4.525S13.59 2 12 2s-3.117.674-4.243 1.875C6.632 5.075 6 6.703 6 8.4C6 15.867 3 18 3 18h18s-3-2.133-3-9.6M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  'iconoir:book':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M4 19V5a2 2 0 0 1 2-2h13.4a.6.6 0 0 1 .6.6v13.114M6 17h14M6 21h14"/><path stroke-linejoin="round" d="M6 21a2 2 0 1 1 0-4"/><path d="M9 7h6"/></g></svg>',
  'iconoir:bookmark-solid':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0z"/></svg>',
  'iconoir:bookmark':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-5.918-3.805a2 2 0 0 0-2.164 0z"/></svg>',
  'iconoir:building':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m10 9.01l.01-.011M14 9.01l.01-.011M10 13.01l.01-.011m3.99.011l.01-.011M10 17.01l.01-.011m3.99.011l.01-.011M6 20.4V5.6a.6.6 0 0 1 .6-.6H12V3.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H6.6a.6.6 0 0 1-.6-.6"/></svg>',
  'iconoir:calendar':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 4V2m0 2v2m0-2h-4.5M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9zm0 0V6a2 2 0 0 1 2-2h2m0-2v4m14 4V6a2 2 0 0 0-2-2h-.5"/></svg>',
  'iconoir:camera':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M2 19V9a2 2 0 0 1 2-2h.5a2 2 0 0 0 1.6-.8l2.22-2.96A.6.6 0 0 1 8.8 3h6.4a.6.6 0 0 1 .48.24L17.9 6.2a2 2 0 0 0 1.6.8h.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"/><path d="M12 17a4 4 0 1 0 0-8a4 4 0 0 0 0 8"/></g></svg>',
  'iconoir:check-circle':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m7 12.5l3 3l7-7"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/></g></svg>',
  'iconoir:check':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5 13l4 4L19 7"/></svg>',
  'iconoir:code':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 6L10 18.5m-3.5-10L3 12l3.5 3.5m11-7L21 12l-3.5 3.5"/></svg>',
  'iconoir:community':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 18v-1a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v1M1 18v-1a3 3 0 0 1 3-3v0m19 4v-1a3 3 0 0 0-3-3v0m-8-2a3 3 0 1 0 0-6a3 3 0 0 0 0 6m-8 2a2 2 0 1 0 0-4a2 2 0 0 0 0 4m16 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg>',
  'iconoir:design-pencil':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"/><path d="M8 21.168V14l4-7l4 7v7.168"/><path d="M8 14s1.127 1 2 1s2-1 2-1s1.127 1 2 1s2-1 2-1"/></g></svg>',
  'iconoir:edit-pencil':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.363 5.652l1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242l-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242l4.243 4.242"/></svg>',
  'iconoir:eye-empty':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/><path d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6Z"/></g></svg>',
  'iconoir:graduation-cap':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m2.573 8.463l8.659-4.329a.6.6 0 0 1 .536 0l8.659 4.33a.6.6 0 0 1 0 1.073l-8.659 4.329a.6.6 0 0 1-.536 0l-8.659-4.33a.6.6 0 0 1 0-1.073"/><path d="M22.5 13V9.5l-2-1m-16 2v5.412a2 2 0 0 0 1.142 1.807l5 2.374a2 2 0 0 0 1.716 0l5-2.374a2 2 0 0 0 1.142-1.807V10.5"/></g></svg>',
  'iconoir:group':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1"/><path d="M13 14v0a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v.5"/><path stroke-linejoin="round" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m10-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg>',
  'iconoir:headset-help':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.5" d="m4 11.5l-.485.121A2 2 0 0 0 2 13.561v1.877a2 2 0 0 0 1.515 1.94l1.74.435A.6.6 0 0 0 6 17.231v-5.463a.6.6 0 0 0-.746-.582zm0 0V11a8 8 0 1 1 16 0v.5m0 0l.485.121A2 2 0 0 1 22 13.561v1.877a2 2 0 0 1-1.515 1.94L20 17.5m0-6l-1.255-.314a.6.6 0 0 0-.745.582v5.463a.6.6 0 0 0 .745.582L20 17.5m-5 3h3a2 2 0 0 0 2-2v-1m-5 3a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 1.5-1.5Z"/></svg>',
  'iconoir:heart':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M22 8.862a5.95 5.95 0 0 1-1.654 4.13c-2.441 2.531-4.809 5.17-7.34 7.608c-.581.55-1.502.53-2.057-.045l-7.295-7.562c-2.205-2.286-2.205-5.976 0-8.261a5.58 5.58 0 0 1 8.08 0l.266.274l.265-.274A5.6 5.6 0 0 1 16.305 3c1.52 0 2.973.624 4.04 1.732A5.95 5.95 0 0 1 22 8.862Z"/></svg>',
  'iconoir:home':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2 8l9.732-4.866a.6.6 0 0 1 .536 0L22 8m-2 3v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/></svg>',
  'iconoir:journal-page':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M6 6h8m-8 4h12m-5 4h5m-5 4h5M2 21.4V2.6a.6.6 0 0 1 .6-.6h15.652a.6.6 0 0 1 .424.176l3.148 3.148A.6.6 0 0 1 22 5.75V21.4a.6.6 0 0 1-.6.6H2.6a.6.6 0 0 1-.6-.6"/><path d="M6 18v-4h3v4zM18 2v3.4a.6.6 0 0 0 .6.6H22"/></g></svg>',
  'iconoir:language':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2S2 6.477 2 12"/><path d="M13 2.05S16 6 16 12s-3 9.95-3 9.95m-2 0S8 18 8 12s3-9.95 3-9.95M2.63 15.5h18.74m-18.74-7h18.74"/></g></svg>',
  'iconoir:light-bulb':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 18h6m-5 3h4m-5-6c.001-2-.499-2.5-1.5-3.5S6.025 9.487 6 8c-.047-3.05 2-5 6-5c4.001 0 6.049 1.95 6 5c-.023 1.487-.5 2.5-1.5 3.5c-.999 1-1.499 1.5-1.5 3.5"/></svg>',
  'iconoir:log-out':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12h7m0 0l-3 3m3-3l-3-3m3-3V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"/></svg>',
  'iconoir:map-pin':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0Z"/><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 11a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/></g></svg>',
  'iconoir:map':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 19l-5.21 1.737a.6.6 0 0 1-.79-.57V5.433a.6.6 0 0 1 .41-.569L9 3m0 16l6 2m-6-2V3m6 18l5.59-1.863a.6.6 0 0 0 .41-.57V3.832a.6.6 0 0 0-.79-.569L15 5m0 16V5m0 0L9 3"/></svg>',
  'iconoir:megaphone':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M14 14V6m0 8l6.102 3.487a.6.6 0 0 0 .898-.52V3.033a.6.6 0 0 0-.898-.521L14 6m0 8H7a4 4 0 1 1 0-8h7M7.757 19.3L7 14h4l.677 4.74a1.98 1.98 0 0 1-3.92.56Z"/></svg>',
  'iconoir:message-text':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12h10M7 8h6"/><path d="M3 20.29V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.961a2 2 0 0 0-1.561.75l-2.331 2.914A.6.6 0 0 1 3 20.29Z"/></g></svg>',
  'iconoir:music-note':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2zm0 0V8m0 0V4l5-1v4z"/></svg>',
  'iconoir:nav-arrow-down':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 9l6 6l6-6"/></svg>',
  'iconoir:nav-arrow-left':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 6l-6 6l6 6"/></svg>',
  'iconoir:nav-arrow-right':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 6l6 6l-6 6"/></svg>',
  'iconoir:page':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M4 21.4V2.6a.6.6 0 0 1 .6-.6h11.652a.6.6 0 0 1 .424.176l3.148 3.148A.6.6 0 0 1 20 5.75V21.4a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6M8 10h8m-8 8h8m-8-4h4"/><path d="M16 2v3.4a.6.6 0 0 0 .6.6H20"/></g></svg>',
  'iconoir:play':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.906 4.537A.6.6 0 0 0 6 5.053v13.894a.6.6 0 0 0 .906.516l11.723-6.947a.6.6 0 0 0 0-1.032z"/></svg>',
  'iconoir:privacy-policy':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M20 12V5.749a.6.6 0 0 0-.176-.425l-3.148-3.148A.6.6 0 0 0 16.252 2H4.6a.6.6 0 0 0-.6.6v18.8a.6.6 0 0 0 .6.6H13M8 10h8M8 6h4m-4 8h3"/><path d="M16 2v3.4a.6.6 0 0 0 .6.6H20m-.008 9.125l2.556.649c.266.068.453.31.445.584C22.821 22.116 19.5 23 19.5 23s-3.321-.884-3.493-6.642a.59.59 0 0 1 .445-.584l2.556-.649c.323-.082.661-.082.984 0"/></g></svg>',
  'iconoir:profile-circle':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2"/><path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/></g></svg>',
  'iconoir:search':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0"/></svg>',
  'iconoir:send':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M22 12L3 20l3.563-8L3 4zM6.5 12H22"/></svg>',
  'iconoir:trophy':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M6.745 4h10.568s-.88 13.257-5.284 13.257c-2.15 0-3.461-3.164-4.239-6.4C6.976 7.468 6.745 4 6.745 4"/><path d="M17.313 4s.921-.983 1.687-1c1.5-.034 1.777 1 1.777 1c.294.61.529 2.194-.88 3.657s-2.987 2.743-3.629 3.2M6.745 4S5.785 3.006 5 3c-1.5-.012-1.777 1-1.777 1c-.294.61-.529 2.194.88 3.657a30 30 0 0 0 3.687 3.2M8.507 20c0-1.829 3.522-2.743 3.522-2.743s3.523.914 3.523 2.743z"/></g></svg>',
  'iconoir:xmark':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/></svg>',
  'material-symbols:mail-outline':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"/></svg>',
  'mdi:check-bold':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"/></svg>',
  'mdi:chevron-left':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>',
  'streamline:camping-tent':
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 10.5v3m2-13l-8.5 13h13L5 .5"/></svg>',
};
