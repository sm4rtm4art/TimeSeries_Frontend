/**
 * Mock time series data for local development
 */

export interface TimeSeriesData {
  id: string;
  name: string;
  description: string;
  dates: string[];
  values: number[];
  metadata?: Record<string, any>;
}

// Utility to generate realistic time series data
function generateTimeSeriesData(
  id: string,
  name: string,
  description: string,
  length: number = 100,
  startDate: Date = new Date(2023, 0, 1),
  hasSeasonality: boolean = true,
  hasTrend: boolean = true,
  hasOutliers: boolean = true,
  baseValue: number = 100,
  volatility: number = 10
): TimeSeriesData {
  const dates: string[] = [];
  const values: number[] = [];
  
  for (let i = 0; i < length; i++) {
    // Generate date
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
    
    // Base value
    let value = baseValue;
    
    // Add trend if enabled
    if (hasTrend) {
      value += (i / length) * 50; // Increasing trend
    }
    
    // Add seasonality if enabled
    if (hasSeasonality) {
      value += Math.sin((i / 30) * Math.PI * 2) * 20; // ~30 day seasonality
    }
    
    // Add random noise
    value += (Math.random() - 0.5) * volatility;
    
    // Add outliers if enabled
    if (hasOutliers && i % 30 === 0 && i > 0) {
      value += (Math.random() > 0.5 ? 1 : -1) * volatility * 5;
    }
    
    values.push(Number(value.toFixed(2)));
  }
  
  return {
    id,
    name,
    description,
    dates,
    values,
    metadata: {
      hasSeasonality,
      hasTrend,
      hasOutliers,
      startDate: startDate.toISOString(),
      length
    }
  };
}

// Export several sample time series
export const mockTimeSeriesData: TimeSeriesData[] = [
  generateTimeSeriesData(
    'airline',
    'Airline Passengers',
    'Monthly airline passenger counts',
    120,
    new Date(2022, 0, 1),
    true,
    true,
    false,
    500,
    30
  ),
  generateTimeSeriesData(
    'energy',
    'Energy Consumption',
    'Daily energy consumption in kWh',
    365,
    new Date(2022, 0, 1),
    true,
    true,
    true,
    1000,
    100
  ),
  generateTimeSeriesData(
    'retail',
    'Retail Sales',
    'Weekly retail sales data',
    52,
    new Date(2022, 0, 1),
    true,
    true,
    true,
    10000,
    500
  ),
  generateTimeSeriesData(
    'stock',
    'Stock Prices',
    'Daily stock price data',
    250,
    new Date(2022, 0, 1),
    false,
    true,
    true,
    100,
    2
  ),
  generateTimeSeriesData(
    'temperature',
    'Temperature',
    'Daily temperature readings',
    365,
    new Date(2022, 0, 1),
    true,
    false,
    false,
    15,
    5
  ),
  generateTimeSeriesData(
    'web_traffic',
    'Web Traffic',
    'Hourly web traffic data',
    168,
    new Date(2022, 0, 1),
    true,
    true,
    true,
    5000,
    1000
  )
];

// Function to get a specific dataset by ID
export function getTimeSeriesById(id: string): TimeSeriesData | undefined {
  return mockTimeSeriesData.find(series => series.id === id);
}

// Function to get all datasets
export function getAllTimeSeries(): TimeSeriesData[] {
  return mockTimeSeriesData;
}

// Export default
export default mockTimeSeriesData; 