import { Chart, Plugin, ScriptableContext, TooltipModel } from 'chart.js';

export interface IScatterChartDataPoint {
  x: number;
  y: number | string | undefined;
}

export interface IScatterPlotPointStyle {
  radius?: number;
  hoverRadius?: number;
  borderWidth?: number;
  hoverBorderWidth?: number;
  borderColor?: string;
  hoverBorderColor?: string;
  backgroundColor?:
    | string
    | ((context: ScriptableContext<'line'>) => string | CanvasGradient);
}

export interface IScatterPlotAxisConfig {
  title?: string;
  min?: number;
  max?: number;
  gridColor?: string;
  tickCallback?: (tickValue: unknown, index: number) => string | number | null;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
}

export interface ICustomScatterPlotProps<
  T extends IScatterChartDataPoint = IScatterChartDataPoint
> {
  data: T[] | null;
  isLoading?: boolean;
  height?: number;
  xAxisConfig?: IScatterPlotAxisConfig;
  yAxisConfig?: IScatterPlotAxisConfig;
  pointStyle?: IScatterPlotPointStyle;
  customRenderer?: (dataPoint: T) => string;
  customPlugins?: Plugin[];
  chartLabel?: string;
  backgroundPluginEnabled?: boolean;
  onDataPointClick?: (dataPoint: T) => void;
}

export interface IScatterPlotMinMax {
  min: number;
  max: number;
}
export interface IExternalTooltipContext {
  chart: Chart<'scatter'>;
  tooltip: TooltipModel<'scatter'>;
}
