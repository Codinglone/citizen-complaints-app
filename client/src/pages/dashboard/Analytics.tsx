import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data - replace with actual API calls
  const [metrics, setMetrics] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    averageResolutionTime: 0,
    satisfactionRate: 0,
    categoryDistribution: [],
    statusDistribution: [],
    timeSeriesData: [],
    topAgencies: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('analytics.title')}</h1>
        <select 
          className="select select-bordered"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">{t('analytics.timeRanges.week')}</option>
          <option value="month">{t('analytics.timeRanges.month')}</option>
          <option value="quarter">{t('analytics.timeRanges.quarter')}</option>
          <option value="year">{t('analytics.timeRanges.year')}</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('analytics.metrics.totalComplaints')}</div>
          <div className="stat-value">{metrics.totalComplaints}</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('analytics.metrics.resolvedComplaints')}</div>
          <div className="stat-value">{metrics.resolvedComplaints}</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('analytics.metrics.averageResolutionTime')}</div>
          <div className="stat-value">{metrics.averageResolutionTime}d</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('analytics.metrics.satisfactionRate')}</div>
          <div className="stat-value">{metrics.satisfactionRate}%</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Series Chart */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{t('analytics.charts.complaintsOverTime')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="complaints" stroke="#8884d8" />
                  <Line type="monotone" dataKey="resolved" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{t('analytics.charts.categoryDistribution')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {metrics.categoryDistribution.map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Agencies */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">{t('analytics.topAgencies')}</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>{t('analytics.agency')}</th>
                  <th>{t('analytics.complaintsHandled')}</th>
                  <th>{t('analytics.resolutionRate')}</th>
                  <th>{t('analytics.averageResolutionTime')}</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topAgencies.map((agency: any) => (
                  <tr key={agency.id}>
                    <td>{agency.name}</td>
                    <td>{agency.complaintsHandled}</td>
                    <td>{agency.resolutionRate}%</td>
                    <td>{agency.avgResolutionTime}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 