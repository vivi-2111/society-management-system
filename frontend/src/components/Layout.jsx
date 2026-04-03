import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, FileSpreadsheet, LogOut, Building2 } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const storedUser = localStorage.getItem('user');
    const userRole = storedUser ? JSON.parse(storedUser).role : null;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/members', label: 'Members', icon: Users, adminOnly: true },
        { path: '/payments', label: 'Payments', icon: CreditCard },
        { path: '/expenses', label: 'Expenses', icon: FileSpreadsheet },
    ].filter(item => !item.adminOnly || userRole === 'admin');

    return (
        <div className="flex h-screen bg-gray-50 flex-col sm:flex-row">
            {/* Sidebar */}
            <aside className="w-full sm:w-64 bg-indigo-900 text-white flex flex-col sm:h-screen">
                <div className="p-5 flex items-center space-x-3 bg-indigo-950 border-b border-indigo-800">
                    <Building2 className="w-8 h-8 text-indigo-400" />
                    <span className="text-xl font-bold tracking-wider">SocietyPro</span>
                </div>
                
                <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-300 hover:bg-red-500 hover:text-white transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sm:hidden">
                    <h1 className="text-xl font-bold text-gray-800">SocietyPro</h1>
                </header>
                <div className="flex-1 overflow-auto p-4 sm:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
