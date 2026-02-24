const fs = require('fs')
const p = require('pdf-parse')

async function run(pdfPath){
  const buf = fs.readFileSync(pdfPath)
  const arr = new Uint8Array(buf)
  const parser = new p.PDFParse(arr)
  await parser.load()
  const res = await parser.getText({})
  const text = res.text || res
  fs.mkdirSync('hafta 2', { recursive: true })
  fs.writeFileSync('hafta 2/2_extracted.txt', text, 'utf8')

  const techList = ['React','ReactJS','Node.js','Node','TypeScript','Type Script','JavaScript','Vite','Express','Next.js','Tailwind','Bootstrap','MongoDB','MySQL','PostgreSQL','Docker','PDF.js','pdfjs','pdf-parse','pdfjs-dist','HTML','CSS','SASS']
  const found = new Set()
  const lower = text.toLowerCase()
  for(const t of techList){
    if(lower.indexOf(t.toLowerCase()) !== -1) found.add(t)
  }
  const out = Array.from(found).sort().join('\n') || 'No known technologies detected.'
  fs.writeFileSync('hafta 2/technologies.txt', out, 'utf8')

  // update README in hafta 2
  const readmePath = 'hafta 2/README.md'
  let readme = '# Hafta 2\n\n'
  readme += 'Extracted technologies from PDF:\n\n'
  readme += out + '\n\n'
  readme += 'See 2_extracted.txt for full text.\n'
  fs.writeFileSync(readmePath, readme, 'utf8')
  console.log('Wrote hafta 2/2_extracted.txt and hafta 2/technologies.txt')
}

const pdfPath = process.argv[2] || 'hafta 2/2.pdf'
run(pdfPath).catch(e=>{console.error(e); process.exit(1)})
