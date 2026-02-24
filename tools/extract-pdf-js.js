const fs = require('fs')
const path = require('path')
const pdfjs = require('pdfjs-dist/legacy/build/pdf')

async function extract(filePath) {
  const data = fs.readFileSync(filePath)
  const loadingTask = pdfjs.getDocument({ data })
  const doc = await loadingTask.promise
  let full = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map(item => item.str)
    full += strings.join(' ') + '\n\n'
  }
  return full
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: node extract-pdf-js.js <pdf-path>')
    process.exit(2)
  }
  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) {
    console.error('File not found:', resolved)
    process.exit(1)
  }

  const text = await extract(resolved)
  fs.mkdirSync('hafta 2', { recursive: true })
  const outTxt = 'hafta 2/2_extracted.txt'
  fs.writeFileSync(outTxt, text, 'utf8')

  // summary README (first ~1500 chars)
  const short = text.trim().slice(0, 1500)
  const summary = []
  summary.push('# Hafta 2 - PDF Analiz Özeti')
  summary.push('')
  summary.push('## Kısa Özet (ilk 1500 karakter)')
  summary.push('')
  summary.push('```')
  summary.push(short)
  summary.push('```')
  summary.push('')
  summary.push('## Tespit Edilen İstenilenler / Notlar')
  summary.push('')
  summary.push('- (PDF içeriğine göre yapılacak maddeler burada listelenecek)')
  summary.push('')
  summary.push('## Eksik Bilgiler (Kullanıcıdan İstenenler)')
  summary.push('')
  summary.push('- Çıktı biçimi: özet / demo / kod / rapor')
  summary.push('- Demo gerekiyorsa canlı link mi yoksa lokal talimat mı?')
  summary.push('- Kullanılacak teknoloji/kütüphane tercihi')
  summary.push('- Gizli anahtar/erişim bilgileri (göndereceksen nasıl paylaşacaksın)')
  summary.push('')
  summary.push('## Önerilen Sonraki Adımlar')
  summary.push('')
  summary.push('- Kullanıcı eksik bilgileri onaylarsa, istenenleri uygulayıp kod ve demo eklenir.')

  const outReadme = 'hafta 2/README.md'
  fs.writeFileSync(outReadme, summary.join('\n'), 'utf8')
  console.log('Wrote', outTxt, 'and', outReadme)
}

main().catch(err => { console.error(err); process.exit(1) })
