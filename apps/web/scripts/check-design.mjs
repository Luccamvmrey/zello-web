#!/usr/bin/env node
/**
 * Verificador do contrato de design (docs/DESIGN-CONTRACT.md).
 *
 * Checa só o que é mecanicamente verificável a partir do código-fonte. Tudo que
 * depende de renderizar a página — contraste real, ausência de scroll
 * horizontal, hierarquia visual — fica para a auditoria do navegador descrita
 * no contrato, e NÃO é verificado aqui. Não confunda "passou" com "está bom".
 *
 * Uso:  pnpm --filter web check:design
 */

import { readFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const SRC = join(APP_ROOT, 'src')
const REPO_ROOT = join(APP_ROOT, '..', '..')

/** Marca uma linha como exceção consciente e registrada. */
const ALLOW = 'design-contract-allow'

/**
 * Paleta padrão do Tailwind. Proibida: o produto tem a própria paleta em
 * packages/ui/src/styles/theme.css, e qualquer uma destas cria uma segunda.
 */
const TW_PALETTE =
  '(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)'

const RULES = [
  {
    id: 'C1',
    title: 'Cor só por token',
    why: 'Cor literal não acompanha o tema escuro nem as correções de contraste feitas no token.',
    files: /\.(tsx|ts)$/,
    patterns: [
      {
        re: new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|via|to)-${TW_PALETTE}-\\d{2,3}\\b`, 'g'),
        message: 'usa a paleta padrão do Tailwind',
      },
      {
        re: /\b(?:bg|text|border|ring|fill|stroke)-(?:black|white)\b/g,
        message: 'usa black/white literal (use foreground/background)',
      },
      {
        re: /#[0-9a-fA-F]{3,8}\b/g,
        message: 'tem cor hexadecimal literal',
      },
    ],
  },
  {
    id: 'C2',
    title: 'Borda de formulário é --input',
    why: 'Só --input passa os 3:1 exigidos pela WCAG 1.4.11 para contorno de controle.',
    files: /\/components\/ui\/(input|select|textarea|radio-group|switch|checkbox)\.tsx$/,
    patterns: [
      {
        re: /\bborder-border(?:-subtle)?\b/g,
        message: 'contorna um controle com border-border (use border-input)',
      },
    ],
  },
  {
    id: 'C3',
    title: 'Sem título solto',
    why: 'Toda página passa pelo PageHeader — é ele que garante título, descrição e régua.',
    files: /\/(pages|features)\/.*\.tsx$/,
    patterns: [
      {
        re: /<h1\b/g,
        message: 'declara um <h1> próprio em vez de usar <PageHeader>',
      },
    ],
  },
  {
    id: 'C4',
    title: 'Sem largura fixa que estoure o celular',
    why: 'Largura mínima maior que ~360px gera scroll horizontal em telas de 390px.',
    files: /\.tsx$/,
    patterns: [
      {
        re: /\bmin-w-\[(\d{3,})px\]/g,
        message: 'fixa uma largura mínima em px',
        test: (match) => Number(match[1]) > 360,
      },
      {
        re: /\bw-screen\b/g,
        message: 'usa w-screen (ignora a área útil ao lado da sidebar)',
      },
    ],
  },
  {
    id: 'C5',
    title: 'Foco nunca é removido sem substituto',
    why: 'outline-none sem um focus-visible no mesmo elemento deixa o teclado sem rastro.',
    files: /\.tsx$/,
    patterns: [
      {
        re: /className=(?:"|'|\{`)([^"'`]*\boutline-none\b[^"'`]*)(?:"|'|`\})/g,
        message: 'zera o outline sem nenhum focus-visible na mesma classe',
        test: (match) => !/focus-visible:/.test(match[1]),
      },
    ],
  },
]

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

const files = await walk(SRC)
const violations = []

for (const file of files) {
  const posix = file.split(sep).join('/')
  const applicable = RULES.filter((rule) => rule.files.test(posix))
  if (applicable.length === 0) continue

  const source = await readFile(file, 'utf8')
  const lines = source.split('\n')

  for (const rule of applicable) {
    for (const pattern of rule.patterns) {
      pattern.re.lastIndex = 0
      let match
      while ((match = pattern.re.exec(source)) !== null) {
        if (pattern.test && !pattern.test(match)) continue

        const line = lineOf(source, match.index)
        // A exceção vale para a própria linha ou para o comentário imediatamente
        // acima — que costuma ocupar 2-3 linhas, já que exige justificativa.
        const context = lines.slice(Math.max(0, line - 4), line).join('\n')
        if (context.includes(ALLOW)) continue

        violations.push({
          rule,
          file: relative(REPO_ROOT, file).split(sep).join('/'),
          line,
          snippet: match[0].trim().slice(0, 60),
          message: pattern.message,
        })
      }
    }
  }
}

if (violations.length === 0) {
  console.log('✔ Contrato de design: nenhuma violação mecânica.')
  console.log('  Isto NÃO cobre contraste, responsivo nem hierarquia visual —')
  console.log('  veja a auditoria de navegador em docs/DESIGN-CONTRACT.md.')
  process.exit(0)
}

const byRule = new Map()
for (const v of violations) {
  if (!byRule.has(v.rule.id)) byRule.set(v.rule.id, [])
  byRule.get(v.rule.id).push(v)
}

console.error(`✘ Contrato de design: ${violations.length} violação(ões).\n`)
for (const [id, list] of [...byRule.entries()].sort()) {
  const { title, why } = list[0].rule
  console.error(`  ${id} — ${title}`)
  console.error(`  ${why}`)
  for (const v of list) {
    console.error(`    ${v.file}:${v.line}  ${v.message}: ${v.snippet}`)
  }
  console.error('')
}
console.error(`  Exceção consciente: comente a linha (ou a de cima) com ${ALLOW}`)
console.error('  e registre o motivo no Livro de exceções do DESIGN-CONTRACT.md.')
process.exit(1)
