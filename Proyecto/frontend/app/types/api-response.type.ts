export type ApiResponse = {
  status: boolean;
  timestamp: string;
  path: string;
  statusCode: number;
  result: any;
};

export type ApiUnathorizedResponse = {
  message: string;
  statusCode: number;
};
