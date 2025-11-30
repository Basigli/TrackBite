import { Request, Response } from "express";
import { ScannedItemModel } from "../storage/ScannedItemSchema";
import { ScannedItemSchemaZ } from "../models/ScannedItem";
import axios from "axios";
import { ScanParser } from "../utils/ScanParser";
// GET /scanned-items
 const getAllScannedItems = async (req: Request, res: Response) => {
  try {
    const items = await ScannedItemModel.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scanned items" });
  }
};

// POST /scanned-items
 const createScannedItem = async (req: Request, res: Response) => {
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
 const getScannedItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ScannedItemModel.findById(id);
    if (!item) {
      console.log("Item not found for ID:", id);
      try {
        const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${id}.json`;
        const response = await axios.get(apiUrl);
        if (response.data.status === 1) {
          const productData = JSON.stringify(response.data);
          const parsedData = ScanParser.parse(productData, id);
          const newItem = new ScannedItemModel(parsedData);
          const savedItem = await newItem.save();
          return res.status(200).json(savedItem);
        } else {
          return res.status(404).json({ error: "Item not found in external database" });
        }
      }
      catch (error) {
        console.error("Error fetching from external API:", error);
        return res.status(500).json({ error: "Failed to fetch item from external API" });
      }
    }
    // if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scanned item" });
  }
};

// PUT /scanned-items/:id
 const updateScannedItem = async (req: Request, res: Response) => {
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
 const deleteScannedItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await ScannedItemModel.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete scanned item" });
  }
};

export default {
  getAllScannedItems,
  createScannedItem,
  getScannedItemById,
  updateScannedItem,
  deleteScannedItem,
};  
