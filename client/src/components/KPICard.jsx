import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-soft hover:shadow-card transition-all duration-300 transform hover:-translate-y-1 p-6 border border-slate-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-brand-muted uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold text-brand-slate mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color === 'indigo' ? 'bg-indigo-50 text-brand-indigo' : color === 'emerald' ? 'bg-secondary/10 text-secondary' : 'bg-warning/10 text-warning'}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center font-medium ${trend === 'up' ? 'text-secondary' : 'text-red-500'}`}>
                        {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        {trendValue}
                    </span>
                    <span className="text-brand-muted ml-2">from last month</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
