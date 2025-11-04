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

  // Ícones que você usa
  export const House: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const FunnelSimple: React.FC<IconProps>;
  export const MagnifyingGlass: React.FC<IconProps>;
  export const CaretLeft: React.FC<IconProps>; // Adiciona o ícone de voltar
  export const CaretRight: React.FC<IconProps>;
  export const Gear: React.FC<IconProps>;
  export const Check: React.FC<IconProps>;
  export const X: React.FC<IconProps>;
  export const SignOut: React.FC<IconProps>;
  export const WhatsappLogo: React.FC<IconProps>;
  export const Camera: React.FC<IconProps>;
  export const Trash: React.FC<IconProps>;

  export const PhosphorIcon: React.FC<IconProps>;
}
declare module "firebase/auth";
declare module "firebase/firestore";
