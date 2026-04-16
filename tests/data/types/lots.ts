export interface LotStep {
  title: string;
  description: string;
}

export interface Description {
  title: string;
  description: string;
}

export interface Banner {
  title: string;
  textColor: string;
}

export interface Button {
  title: string;
  deeplink: string;
}

export interface LegalSection {
  iconName: string;
  title: string;
  description: string;
  button: Button;
}

export interface Lots {
  title: string;
  textColor: string;
}

export interface Pagination {
  title: string;
  textColor: string;
}

export interface MyLotsResponse {
  title: string;
  banner: Banner;
  steps: LotStep[];
  createLotButton: Button;
  subtitle: string;
  legalSection: LegalSection;
  description: Description;
  lots: Lots[];
  pagination: Pagination;
}
