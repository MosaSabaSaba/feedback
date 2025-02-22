import React, { useEffect, useState } from 'react';
import { LineChart, ArrowUp as TrendArrow } from 'lucide-react';
import { FeedbackAnalytics, type FeedbackDataPoint } from '../utils/analytics';

interface AnalyticsDashboardProps {
  employeeId: string;
  feedbackHistory: FeedbackDataPoint[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  employeeId,
  feedbackHistory
}) => {
  const [analytics] = useState(() => new FeedbackAnalytics());
  const [predictions, setPredictions] = useState<{
    satisfaction: number;
    flexibility: number;
    stressLevel: number;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const analyzeFeedback = async () => {
      await analytics.initializeModel();
      await analytics.trainModel([{ employeeId, feedbackHistory }]);
      
      const predictedTrend = await analytics.predictTrend(employeeId, feedbackHistory);
      setPredictions(predictedTrend);

      const newSuggestions = analytics.generateSuggestions(
        feedbackHistory[feedbackHistory.length - 1],
        predictedTrend
      );
      setSuggestions(newSuggestions);
    };

    if (feedbackHistory.length > 0) {
      analyzeFeedback();
    }
  }, [employeeId, feedbackHistory]);

  if (!predictions || feedbackHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <LineChart className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Analytics & Predictions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(predictions).map(([metric, value]) => {
          const currentValue = feedbackHistory[feedbackHistory.length - 1][metric as keyof FeedbackDataPoint];
          const trend = value > currentValue ? 'up' : value < currentValue ? 'down' : 'stable';

          return (
            <div key={metric} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 capitalize">{metric}</h3>
                <TrendArrow
                  className={`w-5 h-5 ${
                    trend === 'up'
                      ? 'text-green-500 rotate-45'
                      : trend === 'down'
                      ? 'text-red-500 -rotate-45'
                      : 'text-yellow-500'
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-500">predicted</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Management Suggestions</h3>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 bg-blue-50 p-3 rounded-md"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-500" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};