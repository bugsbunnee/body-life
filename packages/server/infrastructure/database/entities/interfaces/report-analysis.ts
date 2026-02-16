export interface ReportAnalysis {
   current: number;
   trend: 'increment' | 'decrement' | 'same';
   difference: string;
}
