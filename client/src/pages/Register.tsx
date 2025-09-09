import { Mail,Eye,EyeOff} from "lucide-react"
import  FormInput from "../components/FormInput"
import { Link, useNavigate } from "react-router-dom"
import {useActionState, useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import { registerUser } from "../api/auth"

type ActionState={
    error?:string |null;
    message?:string |null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleSubmit = async (prevState:ActionState,formData:FormData):Promise<ActionState>=>{

    //Extracting Form Data.. 
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const universityName = formData.get("universityName") as string;
    const gender = formData.get("gender") as string;
    const yearJoined = formData.get("yearJoined") as string;
    const department = formData.get("department") as string;


    // client Side validation
    if (!firstName || !lastName || !email || !password || !universityName || !gender || !yearJoined || !department) {
        return { error: "All fields are required." };
    }

        // 3. Password validation
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters long." };
    }

        // 4. Name validation (letters only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return { error: "Names should only contain letters and spaces." };
    }

        // 5. Year validation
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearJoined);
    if (isNaN(year) || year < 1950 || year > currentYear) {
        return { error: `Year joined must be between 1950 and ${currentYear}.` };
    }

        // 7. University name validation
    if (universityName.length < 2) {
        return { error: "University name must be at least 2 characters long." };
    }

    if (!EMAIL_REGEX.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    // Registering User to the database.. 
    try{

        const result = await registerUser({
            firstName,
            lastName,
            email,
            password,
            universityName,
            gender,
            yearJoined,
            department
        })

        if(result.success)
            return {
                message:"Registration Successfull",
                error:null
            }
        else
            return {
                error:result.error?.message || "Registration Failed ,Please try again later",
                message:null
            }
    }catch(error){

        console.error("Unexpected Error while registering..")
        return{
            error:"An unexpected error occured ",
            message:null
        }
    }
}

function Register(){

    // Redirect User if successfully registered .
    const[showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate()
    const initialState:ActionState = {error:null,message:null}
    const [state,formAction,isPending]  = useActionState(handleSubmit,initialState)
    
    useEffect(()=>{
        if(state.message && state.message.includes("Successfull"))
            setTimeout(()=>{
                navigate('/login')
            },2000)
    },[state.message,navigate])

    return (
        <div className="flex min-h-screen w-full item-center justify-center bg-gradient-to-br from-gray-800 via-slate-900  to-black p-4 overflow-y-hidden"

        >
            
            <motion.div className="w-full max-w-xl overflow-y-auto"
                initial={{opacity:0,x:50}}
                animate={{opacity:1,x:0}}
                exit={{opacity:0,x:-50}}
                transition={{duration:0.4}}
            >
                <form  
                action={formAction}
                className=" flex flex-col gap-y-6 rounded-2xl
                border border-white/20 bg-white/10 p-8 md:p-12 backdrop-blur-md shadow-2xl "
                >
                    <div className="text-center">
                        <h1 className="text-4xl text-white font-bold">Welcome to Project</h1>
                        <p className="mt-2 text-gray-300">Please Enter your details to register yourself</p>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <FormInput id="firstName" type="text" label="First Name"
                        placeholder="Enter your Name"/>
                        <FormInput 
                        id="lastName" 
                        type="text" 
                        label="Last Name"
                        placeholder="Enter your last name"/>
                        <FormInput
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="abc@gmail.com"
                        >
                            <div
                            className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-gray-300 hover:text-indigo-400"
                            >
                                <Mail size={20}/>
                            </div>
                        </FormInput>

                        <FormInput
                            id="password"
                            type={showPassword ?"text" :"password"}
                            label="Password"
                            placeholder="*******"
                        >
                            <button
                                type="button" // Important to prevent form submission
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-gray-300 hover:text-indigo-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </FormInput>
                        <FormInput
                            id="universityName"
                            type="text"
                            label="University Name"
                            placeholder="University of Mars"
                        />

                        <div
                        className="flex gap-x-2 text-xl text-white/90 "
                        >
                            <input type="radio" value="Male" name="gender" id="male"/>
                            <label htmlFor="male" className="hover:text-indigo-400">Male</label>
                            <input type="radio" value="Female" name="gender" id="female"/>
                            <label htmlFor="female" className="hover:text-indigo-400">Female</label>
                        </div>

                        <div className="relative">
                            <label htmlFor="year"
                            className="block text-sm font-medium text-gray-200"
                            >Joining Year</label>
                            <input type="text"
                            maxLength={4}
                            placeholder="Y-Y-Y-Y"
                            id="year"
                            name="yearJoined"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
                            />
                        </div>

                        <FormInput
                            id="department"
                            label="Department"
                            type="text"
                            placeholder="MCA"
                        />

                        {state.error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-md bg-red-900/50 border border-red-500/50 p-3"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-400 font-medium text-center">
                                        {state.error}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {state.message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-md bg-green-900/50 border border-green-500/50 p-3"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-green-400 font-medium text-center">
                                        {state.message}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={isPending} // The button is disabled while the action is pending.
                        className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-indigo-800"
                    >
                        {isPending ? 'Creatin account...' : 'Sign In'}
                    </button>

                    <div className="mt-4 text-center text-sm">
                        <p className="text-gray-300">
                            Do have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-400 transition hover:text-indigo-300">
                                Log In
                            </Link>
                        </p>
                    </div>

                </form>
            </motion.div>
        </div>
    )
}
export default Register