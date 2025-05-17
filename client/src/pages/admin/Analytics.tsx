import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('month');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('adminPanel.analytics')}</h1>
        <div className="join">
          <button 
            className={`join-item btn ${timeRange === 'week' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`join-item btn ${timeRange === 'month' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`join-item btn ${timeRange === 'year' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title">New Complaints</div>
          <div className="stat-value text-primary">89</div>
          <div className="stat-desc">↗︎ 32% more than last month</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div className="stat-title">Resolved Issues</div>
          <div className="stat-value text-secondary">72</div>
          <div className="stat-desc">↗︎ 21% more than last month</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src="https://placehold.co/100x100/3b82f6/ffffff?text=PW" alt="Department" />
              </div>
            </div>
          </div>
          <div className="stat-value">86%</div>
          <div className="stat-title">Satisfaction Rate</div>
          <div className="stat-desc text-secondary">↗︎ 5% more than last month</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div className="stat-title">Avg Response Time</div>
          <div className="stat-value">1.2d</div>
          <div className="stat-desc">↘︎ 14% faster than last month</div>
        </div>
      </div>
      
      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Volume Over Time */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Complaint Volume Over Time</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg p-4">
              {/* ASCII Art Chart (Replace with real Chart.js) */}
              <div className="mockup-code bg-primary text-primary-content">
                <pre><code>              Complaint Volume</code></pre>
                <pre><code>100 |      *</code></pre>
                <pre><code>    |     * *     *</code></pre>
                <pre><code> 75 |    *   *   * *</code></pre>
                <pre><code>    |   *     * *   *</code></pre>
                <pre><code> 50 |  *       *     *</code></pre>
                <pre><code>    | *</code></pre>
                <pre><code> 25 |*</code></pre>
                <pre><code>    |____________________</code></pre>
                <pre><code>     W1 W2 W3 W4 W5 W6 W7</code></pre>
              </div>
              <div className="text-center text-xs mt-2">
                Note: This is a placeholder for a real chart
              </div>
            </div>
          </div>
        </div>
        
        {/* Complaints by Category */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Complaints by Category</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg p-4">
              {/* ASCII Art Pie Chart (Replace with real Chart.js) */}
              <div className="mockup-code bg-secondary text-secondary-content">
                <pre><code>       Complaints by Category</code></pre>
                <pre><code>        .-"""""-.    </code></pre>
                <pre><code>      .'          '.  </code></pre>
                <pre><code>     /   Roads 32%  \ </code></pre>
                <pre><code>    |               | </code></pre>
                <pre><code>    | Water    Noise|  </code></pre>
                <pre><code>    | 15%      18%  |  </code></pre>
                <pre><code>     \   Waste 25% /  </code></pre>
                <pre><code>      '.          .'   </code></pre>
                <pre><code>        '-......-'     </code></pre>
              </div>
              <div className="text-center text-xs mt-2">
                Note: This is a placeholder for a real chart
              </div>
            </div>
          </div>
        </div>
        
        {/* Complaint Status Distribution */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Complaint Status Distribution</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg p-4">
              {/* ASCII Art Bar Chart (Replace with real Chart.js) */}
              <div className="mockup-code bg-accent text-accent-content">
                <pre><code>     Complaint Status Distribution</code></pre>
                <pre><code>40% |   ██</code></pre>
                <pre><code>    |   ██</code></pre>
                <pre><code>30% |   ██    ██</code></pre>
                <pre><code>    |   ██    ██</code></pre>
                <pre><code>20% |   ██    ██    ██</code></pre>
                <pre><code>    |   ██    ██    ██    ██</code></pre>
                <pre><code>10% |   ██    ██    ██    ██    ██</code></pre>
                <pre><code>    |___██____██____██____██____██___</code></pre>
                <pre><code>        Res   InP   Pen   Ass   Esc</code></pre>
              </div>
              <div className="text-center text-xs mt-2">
                Note: This is a placeholder for a real chart
              </div>
            </div>
          </div>
        </div>
        
        {/* Response Time by Department */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Response Time by Department (Days)</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg p-4">
              {/* ASCII Art Horizontal Bar Chart (Replace with real Chart.js) */}
              <div className="mockup-code bg-neutral text-neutral-content">
                <pre><code>     Response Time by Department</code></pre>
                <pre><code>Sanitation  |████████████| 3.2</code></pre>
                <pre><code>Water Auth  |██████████  | 2.7</code></pre>
                <pre><code>Roads       |████████    | 2.1</code></pre>
                <pre><code>Parks       |██████      | 1.6</code></pre>
                <pre><code>Env. Prot.  |████        | 1.1</code></pre>
                <pre><code>Transport   |███         | 0.8</code></pre>
                <pre><code>           0  1  2  3  4  5</code></pre>
                <pre><code>                Days</code></pre>
              </div>
              <div className="text-center text-xs mt-2">
                Note: This is a placeholder for a real chart
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Geographic Distribution & Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Geographic Distribution</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p>Interactive map showing complaint hotspots would appear here</p>
                <p className="text-xs mt-2 opacity-70">Requires integration with a mapping library</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sentiment Analysis */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Sentiment Analysis</h2>
            <div className="mt-4 h-64 bg-base-100 rounded-lg p-4">
              <div className="mockup-code">
                <pre><code>     Sentiment Distribution</code></pre>
                <pre><code>60% |            ████</code></pre>
                <pre><code>    |            ████</code></pre>
                <pre><code>    |            ████</code></pre>
                <pre><code>40% |      ████  ████</code></pre>
                <pre><code>    |      ████  ████</code></pre>
                <pre><code>    |      ████  ████</code></pre>
                <pre><code>20% | ████ ████  ████</code></pre>
                <pre><code>    | ████ ████  ████</code></pre>
                <pre><code>    |_████_████__████____</code></pre>
                <pre><code>     Negative Neutral Positive</code></pre>
              </div>
              <div className="text-center text-xs mt-2">
                AI-powered sentiment analysis of complaint descriptions
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Issues Table */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Top 5 Recurring Issues</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Issue Type</th>
                  <th>Count</th>
                  <th>% of Total</th>
                  <th>Most Common Location</th>
                  <th>Avg Resolution Time</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Potholes</td>
                  <td>47</td>
                  <td>18.4%</td>
                  <td>Main Street</td>
                  <td>3.2 days</td>
                  <td><span className="text-error">↑ 12%</span></td>
                </tr>
                <tr>
                  <td>Garbage Collection</td>
                  <td>35</td>
                  <td>13.7%</td>
                  <td>Residential Area B</td>
                  <td>1.5 days</td>
                  <td><span className="text-error">↑ 5%</span></td>
                </tr>
                <tr>
                  <td>Noise Complaints</td>
                  <td>28</td>
                  <td>10.9%</td>
                  <td>Downtown Area</td>
                  <td>2.7 days</td>
                  <td><span className="text-success">↓ 3%</span></td>
                </tr>
                <tr>
                  <td>Graffiti</td>
                  <td>22</td>
                  <td>8.6%</td>
                  <td>Public Buildings</td>
                  <td>4.1 days</td>
                  <td><span className="text-success">↓ 8%</span></td>
                </tr>
                <tr>
                  <td>Broken Streetlights</td>
                  <td>19</td>
                  <td>7.4%</td>
                  <td>Residential Area A</td>
                  <td>2.3 days</td>
                  <td><span className="text-error">↑ 2%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-ghost btn-sm">
              View Full Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Export and Print Buttons */}
      <div className="flex justify-end gap-4">
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>
    </div>
  );
};