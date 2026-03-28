// LaTeX 명령어 → 유니코드 기호 매핑
const SYMBOL_MAP: Record<string, string> = {
  // 연산자·관계
  leq: '≤', geq: '≥', neq: '≠', approx: '≈', equiv: '≡',
  le: '≤', ge: '≥', ne: '≠',
  times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓',
  ll: '≪', gg: '≫', sim: '∼', simeq: '≃', cong: '≅',
  propto: '∝', perp: '⊥', parallel: '∥', mid: '∣', nmid: '∤',
  prec: '≺', succ: '≻', preceq: '≼', succeq: '≽',
  subset: '⊂', supset: '⊃', subseteq: '⊆', supseteq: '⊇',
  in: '∈', notin: '∉', ni: '∋',
  cap: '∩', cup: '∪', emptyset: '∅', varnothing: '∅', setminus: '∖',
  wedge: '∧', vee: '∨', neg: '¬', land: '∧', lor: '∨', lnot: '¬',
  forall: '∀', exists: '∃', nexists: '∄',
  bot: '⊥', top: '⊤', vdash: '⊢', dashv: '⊣', models: '⊨',
  // 화살표
  to: '→', rightarrow: '→', leftarrow: '←',
  leftrightarrow: '↔', Leftrightarrow: '⇔',
  Rightarrow: '⇒', Leftarrow: '⇐',
  mapsto: '↦', implies: '⇒', iff: '⇔',
  uparrow: '↑', downarrow: '↓', Uparrow: '⇑', Downarrow: '⇓',
  hookrightarrow: '↪', hookleftarrow: '↩',
  // 그리스 소문자
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν',
  xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ', varrho: 'ϱ',
  sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
  phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  // 그리스 대문자
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ',
  Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  // 큰 연산자
  sum: 'Σ', prod: 'Π', coprod: '∐',
  bigcap: '⋂', bigcup: '⋃', bigvee: '⋁', bigwedge: '⋀',
  bigoplus: '⊕', bigotimes: '⊗',
  oplus: '⊕', otimes: '⊗', ominus: '⊖', odot: '⊙',
  int: '∫', iint: '∬', iiint: '∭', oint: '∮',
  // 괄호·구분자
  lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉',
  langle: '⟨', rangle: '⟩',
  // 기타 기호
  infty: '∞', partial: '∂', nabla: '∇',
  ell: 'ℓ', hbar: 'ℏ', Re: 'ℜ', Im: 'ℑ', wp: '℘',
  aleph: 'ℵ', beth: 'ℶ',
  star: '⋆', circ: '∘', bullet: '•',
  square: '□', blacksquare: '■', triangle: '△', checkmark: '✓',
  ldots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱',
  prime: '′', dagger: '†', ddagger: '‡',
};

/**
 * LaTeX 수식을 읽기 좋은 유니코드 평문으로 변환 (TOC 표시용)
 */
export function cleanLatex(s: string): string {
  return s
    // 구조적 패턴
    .replace(/\\sqrt\{([^{}]+)\}/g, '√$1')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, 'C($1,$2)')
    // 크기 조절 제거
    .replace(/\\(left|right|big|Big|bigg|Bigg|middle)[|.()[\]{}\\]?/g, '')
    // 내용만 추출하는 명령들
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/\\math(rm|bf|it|sf|tt|cal|bb|frak|scr)\{([^{}]+)\}/g, '$2')
    .replace(/\\operatorname\{([^{}]+)\}/g, '$1')
    // 장식 명령 → 내용만
    .replace(/\\(overline|underline|hat|bar|vec|tilde|dot|ddot|widehat|widetilde|overbrace|underbrace|boxed|cancel)\{([^{}]+)\}/g, '$2')
    // 함수명 → 백슬래시만 제거
    .replace(/\\(log|ln|lg|sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|exp|det|dim|ker|deg|hom|arg|lim|limsup|liminf|max|min|gcd|lcm|mod|inf|sup|Pr)\b/g, '$1')
    // 기호 매핑
    .replace(/\\([a-zA-Z]+)/g, (_, cmd) => SYMBOL_MAP[cmd] || cmd)
    // spacing → 공백
    .replace(/\\(quad|qquad)\b/g, ' ')
    .replace(/\\[,;!> ]/g, ' ')
    // 아래첨자·위첨자 제거 (TOC 가독성)
    .replace(/[_^]\{[^{}]+\}/g, '')
    .replace(/[_^][a-zA-Z0-9]/g, '')
    // 남은 중괄호·백슬래시 제거
    .replace(/[{}\\]/g, '')
    // 연속 공백 정리
    .replace(/\s+/g, ' ')
    .trim();
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 마크다운에서 heading 추출 (h1~h3)
 */
export function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\$\$[^$]+\$\$/g, '')
      .replace(/\$([^$]+)\$/g, (_, m) => cleanLatex(m))
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .trim();
    const id = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\$\$[^$]+\$\$/g, '')
      .replace(/\$([^$]+)\$/g, (_, m) => cleanLatex(m))
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w가-힣-]/g, '')
      .toLowerCase();
    headings.push({ id, text, level });
  }

  return headings;
}
