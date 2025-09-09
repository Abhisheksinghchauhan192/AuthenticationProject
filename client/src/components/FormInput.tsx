
import React from 'react'

// A reusable Input component for our form to keep the main component clean
const FormInput: React.FC<{
    id: string;
    type: string;
    label: string;
    placeholder: string;
    children?: React.ReactNode; 
}> = ({ id, type, label, placeholder, children }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-200">
            {label}
        </label>
        <div className="mt-1">
            <input
                id={id}
                name={id} 
                type={type}
                required
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
            />
            {/* The icon will be rendered inside the input field */}
            {children}
        </div>
    </div>
);

export default FormInput