import React, { useState } from 'react'

export default function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [summary, setSummary] = useState('')
  const [techs, setTechs] = useState<string[]>([])
  const [fullText, setFullText] = useState('')
  const [working, setWorking] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setFileName(f.name)
    setWorking(true)
    setSummary('')
    setTechs([])
    setFullText('')

    try {
      const arrayBuffer = await f.arrayBuffer()
      const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf')
      if (pdfjs.GlobalWorkerOptions) {
        try { pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js' } catch {}
      }

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) })
      const pdf = await loadingTask.promise
      let full = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const strings = content.items.map((it: any) => it.str)
        full += strings.join(' ') + '\n\n'
      }

      setFullText(full)
      const short = full.trim().slice(0, 1600)
      setSummary(short + (full.length > 1600 ? '...' : ''))

      const techList = ['React','ReactJS','Node.js','Node','TypeScript','Type Script','JavaScript','Vite','Express','Next.js','Tailwind','Bootstrap','MongoDB','MySQL','PostgreSQL','Docker','PDF.js','pdfjs','pdf-parse','pdfjs-dist','HTML','CSS','SASS']
      const found: string[] = []
      const lower = full.toLowerCase()
      for (const t of techList) if (lower.indexOf(t.toLowerCase()) !== -1) found.push(t)
      setTechs(found)

      const blobText = new Blob([full], { type: 'text/plain' })
      const blobTech = new Blob([found.join('\n')], { type: 'text/plain' })
      const urlText = URL.createObjectURL(blobText)
      const urlTech = URL.createObjectURL(blobTech)
      const a1 = document.getElementById('dl-text') as HTMLAnchorElement | null
      const a2 = document.getElementById('dl-tech') as HTMLAnchorElement | null
      if (a1) { a1.href = urlText; a1.style.display = 'inline-block' }
      if (a2) { a2.href = urlTech; a2.style.display = 'inline-block' }

    } catch (err: any) {
      setSummary('Hata: ' + (err?.message || String(err)))
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="app">
      <h1>React TypeScript PDF Demo</h1>
      <p>PDF yükle — metin çıkarma, kısa özet ve teknoloji tespiti (tarayıcı tarafı).</p>

      <label className="upload">
        PDF seç
        <input type="file" accept="application/pdf" onChange={handleFile} />
      </label>

      {fileName && (
        <div className="info">
          <strong>Dosya:</strong> {fileName}
        </div>
      )}

      <div className="actions">
        <a id="dl-text" download="extracted.txt" style={{ display: 'none', marginRight: 8 }}>İndir: çıkarılan metin</a>
        <a id="dl-tech" download="technologies.txt" style={{ display: 'none' }}>İndir: tespit edilen teknolojiler</a>
      </div>

      {working && <div className="message">Analiz ediliyor...</div>}

      {summary && (
        <div className="message">
          <h3>Özet</h3>
          <div>{summary}</div>
        </div>
      )}

      {techs.length > 0 && (
        <div className="message">
          <h3>Tespit Edilen Teknolojiler</h3>
          <div>{techs.join(', ')}</div>
        </div>
      )}

      {fullText && (
        <div className="message">
          <h3>Ham Metin (kısaltılmış gösterim)</h3>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{fullText.slice(0, 5000)}</pre>
        </div>
      )}
    </div>
  )
}
