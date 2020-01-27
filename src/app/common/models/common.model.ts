export interface MessageBoxMessage {
  title: string;
  content: string;
}

export interface FilterSelection<T = any> {
  value: T;
  viewValue: string;
}

export interface TimeFrameData {
  start_date: string;
  end_date: string;
}
