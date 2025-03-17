import React, { useState, useEffect } from 'react'
import { onboarding,  getCurrentUser } from '../lib/appwrite/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function OnBoarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const {handleOnboarding} = useAuth();

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const user = await getCurrentUser();
    //             if (!user) {
    //                 navigate('/sign-in', { replace: true });
    //                 return;
    //             }
                
    //             const isOnboarded = await onboardingverification();
    //             if (isOnboarded) {
    //                 navigate('/', { replace: true });
    //             }
    //         } catch (error) {
    //             console.error('Auth check error:', error);
    //             navigate('/sign-in', { replace: true });
    //         } finally {
    //             setIsChecking(false);
    //         }
    //     };

    //     checkAuth();
    // }, [navigate]);

    // if (isChecking) {
    //     return <div>Loading...</div>;
    // }

    const handleOnBoarding = async(e: React.FormEvent<HTMLFormElement>) => {
       try {
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const gender = formData.get('gender');
        const selectedInterests = Array.from(e.currentTarget.interests.selectedOptions).map(option => option.value);
        let friendId = formData.get('friendsId');
        if(!friendId){
            friendId=" ";
        }

        if (!gender || selectedInterests.length === 0 ) {
            alert('Please fill in all fields');
            return;
        }

        await handleOnboarding(
            gender.toString(), 
            selectedInterests.join(','), 
            friendId.toString()
        );
        navigate('/');
       } catch (error) {
         console.error('Onboarding error:', error);
       } finally {
         setLoading(false);
       }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Complete Your Profile
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Tell us a bit about yourself
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        handleOnBoarding(e);
                    }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Your Interests
                            </label>
                            <select
                                name="interests"
                                multiple
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                size={4}
                            >
                               
                                <option value="Dev" className='w-fit px-3 py-1 bg-gray-400 rounded-lg mt-4'>Development</option>
                                <option value="Travelling" className='w-fit px-3 py-1 bg-gray-400 rounded-lg mt-4'>Travelling</option>
                                <option value="Trading" className='w-fit px-3 py-1 bg-gray-400 rounded-lg mt-4'>Trading</option>
                                <option value="Learner" className='w-fit px-3 py-1 bg-gray-400 rounded-lg mt-4'>Gaming</option>
                                <option value="Music" className='w-fit px-3 py-1 bg-gray-400 rounded-lg mt-4'>Music</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">
                                Hold Cmd (Mac) or Ctrl (Windows) to select multiple
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                name="gender"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Friend's ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="friendsId"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter friend's ID"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Setting up...' : 'Complete Setup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OnBoarding
