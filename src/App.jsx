import { useState, useEffect } from 'react'
import './App.css'
import MenuForm from './components/MenuForm'
import PromptOutput from './components/PromptOutput'
import TemplateEditor from './components/TemplateEditor'
import defaultPromptTemplate from '../promp.txt?raw'

const STORAGE_KEY_TEMPLATE = 'menu-semanal-template'
const STORAGE_KEY_MENU = 'menu-semanal-menu'

const DAYS = [
  { id: 'lunes', label: 'Lunes', emoji: '🌙' },
  { id: 'martes', label: 'Martes', emoji: '🔥' },
  { id: 'miercoles', label: 'Miércoles', emoji: '💧' },
  { id: 'jueves', label: 'Jueves', emoji: '⚡' },
  { id: 'viernes', label: 'Viernes', emoji: '🌿' },
  { id: 'sabado', label: 'Sábado', emoji: '🌟' },
  { id: 'domingo', label: 'Domingo', emoji: '☀️' },
]

const MEAL_TYPES = [
  { id: 'desayuno', label: 'Desayuno', icon: '🌅', optional: false },
  { id: 'merienda_am', label: 'Merienda AM', icon: '🍎', optional: true },
  { id: 'almuerzo', label: 'Almuerzo', icon: '🍽️', optional: false },
  { id: 'merienda_pm', label: 'Merienda PM', icon: '🥤', optional: true },
  { id: 'cena', label: 'Cena', icon: '🌙', optional: false },
]

function createEmptyMenu() {
  const menu = {}
  DAYS.forEach(day => {
    menu[day.id] = {}
    MEAL_TYPES.forEach(meal => {
      menu[day.id][meal.id] = ''
    })
  })
  return menu
}

