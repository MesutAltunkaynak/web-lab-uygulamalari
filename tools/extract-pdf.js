const fs = require('fs')
let pdf = require('pdf-parse')
if (pdf && typeof pdf !== 'function' && pdf.default) pdf = pdf.default

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node extract-pdf.js <pdf-path>')
  process.exit(2)
}

const dataBuffer = fs.readFileSync(filePath)
pdf(dataBuffer).then(function(data) {
  // write full text
  fs.mkdirSync('hafta 2', { recursive: true })
  const outPath = 'hafta 2/2_extracted.txt'
  fs.writeFileSync(outPath, data.text, 'utf8')
  console.log('Extracted text written to', outPath)

  // create a short summary and checklist
  const short = data.text.trim().slice(0, 1600)
  const summary = []
  summary.push('# Hafta 2 - PDF Analiz Özeti')
  summary.push('')
  summary.push('## Kısa Özet (ilk 1600 karakter)')
  summary.push('')
  summary.push('```')
  summary.push(short)
  summary.push('```')
  summary.push('')
  summary.push('## Tespit Edilen İstenilenler / Notlar')
  summary.push('')
  summary.push('- (Buraya PDF içeriğinden çıkarılacak ve yapılacak maddeler eklenecek)')
  summary.push('')
  summary.push('## Eksik Bilgiler (Kullanıcıdan İsteniyor)')
  summary.push('')
  summary.push('- Çıktı biçimi (özet / demo / kod dosyası / rapor)')
  summary.push('- Eğer demo gerekiyorsa canlı link mi yoksa lokal talimat mı?')
  summary.push('- Kullanılacak teknoloji/kütüphaneler tercihi (varsa)')
  summary.push('- API anahtarları / gizli bilgiler (gerekirse paylaşım yöntemi)')
  summary.push('')
  summary.push('## Önerilen Sonraki Adımlar')
  summary.push('')
  summary.push('- Kullanıcı eksik bilgileri onaylarsa, istenenleri uygulayıp kod/çalıştırma talimatları eklenir.')

  fs.writeFileSync('hafta 2/README.md', summary.join('\n'), 'utf8')
  console.log('Summary written to hafta 2/README.md')
}).catch(err => {
  console.error('Error parsing PDF:', err)
  process.exit(1)
})
