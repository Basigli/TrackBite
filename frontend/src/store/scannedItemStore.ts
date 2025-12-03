import { defineStore } from 'pinia';
import { ref, type Ref, reactive, type Reactive } from 'vue';
import api from '../api';
import type { ScannedItem } from '../models/ScannedItem';

export const useScannedItemStore = defineStore('scannedItem', () => {
  const scannedItems: Reactive<Map<string, ScannedItem>> = reactive(new Map());

  const fetchScannedItem: (barcode: string) => Promise<ScannedItem | undefined> = async (barcode: string) => {
    if (scannedItems.has(barcode)) {
      return scannedItems.get(barcode);
    }
    try {
        const res = await api.get<ScannedItem>(`/scanned-items/${barcode}`);
        scannedItems.set(barcode, res.data);
        return res.data;
    } catch (err) {
      console.error('Error fetching scanned item:', err);
    }
  };

  const fetchScannedItems: (userId: string) => Promise<void> = async (userId: string) => {
    try {
      const res = await api.get<ScannedItem[]>(`/scanned-items/user/${userId}`);
      res.data.forEach(item => {
        scannedItems.set(item.barcode, item);
      });
    } catch (err) {
      console.error('Error fetching scanned items:', err);
    }
  };

  return {
    scannedItems,
    fetchScannedItem,
    fetchScannedItems
  };
});