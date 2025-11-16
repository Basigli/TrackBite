<template>
  <div class="macro-breakdown p-4 bg-yellow-100 rounded">
    <h3 class="font-semibold mb-2">Macros</h3>
    <ul>
      <li>Protein: {{ macros.protein }}g</li>
      <li>Fat: {{ macros.fat }}g</li>
      <li>Carbs: {{ macros.carbs }}g</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MacroBreakdown',
  props: { macros: Object },
};
</script>
