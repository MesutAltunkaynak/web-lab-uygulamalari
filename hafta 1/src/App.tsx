import React, { useState } from 'react'

export default function App() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (f) {
      setFileName(f.name)
      setMessage('PDF yüklendi. Analiz için hazır.')
    }
  }

  return (
    <div className="app">
      <h1>React TypeScript PDF Demo</h1>
      <p>Bu küçük demo PDF yükleme arayüzü sunar.</p>

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
        <button onClick={() => setMessage('Analiz fonksiyonu henüz eklenmedi.')}>Analiz Et</button>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  )
}
