interface ScannedItem {
  id: number, 
  nome: string, 
  allergenes: Map<string, number>,
  macros: Map<string, number>
}
