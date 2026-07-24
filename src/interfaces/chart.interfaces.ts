export interface IChartData {
  name: string;
  [brand: string]: number | string;
}

export interface ILabeledChartData {
  [label: string]: IChartData;
}

export interface IGraphSingleData {
  label?: string;
  data?: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface IGraphData {
  labels?: string[];
  datasets?: IGraphSingleData[];
}
