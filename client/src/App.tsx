import { RouterProvider } from "react-router-dom"
import { router } from './routes/routes'
import { AnimatePresence } from "framer-motion"
import { AuthProvider } from './context/AuthContext'

const App = () => {
    return (
        <AuthProvider>
            <AnimatePresence mode="wait">
                <RouterProvider router={router} />
            </AnimatePresence>
        </AuthProvider>
    )
}

export default App