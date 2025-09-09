import { useNavigate } from "react-router-dom"
import { logoutUser } from "../api/auth"

export default function Header(){
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const result = await logoutUser();
            
            if (result.success) {
                // No need to clear localStorage - httpOnly cookie is cleared by server
                // Redirect to login page
                navigate('/login');
            } else {
                // Handle logout failure
                console.error('Logout failed:', result.error?.message);
                // Optionally show error message to user
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Unexpected error during logout:', error);
            
        }
    };

    return (
        <header className="h-20">
            <nav className="flex flex-row items-center justify-end mr-4 gap-8  bg-amber-300 p-1.5">
                <button 
                    onClick={handleLogout}
                    className="text-2xl font-bold bg-blue-500 rounded-2xl py-2 px-4 hover:outline-indigo-500 hover:outline-2 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                    Log out
                </button>
            </nav>
        </header>
    )
}