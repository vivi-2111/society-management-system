import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CreditCard, CheckCircle } from 'lucide-react';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [members, setMembers] = useState([]);
    
    // Single form state
    const [memberId, setMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [monthYear, setMonthYear] = useState('');
    const [status, setStatus] = useState('unpaid');

    // Bulk form state
    const [bulkAmount, setBulkAmount] = useState('');
    const [bulkMonthYear, setBulkMonthYear] = useState('');

    const storedUser = localStorage.getItem('user');
    const userRole = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        fetchPayments();
        fetchMembers();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments');
            setPayments(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMembers = async () => {
        try {
            const res = await api.get('/members');
            setMembers(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments', { member_id: memberId, amount, month_year: monthYear, status });
            setMemberId(''); setAmount(''); setMonthYear(''); setStatus('unpaid');
            fetchPayments();
        } catch (err) { console.error(err); }
    };

    const handleMarkPaid = async (id) => {
        try {
            await api.put(`/payments/${id}`, { status: 'paid' });
            fetchPayments();
        } catch (err) { console.error(err); }
    };

    const handleBulkAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments/bulk', { amount: bulkAmount, month_year: bulkMonthYear, status: 'unpaid' });
            setBulkAmount(''); setBulkMonthYear('');
            fetchPayments();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Maintenance Payments</h1>

            {userRole === 'admin' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-indigo-500" />
                        Record Maintenance Due / Payment
                    </h3>
                    <form onSubmit={handleAddPayment} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Member</label>
                            <select required value={memberId} onChange={(e)=>setMemberId(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="">Select Member</option>
                                {members.map(m => <option key={m.MEMBER_ID} value={m.MEMBER_ID}>{m.FLAT_NUMBER} - {m.NAME}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
                            <input type="number" required value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Month/Year</label>
                            <input type="text" required value={monthYear} onChange={(e)=>setMonthYear(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2023-10" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Status</label>
                            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-[42px]">
                            Save Record
                        </button>
                    </form>
                </div>
            )}
            
            {userRole === 'admin' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 bg-indigo-50/30">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                        Bulk Generate Dues (All Members)
                    </h3>
                    <form onSubmit={handleBulkAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Amount per Flat (₹)</label>
                            <input type="number" required value={bulkAmount} onChange={(e)=>setBulkAmount(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Month/Year</label>
                            <input type="text" required value={bulkMonthYear} onChange={(e)=>setBulkMonthYear(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2023-10" />
                        </div>
                        <div className="sm:col-span-2">
                            <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors h-[42px] shadow-sm w-full sm:w-auto">
                                Generate For All Members
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flat & Member</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map(p => (
                            <tr key={p.PAYMENT_ID} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{p.FLAT_NUMBER}</div>
                                    <div className="text-sm text-gray-500">{p.MEMBER_NAME}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.MONTH_YEAR}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">₹{p.AMOUNT}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.STATUS === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.STATUS.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {p.STATUS === 'unpaid' && (
                                        <button onClick={() => handleMarkPaid(p.PAYMENT_ID)} className="ml-auto flex flex-row items-center font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-all shadow-md active:scale-95">
                                            <CheckCircle className="w-4 h-4 mr-2" /> 
                                            {userRole === 'admin' ? 'Mark Paid' : 'Pay Now'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
