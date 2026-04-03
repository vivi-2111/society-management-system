import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { IndianRupee, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        totalPending: 0,
        recentTransactions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await api.get('/reports/summary');
            setSummary(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching summary:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform transition-all hover:scale-105">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-100 font-medium">Net Balance</p>
                            <h3 className="text-3xl font-bold mt-2 flex items-center">
                                <IndianRupee className="w-6 h-6 mr-1"/> {summary.balance}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Total Income Card */}
                <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Income</p>
                            <h3 className="text-2xl font-bold mt-2 flex items-center text-gray-800">
                                <IndianRupee className="w-5 h-5 mr-1"/> {summary.totalIncome || 0}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp className="w-6 h-6"/></div>
                    </div>
                </div>

                {/* Total Expenses Card */}
                <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-md border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Total Expenses</p>
                            <h3 className="text-2xl font-bold mt-2 flex items-center text-gray-800">
                                <IndianRupee className="w-5 h-5 mr-1"/> {summary.totalExpenses || 0}
                            </h3>
                        </div>
                        <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertCircle className="w-6 h-6"/></div>
                    </div>
                </div>

                {/* Pending Payments Card */}
                <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-md border-l-4 border-amber-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Pending Dues</p>
                            <h3 className="text-2xl font-bold mt-2 flex items-center text-gray-800">
                                <IndianRupee className="w-5 h-5 mr-1"/> {summary.totalPending || 0}
                            </h3>
                        </div>
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Clock className="w-6 h-6"/></div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions area */}
            <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                       Recent Status Overview
                    </h3>
                </div>
                <div className="p-6">
                    {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {summary.recentTransactions.map((tx, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{tx.NAME}</span>
                                        <span className="text-xs text-gray-500">{new Date(tx.PAYMENT_DATE).toLocaleDateString()} • Maint: {tx.AMOUNT}</span>
                                    </div>
                                    <div>
                                        {tx.STATUS === 'paid' ? 
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Paid</span> : 
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Unpaid</span>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
