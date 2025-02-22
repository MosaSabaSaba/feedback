import React from 'react';
import { Smile, Meh, Frown, Calendar, Brain } from 'lucide-react';

type Rating = 1 | 2 | 3;

interface FeedbackMatrixProps {
  satisfaction: Rating;
  flexibility: Rating;
  stressLevel: Rating;
}

const getColor = (rating: Rating) => {
  switch (rating) {
    case 1:
      return 'bg-red-100 border-red-200';
    case 2:
      return 'bg-yellow-100 border-yellow-200';
    case 3:
      return 'bg-green-100 border-green-200';
  }
};

const getIcon = (rating: Rating, Icon: typeof Smile) => {
  const className = 'w-6 h-6';
  switch (rating) {
    case 1:
      return <Icon className={`${className} text-red-500`} />;
    case 2:
      return <Icon className={`${className} text-yellow-500`} />;
    case 3:
      return <Icon className={`${className} text-green-500`} />;
  }
};

export const FeedbackMatrix: React.FC<FeedbackMatrixProps> = ({
  satisfaction,
  flexibility,
  stressLevel,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
      <div
        className={`${getColor(
          satisfaction
        )} p-6 rounded-lg border flex flex-col items-center gap-3`}
      >
        <h3 className="font-medium text-gray-700">Satisfaction</h3>
        {getIcon(satisfaction, satisfaction === 1 ? Frown : satisfaction === 2 ? Meh : Smile)}
        <span className="text-sm text-gray-600">
          {satisfaction === 1 ? 'Low' : satisfaction === 2 ? 'Medium' : 'High'}
        </span>
      </div>

      <div
        className={`${getColor(
          flexibility
        )} p-6 rounded-lg border flex flex-col items-center gap-3`}
      >
        <h3 className="font-medium text-gray-700">Flexibility</h3>
        {getIcon(flexibility, Calendar)}
        <span className="text-sm text-gray-600">
          {flexibility === 1 ? 'Low' : flexibility === 2 ? 'Medium' : 'High'}
        </span>
      </div>

      <div
        className={`${getColor(
          stressLevel
        )} p-6 rounded-lg border flex flex-col items-center gap-3`}
      >
        <h3 className="font-medium text-gray-700">Stress Level</h3>
        {getIcon(stressLevel, Brain)}
        <span className="text-sm text-gray-600">
          {stressLevel === 1 ? 'Low' : stressLevel === 2 ? 'Medium' : 'High'}
        </span>
      </div>
    </div>
  );
};