/**
 * Macro nutrient color constants
 */
export const MACRO_COLORS = {
  protein: {
    light: 'bg-blue-100',
    medium: 'bg-blue-500',
    dark: 'bg-blue-700',
    text: 'text-blue-700',
    border: 'border-blue-500'
  },
  carbohydrates: {
    light: 'bg-amber-100',
    medium: 'bg-amber-500',
    dark: 'bg-amber-700',
    text: 'text-amber-700',
    border: 'border-amber-500'
  },
  fat: {
    light: 'bg-purple-100',
    medium: 'bg-purple-500',
    dark: 'bg-purple-700',
    text: 'text-purple-700',
    border: 'border-purple-500'
  }
}

export const getKeyFromMacro =  {
    Protein: 'protein',
    Carbohydrates: 'carbohydrates',
    Fat: 'fat',
    Fats: 'fat',
    fat: 'fat',
    protein: 'protein',
    Proteins: 'protein',
    proteins: 'protein',
    protein: 'protein',
    carbohydrate: 'carbohydrates',  
    Carbs: 'carbohydrates',
    carb: 'carbohydrates',
    carbohydrates: 'carbohydrates',
}


/**
 * Progress bar colors based on completion percentage
 */
export const PROGRESS_COLORS = {
  low: 'bg-blue-500',      // < 80%
  good: 'bg-green-500',    // 80-100%
  warning: 'bg-yellow-500', // 100-110%
  exceeded: 'bg-red-500'    // > 110%
}

/**
 * Nutri-Score grade colors
 */
export const GRADE_COLORS = {
  a: 'text-green-600',
  b: 'text-lime-600',
  c: 'text-yellow-600',
  d: 'text-orange-600',
  e: 'text-red-600'
}

/**
 * Nutrient level colors
 */
export const NUTRIENT_LEVEL_COLORS = {
  low: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

/**
 * Get macro color by name
 */
export const getMacroColor = (macroName, shade = 'medium') => {
  const normalized = macroName.toLowerCase()
  return MACRO_COLORS[normalized]?.[shade] || 'bg-gray-500'
}

/**
 * Get progress color based on percentage
 */
export const getProgressColor = (percentage) => {
  if (percentage < 80) return PROGRESS_COLORS.low
  if (percentage < 100) return PROGRESS_COLORS.good
  if (percentage < 110) return PROGRESS_COLORS.warning
  return PROGRESS_COLORS.exceeded
}

/**
 * Get grade color
 */
export const getGradeColor = (grade) => {
  return GRADE_COLORS[grade?.toLowerCase()] || 'text-gray-600'
}

/**
 * Get nutrient level color
 */
export const getNutrientLevelColor = (level) => {
  return NUTRIENT_LEVEL_COLORS[level?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}