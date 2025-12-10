import { useState, useRef, useEffect } from 'react'
import './PromptOutput.css'

function PromptOutput({ prompt, onClose }) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      textareaRef.current?.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSelectAll = () => {
    textareaRef.current?.select()
  }

  return (
    <div className="prompt-overlay" onClick={onClose}>
      <div className="prompt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <div className="prompt-title">
            <span className="prompt-icon">✨</span>
            <h3>Prompt Generado</h3>
          </div>
          <button className="prompt-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="prompt-content">
          <textarea
            ref={textareaRef}
            className="prompt-text"
            value={prompt}
            readOnly
            rows={20}
          />
        </div>

        <div className="prompt-actions">
          <button className="prompt-btn btn-select" onClick={handleSelectAll}>
            <span>📋</span>
            Seleccionar todo
          </button>
          <button 
            className={`prompt-btn btn-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            <span>{copied ? '✓' : '📄'}</span>
            {copied ? '¡Copiado!' : 'Copiar prompt'}
          </button>
        </div>

        <div className="prompt-hint">
          <p>💡 Copia este prompt y pégalo en tu asistente de IA favorito para obtener recomendaciones personalizadas.</p>
        </div>
      </div>
    </div>
  )
}

export default PromptOutput

