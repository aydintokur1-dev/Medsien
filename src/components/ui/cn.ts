/** Join class names, skipping falsy values. No merging — avoid passing conflicting utilities. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
