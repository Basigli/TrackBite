<template>
  <div>
    <div class="relative mb-3">
      <input
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        type="text"
        placeholder="Search recipes..."
        class="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 text-base shadow-sm"
      />
      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div class="relative mb-3">
      <input
        :value="userFilter"
        @input="$emit('update:userFilter', $event.target.value)"
        type="text"
        placeholder="Filter by user..."
        class="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 text-base shadow-sm"
      />
      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>

    <div class="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
      <button
        @click="$emit('update:sortBy', 'newest')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          sortBy === 'newest' 
            ? 'bg-green-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 border-2 border-gray-200'
        ]"
      >
        Newest
      </button>
      <button
        @click="$emit('update:sortBy', 'oldest')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          sortBy === 'oldest' 
            ? 'bg-green-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 border-2 border-gray-200'
        ]"
      >
        Oldest
      </button>
      <button
        @click="$emit('update:sortBy', 'name')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          sortBy === 'name' 
            ? 'bg-green-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 border-2 border-gray-200'
        ]"
      >
        A-Z
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipesFilters',
  props: {
    search: { type: String, required: true },
    userFilter: { type: String, required: true },
    sortBy: { type: String, required: true }
  },
  emits: ['update:search', 'update:userFilter', 'update:sortBy']
};
</script>
