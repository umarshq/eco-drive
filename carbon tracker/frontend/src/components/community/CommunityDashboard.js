// src/components/community/CommunityDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const CommunityDashboard = () => {
  const [communities, setCommunities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communitiesRes = await api.get('/community/list');
        const leaderboardRes = await api.get('/community/leaderboard');
        setCommunities(communitiesRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCommunityData();
  }, []);

  return (
    <div className="community-dashboard">
      <div className="communities-list">
        <h3>Your Communities</h3>
        {communities.map(community => (
          <div key={community.id} className="community-card">
            <h4>{community.name}</h4>
            <p>Members: {community.memberCount}</p>
          </div>
        ))}
      </div>
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        {leaderboard.map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <span>{index + 1}</span>
            <span>{user.name}</span>
            <span>{user.score} kg CO2 saved</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDashboard;