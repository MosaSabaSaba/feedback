import React, { useState, useEffect } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackMatrix } from './components/FeedbackMatrix';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import type { FeedbackDataPoint } from './utils/analytics';

// Simulated employee ID - in a real app, this would come from authentication
const EMPLOYEE_ID = 'emp-123';

function App() {
  const [currentFeedback, setCurrentFeedback] = useState({
    satisfaction: 2,
    flexibility: 3,
    stressLevel: 1,
  });

  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackDataPoint[]>([]);

  useEffect(() => {
    // Simulate loading historical feedback data
    // In a real app, this would come from your backend
    setFeedbackHistory([
      {
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        satisfaction: 3,
        flexibility: 3,
        stressLevel: 1,
      },
      {
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        satisfaction: 2,
        flexibility: 3,
        stressLevel: 2,
      },
      {
        timestamp: Date.now(),
        satisfaction: currentFeedback.satisfaction,
        flexibility: currentFeedback.flexibility,
        stressLevel: currentFeedback.stressLevel,
      },
    ]);
  }, [currentFeedback]);

  const handleFeedbackSubmit = (feedback: typeof currentFeedback) => {
    setCurrentFeedback(feedback);
    // In a real app, you would save this to your backend
    const newFeedbackPoint: FeedbackDataPoint = {
      timestamp: Date.now(),
      ...feedback,
    };
    setFeedbackHistory([...feedbackHistory, newFeedbackPoint]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Employee Feedback</h1>
          <p className="text-lg text-gray-600">
            Help us improve by sharing your experience
          </p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <FeedbackForm onSubmit={handleFeedbackSubmit} />
          
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Feedback Matrix
            </h2>
            <FeedbackMatrix
              satisfaction={currentFeedback.satisfaction}
              flexibility={currentFeedback.flexibility}
              stressLevel={currentFeedback.stressLevel}
            />
          </div>

          <AnalyticsDashboard
            employeeId={EMPLOYEE_ID}
            feedbackHistory={feedbackHistory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;