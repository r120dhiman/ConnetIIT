import React, { useState } from 'react'
// import { onboarding,  getCurrentUser } from '../lib/appwrite/auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function OnBoarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // const [isChecking, setIsChecking] = useState(true);
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
        <div className="min-h-screen bg-[#1B1730] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[#FE744D]">
                    Complete Your Profile
                </h2>
                <p className="mt-2 text-center text-sm text-[#FE744D]">
                    Tell us a bit about yourself
                </p>
            </div>

        <div className="mt-8 bg-[#262438] sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#262438] py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        handleOnBoarding(e);
                    }}>
                        <div>
                            <label className="block text-sm bg-[#262438] font-medium text-[#fafafa]">
                                Your Interests
                            </label>
                            <select
                                name="interests"
                                multiple
                                className="mt-1 block w-full pl-3 text-[#fafafa] pr-10 py-2 bg-[#262438] text-base border-[#262438] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                size={4}
                            >
                               
                                <option value="Dev" className='p-auto py-1 text-center bg-[#392639] text-[#fafafa] rounded-2xl  m-auto w-40 px-auto  text-lg px-4 mt-4'>Development</option>
                                <option value="Travelling" className='p-auto py-1 text-center bg-[#392639] text-[#fafafa] rounded-2xl  m-auto w-40 px-auto  text-lg px-4 mt-4'>Travelling</option>
                                <option value="Trading" className='p-auto py-1 text-center bg-[#392639] text-[#fafafa] rounded-2xl  m-auto w-40 px-auto  text-lg px-4 mt-4'>Trading</option>
                                <option value="Learner" className='p-auto py-1 text-center bg-[#392639] text-[#fafafa] rounded-2xl  m-auto w-40 px-auto  text-lg px-4 mt-4'>Gaming</option>
                                <option value="Music" className='p-auto py-1 text-center bg-[#392639] text-[#fafafa] rounded-2xl  m-auto w-40 px-auto  text-lg px-4 mt-4'>Music</option>
                            </select>
                            <p className="mt-2 text-sm text-[#fafafa]">
                                Hold Cmd (Mac) or Ctrl (Windows) to select multiple
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#fafafa]">
                                Gender
                            </label>
                            <select
                                name="gender"
                                className="mt-1 block w-full pl-3 rounded-3xl pr-10 py-2 text-base bg-[#392639] text-[#fafafa] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#fafafa]">
                                Friend's ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="friendsId"
                                className="mt-1 block w-full border-gray-300 rounded-3xl bg-[#392639] py-3 px-3 text-[#fafafa] shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter friend's ID"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 bg-[#392639]  hover:bg-[#FE744D] hover:text-[#fafafa] px-4 border border-transparent  shadow-sm text-sm font-medium text-white  focus:outline-none focus:ring-2 rounded-3xl focus:ring-offset-2 focus:ring-[#FE744D] disabled:opacity-50"
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
