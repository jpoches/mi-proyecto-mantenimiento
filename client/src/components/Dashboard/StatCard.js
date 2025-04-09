// client/src/components/Dashboard/StatCard.js
import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    indigo: 'bg-indigo-50 border-indigo-200',
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${colorClasses[color] || 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-2 rounded-full bg-white shadow-sm">{icon}</div>
      </div>
      <div className="flex items-end">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500 ml-2">Total</p>
      </div>
    </div>
  );
};

export default StatCard;