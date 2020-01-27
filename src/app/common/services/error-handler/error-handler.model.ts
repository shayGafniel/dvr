export type SnackBarError = [string, number]; // Error message (string) + Http Error Code (number)

export interface ErrorInfo {
  name: string;
  userEmail: string;
  time: string;
  errId: string;
  status: string;
  message: string;
  stack: string;
  url?: string;
}

export interface SupportUserData {
  frequency: string;
  severity: string;
  affectOn: string;
  userComment: string;
}

export interface HttpCall {
  ts: string;
  url: string;
  body: string;
  response: string;
}

export interface ServerEmailSupport extends SupportUserData {
  applicationMessage?: string;
  lastHttpCalls?: HttpCall[];
}

export interface SupportResponse {
  ticketId: string;
}
