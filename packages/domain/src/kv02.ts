export function calculateQuantityDelta(movementType: string, quantity: number): number {
  if (quantity <= 0) {
    throw new Error('Quantity must be strictly positive');
  }
  if (movementType === 'in' || movementType === 'adjustment_up') {
    return quantity;
  }
  if (movementType === 'out' || movementType === 'adjustment_down') {
    return -quantity;
  }
  throw new Error('Invalid movement type');
}

export function validateStockLevel(currentStock: number, delta: number): void {
  if (currentStock + delta < 0) {
    throw new Error('Stock cannot be negative');
  }
}
