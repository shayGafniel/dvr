export enum PotentialType {
  Disqualified = 'disqualified',
  InProgress = 'in progress',
  NewQualified = 'new qualified',
  Qualified = 'qualified',
}

export interface PotentialDisplay {
  color: string;
  percent: number;
  type: PotentialType;
  value: number;
}

export interface Potential {
  currencyCode: string;
  order: PotentialType[];
  values: { [type in PotentialType]: number };
}

export const potentialColors: { [type in PotentialType]: string } = {
  [PotentialType.Disqualified]: '#fe645f',
  [PotentialType.InProgress]: '#6a71e5',
  [PotentialType.NewQualified]: '#2ab8fc',
  [PotentialType.Qualified]: '#00c427',
};

export const sortedPotentialTypesForAccount: PotentialType[] = [
  PotentialType.Qualified,
  PotentialType.NewQualified,
  PotentialType.Disqualified,
  PotentialType.InProgress,
];

export const sortedPotentialTypesForEntity: PotentialType[] = [
  PotentialType.InProgress,
  PotentialType.Disqualified,
  PotentialType.NewQualified,
  PotentialType.Qualified,
];
