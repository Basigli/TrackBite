<template>
  <div class="macro-breakdown bg-white rounded-xl shadow-md p-4 mb-4 max-w-sm mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-3">Macros</h3>
    <ul class="space-y-1 text-gray-700">
      <li><span class="font-medium">Protein:</span> {{ macros.protein }}g</li>
      <li><span class="font-medium">Fat:</span> {{ macros.fat }}g</li>
      <li><span class="font-medium">Carbs:</span> {{ macros.carbs }}g</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MacroBreakdown',
  props: { macros: Object },
};
</script>
