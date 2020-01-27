export interface DashboardGraphsResponse {
  refunded: number[];
  submitted: number[];
  potential: number[];
  disqualified: number[];
  labels: string[];
}

export interface DashboardGraphs extends DashboardGraphsResponse {
  disqualifiedAvg: number;
}

export const dashboardGraphsFirstSetOrder = ['potential', 'submitted', 'refunded'];
export const dashboardGraphsSecondSetOrder = ['disqualified', 'disqualifiedAvg'];

export const dashboardGraphsColors = {
  refunded: '#00c427',
  submitted: '#2ab8fc',
  potential: '#ced6df',
  disqualified: '#2ab8fc',
  disqualifiedAvg: '#fe645f',
};

export const dashboardGraphsLegends = {
  refunded: 'Refunded',
  submitted: 'Submitted',
  potential: 'Potential',
  disqualified: 'Disqualified',
  disqualifiedAvg: 'Avg.',
};
