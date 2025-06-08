import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import Input from '../../components/inputs/Input'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'
import uploadImage from '../../utils/uploadimage'
import toast from 'react-hot-toast'

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [adminInviteToken, setAdminInviteToken] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { updateUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (!fullName.trim()) {
                throw new Error("Please enter a full name.")
            }

            if (!validateEmail(email)) {
                throw new Error("Please enter a valid email address.")
            }

            if (!password || password.length < 6) {
                throw new Error("Password must be at least 6 characters.")
            }

            let profileImageUrl = ""
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl = imgUploadRes.profileImageUrl || ""
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                profileImageUrl,
                adminInviteToken
            })

            const { token, role } = response.data

            if (token) {
                localStorage.setItem("token", token)
                updateUser(response.data)
                toast.success("Account created successfully!")

                if (role === "admin") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/user/dashboard")
                }
            }

        } catch (err) {
            const errMsg = err?.response?.data?.message || err?.message || "Something went wrong"
            setError(errMsg)
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Join us today by entering your details below
                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="John"
                            type="text"
                        />
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder='john@example.com'
                            type="email"
                        />
                        <Input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            label="Password"
                            placeholder='Min 6 Characters'
                            type="password"
                        />
                        <Input
                            value={adminInviteToken}
                            onChange={({ target }) => setAdminInviteToken(target.value)}
                            label="Admin Invite Token"
                            placeholder='6 Digit Code'
                            type="text"
                        />
                    </div>

                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button
                        type='submit'
                        className='btn-primary disabled:opacity-60'
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'SIGN UP'}
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{" "}
                        <Link className='font-medium text-primary underline' to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp
