/**
 * The isometric village as SVG markup (rendered with `SvgXml`), ported from the concept board
 * (`concept/iso.js`). Tiles are 64 × 32, z in pixels; light from the left, soft shadows on the
 * ground towards the right, a veil on every face (light at the top, dark at the base).
 *
 * Every function returns markup; ids of the shared gradients are prefixed per instance because
 * they are document-global on web.
 */
import { RESIDENTS_PER_HOUSE, VILLAGE_LOTS, type BuildingId, type DecorId } from '@/content/village';
import { shade } from '@/components/illustrations/mascots/animal-svg';
import type { BuildingState } from '@/store';
import { characterColors, galleryColors } from '@/theme';

export const TW = 64;
export const TH = 32;

const r1 = (n: number) => Math.round(n * 10) / 10;
type Pt = [number, number];
export const P = (i: number, j: number, z = 0): Pt => [r1(((i - j) * TW) / 2), r1(((i + j) * TH) / 2 - z)];
const pts = (a: Pt[]) => a.map((p) => p[0] + ',' + p[1]).join(' ');

type Faces = { top: string; left: string; right: string };
const faces = (h: string): Faces => ({ top: shade(h, 0.28), left: h, right: shade(h, -0.16) });
const WALL: Faces = { top: '#FFFDF8', left: '#F6EDDD', right: '#E2D3B9' };
const STONE: Faces = { top: '#ECE6DB', left: '#D8CFC0', right: '#C0B5A3' };
const TRIM: Faces = { top: '#FFFFFF', left: '#EEE4D2', right: '#D5C5A9' };
const GL = '#3A4157';
const GR = '#2B3043';
const DOOR = '#2A2F40';
const WARM = '#FFD36B';
/** The animals' colours (roofs, stalls, flags, villagers' clothes) and the Banco's green roof. */
const CORAL = characterColors.volpe.base;
const INDIGO = characterColors.castoro.base;
const SUN = characterColors.scoiattolo.base;
const SUN_MID = characterColors.scoiattolo.mid;
const CYAN = characterColors.lontra.base;
const GREEN = galleryColors.green;
/** Today's site and the free lots of "Costruisci" glow in sun on the grass. */
const SUN_GLOW = 'rgba(255, 204, 77, .55)';
const SUN_GLOW_SOFT = 'rgba(255, 204, 77, .45)';
const SUN_GLOW_STRONG = 'rgba(255, 204, 77, .9)';
const WOOD = '#A8743F';
const fp = (i: number, j: number, fw: number, fd: number): [number, number] => [i + (1 - fw) / 2, j + (1 - fd) / 2];

