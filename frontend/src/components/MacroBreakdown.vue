<template>
  <div class="macro-breakdown bg-white rounded-xl shadow-md p-4 mb-4 max-w-sm mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-3">Macros</h3>
    <ul class="space-y-1 text-gray-700">
      <li><span class="font-medium">Protein:</span> {{ getProtein() }}g</li>
      <li><span class="font-medium">Fat:</span> {{ getFat() }}g</li>
      <li><span class="font-medium">Carbs:</span> {{ getCarbs() }}g</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MacroBreakdown',
  props: { 
    macros: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const getNutrientValue = (searchTerms) => {
      if (!props.macros || props.macros.length === 0) return 0;
      
      const nutrient = props.macros.find(n => 
        searchTerms.some(term => n.name.toLowerCase().includes(term.toLowerCase()))
      );
      
      return nutrient ? Math.round(nutrient.totalAmount) : 0;
    };

    const getProtein = () => getNutrientValue(['protein', 'proteins']);
    const getFat = () => getNutrientValue(['fat', 'lipid', 'fats']);
    const getCarbs = () => getNutrientValue(['carb', 'carbohydrate', 'carbohydrates']);

    return { getProtein, getFat, getCarbs };
  }
};
</script>