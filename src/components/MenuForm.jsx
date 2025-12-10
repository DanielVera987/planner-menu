import './MenuForm.css'

function MenuForm({ menu, days, mealTypes, onChange }) {
  
  const copyToOtherDays = (sourceDayId, mealId, value) => {
    if (!value.trim()) return
    
    days.forEach(day => {
      if (day.id !== sourceDayId && !menu[day.id][mealId].trim()) {
        onChange(day.id, mealId, value)
      }
    })
  }

  return (
    <div className="menu-form">
      <div className="week-grid">
        {/* Header con días */}
        <div className="grid-header">
          <div className="grid-cell header-label">Comida</div>
          {days.map(day => (
            <div key={day.id} className="grid-cell header-day">
              <span className="day-emoji">{day.emoji}</span>
              <span className="day-name">{day.label}</span>
              <span className="day-short">{day.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Filas de comidas */}
        {mealTypes.map(meal => (
          <div key={meal.id} className="grid-row">
            <div className="grid-cell meal-label">
              <span className="meal-icon">{meal.icon}</span>
              <span className="meal-name">{meal.label}</span>
              {meal.optional && <span className="optional-tag">opcional</span>}
            </div>
            
            {days.map(day => (
              <div 
                key={`${day.id}-${meal.id}`} 
                className="grid-cell meal-cell"
                data-day={day.label.slice(0, 3)}
              >
                <textarea
                  className="meal-input"
                  placeholder={meal.optional ? "..." : "¿Qué comer?"}
                  value={menu[day.id][meal.id]}
                  onChange={(e) => onChange(day.id, meal.id, e.target.value)}
                  rows={2}
                />
                {menu[day.id][meal.id].trim() && (
                  <button
                    className="copy-btn"
                    title="Copiar a días vacíos"
                    onClick={() => copyToOtherDays(day.id, meal.id, menu[day.id][meal.id])}
                  >
                    📋→
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Resumen rápido */}
      <div className="summary">
        <div className="summary-header">
          <span className="summary-icon">📊</span>
          <span>Resumen</span>
        </div>
        <div className="summary-stats">
          {mealTypes.filter(m => !m.optional).map(meal => {
            const filled = days.filter(day => menu[day.id][meal.id].trim()).length
            return (
              <div key={meal.id} className="stat">
                <span className="stat-icon">{meal.icon}</span>
                <span className="stat-label">{meal.label}</span>
                <span className={`stat-count ${filled === 7 ? 'complete' : ''}`}>
                  {filled}/7
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MenuForm
