import Donation from '../models/Donation.js';
import EssaySubmission from '../models/EssaySubmission.js';

// Helper: Ordinary Least-Squares Linear Regression Calculation
const calculateLinearRegression = (dataArray, key) => {
  const n = dataArray.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, forecastNext: 0, growthRate: 0, trend: 'Stable' };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const y = dataArray[i][key] || 0;
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / (n || 1);
  const forecastNext = Math.round(slope * n + intercept);
  
  const initialVal = dataArray[0][key] || 1;
  const latestVal = dataArray[n - 1][key] || 0;
  const growthRate = Math.round(((latestVal - initialVal) / initialVal) * 100);

  return {
    slope: parseFloat(slope.toFixed(2)),
    intercept: parseFloat(intercept.toFixed(2)),
    forecastNext: Math.max(0, forecastNext),
    growthRate,
    trend: slope > 5 ? 'High Acceleration' : slope > 0 ? 'Steady Growth' : 'Decline'
  };
};

export const getTrendAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Aggregate Book Pledges by Month
    const donationStats = await Donation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalBooks: { $sum: '$numberOfBooks' },
          donationCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 2. Aggregate Essay Submissions by Month
    const essayStats = await EssaySubmission.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalParticipants: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 3. Build Synchronized 6-Month Timeline
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeSeriesData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1; // 1-12
      const monthLabel = `${monthNames[d.getMonth()]} ${year}`;

      const matchedDonation = donationStats.find(
        (item) => item._id.year === year && item._id.month === monthNum
      );
      const matchedEssay = essayStats.find(
        (item) => item._id.year === year && item._id.month === monthNum
      );

      timeSeriesData.push({
        month: monthLabel,
        label: monthNames[d.getMonth()],
        year,
        monthNum,
        books: matchedDonation ? matchedDonation.totalBooks : 0,
        participation: matchedEssay ? matchedEssay.totalParticipants : 0
      });
    }

    // 4. Run Machine Learning Regression Engine
    const bookModel = calculateLinearRegression(timeSeriesData, 'books');
    const participationModel = calculateLinearRegression(timeSeriesData, 'participation');

    return res.status(200).json({
      success: true,
      timeSeriesData,
      models: {
        books: bookModel,
        participation: participationModel
      },
      metrics: {
        totalBooksCollected: timeSeriesData.reduce((acc, curr) => acc + curr.books, 0),
        totalParticipants: timeSeriesData.reduce((acc, curr) => acc + curr.participation, 0),
        activeSeason: 'Peak Summer Intake'
      }
    });
  } catch (error) {
    console.error('Analytics Engine Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate trend analytics',
      error: error.message
    });
  }
};