export enum NavItemIconType {
  Inbuilt = 'inbuilt',
  Sprite = 'sprite',
  Svg = 'svg',
}

export interface NavItemIcon {
  path: string;
  type: NavItemIconType;
}

export interface NavItem {
  display: string;
  icon?: NavItemIcon;
  url: string;
  children?: NavItem[];
  roleName?: string;
  isAuthorized?: boolean;
  isExact?: boolean;
}

export interface NavGroup {
  items: NavItem[];
}

export type NavGroups = NavGroup[];
