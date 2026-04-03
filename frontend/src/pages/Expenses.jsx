import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileSpreadsheet } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    
    // Form state
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const storedUser = localStorage.getItem('user');
    const userRole = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', { category, amount, description });
            setCategory(''); setAmount(''); setDescription('');
            fetchExpenses();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Society Expenses</h1>

            {userRole === 'admin' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileSpreadsheet className="w-5 h-5 mr-2 text-indigo-500" />
                        Record New Expense
                    </h3>
                    <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Category</label>
                            <select required value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="">Select Category</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water">Water</option>
                                <option value="Repairs">Repairs & Maintenance</option>
                                <option value="Security">Security Services</option>
                                <option value="Cleaning">Cleaning & Housekeeping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
                            <input type="number" required value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="5000" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Monthly Bill" />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-[42px]">
                            Add Expense
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map(e => (
                            <tr key={e.EXPENSE_ID} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(e.EXPENSE_DATE).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                        {e.CATEGORY}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{e.DESCRIPTION}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">₹{e.AMOUNT}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expenses;
