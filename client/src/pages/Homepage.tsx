import { useState, useEffect } from 'react';
import { getAllProfiles } from '../api/user';

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    universityName?: string;
    gender?: string;
    yearJoined?: number;
    department?: string;
    dateOfBirth?: string;
}

function HomePage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const result = await getAllProfiles();
            
            if (result.success) {
                setProfiles(result.data || []);
                setError(null);
            } else {
                setError(result.error?.message || 'Failed to fetch profiles');
                setProfiles([]);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchProfiles();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Teacher Profiles</h1>
                            <p className="text-gray-600 mt-2">
                                Manage and view all teacher profiles in the system
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Error loading profiles</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Container */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <h2 className="text-xl font-semibold text-white">All Teacher Profiles</h2>
                        <p className="text-indigo-100 mt-1">
                            {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} found
                        </p>
                    </div>
                    
                    {profiles.length === 0 && !error ? (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-medium text-gray-900 mb-2">No Data Available</h3>
                            <p className="text-gray-500 text-lg">No teacher profiles are available at the moment.</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : profiles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            University
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Year Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {profiles.map((profile, index) => (
                                        <tr 
                                            key={profile.id} 
                                            className={`hover:bg-gray-50 transition-colors duration-150 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-semibold text-lg">
                                                                {profile.firstName[0]}{profile.lastName[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {profile.firstName} {profile.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {profile.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{profile.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {profile.universityName || (
                                                        <span className="text-gray-400 italic">Not specified</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {profile.department ? (
                                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {profile.department}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {profile.gender || (
                                                    <span className="text-gray-400 italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {profile.yearJoined || (
                                                    <span className="text-gray-400 italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default HomePage;