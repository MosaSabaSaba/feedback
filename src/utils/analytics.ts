import * as tf from '@tensorflow/tfjs';

export type FeedbackDataPoint = {
  timestamp: number;
  satisfaction: number;
  flexibility: number;
  stressLevel: number;
};

export type EmployeeFeedback = {
  employeeId: string;
  feedbackHistory: FeedbackDataPoint[];
};

export class FeedbackAnalytics {
  private model: tf.Sequential | null = null;

  async initializeModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });
  }

  preprocessData(feedbackHistory: FeedbackDataPoint[]): { input: tf.Tensor; output: tf.Tensor } {
    const input = feedbackHistory.map(feedback => [
      feedback.timestamp / Date.now(), // Normalize timestamp
      feedback.satisfaction / 3,
      feedback.flexibility / 3,
      feedback.stressLevel / 3
    ]);

    const output = feedbackHistory.map(feedback => [
      feedback.satisfaction / 3,
      feedback.flexibility / 3,
      feedback.stressLevel / 3
    ]);

    return {
      input: tf.tensor2d(input),
      output: tf.tensor2d(output)
    };
  }

  async trainModel(employeeFeedback: EmployeeFeedback[]) {
    if (!this.model) await this.initializeModel();

    for (const employee of employeeFeedback) {
      if (employee.feedbackHistory.length < 2) continue;

      const { input, output } = this.preprocessData(employee.feedbackHistory);

      await this.model!.fit(input, output, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        verbose: 0
      });

      input.dispose();
      output.dispose();
    }
  }

  async predictTrend(employeeId: string, feedbackHistory: FeedbackDataPoint[]): Promise<{
    satisfaction: number;
    flexibility: number;
    stressLevel: number;
  }> {
    if (!this.model || feedbackHistory.length < 2) {
      return {
        satisfaction: feedbackHistory[feedbackHistory.length - 1]?.satisfaction || 2,
        flexibility: feedbackHistory[feedbackHistory.length - 1]?.flexibility || 2,
        stressLevel: feedbackHistory[feedbackHistory.length - 1]?.stressLevel || 2
      };
    }

    const latestData = feedbackHistory[feedbackHistory.length - 1];
    const inputTensor = tf.tensor2d([[
      Date.now() / Date.now(),
      latestData.satisfaction / 3,
      latestData.flexibility / 3,
      latestData.stressLevel / 3
    ]]);

    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const [satisfaction, flexibility, stressLevel] = await prediction.data();

    inputTensor.dispose();
    prediction.dispose();

    return {
      satisfaction: Math.round(satisfaction * 3),
      flexibility: Math.round(flexibility * 3),
      stressLevel: Math.round(stressLevel * 3)
    };
  }

  generateSuggestions(
    currentFeedback: FeedbackDataPoint,
    predictedTrend: { satisfaction: number; flexibility: number; stressLevel: number }
  ): string[] {
    const suggestions: string[] = [];

    if (predictedTrend.satisfaction < currentFeedback.satisfaction) {
      suggestions.push('Employee satisfaction is trending downward. Consider scheduling a one-on-one meeting to discuss concerns.');
    }

    if (predictedTrend.stressLevel > currentFeedback.stressLevel) {
      suggestions.push('Stress levels are predicted to increase. Consider reviewing workload distribution and deadlines.');
    }

    if (predictedTrend.flexibility < currentFeedback.flexibility) {
      suggestions.push('Flexibility satisfaction is decreasing. Review current scheduling policies and gather specific feedback.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Current workplace satisfaction metrics are stable or improving. Continue current management practices.');
    }

    return suggestions;
  }
}