function App() {
  const [activeTab, setActiveTab] = useState('menu')
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MENU)
    return saved ? JSON.parse(saved) : createEmptyMenu()
  })
  const [template, setTemplate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TEMPLATE)
    return saved || defaultPromptTemplate
  })
  const [showPrompt, setShowPrompt] = useState(false)
  const [customInstructions, setCustomInstructions] = useState(() => {
    return localStorage.getItem('menu-semanal-instructions') || ''
  })
  const [instructionsError, setInstructionsError] = useState(false)

  // Guardar menú en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menu))
  }, [menu])

  // Guardar instrucciones en localStorage
  useEffect(() => {
    localStorage.setItem('menu-semanal-instructions', customInstructions)
  }, [customInstructions])

  const handleMenuChange = (day, meal, value) => {
    setMenu(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }))
  }

  const handleTemplateSave = (newTemplate) => {
    setTemplate(newTemplate)
    localStorage.setItem(STORAGE_KEY_TEMPLATE, newTemplate)
  }

  const generateMenuText = () => {
    let menuText = ''
    
    DAYS.forEach(day => {
      menuText += `\n#### ${day.label.toUpperCase()} ####\n`
      
      MEAL_TYPES.forEach(meal => {
        const value = menu[day.id][meal.id]
        if (value.trim()) {
          menuText += `${meal.label}: ${value}\n`
        } else if (!meal.optional) {
          menuText += `${meal.label}: (sin especificar)\n`
        }
      })
    })
    
    return menuText
  }

  const generatePrompt = () => {
    const menuText = generateMenuText()
    const instructionsSection = `\n### MIS NECESIDADES ESTA SEMANA ###\n${customInstructions}\n`
    return template + instructionsSection + menuText
  }

  const handleGeneratePrompt = () => {
    if (!customInstructions.trim()) {
      setInstructionsError(true)
      return
    }
    setInstructionsError(false)
    setShowPrompt(true)
  }

  const handleInstructionsChange = (value) => {
    setCustomInstructions(value)
    if (value.trim()) {
      setInstructionsError(false)
    }
  }

  const handleClearMenu = () => {
    setMenu(createEmptyMenu())
    setShowPrompt(false)
  }

  const hasAnyMeal = () => {
    return Object.values(menu).some(day => 
      Object.values(day).some(meal => meal.trim() !== '')
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <h1>Menú Semanal</h1>
          </div>
          <p className="tagline">Planifica tus comidas de forma saludable</p>
        </div>
        <div className="header-decoration"></div>
      </header>

      {/* Tabs de navegación */}
      <nav className="main-nav">
        <button 
          className={`nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Menú Semanal</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'template' ? 'active' : ''}`}
          onClick={() => setActiveTab('template')}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">Plantilla</span>
        </button>
      </nav>

      <main className="main">
        {activeTab === 'menu' && (
          <section className="menu-section">
            <div className="section-header">
              <h2>Configura tu menú</h2>
              <p>Completa las comidas para cada día de la semana</p>
            </div>
            
            <MenuForm
              menu={menu}
              days={DAYS}
              mealTypes={MEAL_TYPES}
              onChange={handleMenuChange}
            />

            {/* Instrucciones personalizadas */}
            <div className={`instructions-box ${instructionsError ? 'error' : ''}`}>
              <div className="instructions-header">
                <div className="instructions-title">
                  <span className="instructions-icon">💬</span>
                  <h3>¿Qué necesitas esta semana?</h3>
                  <span className="required-badge">Requerido</span>
                </div>
                <p className="instructions-subtitle">
                  Cuéntale a la IA tus necesidades específicas para que te dé mejores recomendaciones
                </p>
              </div>
              
              <textarea
                className="instructions-input"
                placeholder="Ejemplo: Esta semana quiero reducir carbohidratos. Necesito opciones rápidas para los almuerzos porque tengo poco tiempo. Me gustaría incluir más proteína vegetal. ¿Puedes revisar si el menú es equilibrado?"
                value={customInstructions}
                onChange={(e) => handleInstructionsChange(e.target.value)}
                rows={4}
              />
              
              {instructionsError && (
                <p className="instructions-error">
                  ⚠️ Por favor, indica qué necesitas o qué quieres que la IA revise de tu menú
                </p>
              )}

              <div className="instructions-examples">
                <span className="examples-label">💡 Ideas de qué escribir:</span>
                <div className="examples-list">
                  <span className="example-chip" onClick={() => setCustomInstructions(prev => prev + (prev ? ' ' : '') + 'Revisa si el menú es equilibrado.')}>Revisar equilibrio</span>
                  <span className="example-chip" onClick={() => setCustomInstructions(prev => prev + (prev ? ' ' : '') + 'Sugiere alternativas más económicas.')}>Opciones económicas</span>
                  <span className="example-chip" onClick={() => setCustomInstructions(prev => prev + (prev ? ' ' : '') + 'Necesito opciones rápidas de preparar.')}>Recetas rápidas</span>
                  <span className="example-chip" onClick={() => setCustomInstructions(prev => prev + (prev ? ' ' : '') + 'Quiero reducir carbohidratos.')}>Reducir carbohidratos</span>
                  <span className="example-chip" onClick={() => setCustomInstructions(prev => prev + (prev ? ' ' : '') + 'Incluir más proteína.')}>Más proteína</span>
                </div>
              </div>
            </div>

            <div className="actions">
              <button 
                className="btn btn-secondary"
                onClick={handleClearMenu}
                disabled={!hasAnyMeal()}
              >
                <span className="btn-icon">🗑️</span>
                Limpiar todo
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleGeneratePrompt}
              >
                <span className="btn-icon">✨</span>
                Generar Prompt
              </button>
            </div>
          </section>
        )}

        {activeTab === 'template' && (
          <section className="template-section">
            <TemplateEditor 
              template={template}
              onSave={handleTemplateSave}
              defaultTemplate={defaultPromptTemplate}
            />
          </section>
        )}

        {showPrompt && (
          <PromptOutput 
            prompt={generatePrompt()} 
            onClose={() => setShowPrompt(false)}
          />
        )}
      </main>

      <footer className="footer">
        <p>Hecho con 💚 para una alimentación más saludable</p>
      </footer>
    </div>
  )
}

export default App
