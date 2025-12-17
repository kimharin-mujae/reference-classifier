export interface ReferenceData {
  name: string;
  type: "Hero" | "Card" | "Button" | "Layout" | "Form" | "Navigation" | "Other";
  platform: "Web" | "App";
  memo: string;
}

export const REFERENCE_TYPES = ["Hero", "Card", "Button", "Layout", "Form", "Navigation", "Other"] as const;
export const PLATFORMS = ["Web", "App"] as const;
