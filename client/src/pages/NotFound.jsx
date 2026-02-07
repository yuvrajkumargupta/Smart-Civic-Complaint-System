import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 text-center max-w-md w-full">
                <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-orange-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Page Not Found</h1>
                <p className="text-slate-500 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-indigo hover:bg-brand-blue text-white font-medium rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
