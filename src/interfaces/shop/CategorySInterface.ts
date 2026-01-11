export interface categorySI {
  id: number
  name: string
  subcategories: subI[]
}

export interface subI {
  id: number
  name: string
}
