import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import api from '../api'
import type { Diet } from '../models/Diet'

// Tipo per la creazione di una dieta (senza _id che viene generato dal backend)
interface CreateDietDto {
  name: string
  caloriesAmount: number
  macros: Array<{
    name: string
    unit: string
    totalAmount: number
    amount100g: number
    amountPerServing: number
  }>
  userId: string
}

export const useDietStore = defineStore('diet', () => {
  const diets: Ref<Diet[]> = ref([])
  const selectedDiet: Ref<Diet | null> = ref(null)

  const fetchDiets = async (userId: string) => {
    try {
      const res = await api.get<Diet[]>(`/diets/user/${userId}`)
      diets.value = res.data

      if (res.data.length > 0 && !selectedDiet.value) {
        selectedDiet.value = res.data[0] ?? null
      }
    } catch (err) {
      console.error('Error fetching diets:', err)
    }
  }

  const createDiet = async (dietData: CreateDietDto) => {
    try {
      console.log('Creating diet with data:', dietData)
      const res = await api.post<Diet>('/diets', dietData)
      diets.value.push(res.data)
      
      // Se non c'è una dieta selezionata, seleziona quella appena creata
      if (!selectedDiet.value) {
        selectedDiet.value = res.data
      }
    } catch (err) {
      console.error('Error creating diet:', err)
      throw err // Rilancia l'errore per gestirlo nel componente
    }
  }

  const updateDiet = async (dietId: string, userId: string, data: Partial<Diet>) => {
    try {
      console.log('Store - Updating diet:', dietId, 'for user:', userId, 'with data:', data)
      const res = await api.put<Diet>(`/diets/${dietId}/user/${userId}`, data)
      console.log('Store - Update response:', res.data)
      
      const index = diets.value.findIndex((d) => d._id === dietId)
      
      if (index !== -1) {
        // Aggiorna la dieta nell'array con l'intero oggetto restituito dal backend
        diets.value[index] = { ...res.data }
        console.log('Store - Updated diet in array at index:', index, diets.value[index])

        // Aggiorna la dieta selezionata se è quella modificata
        if (selectedDiet.value?._id === dietId) {
          selectedDiet.value = { ...res.data }
          console.log('Store - Updated selectedDiet:', selectedDiet.value)
        }
      }
    } catch (err) {
      console.error('Error updating diet:', err)
      throw err
    }
  }

  const deleteDiet = async (dietId: string, userId: string) => {
    try {
      await api.delete(`/diets/${dietId}/user/${userId}`)
      diets.value = diets.value.filter((d) => d._id !== dietId)

      if (selectedDiet.value?._id === dietId) {
        selectedDiet.value = diets.value[0] || null
      }
    } catch (err) {
      console.error('Error deleting diet:', err)
      throw err
    }
  }

  const selectDiet = (diet: Diet) => {
    selectedDiet.value = diet
  }

  return {
    diets,
    selectedDiet,
    fetchDiets,
    createDiet,
    updateDiet,
    deleteDiet,
    selectDiet,
  }
})