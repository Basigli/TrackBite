import { ScanParser } from "./utils/ScanParser";
import { readFileSync } from "fs";


const data = readFileSync("737628064502.json", "utf-8");
const parser = new ScanParser();
const scannedItem = parser.parse(data);
console.log(scannedItem);