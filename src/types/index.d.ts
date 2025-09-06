declare module "phosphor-react-native" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export type IconWeight =
    | "thin"
    | "light"
    | "regular"
    | "bold"
    | "fill"
    | "duotone";

  export interface IconProps extends ViewProps {
    size?: number;
    color?: string;
    weight?: IconWeight;
  }

  export const House: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const FunnelSimple: React.FC<IconProps>;
  export const MagnifyingGlass: React.FC<IconProps>;
  

  export const PhosphorIcon: React.FC<IconProps>;
}
