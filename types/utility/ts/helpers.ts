export type OmitId<T> = Omit<T, "id">;
export type Bland<T, Name extends string> = T & { readonly __brand: Name };
