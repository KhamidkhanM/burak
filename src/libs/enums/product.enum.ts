// dish sizes, used for non-drink products
export enum ProductSize {
  SMALL = "SMALL", // small portion
  NORMAL = "NORMAL", // regular portion
  LARGE = "LARGE", // large portion
  SET = "SET", // combo/set meal
}

// drink volumes in liters, used only when productCollection is DRINK
export enum ProductVolume {
  HALF = 0.5, // 0.5 liter
  ONE = 1, // 1 liter
  ONE_POINT_TWO = 1.2, // 1.2 liters
  ONE_POINT_FIVE = 1.5, // 1.5 liters
  TWO = 2, // 2 liters
}

// lifecycle status of a product on the menu
export enum ProductStatus {
  PAUSE = "PAUSE", // temporarily hidden/unavailable
  PROCESS = "PROCESS", // active, currently sellable
  DELETE = "DELETE", // soft-deleted, no longer shown
}

// which menu category a product belongs to
export enum ProductCollection {
  DISH = "DISH", // main dishes
  SALAD = "SALAD", // salads
  DESSERT = "DESERT", // desserts
  DRINK = "DRINK", // drinks (uses productVolume)
  OTHER = "OTHER", // anything else
}
