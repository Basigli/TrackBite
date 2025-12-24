/**
 * Macro color shade type
 */
type MacroShade = 'light' | 'medium' | 'dark' | 'text' | 'border'

/**
 * Macro color configuration
 */
interface MacroColorConfig {
  light: string
  medium: string
  dark: string
  text: string
  border: string
}

/**
 * Macro colors type
 */
interface MacroColors {
  protein: MacroColorConfig
  carbohydrates: MacroColorConfig
  fat: MacroColorConfig
}

/**
 * Macro nutrient color constants
 */
export const MACRO_COLORS: MacroColors = {
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

/**
 * Mapping from various macro name formats to standardized keys
 */
export const getKeyFromMacro: Record<string, keyof MacroColors> = {
  Protein: 'protein',
  Carbohydrates: 'carbohydrates',
  Fat: 'fat',
  Fats: 'fat',
  fat: 'fat',
  protein: 'protein',
  Proteins: 'protein',
  proteins: 'protein',
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
} as const

/**
 * Nutri-Score grade colors
 */
export const GRADE_COLORS = {
  a: 'text-green-600',
  b: 'text-lime-600',
  c: 'text-yellow-600',
  d: 'text-orange-600',
  e: 'text-red-600'
} as const

/**
 * Nutrient level colors
 */
export const NUTRIENT_LEVEL_COLORS = {
  low: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
} as const

export const GRADE_TEXT_COLORS = {
  a: 'text-green-600',
  b: 'text-lime-600',
  c: 'text-yellow-600',
  d: 'text-orange-600',
  e: 'text-red-600'
} as const

/**
 * Get macro color by name
 */
export const getMacroColor = (macroName: string, shade: MacroShade = 'medium'): string => {
  const normalized = macroName.toLowerCase() as keyof MacroColors
  return MACRO_COLORS[normalized]?.[shade] || 'bg-gray-500'
}

/**
 * Get progress color based on percentage
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage < 80) return PROGRESS_COLORS.low
  if (percentage < 100) return PROGRESS_COLORS.good
  if (percentage < 110) return PROGRESS_COLORS.warning
  return PROGRESS_COLORS.exceeded
}

/**
 * Get grade color
 */
export const getGradeColor = (grade: string | undefined): string => {
  if (!grade) return 'text-gray-600'
  return GRADE_COLORS[grade.toLowerCase() as keyof typeof GRADE_COLORS] || 'text-gray-600'
}

export const getGradeColorText = (grade: string | undefined): string => {
  if (!grade) return 'text-gray-600'
  return GRADE_TEXT_COLORS[grade.toLowerCase() as keyof typeof GRADE_TEXT_COLORS] || 'text-gray-600'
    };

/**
 * Get nutrient level color
 */
export const getNutrientLevelColor = (level: string | undefined): string => {
  if (!level) return 'bg-gray-100 text-gray-800'
  return NUTRIENT_LEVEL_COLORS[level.toLowerCase() as keyof typeof NUTRIENT_LEVEL_COLORS] || 'bg-gray-100 text-gray-800'
}