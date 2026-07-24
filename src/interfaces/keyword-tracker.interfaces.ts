export interface IDeleteKeyword {
  channelsToDeleteFrom: string[];
  countryCode?:string
}

export interface IMessage {
  success: boolean;
  error: boolean;
  msg: string;
}
