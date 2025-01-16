// src/components/analytics/CarbonAnalytics.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../../utils/api';

const CarbonAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/carbon/analytics');
        setAnalyticsData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-container">
      <h2>Carbon Footprint Trends</h2>
      <LineChart width={600} height={300} data={analyticsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="carbonEmission" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default CarbonAnalytics;