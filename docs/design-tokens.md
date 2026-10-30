# Design tokens

Tokens em `src/styles.css` (`:root`), sem biblioteca de componentes.

- Cores: papel quente (`--bg #f6f3ec`) + tinta; modo escuro via `prefers-color-scheme`.
- Cor de destaque por idioma (`--accent`): EN azul, FR violeta, ES laranja, IT verde.
- Espaçamento em escala de 4px (`--s1`…`--s7`), raios `--r-sm/md/lg`.
- Tipografia: Bricolage Grotesque (títulos) + Inter (texto), tamanhos fluidos com `clamp()`.
- Movimento: `--t 160ms` + `--ease`, só transform/opacity; respeita `prefers-reduced-motion`.
