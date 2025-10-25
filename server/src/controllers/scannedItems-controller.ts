import { Request, Response } from "express";
import { ScannedItemModel } from "../storage/ScannedItemSchema";
import { ScannedItemSchemaZ } from "../models/ScannedItem";

// GET /scanned-items
export const getAllScannedItems = async (req: Request, res: Response) => {
  try {
    const items = await ScannedItemModel.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scanned items" });
  }
};

// POST /scanned-items
export const createScannedItem = async (req: Request, res: Response) => {
  try {
    const parsed = ScannedItemSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid scanned item data", details: parsed.error });
    }
    const newItem = new ScannedItemModel(parsed.data);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to create scanned item" });
  }
};

// GET /scanned-items/:id
export const getScannedItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ScannedItemModel.findById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scanned item" });
  }
};

// PUT /scanned-items/:id
export const updateScannedItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = ScannedItemSchemaZ.safeParse(req.body);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error);
      return res.status(400).json({ error: "Invalid scanned item data", details: parsed.error });
    }
    const updatedItem = await ScannedItemModel.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update scanned item" });
  }
};

// DELETE /scanned-items/:id
export const deleteScannedItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await ScannedItemModel.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete scanned item" });
  }
};
