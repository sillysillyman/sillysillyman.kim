// LaTeX command -> Unicode symbol mapping
const SYMBOL_MAP: Record<string, string> = {
  // Operators and relations
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
  // Arrows
  to: '→', rightarrow: '→', leftarrow: '←',
  leftrightarrow: '↔', Leftrightarrow: '⇔',
  Rightarrow: '⇒', Leftarrow: '⇐',
  mapsto: '↦', implies: '⇒', iff: '⇔',
  uparrow: '↑', downarrow: '↓', Uparrow: '⇑', Downarrow: '⇓',
  hookrightarrow: '↪', hookleftarrow: '↩',
  // Greek lowercase
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν',
  xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ', varrho: 'ϱ',
  sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
  phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  // Greek uppercase
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ',
  Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  // Large operators
  sum: 'Σ', prod: 'Π', coprod: '∐',
  bigcap: '⋂', bigcup: '⋃', bigvee: '⋁', bigwedge: '⋀',
  bigoplus: '⊕', bigotimes: '⊗',
  oplus: '⊕', otimes: '⊗', ominus: '⊖', odot: '⊙',
  int: '∫', iint: '∬', iiint: '∭', oint: '∮',
  // Brackets and delimiters
  lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉',
  langle: '⟨', rangle: '⟩',
  // Miscellaneous symbols
  infty: '∞', partial: '∂', nabla: '∇',
  ell: 'ℓ', hbar: 'ℏ', Re: 'ℜ', Im: 'ℑ', wp: '℘',
  aleph: 'ℵ', beth: 'ℶ',
  star: '⋆', circ: '∘', bullet: '•',
  square: '□', blacksquare: '■', triangle: '△', checkmark: '✓',
  ldots: '…', cdots: '⋯', vdots: '⋮', ddots: '⋱',
  prime: '′', dagger: '†', ddagger: '‡',
};

/**
 * Convert LaTeX expressions to readable Unicode plaintext (for TOC display)
 */
export function cleanLatex(s: string): string {
  return s
    // Structural patterns
    .replace(/\\sqrt\{([^{}]+)\}/g, '√$1')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, 'C($1,$2)')
    // Remove size modifiers
    .replace(/\\(left|right|big|Big|bigg|Bigg|middle)[|.()[\]{}\\]?/g, '')
    // Extract content from text/math commands
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/\\math(rm|bf|it|sf|tt|cal|bb|frak|scr)\{([^{}]+)\}/g, '$2')
    .replace(/\\operatorname\{([^{}]+)\}/g, '$1')
    // Decoration commands -> content only
    .replace(/\\(overline|underline|hat|bar|vec|tilde|dot|ddot|widehat|widetilde|overbrace|underbrace|boxed|cancel)\{([^{}]+)\}/g, '$2')
    // Function names -> strip backslash only
    .replace(/\\(log|ln|lg|sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|sinh|cosh|tanh|exp|det|dim|ker|deg|hom|arg|lim|limsup|liminf|max|min|gcd|lcm|mod|inf|sup|Pr)\b/g, '$1')
    // Symbol mapping
    .replace(/\\([a-zA-Z]+)/g, (_, cmd) => SYMBOL_MAP[cmd] || cmd)
    // Spacing -> whitespace
    .replace(/\\(quad|qquad)\b/g, ' ')
    .replace(/\\[,;!> ]/g, ' ')
    // Remove subscripts and superscripts (for TOC readability)
    .replace(/[_^]\{[^{}]+\}/g, '')
    .replace(/[_^][a-zA-Z0-9]/g, '')
    // Remove remaining braces and backslashes
    .replace(/[{}\\]/g, '')
    // Collapse consecutive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings (h1-h3) from markdown
 */
export function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2]
      .replace(/<[^>]+>/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\$\$[^$]+\$\$/g, '')
      .replace(/\$([^$]+)\$/g, (_, m) => cleanLatex(m))
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .trim();
    const id = match[2]
      .replace(/<[^>]+>/g, '')
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
