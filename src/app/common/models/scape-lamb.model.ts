export interface NamedWorkload {
  id?: string;
  name: string;
  submissionDate?: string;
  endDate?: string;
  user?: string;
  numReports?: number;
  status?: {
    status: string;
    numFailed?: number;
  };
  filter?: {
    goal: string;
    entityIds: string[];
    dates?: {
      value: {
        dateField: string;
        dateFrom: string;
        dateTo?: string;
      };
      includeMissing: boolean;
    };
    domesticOrForeign?: {
      value: string;
      includeMissing: boolean;
    };
    reportIds?: string[];
    countries?: {
      value: string[];
      includeMissing: boolean;
    };
  };
}

export interface NamedWorkloadsResponse {
  workloads: NamedWorkload[];
}

export interface WorkloadsNames {
  [id: string]: string;
}
