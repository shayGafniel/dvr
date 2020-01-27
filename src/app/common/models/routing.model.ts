export interface Breadcrumb {
  link?: string;
  title: string;
}

export interface BreadcrumbMap {
  [key: string]: string;
}

export interface BreadcrumbBeforeItem {
  link: string;
  title: string;
}

export interface DataOfPath {
  breadcrumb?: string;
  breadcrumbLink?: string;
  breadcrumbBeforeItems?: BreadcrumbBeforeItem[];
  serviceName?: string;
}
