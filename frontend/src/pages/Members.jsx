import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, Trash2, Edit } from 'lucide-react';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/members');
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await api.post('/members', { name, flat_number: flatNumber, phone });
            setName('');
            setFlatNumber('');
            setPhone('');
            fetchMembers();
        } catch (err) {
            alert(err.response?.data?.error || err.message);
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete this member?')) {
            try {
                await api.delete(`/members/${id}`);
                fetchMembers();
            } catch(err) { console.error(err); }
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Members Management</h1>

            {/* Add Member Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-indigo-500" />
                    Add New Member
                </h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Name</label>
                        <input type="text" required value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Flat Number</label>
                        <input type="text" required value={flatNumber} onChange={(e)=>setFlatNumber(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="A-101" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="1234567890" />
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-[42px]">
                        Add Member
                    </button>
                </form>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map(member => (
                            <tr key={member.MEMBER_ID} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{member.FLAT_NUMBER}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{member.NAME}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{member.PHONE}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(member.MEMBER_ID)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Members;
