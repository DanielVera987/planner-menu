import { useState, useEffect } from 'react'
import './TemplateEditor.css'

function TemplateEditor({ template, onSave, defaultTemplate }) {
  const [value, setValue] = useState(template)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setValue(template)
  }, [template])

  const handleSave = () => {
    onSave(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de restaurar la plantilla original? Se perderán tus cambios.')) {
      setValue(defaultTemplate)
      onSave(defaultTemplate)
    }
  }

  const charCount = value.length
  const lineCount = value.split('\n').length

  return (
    <div className="template-editor">
      <div className="editor-header">
        <div className="editor-info">
          <h3>📝 Plantilla del Prompt</h3>
          <p>Edita las instrucciones base que se usarán para generar el prompt final</p>
        </div>
        <div className="editor-stats">
          <span className="stat">{lineCount} líneas</span>
          <span className="stat">{charCount} caracteres</span>
        </div>
      </div>

      <div className="editor-content">
        <textarea
          className="template-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe aquí las instrucciones para el nutriólogo AI..."
          spellCheck={false}
        />
      </div>

      <div className="editor-actions">
        <button 
          className="editor-btn btn-reset"
          onClick={handleReset}
        >
          <span>🔄</span>
          Restaurar original
        </button>
        <button 
          className={`editor-btn btn-save ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          <span>{saved ? '✓' : '💾'}</span>
          {saved ? '¡Guardado!' : 'Guardar plantilla'}
        </button>
      </div>

      <div className="editor-hint">
        <p>💡 La plantilla se guarda en tu navegador. El menú que crees se añadirá al final de esta plantilla.</p>
      </div>
    </div>
  )
}

export default TemplateEditor

