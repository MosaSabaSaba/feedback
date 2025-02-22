import React, { useState } from 'react';
import { Smile, Meh, Frown, Calendar, Brain } from 'lucide-react';

type Rating = 1 | 2 | 3;
type FeedbackData = {
  satisfaction: Rating;
  flexibility: Rating;
  stressLevel: Rating;
};

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackData) => void;
}

const RatingButton: React.FC<{
  value: Rating;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ value, selected, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg transition-all ${
      selected
        ? 'bg-blue-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-600 hover:bg-blue-50'
    } flex flex-col items-center gap-2 border`}
  >
    {icon}
    <span className="text-sm">
      {value === 1 ? 'Low' : value === 2 ? 'Medium' : 'High'}
    </span>
  </button>
);

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    satisfaction: 2,
    flexibility: 2,
    stressLevel: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl">
      <div className="space-y-6">
        {/* Satisfaction Rating */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <Smile className="w-5 h-5" />
            Overall Satisfaction
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((value) => (
              <RatingButton
                key={value}
                value={value as Rating}
                selected={feedback.satisfaction === value}
                onClick={() =>
                  setFeedback({ ...feedback, satisfaction: value as Rating })
                }
                icon={
                  value === 1 ? (
                    <Frown className="w-6 h-6" />
                  ) : value === 2 ? (
                    <Meh className="w-6 h-6" />
                  ) : (
                    <Smile className="w-6 h-6" />
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Flexibility Rating */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <Calendar className="w-5 h-5" />
            Scheduling Flexibility
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((value) => (
              <RatingButton
                key={value}
                value={value as Rating}
                selected={feedback.flexibility === value}
                onClick={() =>
                  setFeedback({ ...feedback, flexibility: value as Rating })
                }
                icon={<Calendar className="w-6 h-6" />}
              />
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-lg font-medium text-gray-700">
            <Brain className="w-5 h-5" />
            Stress Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((value) => (
              <RatingButton
                key={value}
                value={value as Rating}
                selected={feedback.stressLevel === value}
                onClick={() =>
                  setFeedback({ ...feedback, stressLevel: value as Rating })
                }
                icon={<Brain className="w-6 h-6" />}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
      >
        Submit Feedback
      </button>
    </form>
  );
};