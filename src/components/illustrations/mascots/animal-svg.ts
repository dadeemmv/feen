/**
 * The four animals and the partner's wax seal as SVG markup (rendered with `SvgXml`).
 * Ported from the concept board (`concept/avatars.js`): 200 × 200 busts with volume — light from
 * the top left, soft shadows, a highlight on the head. `prefix` keeps gradient ids unique per
 * instance (they are document-global on web).
 */
import type { MascotId } from '@/content/personality';
import { characterColors } from '@/theme';

const INK = '#141416';
const CREAM = '#FFF7EA';
const BLUSH = '#FF7A93';

/** Mix a hex colour towards white (a > 0) or black (a < 0). */
export function shade(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const t = a < 0 ? 0 : 255;
  const p = Math.abs(a);
  r = Math.round(r + (t - r) * p);
  g = Math.round(g + (t - g) * p);
  b = Math.round(b + (t - b) * p);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

type Tones = { base: string; mid: string; tint: string; deep: string };

function defs(g: string, c: Tones) {
  const rad = (id: string, stops: [number, string][], cx = '36%', cy = '28%', r = '80%') =>
    `<radialGradient id="${g}${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
      .map(([o, col]) => `<stop offset="${o}" stop-color="${col}"/>`)
      .join('')}</radialGradient>`;
  return (
    '<defs>' +
    rad('bg', [[0, shade(c.tint, 0.55)], [1, c.tint]], '50%', '34%', '75%') +
    rad('b', [[0, shade(c.base, 0.3)], [0.55, c.base], [1, shade(c.base, -0.22)]]) +
    rad('m', [[0, shade(c.mid, 0.18)], [1, shade(c.mid, -0.25)]], '30%', '22%', '90%') +
    rad('c', [[0, '#FFFFFF'], [0.6, CREAM], [1, '#E9D9BF']], '40%', '28%', '85%') +
    rad('k', [[0, '#EEFFB8'], [0.55, '#CFF56A'], [1, '#A6CF34']], '35%', '25%', '85%') +
    `<filter id="${g}s" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>` +
    `<filter id="${g}h" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2"/></filter>` +
    '</defs>'
  );
}

const eyes = (x1: number, x2: number, y: number, r: number) =>
  `<circle cx="${x1}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${INK}"/>` +
  `<circle cx="${x1 + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.34}" fill="#fff"/><circle cx="${x2 + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.34}" fill="#fff"/>`;

const blush = (x1: number, x2: number, y: number) =>
  `<ellipse cx="${x1}" cy="${y}" rx="9" ry="5" fill="${BLUSH}" opacity=".4"/><ellipse cx="${x2}" cy="${y}" rx="9" ry="5" fill="${BLUSH}" opacity=".4"/>`;

type Kit = {
  g: string;
  B: string;
  M: string;
  C: string;
  K: string;
  bust: string;
  ao: (cy?: number, rx?: number) => string;
  hi: (cx?: number, cy?: number, rx?: number, ry?: number) => string;
};

function kit(g: string, c: Tones): Kit {
  const u = (id: string) => `url(#${g}${id})`;
  return {
    g,
    B: u('b'),
    M: u('m'),
    C: u('c'),
    K: u('k'),
    bust:
      `<path d="M50 206 C50 170 72 150 100 150 C128 150 150 170 150 206 Z" fill="${u('b')}"/>` +
      `<path d="M78 206 C78 182 88 166 100 166 C112 166 122 182 122 206 Z" fill="${u('c')}"/>`,
    // Shadow of the head on the body, highlight on the head.
    ao: (cy = 154, rx = 40) =>
      `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="10" fill="${shade(c.base, -0.55)}" opacity=".38" filter="${u('s')}"/>`,
    hi: (cx = 80, cy = 70, rx = 18, ry = 10) =>
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".32" filter="${u('h')}"/>`,
  };
}

const DRAW: Record<MascotId, (c: Tones, k: Kit) => string> = {
  volpe: (c, k) => `
    <path d="M128 206 C176 204 198 168 192 126 C190 112 183 101 174 96 C178 122 168 150 138 162 Z" fill="${k.M}"/>
    <path d="M192 126 C190 112 183 101 174 96 C176 107 176 117 173 126 C180 129 187 129 192 126 Z" fill="${k.C}"/>
    ${k.bust}
    <path d="M60 152 C84 166 116 166 140 152 L143 166 C117 182 83 182 57 166 Z" fill="${c.deep}"/>
    <path d="M118 170 L134 198 L118 194 L110 174 Z" fill="${shade(c.deep, -0.15)}"/>
    ${k.ao(152, 44)}
    <path d="M50 84 L58 24 L94 58 Z" fill="${k.B}"/><path d="M150 84 L142 24 L106 58 Z" fill="${k.B}"/>
    <path d="M60 72 L64 38 L85 58 Z" fill="${c.deep}"/><path d="M140 72 L136 38 L115 58 Z" fill="${c.deep}"/>
    <path d="M46 94 C46 64 70 52 100 52 C130 52 154 64 154 94 C154 120 130 142 100 152 C70 142 46 120 46 94 Z" fill="${k.B}"/>
    <path d="M46 98 C62 98 84 106 100 126 C116 106 138 98 154 98 C152 122 130 142 100 152 C70 142 48 122 46 98 Z" fill="${k.C}"/>
    ${k.hi(78, 68, 20, 9)}
    ${eyes(78, 122, 94, 6.5)}
    <ellipse cx="100" cy="140" rx="8" ry="6" fill="${INK}"/><ellipse cx="97.5" cy="138" rx="2.6" ry="1.6" fill="#fff" opacity=".7"/>
    ${blush(64, 136, 114)}`,

  scoiattolo: (c, k) => `
    <path d="M118 206 C186 206 204 130 182 80 C168 46 124 40 126 74 C148 80 162 108 154 138 C146 164 128 172 112 176 Z" fill="${k.M}"/>
    <path d="M150 70 C166 74 180 96 176 126 C172 110 162 92 146 84 Z" fill="${k.B}"/>
    ${k.bust}
    ${k.ao(150, 36)}
    <path d="M66 70 L70 30 L94 58 Z" fill="${k.B}"/><path d="M134 70 L130 30 L106 58 Z" fill="${k.B}"/>
    <path d="M70 30 l-5 -9 M70 30 l2 -10 M130 30 l5 -9 M130 30 l-2 -10" stroke="${c.deep}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M72 62 L74 40 L88 57 Z" fill="${c.deep}" opacity=".5"/><path d="M128 62 L126 40 L112 57 Z" fill="${c.deep}" opacity=".5"/>
    <circle cx="100" cy="100" r="46" fill="${k.B}"/>
    <circle cx="73" cy="116" r="18" fill="${k.C}"/><circle cx="127" cy="116" r="18" fill="${k.C}"/>
    <ellipse cx="100" cy="122" rx="16" ry="12" fill="${k.C}"/>
    ${k.hi(82, 68, 18, 9)}
    ${eyes(82, 118, 94, 7.5)}
    <path d="M94 108 Q100 104 106 108 Q100 116 94 108 Z" fill="${INK}"/>
    <rect x="97" y="116" width="6" height="7" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="1.2"/>
    ${blush(64, 136, 106)}
    <ellipse cx="100" cy="167" rx="12" ry="14" fill="#C98A4B"/><ellipse cx="96" cy="163" rx="4" ry="6" fill="#fff" opacity=".25"/>
    <path d="M86 159 C86 148 114 148 114 159 Z" fill="${c.deep}"/>
    <path d="M100 149 L101 142" stroke="${c.deep}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="87" cy="168" rx="7" ry="6" fill="${k.B}"/><ellipse cx="113" cy="168" rx="7" ry="6" fill="${k.B}"/>`,

  castoro: (c, k) => `
    <g transform="rotate(-35 162 184)"><ellipse cx="162" cy="184" rx="20" ry="34" fill="${c.deep}"/>
      <path d="M148 170 H176 M146 184 H178 M148 198 H176 M155 160 V208 M169 160 V208" stroke="${c.mid}" stroke-width="2.5" opacity=".8"/></g>
    ${k.bust}
    ${k.ao(154, 42)}
    <circle cx="55" cy="84" r="12" fill="${k.B}"/><circle cx="145" cy="84" r="12" fill="${k.B}"/>
    <circle cx="55" cy="84" r="6" fill="${c.deep}"/><circle cx="145" cy="84" r="6" fill="${c.deep}"/>
    <ellipse cx="100" cy="104" rx="50" ry="46" fill="${k.B}"/>
    <ellipse cx="100" cy="126" rx="30" ry="20" fill="${c.tint}"/><ellipse cx="94" cy="120" rx="14" ry="7" fill="#fff" opacity=".35"/>
    ${eyes(78, 122, 96, 6.5)}
    <rect x="89" y="110" width="22" height="12" rx="6" fill="${INK}"/><ellipse cx="95" cy="113" rx="3" ry="1.6" fill="#fff" opacity=".6"/>
    <path d="M88 130 Q100 136 112 130" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="91" y="132" width="8.5" height="13" rx="2" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <rect x="100.5" y="132" width="8.5" height="13" rx="2" fill="#fff" stroke="${INK}" stroke-width="2"/>
    ${blush(66, 134, 118)}
    <ellipse cx="100" cy="76" rx="44" ry="6" fill="${shade(c.base, -0.5)}" opacity=".3" filter="url(#${k.g}h)"/>
    <path d="M54 72 C54 40 76 30 100 30 C124 30 146 40 146 72 Z" fill="${k.K}"/>
    <rect x="42" y="68" width="116" height="10" rx="5" fill="#B0D93F"/>
    <rect x="95" y="31" width="10" height="38" rx="4" fill="#B8E04F"/>
    ${k.hi(76, 44, 14, 7)}`,

  lontra: (c, k) => `
    ${k.bust}
    ${k.ao(150, 40)}
    <circle cx="54" cy="88" r="10" fill="${k.B}"/><circle cx="146" cy="88" r="10" fill="${k.B}"/>
    <circle cx="54" cy="88" r="5" fill="${c.deep}"/><circle cx="146" cy="88" r="5" fill="${c.deep}"/>
    <ellipse cx="100" cy="102" rx="50" ry="45" fill="${k.B}"/>
    <path d="M56 112 C60 94 80 90 100 98 C120 90 140 94 144 112 C144 136 124 147 100 147 C76 147 56 136 56 112 Z" fill="${k.C}"/>
    <circle cx="87" cy="119" r="14" fill="#fff" opacity=".55"/><circle cx="113" cy="119" r="14" fill="#fff" opacity=".55"/>
    ${k.hi(80, 70, 20, 9)}
    <path d="M72 92 Q79 83 86 92 M114 92 Q121 83 128 92" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M90 105 Q100 100 110 105 Q108 115 100 117 Q92 115 90 105 Z" fill="${INK}"/><ellipse cx="96.5" cy="105.5" rx="3" ry="1.5" fill="#fff" opacity=".6"/>
    <path d="M94 124 Q100 130 106 124" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M76 116 L50 111 M76 123 L52 127 M124 116 L150 111 M124 123 L148 127" stroke="${c.deep}" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    ${blush(66, 134, 110)}
    <path d="M86 177 Q100 158 114 177 Q100 185 86 177 Z" fill="#FFC9D2"/>
    <path d="M100 163 V181 M93 167 L96 181 M107 167 L104 181" stroke="#F49AAE" stroke-width="1.5"/>
    <ellipse cx="86" cy="179" rx="7" ry="6" fill="${k.B}"/><ellipse cx="114" cy="179" rx="7" ry="6" fill="${k.B}"/>
    <path d="M0 190 Q25 180 50 190 T100 190 T150 190 T200 190 V200 H0 Z" fill="${c.base}" opacity=".35"/>`,
};

/** The animal's bust on its tinted backdrop (200 × 200). `background: false` drops the backdrop. */
export function animalSvg(id: MascotId, prefix: string, background = true) {
  const c = characterColors[id];
  const g = `${prefix}${id}`;
  const k = kit(g, c);
  const bg = background ? `<rect width="200" height="200" fill="url(#${g}bg)"/>` : '';
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(g, c)}${bg}${DRAW[id](c, k)}</svg>`;
}

/** The partner's wax seal: wavy red rim and the paw print (100 × 100). */
export function sealSvg(prefix: string) {
  const id = `${prefix}wax`;
  let d = '';
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const r = 44 + 2.6 * Math.sin(a * 14) + 1.2 * Math.sin(a * 5);
    d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(2) + ' ' + (50 + r * Math.sin(a)).toFixed(2);
  }
  return (
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><radialGradient id="${id}" cx="38%" cy="32%"><stop offset="0" stop-color="#F25745"/><stop offset="1" stop-color="#B31B1B"/></radialGradient></defs>` +
    `<path d="${d}Z" fill="url(#${id})"/><circle cx="50" cy="50" r="31" fill="none" stroke="#8E1414" stroke-width="2" opacity=".55"/>` +
    `<g fill="#8E1414" opacity=".85"><ellipse cx="50" cy="58" rx="11" ry="9"/>` +
    `<ellipse cx="36" cy="45" rx="4.6" ry="6" transform="rotate(-20 36 45)"/><ellipse cx="45" cy="38" rx="4.6" ry="6.2"/>` +
    `<ellipse cx="55" cy="38" rx="4.6" ry="6.2"/><ellipse cx="64" cy="45" rx="4.6" ry="6" transform="rotate(20 64 45)"/></g>` +
    `<ellipse cx="36" cy="28" rx="12" ry="6" fill="#fff" opacity=".22" transform="rotate(-30 36 28)"/></svg>`
  );
}
