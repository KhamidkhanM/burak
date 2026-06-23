// dish sizes, used for non-drink products
export enum ProductSize {
  SMALL = "SMALL",
  NORMAL = "NORMAL",
  LARGE = "LARGE",
  SET = "SET",
}

// drink volumes in liters, used only when productCollection is DRINK
export enum ProductVolume {
  HALF = 0.5,
  ONE = 1,
  ONE_POINT_TWO = 1.2,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
}

// lifecycle status of a product on the menu
export enum ProductStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE",
}

// which menu category a product belongs to
export enum ProductCollection {
  DISH = "DISH",
  SALAD = "SALAD",
  DESSERT = "DESERT",
  DRINK = "DRINK",
  OTHER = "OTHER",
}