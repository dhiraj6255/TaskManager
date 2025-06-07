import { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import toast from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { updateUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {

        e.preventDefault();

        const trimmedEmail = email.trim()

        if (!validateEmail(trimmedEmail)) {
            setError("Please enter a valid email address.")
            return
        }

        if (!password) {
            setError("Please enter the password.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }

        setError(null)
        setLoading(true)

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email: trimmedEmail,
                password,
            })

            const { token, role } = response.data

            if (token) {
                localStorage.setItem("token", token)
                updateUser(response.data)

                toast.success("Login successful!")

                if (role === "admin") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/user/dashboard")
                }
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again."
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your details to log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        autoComplete="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="john@example.com"
                        type="email"
                    />
                    <Input
                        autoComplete="current-password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Min 6 Characters"
                        type="password"
                    />

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button
                        type='submit'
                        className='btn-primary disabled:opacity-60'
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Don't have an account?{" "}
                        <Link className='font-medium text-primary underline' to="/signup">
                            SignUp
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login
