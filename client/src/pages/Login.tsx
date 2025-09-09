import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useActionState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 
import FormInput from '../components/FormInput';
import { motion } from 'framer-motion';
import { loginUser, checkAuthStatus } from '../api/auth';

// --- TYPE DEFINITIONS (For TypeScript Safety) ---

type ActionState = {
    error?: string | null;
    message?: string | null;
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleSubmission = async (
    _prevState: ActionState, 
    formData: FormData
): Promise<ActionState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Enhanced validation
    if (!email || !password) {
        return { error: "All fields are required." };
    }

    if (!EMAIL_REGEX.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters long." };
    }

    console.log("Attempting login for:", email.substring(0, 3) + "***@" + email.split('@')[1]);
    
    try {
        const result = await loginUser({ email, password });

        if (result.success) {
            // ✅ Update auth context
            const authResult = await checkAuthStatus();
            if (authResult.success) {
                // This will trigger context update and redirect
                window.location.href = '/'; // Force page refresh to update context
            }
            
            return { 
                message: "Login successful! Redirecting...",
                error: null 
            };
        } else {
            return { 
                error: result.error?.message || "Login failed. Please try again.",
                message: null 
            };
        }
    } catch (error) {
        console.error("Unexpected error during login:", error);
        return { 
            error: "An unexpected error occurred. Please try again.",
            message: null 
        };
    }
};


// --- THE LOGIN COMPONENT ---

function Login() {
    const navigate = useNavigate();
    
    // The initial state for our action.
    const initialState: ActionState = { error: null, message: null };

    // useActionState takes the action function and the initial state.
    // It returns the current state, the action to pass to the form, and a pending status.
    const [state, formAction, isPending] = useActionState(handleSubmission, initialState);

    // This state is for the UI toggle (show/hide password)
    const [showPassword, setShowPassword] = useState(false);

    // Handle successful login navigation
    useEffect(() => {
        if (state.message && state.message.includes("successful")) {
            setTimeout(() => {
                navigate('/'); // Changed from '/home' to '/'
            }, 500);
        }
    }, [state.message, navigate]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-800 via-slate-900 to-black p-4"
        >
            <motion.div className="w-full max-w-md"
                initial={{opacity:0,x:50}}
                animate={{opacity:1,x:0}}
                exit={{opacity:0,x:-50}}
                transition={{duration:0.4}}
            >
                <form
                    action={formAction}
                    className="flex flex-col gap-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:p-12"
                >
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white">Welcome !</h1>
                        <p className="mt-2 text-gray-300">Please enter your credentials to log in.</p>
                    </div>

                    <div className="flex flex-col gap-y-4">
                        <FormInput id="email" type="email" label="Email Address" placeholder="you@example.com" />
                        <FormInput
                            id="password"
                            type={showPassword ? "text" : "password"} // Type is now dynamic
                            label="Password"
                            placeholder="••••••••"
                        >
                            {/* The toggle button is passed as a child */}
                            <button
                                type="button" // Important to prevent form submission
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-gray-300 hover:text-indigo-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </FormInput>
                    </div>
                    
                    {/* Displaying success message */}
                    {state.message && (
                        <p className="text-sm text-green-400 bg-green-900/50 border border-green-500/50 rounded-md p-3 text-center">
                            {state.message}
                        </p>
                    )}
                    
                    {/* Displaying the error message from the action's state */}
                    {state.error && (
                        <p className="text-sm text-red-400 bg-red-900/50 border border-red-500/50 rounded-md p-3 text-center">
                            {state.error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending} // The button is disabled while the action is pending.
                        className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-indigo-800"
                    >
                        {isPending ? 'Logging  In...' : 'Log In'}
                    </button>

                    <div className="mt-4 text-center text-sm">
                        <p className="text-gray-300">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-400 transition hover:text-indigo-300">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Login;