/** Markup builder bound to one gradient-id prefix. */
function kit(g: string) {
  const u = (id: string) => `url(#${g}${id})`;
  const poly = (a: Pt[], fill: string, ex = '') => `<polygon points="${pts(a)}" fill="${fill}" ${ex}/>`;
  const ln = (a: Pt, b: Pt, c: string, w = 1.6, ex = '') =>
    `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;

  function box(i0: number, j0: number, fw: number, fd: number, z0: number, h: number, c: Faces | string) {
    const f = typeof c === 'string' ? faces(c) : c;
    const i1 = i0 + fw;
    const j1 = j0 + fd;
    const L = [P(i0, j1, z0), P(i1, j1, z0), P(i1, j1, z0 + h), P(i0, j1, z0 + h)];
    const Rf = [P(i1, j0, z0), P(i1, j1, z0), P(i1, j1, z0 + h), P(i1, j0, z0 + h)];
    const T = [P(i0, j0, z0 + h), P(i1, j0, z0 + h), P(i1, j1, z0 + h), P(i0, j1, z0 + h)];
    return (
      poly(L, f.left) +
      poly(L, u('isoL')) +
      poly(Rf, f.right) +
      poly(Rf, u('isoR')) +
      poly(T, f.top) +
      (h > 6 ? poly(T, u('isoT')) : '')
    );
  }
  const onL = (j1: number, a: number, b: number, za: number, zb: number, f: string) =>
    poly([P(a, j1, za), P(b, j1, za), P(b, j1, zb), P(a, j1, zb)], f);
  const onR = (i1: number, a: number, b: number, za: number, zb: number, f: string) =>
    poly([P(i1, a, za), P(i1, b, za), P(i1, b, zb), P(i1, a, zb)], f);

  function pyr(i0: number, j0: number, fw: number, fd: number, z: number, rh: number, hex: string, o = 0.07) {
    const a = i0 - o;
    const b = i0 + fw + o;
    const c = j0 - o;
    const d = j0 + fd + o;
    const A = P((a + b) / 2, (c + d) / 2, z + rh);
    const T = P(a, c, z);
    const Rr = P(b, c, z);
    const Bb = P(b, d, z);
    const L = P(a, d, z);
    return (
      poly([T, Rr, A], shade(hex, 0.2)) +
      poly([T, L, A], shade(hex, 0.2)) +
      poly([L, Bb, A], hex) +
      poly([L, Bb, A], u('isoL')) +
      poly([Rr, Bb, A], shade(hex, -0.22)) +
      poly([Rr, Bb, A], u('isoR'))
    );
  }
  function gable(i0: number, j0: number, fw: number, fd: number, z: number, rh: number, hex: string, end = WALL.right, o = 0.07) {
    const i1 = i0 + fw;
    const j1 = j0 + fd;
    const jm = (j0 + j1) / 2;
    const a = i0 - o;
    const b = i1 + o;
    const c = j0 - o;
    const d = j1 + o;
    return (
      poly([P(a, c, z), P(b, c, z), P(b, jm, z + rh), P(a, jm, z + rh)], shade(hex, 0.18)) +
      poly([P(i1, j0, z), P(i1, j1, z), P(i1, jm, z + rh)], end) +
      poly([P(i1, j0, z), P(i1, j1, z), P(i1, jm, z + rh)], u('isoR')) +
      poly([P(a, d, z), P(b, d, z), P(b, jm, z + rh), P(a, jm, z + rh)], hex) +
      poly([P(a, d, z), P(b, d, z), P(b, jm, z + rh), P(a, jm, z + rh)], u('isoL'))
    );
  }
  function awning(a: number, b: number, j1: number, z: number, ext: number, drop: number, cA: string, cB: string, n: number) {
    let s = '';
    for (let k = 0; k < n; k++) {
      const x = a + ((b - a) * k) / n;
      const y = a + ((b - a) * (k + 1)) / n;
      s += poly([P(x, j1, z), P(y, j1, z), P(y, j1 + ext, z - drop), P(x, j1 + ext, z - drop)], k % 2 ? cB : cA);
    }
    return s;
  }
  function flowers(i: number, j: number) {
    const sp = [[0.14, 0.95], [0.3, 0.97], [0.52, 0.96], [0.95, 0.16], [0.97, 0.36], [0.96, 0.58], [0.9, 0.93], [0.74, 0.97]];
    const cs = [CORAL, SUN, '#FFFFFF', '#FF8FA3'];
    return sp
      .map(([a, b], k) => {
        const p = P(i + a, j + b);
        return `<circle cx="${p[0]}" cy="${p[1] - 1.5}" r="2.1" fill="${cs[k % 4]}"/>`;
      })
      .join('');
  }
  function tree(i: number, j: number, s = 1, col = '#6CC04A', fruit = false) {
    const [x, y] = P(i, j);
    let o =
      `<ellipse cx="${x}" cy="${y}" rx="${8 * s}" ry="${4 * s}" fill="rgba(0,0,0,.08)"/>` +
      `<rect x="${x - 2 * s}" y="${y - 12 * s}" width="${4 * s}" height="${12 * s}" rx="${1.5 * s}" fill="#9A6B3F"/>` +
      `<circle cx="${x}" cy="${y - 20 * s}" r="${12 * s}" fill="${col}"/><circle cx="${x}" cy="${y - 20 * s}" r="${12 * s}" fill="${u('isoSph')}"/>`;
    if (fruit)
      [[-5, -17], [5, -22], [3, -13], [-2, -27]].forEach(([dx, dy]) => {
        o += `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${2.1 * s}" fill="${CORAL}"/>`;
      });
    return o;
  }
  function pine(i: number, j: number, s = 1) {
    const [x, y] = P(i, j);
    return (
      `<ellipse cx="${x}" cy="${y}" rx="${7 * s}" ry="${3.5 * s}" fill="rgba(0,0,0,.08)"/>` +
      `<rect x="${x - 1.6 * s}" y="${y - 8 * s}" width="${3.2 * s}" height="${8 * s}" fill="#8A5A2B"/>` +
      `<path d="M${x} ${y - 36 * s} L${x + 10 * s} ${y - 8 * s} L${x - 10 * s} ${y - 8 * s} Z" fill="#3E9E5A"/>` +
      `<path d="M${x} ${y - 36 * s} L${x + 10 * s} ${y - 8 * s} L${x} ${y - 8 * s} Z" fill="#2F8048"/>`
    );
  }
  function sapling(i: number, j: number) {
    const [x, y] = P(i, j);
    return (
      `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.4" fill="#A97B4E" opacity=".5"/><path d="M${x} ${y} V${y - 7}" stroke="#6B8E3D" stroke-width="1.6"/>` +
      `<ellipse cx="${x - 3}" cy="${y - 8}" rx="3.2" ry="1.8" fill="#7CC95A" transform="rotate(-25 ${x - 3} ${y - 8})"/>` +
      `<ellipse cx="${x + 3}" cy="${y - 9}" rx="3.2" ry="1.8" fill="#7CC95A" transform="rotate(25 ${x + 3} ${y - 9})"/>`
    );
  }
  function villager(i: number, j: number, col: string, skin: string) {
    const [x, y] = P(i, j);
    return (
      `<ellipse cx="${x}" cy="${y}" rx="4" ry="1.6" fill="rgba(0,0,0,.15)"/>` +
      `<rect x="${x - 3}" y="${y - 10}" width="6" height="9" rx="3" fill="${col}"/><circle cx="${x}" cy="${y - 13}" r="3" fill="${skin}"/>`
    );
  }
  function fountain(i: number, j: number) {
    const [i0, j0] = fp(i, j, 0.5, 0.5);
    let s = box(i0, j0, 0.5, 0.5, 0, 6, STONE);
    s += poly([P(i0 + 0.05, j0 + 0.05, 6), P(i0 + 0.45, j0 + 0.05, 6), P(i0 + 0.45, j0 + 0.45, 6), P(i0 + 0.05, j0 + 0.45, 6)], '#7FD8CF');
    const [k0, l0] = fp(i, j, 0.1, 0.1);
    s += box(k0, l0, 0.1, 0.1, 6, 10, STONE);
    const t = P(i + 0.5, j + 0.5, 18);
    return s + `<circle cx="${t[0]}" cy="${t[1]}" r="3.5" fill="#BFF3EE"/>`;
  }

  const R: Record<BuildingId, (i: number, j: number, st: BuildingState) => string> = {
    municipio(i, j, st) {
      const fw = 0.8;
      const [i0, j0] = fp(i, j, fw, fw);
      const i1 = i0 + fw;
      const j1 = j0 + fw;
      const h = 30;
      const w = st === 'fiorito' ? WARM : GL;
      let s = box(i0, j0, fw, fw, 0, h, WALL);
      s += onL(j1, i0 + 0.32, i0 + 0.48, 0, 16, DOOR) + onL(j1, i0 + 0.08, i0 + 0.2, 14, 23, w) + onL(j1, i0 + 0.6, i0 + 0.72, 14, 23, w);
      s += onR(i1, j0 + 0.12, j0 + 0.3, 14, 23, GR) + onR(i1, j0 + 0.5, j0 + 0.68, 14, 23, GR);
      s += box(i0 - 0.04, j0 - 0.04, fw + 0.08, fw + 0.08, h, 3, TRIM) + pyr(i0, j0, fw, fw, h + 3, 22, INDIGO);
      const t0 = P(i0 + fw / 2, j0 + fw / 2, h + 25);
      const t1 = P(i0 + fw / 2, j0 + fw / 2, h + 46);
      s += ln(t0, t1, DOOR, 1.6) + `<path d="M${t1[0]} ${t1[1]} l15 4 l-15 6 z" fill="${SUN}" stroke="${SUN_MID}" stroke-width=".8"/>`;
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    bottega(i, j, st) {
      const fw = 0.66;
      const fd = 0.8;
      const [i0, j0] = fp(i, j, fw, fd);
      const i1 = i0 + fw;
      const j1 = j0 + fd;
      const h = 24;
      let s = box(i0, j0, fw, fd, 0, h, WALL);
      s += onL(j1, i0 + 0.08, i0 + 0.22, 0, 14, DOOR) + onL(j1, i0 + 0.32, i0 + 0.56, 6, 14, st === 'fiorito' ? WARM : GL);
      s += onR(i1, j0 + 0.18, j0 + 0.38, 10, 18, GR) + onR(i1, j0 + 0.5, j0 + 0.7, 10, 18, GR);
      s += awning(i0 + 0.04, i0 + 0.62, j1, h - 5, 0.15, 6, CORAL, '#FFFFFF', 6);
      s += gable(i0, j0, fw, fd, h, 16, CORAL);
      s += box(i0 + 0.1, j0 + 0.16, 0.1, 0.1, h + 6, 15, { top: '#5E6270', left: '#555966', right: '#43464F' });
      const m = P(i0 + 0.15, j0 + 0.21, h + 24);
      s += `<circle cx="${m[0]}" cy="${m[1]}" r="3.5" fill="#fff"/><circle cx="${m[0] + 4}" cy="${m[1] - 7}" r="4.5" fill="#fff"/><circle cx="${m[0] + 1}" cy="${m[1] - 16}" r="5.5" fill="#fff"/>`;
      return st === 'fiorito' ? s + flowers(i, j) + villager(i + 0.4, j + 0.97, INDIGO, '#C68642') : s;
    },
    mercato(i, j, st) {
      const stall = (i0: number, j0: number, ca: string) => {
        const fw = 0.32;
        const fd = 0.28;
        const h = 12;
        const i1 = i0 + fw;
        const j1 = j0 + fd;
        let t = box(i0, j0, fw, fd, 0, h, { top: '#F6E5C6', left: '#E8D0A6', right: '#D0B486' });
        t += box(i0 + 0.03, j0 + 0.04, 0.12, 0.1, h, 4, faces(SUN)) + box(i0 + 0.17, j0 + 0.05, 0.11, 0.1, h, 4, faces('#7CC95A'));
        [[i0 + 0.01, j1 - 0.01], [i1 - 0.01, j1 - 0.01], [i1 - 0.01, j0 + 0.01]].forEach(([a, b]) => {
          t += ln(P(a, b, h), P(a, b, h + 13), '#8A6A45', 1.3);
        });
        return t + pyr(i0, j0, fw, fd, h + 13, 8, ca, 0.05);
      };
      const s = stall(i + 0.08, j + 0.1, CORAL) + stall(i + 0.58, j + 0.12, INDIGO) + stall(i + 0.32, j + 0.6, CYAN);
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    granaio(i, j, st) {
      const fw = 0.7;
      const fd = 0.84;
      const [i0, j0] = fp(i, j, fw, fd);
      const i1 = i0 + fw;
      const j1 = j0 + fd;
      const h = 28;
      const a = i0 + 0.18;
      const b = i0 + 0.5;
      let s = box(i0, j0, fw, fd, 0, h, WALL) + onL(j1, a, b, 0, 19, '#C0702A');
      s += ln(P(a, j1, 0), P(b, j1, 19), '#FFE9C7', 1.3) + ln(P(b, j1, 0), P(a, j1, 19), '#FFE9C7', 1.3);
      s += onR(i1, j0 + 0.32, j0 + 0.52, 15, 23, GR) + gable(i0, j0, fw, fd, h, 20, SUN);
      s += box(i1 + 0.01, j0 + 0.56, 0.12, 0.12, 0, 7, faces('#F2CF63'));
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    pozzo(i, j, st) {
      const fw = 0.42;
      const [i0, j0] = fp(i, j, fw, fw);
      const i1 = i0 + fw;
      const j1 = j0 + fw;
      const jm = (j0 + j1) / 2;
      let s = box(i0, j0, fw, fw, 0, 10, STONE);
      s += poly([P(i0 + 0.06, j0 + 0.06, 10), P(i1 - 0.06, j0 + 0.06, 10), P(i1 - 0.06, j1 - 0.06, 10), P(i0 + 0.06, j1 - 0.06, 10)], '#2FC9BB');
      s += box(i0 + 0.01, jm - 0.03, 0.05, 0.06, 10, 18, faces(WOOD)) + box(i1 - 0.06, jm - 0.03, 0.05, 0.06, 10, 18, faces(WOOD));
      s += gable(i0 - 0.05, j0 + 0.02, fw + 0.1, fw - 0.04, 28, 9, '#8A5A2B', shade(WOOD, -0.25));
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    frutteto(i, j, st) {
      return [[0.28, 0.3], [0.72, 0.28], [0.3, 0.72], [0.72, 0.72]]
        .map(([a, b]) => (st === 'cantiere' ? sapling(i + a, j + b) : tree(i + a, j + b, 0.78, '#6CC04A', true)))
        .join('');
    },
    torre(i, j, st) {
      const fw = 0.46;
      const [i0, j0] = fp(i, j, fw, fw);
      const i1 = i0 + fw;
      const j1 = j0 + fw;
      const h = 62;
      let s = box(i0, j0, fw, fw, 0, h, WALL) + onL(j1, i0 + 0.16, i0 + 0.3, 0, 13, DOOR);
      for (let z = 22; z < h - 6; z += 13) s += onL(j1, i0 + 0.17, i0 + 0.29, z, z + 7, GL) + onR(i1, j0 + 0.17, j0 + 0.29, z, z + 7, GR);
      s += box(i0 - 0.04, j0 - 0.04, fw + 0.08, fw + 0.08, h, 3, TRIM) + pyr(i0, j0, fw, fw, h + 3, 26, INDIGO);
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    faro(i, j, st) {
      const [b0, c0] = fp(i, j, 0.52, 0.52);
      const fw = 0.3;
      const [k0, l0] = fp(i, j, fw, fw);
      let s = box(b0, c0, 0.52, 0.52, 0, 7, STONE);
      let z = 7;
      ['w', 'c', 'w', 'c', 'w'].forEach((t) => {
        s += box(k0, l0, fw, fw, z, 9.5, t === 'w' ? WALL : faces(CORAL));
        z += 9.5;
      });
      s += box(k0 - 0.05, l0 - 0.05, fw + 0.1, fw + 0.1, z, 2.5, { top: '#454A5A', left: '#363A47', right: '#272A33' });
      z += 2.5;
      s += box(k0 + 0.03, l0 + 0.03, fw - 0.06, fw - 0.06, z, 9, { top: '#FFF6CF', left: '#FFE58A', right: '#F3CC4C' });
      const bm = P(i + 0.5, j + 0.5, z + 4.5);
      s += `<path d="M${bm[0]} ${bm[1]} L${bm[0] - 74} ${bm[1] - 20} L${bm[0] - 74} ${bm[1] + 12} Z" fill="#FFE58A" opacity=".5"/>`;
      s += pyr(k0, l0, fw, fw, z + 9, 11, CORAL, 0.05);
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    mura(i, j, st) {
      let s = box(i + 0.1, j + 0.36, 0.8, 0.2, 0, 14, STONE);
      for (let k = 0; k < 5; k++) s += box(i + 0.14 + k * 0.15, j + 0.38, 0.08, 0.16, 14, 5, STONE);
      s += onL(j + 0.56, i + 0.43, i + 0.57, 0, 10, DOOR);
      s += box(i + 0.02, j + 0.3, 0.2, 0.32, 0, 22, STONE) + pyr(i + 0.02, j + 0.3, 0.2, 0.32, 22, 10, INDIGO, 0.04);
      s += box(i + 0.78, j + 0.3, 0.2, 0.32, 0, 22, STONE) + pyr(i + 0.78, j + 0.3, 0.2, 0.32, 22, 10, INDIGO, 0.04);
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    ponte(i, j, st) {
      let s = poly([P(i + 0.24, j), P(i + 0.76, j), P(i + 0.76, j + 1), P(i + 0.24, j + 1)], '#8EDDD4');
      s += box(i + 0.2, j + 0.33, 0.06, 0.34, 0, 5, faces('#8A5A2B')) + box(i + 0.74, j + 0.33, 0.06, 0.34, 0, 5, faces('#8A5A2B'));
      s += box(i + 0.02, j + 0.3, 0.96, 0.4, 5, 3, faces('#C49460'));
      [0.31, 0.69].forEach((b) => {
        for (let k = 0; k <= 4; k++) {
          const a = i + 0.05 + k * 0.225;
          s += ln(P(a, j + b, 8), P(a, j + b, 14), '#8A5A2B', 1.3);
        }
        s += ln(P(i + 0.05, j + b, 14), P(i + 0.95, j + b, 14), '#8A5A2B', 1.6);
      });
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
    // The Bank: plinth, columns on the right façade, banknote-green pediment.
    banco(i, j, st) {
      const fw = 0.7;
      const fd = 0.66;
      const [i0, j0] = fp(i, j, fw + 0.1, fd);
      const i1 = i0 + fw;
      const j1 = j0 + fd;
      const h = 26;
      let s = box(i0 - 0.04, j0 - 0.04, fw + 0.16, fd + 0.08, 0, 4, STONE) + box(i0, j0, fw, fd, 4, h, WALL);
      s += onL(j1, i0 + 0.1, i0 + 0.24, 14, 24, GL) + onL(j1, i0 + 0.42, i0 + 0.56, 14, 24, GL);
      s += onR(i1, j0 + 0.26, j0 + 0.4, 4, 21, DOOR);
      [0.04, 0.2, 0.42, 0.58].forEach((a) => {
        s += box(i1 + 0.03, j0 + a, 0.05, 0.05, 4, h, TRIM);
      });
      s += box(i0 - 0.04, j0 - 0.04, fw + 0.16, fd + 0.08, 4 + h, 4, TRIM);
      s += gable(i0 - 0.02, j0 - 0.02, fw + 0.14, fd + 0.04, 8 + h, 14, GREEN, WALL.left);
      return st === 'fiorito' ? s + flowers(i, j) : s;
    },
  };

  return { u, poly, ln, box, onL, onR, pyr, gable, tree, pine, villager, fountain, R };
}

/** Footprint and height of each building, for projects and sites. */
const B: Record<BuildingId, { fw: number; fd: number; h: number }> = {
  municipio: { fw: 0.8, fd: 0.8, h: 55 },
  bottega: { fw: 0.66, fd: 0.8, h: 40 },
  mercato: { fw: 0.8, fd: 0.8, h: 30 },
  granaio: { fw: 0.7, fd: 0.84, h: 48 },
  pozzo: { fw: 0.42, fd: 0.42, h: 36 },
  frutteto: { fw: 0.8, fd: 0.8, h: 28 },
  torre: { fw: 0.46, fd: 0.46, h: 88 },
  mura: { fw: 0.96, fd: 0.32, h: 30 },
  ponte: { fw: 0.96, fd: 0.4, h: 12 },
  faro: { fw: 0.52, fd: 0.52, h: 76 },
  banco: { fw: 0.82, fd: 0.74, h: 48 },
};

/** Tallest drawn height per building, so single scenes fill their frame. */
const TOP: Record<BuildingId, number> = {
  municipio: 82,
  banco: 66,
  bottega: 70,
  mercato: 44,
  granaio: 54,
  pozzo: 52,
  frutteto: 40,
  torre: 96,
  mura: 46,
  ponte: 30,
  faro: 88,
};

/** The shared veils, ambient-occlusion and sphere gradients. */
export function isoDefs(g: string) {
  return (
    '<defs>' +
    `<linearGradient id="${g}isoL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>` +
    `<linearGradient id="${g}isoR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>` +
    `<linearGradient id="${g}isoT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="${g}isoSph" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>` +
    `<radialGradient id="${g}isoAO"><stop offset="0" stop-color="#22400F" stop-opacity=".34"/><stop offset=".6" stop-color="#22400F" stop-opacity=".13"/><stop offset="1" stop-color="#22400F" stop-opacity="0"/></radialGradient>` +
    '</defs>'
  );
}

function blueprint(k: ReturnType<typeof kit>, i: number, j: number, t: BuildingId) {
  const b = B[t];
  const [i0, j0] = fp(i, j, b.fw, b.fd);
  const i1 = i0 + b.fw;
  const j1 = j0 + b.fd;
  const st = `stroke="${INDIGO}" stroke-width="1.3" stroke-dasharray="3.5 3" stroke-linejoin="round"`;
  // The lot is marked on the ground with a stake: it opens whenever you want, no locks.
  let s = k.poly([P(i0, j0), P(i1, j0), P(i1, j1), P(i0, j1)], 'rgba(108,92,231,.08)', st);
  const a = P(i0 + 0.08, j1 - 0.08);
  const top = P(i0 + 0.08, j1 - 0.08, Math.min(26, b.h * 0.6 + 6));
  s += k.ln(a, top, '#8A5A2B', 1.8) + `<path d="M${top[0]} ${top[1]} l12 3.5 l-12 4.5 z" fill="${INDIGO}"/>`;
  return s;
}

/** A site: plinth, walls rising with the lessons (`progress` 0…1), scaffolding and bricks. */
function site(k: ReturnType<typeof kit>, i: number, j: number, t: BuildingId, progress: number) {
  const b = B[t];
  const fw = b.fw;
  const fd = b.fd;
  const h = Math.max(24, b.h * 0.62);
  const [i0, j0] = fp(i, j, fw, fd);
  const i1 = i0 + fw;
  const j1 = j0 + fd;
  const e = 0.05;
  const w = '#C08A4E';
  const walls = h * (0.25 + 0.6 * Math.min(1, Math.max(0, progress)));
  let s = k.box(i0 - e, j0 - e, fw + 2 * e, fd + 2 * e, 0, 2, STONE) + k.box(i0, j0, fw, fd, 2, walls, WALL);
  const A: [number, number] = [i0 - e, j1 + e];
  const Bc: [number, number] = [i1 + e, j1 + e];
  const C: [number, number] = [i1 + e, j0 - e];
  [A, Bc, C].forEach(([a, c]) => {
    s += k.ln(P(a, c, 0), P(a, c, h + 5), w, 1.8);
  });
  [h * 0.5, h].forEach((z) => {
    s += k.ln(P(A[0], A[1], z), P(Bc[0], Bc[1], z), w, 2) + k.ln(P(Bc[0], Bc[1], z), P(C[0], C[1], z), w, 2);
  });
  s += k.ln(P(A[0], A[1], 2), P(Bc[0], Bc[1], h * 0.5), w, 1.1, 'opacity=".75"') + k.ln(P(Bc[0], Bc[1], 2), P(C[0], C[1], h * 0.5), w, 1.1, 'opacity=".75"');
  const pj = Math.min(j1 + e + 0.04, j + 0.84);
  return s + k.box(i0 + 0.02, pj, 0.14, 0.1, 0, 4, faces('#D9663B')) + k.box(i0 + 0.04, pj + 0.01, 0.09, 0.07, 4, 3.5, faces('#D9663B'));
}

function render(k: ReturnType<typeof kit>, t: BuildingId, i: number, j: number, st: BuildingState, progress = 0.4) {
  if (st === 'progetto') return blueprint(k, i, j, t);
  if (st === 'cantiere' && t !== 'frutteto') return site(k, i, j, t, progress);
  return k.R[t](i, j, st);
}

const tile = (k: ReturnType<typeof kit>, i: number, j: number, fill: string) =>
  k.poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], fill, 'stroke="rgba(0,0,0,.04)" stroke-width="1"');

/** Soft ground shadow towards the right (light from the left); projects cast none. */
function castShadow(k: ReturnType<typeof kit>, t: BuildingId, i: number, j: number, st: BuildingState) {
  if (st === 'progetto') return '';
  const b = B[t];
  const h = st === 'cantiere' ? b.h * 0.5 : b.h;
  const [x, y] = P(i + 0.5, j + 0.5);
  const rx = 18 + b.fw * 20 + h * 0.14;
  return `<ellipse cx="${r1(x + h * 0.16)}" cy="${r1(y + 3)}" rx="${r1(rx)}" ry="${r1(rx * 0.42)}" fill="${k.u('isoAO')}"/>`;
}

const sides = (k: ReturnType<typeof kit>, n: number, T: number) =>
  k.poly([P(0, n), P(n, n), P(n, n, -T), P(0, n, -T)], '#C99A68') +
  k.poly([P(0, n), P(n, n), P(n, n, -T), P(0, n, -T)], k.u('isoL')) +
  k.poly([P(n, 0), P(n, n), P(n, n, -T), P(n, 0, -T)], '#A97B4E') +
  k.poly([P(n, 0), P(n, n), P(n, n, -T), P(n, 0, -T)], k.u('isoR')) +
  k.poly([P(0, n), P(n, n), P(n, n, -4), P(0, n, -4)], '#9ED46B') +
  k.poly([P(n, 0), P(n, n), P(n, n, -4), P(n, 0, -4)], '#86BD55');

/** One building on its own tile of ground (building cards, the first stone). */
export function sceneSvg(t: BuildingId, st: BuildingState, prefix: string, progress?: number) {
  const k = kit(prefix);
  const g =
    `<ellipse cx="0" cy="${TH + 15}" rx="26" ry="5" fill="rgba(0,0,0,.08)"/>` +
    sides(k, 1, 9) +
    tile(k, 0, 0, '#C8ED8F') +
    castShadow(k, t, 0, 0, st) +
    render(k, t, 0, 0, st, progress);
  const top = TOP[t] - 4;
  return `<svg viewBox="-48 ${-top} 96 ${top + 52}" xmlns="http://www.w3.org/2000/svg">${isoDefs(prefix)}${g}</svg>`;
}

/* ── The whole village ──────────────────────────────────────────────────────────────────── */

export const VILLAGE_SIZE = 7;

/** Where each building stands on the 7 × 7 island (the board's layout). */
export const LAYOUT: Record<BuildingId, { i: number; j: number }> = {
  torre: { i: 1, j: 1 },
  frutteto: { i: 5, j: 1 },
  municipio: { i: 2, j: 2 },
  granaio: { i: 4, j: 2 },
  mercato: { i: 2, j: 4 },
  pozzo: { i: 4, j: 4 },
  bottega: { i: 1, j: 5 },
  faro: { i: 0, j: 6 },
  mura: { i: 5, j: 5 },
  ponte: { i: 6, j: 3 },
  banco: { i: 1, j: 2 },
};

/** Free lots for residents' houses and tents, in the order they fill up. */
const HOMES: [number, number][] = [
  [5.08, 2.1],
  [5.58, 2.56],
  [0.34, 5.3],
  [2.3, 5.36],
  [3.3, 0.3],
  [0.3, 3.3],
  [6.3, 4.6],
  [4.3, 6.3],
];
const ROOFS = [CORAL, CYAN, SUN, INDIGO];
const DECO: ['pine' | 'tree', number, number][] = [
  ['pine', 0, 0],
  ['tree', 1, 0],
  ['tree', 6, 0],
  ['pine', 6, 1],
  ['tree', 0, 2],
  ['tree', 0, 4],
  ['pine', 2, 6],
  ['tree', 4, 6],
  ['tree', 6, 5],
  ['pine', 6, 6],
];
const WALKERS: [number, number, string, string][] = [
  [3.5, 1.4, CORAL, '#F1C9A5'],
  [1.5, 3.6, INDIGO, '#8D5524'],
  [3.4, 5.3, SUN, '#C68642'],
  [5.2, 3.5, CYAN, '#FFDBAC'],
  [3.6, 4.3, '#000', '#E0AC69'],
  [2.5, 3.4, '#FF8FA3', '#F1C9A5'],
];

export type VillageModel = {
  states: Record<BuildingId, BuildingState>;
  /** Walls of each site, 0…1 (lessons done / lessons). */
  progress: Partial<Record<BuildingId, number>>;
  /** Today's site, highlighted on the ground with the partner next to it. */
  current?: BuildingId;
  residents: number;
  /** Houses and decorations bought with bricks, each on its lot (index into `VILLAGE_LOTS`). */
  placements: readonly { kind: DecorId; lot: number }[];
  /**
   * "Costruisci": the free lots light up on the ground; the chosen one gets an ink outline and a
   * ghost of what is about to be built.
   */
  lots?: { free: readonly number[]; selected?: number; preview?: DecorId };
};

const PARTNER_SPOT: [number, number] = [0.8, 0.6];

/** The island with every building in its state, homes, trees, walkers and the partner. */
export function villageSvg(m: VillageModel, prefix: string) {
  const k = kit(prefix);
  const N = VILLAGE_SIZE;
  const T = 16;
  let g = `<ellipse cx="0" cy="${N * TH + T + 8}" rx="${N * TW * 0.3}" ry="12" fill="rgba(0,0,0,.06)"/>` + sides(k, N, T);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) g += tile(k, i, j, i === 3 || j === 3 ? '#F2E8D3' : (i + j) % 2 ? '#C8ED8F' : '#BFE884');

  const objs: { k: number; k2: number; svg: string }[] = [];
  (Object.keys(LAYOUT) as BuildingId[]).forEach((t) => {
    const { i, j } = LAYOUT[t];
    const st = m.states[t];
    if (m.current === t)
      g += k.poly(
        [P(i + 0.04, j + 0.04), P(i + 0.96, j + 0.04), P(i + 0.96, j + 0.96), P(i + 0.04, j + 0.96)],
        SUN_GLOW,
        `stroke="${SUN_MID}" stroke-width="1.4" stroke-dasharray="4 3"`,
      );
    objs.push({ k: i + j + 1, k2: i, svg: castShadow(k, t, i, j, st) + render(k, t, i, j, st, m.progress[t]) });
  });

  // "Costruisci": free lots glow on the ground, the chosen one is outlined in indigo with a ghost.
  if (m.lots) {
    for (const lot of m.lots.free) {
      const [i, j] = VILLAGE_LOTS[lot];
      const chosen = lot === m.lots.selected;
      g += k.poly(
        [P(i + 0.06, j + 0.06), P(i + 0.94, j + 0.06), P(i + 0.94, j + 0.94), P(i + 0.06, j + 0.94)],
        chosen ? SUN_GLOW_STRONG : SUN_GLOW_SOFT,
        chosen ? `stroke="${INDIGO}" stroke-width="2"` : `stroke="${SUN_MID}" stroke-width="1.4" stroke-dasharray="4 3"`,
      );
    }
    const { selected, preview } = m.lots;
    if (selected !== undefined && preview) {
      const [i, j] = VILLAGE_LOTS[selected];
      objs.push({ k: i + j + 0.6, k2: i, svg: `<g opacity=".6">${decorAt(k, preview, i, j, m.placements.length)}</g>` });
    }
  }

  // Bricks: houses and decorations on their lots.
  m.placements.forEach((p, n) => {
    const [i, j] = VILLAGE_LOTS[p.lot] ?? [0, 0];
    objs.push({ k: i + j + 0.6, k2: i, svg: decorAt(k, p.kind, i, j, n) });
  });

  // A house holds four residents; whoever has no house sleeps in a tent, happy all the same.
  const houses = m.placements.filter((p) => p.kind === 'casa').length;
  const homeless = Math.max(0, m.residents - houses * RESIDENTS_PER_HOUSE);
  const tents = Math.min(Math.ceil(homeless / RESIDENTS_PER_HOUSE), HOMES.length);
  HOMES.slice(0, tents).forEach(([i, j]) => objs.push({ k: i + j + 0.68, k2: i, svg: tent(k, i, j) }));

  if (m.current) {
    const { i, j } = LAYOUT[m.current];
    const si = i + PARTNER_SPOT[0] + 0.5;
    const sj = j + PARTNER_SPOT[1];
    objs.push({ k: si + sj, k2: si, svg: partnerPole(si, sj) });
  }
  DECO.forEach(([t, i, j]) => objs.push({ k: i + j + 1, k2: i, svg: t === 'pine' ? k.pine(i + 0.5, j + 0.5, 0.9) : k.tree(i + 0.5, j + 0.5, 0.85) }));
  objs.push({ k: 7, k2: 3, svg: k.fountain(3, 3) });
  // Walkers appear as the village fills up: one for every few residents.
  WALKERS.slice(0, Math.min(WALKERS.length, Math.ceil(m.residents / 3))).forEach(([i, j, c, sk]) =>
    objs.push({ k: i + j, k2: i, svg: k.villager(i, j, c, sk) }),
  );
  objs.sort((a, b) => a.k - b.k || a.k2 - b.k2);
  g += objs.map((o) => o.svg).join('');
  return `<svg viewBox="${VILLAGE_VIEWBOX.join(' ')}" xmlns="http://www.w3.org/2000/svg">${isoDefs(prefix)}${g}</svg>`;
}

/** viewBox of the whole island: [minX, minY, width, height]. */
export const VILLAGE_VIEWBOX = [-250, -78, 500, 340] as const;

function house(k: ReturnType<typeof kit>, i: number, j: number, roof: string) {
  const fw = 0.32;
  const fd = 0.32;
  const h = 13;
  const s = k.box(i, j, fw, fd, 0, h, WALL) + k.onL(j + fd, i + 0.12, i + 0.2, 0, 8, DOOR) + k.onR(i + fw, j + 0.1, j + 0.21, 6, 10, GR);
  return s + k.gable(i, j, fw, fd, h, 9, roof, WALL.right, 0.04);
}

function tent(k: ReturnType<typeof kit>, i: number, j: number) {
  const fw = 0.34;
  const fd = 0.34;
  return k.pyr(i, j, fw, fd, 0, 17, '#FF8FA3', 0.01) + k.poly([P(i + 0.11, j + fd), P(i + 0.23, j + fd), P(i + 0.17, j + fd - 0.08, 10)], '#6E2A3A');
}

/** A flower bed: a low stone border, dark soil, four colours of flowers. */
function bed(k: ReturnType<typeof kit>, ti: number, tj: number) {
  const fw = 0.56;
  const [i0, j0] = fp(ti, tj, fw, fw);
  let s = k.box(i0, j0, fw, fw, 0, 4, STONE);
  s += k.poly([P(i0 + 0.05, j0 + 0.05, 4), P(i0 + fw - 0.05, j0 + 0.05, 4), P(i0 + fw - 0.05, j0 + fw - 0.05, 4), P(i0 + 0.05, j0 + fw - 0.05, 4)], '#6B4A2B');
  const cs = [CORAL, SUN, '#FFFFFF', '#FF8FA3'];
  [0.16, 0.3, 0.44].forEach((a, r) =>
    [0.16, 0.3, 0.44].forEach((b, c) => {
      const p = P(i0 + a, j0 + b, 4);
      s += `<circle cx="${p[0]}" cy="${p[1] - 2.4}" r="2.2" fill="#4E9A3A"/><circle cx="${p[0]}" cy="${p[1] - 4}" r="1.8" fill="${cs[(r + c) % 4]}"/>`;
    }),
  );
  return s;
}

/** A wooden bench facing the road: two legs, the seat, the backrest. */
function bench(k: ReturnType<typeof kit>, ti: number, tj: number) {
  const fw = 0.46;
  const fd = 0.16;
  const [i0, j0] = fp(ti, tj, fw, fd);
  const leg = '#6B4A26';
  return (
    `<ellipse cx="${P(ti + 0.5, tj + 0.5)[0]}" cy="${P(ti + 0.5, tj + 0.5)[1] + 2}" rx="13" ry="4" fill="rgba(0,0,0,.08)"/>` +
    k.box(i0 + 0.03, j0 + 0.03, 0.05, 0.1, 0, 5, leg) +
    k.box(i0 + fw - 0.08, j0 + 0.03, 0.05, 0.1, 0, 5, leg) +
    k.box(i0, j0 - 0.02, fw, 0.04, 5, 8, WOOD) +
    k.box(i0, j0, fw, fd, 5, 2, WOOD)
  );
}

/** A street lamp: a dark pole and a warm light with its glow. */
function lamp(k: ReturnType<typeof kit>, ti: number, tj: number) {
  const base = P(ti + 0.5, tj + 0.5);
  const top = P(ti + 0.5, tj + 0.5, 30);
  return (
    `<ellipse cx="${base[0]}" cy="${base[1]}" rx="5" ry="2.2" fill="rgba(0,0,0,.15)"/>` +
    k.ln(base, top, GR, 2.2) +
    `<circle cx="${top[0]}" cy="${top[1] - 3}" r="9" fill="${WARM}" opacity=".28"/>` +
    `<circle cx="${top[0]}" cy="${top[1] - 3}" r="4" fill="${WARM}"/>` +
    `<rect x="${top[0] - 4.5}" y="${top[1] - 9}" width="9" height="2.4" rx="1.2" fill="${GR}"/>`
  );
}

/** Whatever bricks built, drawn on its tile (`n` picks the roof colour of a house). */
function decorAt(k: ReturnType<typeof kit>, kind: DecorId, ti: number, tj: number, n: number) {
  switch (kind) {
    case 'casa':
      return house(k, ti + 0.34, tj + 0.34, ROOFS[n % ROOFS.length]);
    case 'albero':
      return k.tree(ti + 0.5, tj + 0.5, 0.85);
    case 'pino':
      return k.pine(ti + 0.5, tj + 0.5, 0.9);
    case 'aiuola':
      return bed(k, ti, tj);
    case 'panchina':
      return bench(k, ti, tj);
    case 'lampione':
      return lamp(k, ti, tj);
  }
}

/** Tallest drawn height per decoration, so catalogue scenes fill their frame. */
const DECOR_TOP: Record<DecorId, number> = { casa: 34, albero: 40, pino: 44, aiuola: 16, panchina: 22, lampione: 44 };

/** One decoration on its own tile of ground (the "Costruisci" catalogue). */
export function decorSceneSvg(kind: DecorId, prefix: string) {
  const k = kit(prefix);
  const g =
    `<ellipse cx="0" cy="${TH + 15}" rx="26" ry="5" fill="rgba(0,0,0,.08)"/>` +
    sides(k, 1, 9) +
    tile(k, 0, 0, '#C8ED8F') +
    decorAt(k, kind, 0, 0, 0);
  const top = DECOR_TOP[kind];
  return `<svg viewBox="-48 ${-top} 96 ${top + 52}" xmlns="http://www.w3.org/2000/svg">${isoDefs(prefix)}${g}</svg>`;
}

/** Centre of a lot's tile on the ground (viewBox units), for hit areas and the camera. */
export function lotAnchor(lot: number) {
  const [i, j] = VILLAGE_LOTS[lot] ?? [0, 0];
  const [x, y] = P(i + 0.5, j + 0.5);
  return { x, y };
}

/**
 * The partner in the village: a pole beside today's site. The medallion with their portrait is
 * drawn on top by the screen (a real view, so it can be touched), at `partnerAnchor`.
 */
function partnerPole(i: number, j: number) {
  const [x, y] = P(i, j);
  return (
    `<g transform="translate(${x} ${y})"><ellipse rx="6" ry="2.4" fill="rgba(0,0,0,.18)"/>` +
    `<line x1="0" y1="0" x2="0" y2="-20" stroke="#000" stroke-width="1.6" stroke-linecap="round"/></g>`
  );
}

/** Centre of the partner's medallion (viewBox units) beside a site. */
export function partnerAnchor(t: BuildingId) {
  const { i, j } = LAYOUT[t];
  const [x, y] = P(i + PARTNER_SPOT[0] + 0.5, j + PARTNER_SPOT[1]);
  return { x, y: y - 34 };
}

/** Screen-space centre of a building (viewBox units), for hit areas and the camera. */
export function buildingAnchor(t: BuildingId) {
  const { i, j } = LAYOUT[t];
  const [x, y] = P(i + 0.5, j + 0.5);
  return { x, y: y - Math.min(B[t].h, 60) / 2 };
}
