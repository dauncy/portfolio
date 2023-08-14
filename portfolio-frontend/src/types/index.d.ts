export type Nullable<T> = T | null;

declare global {
  let BACKEND_URL: string;
  let VISITOR_API_KEY: string;
}
