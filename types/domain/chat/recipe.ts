export type Material = {
  name: string;
  query: string;
  inPantry: boolean;
};

export type Recipe = {
  title: string;
  description: string;
  materials: Material[];
};

export type Recipes = Recipe[];
