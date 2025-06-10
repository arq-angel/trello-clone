import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterUserInputSchema} from "../schemas/auth.schema";
import type {IRegisterUserParams} from "../schemas/auth.schema";
import {toast} from "react-hot-toast";
import {useAppDispatch} from "../hooks";
import {Link, useNavigate} from "react-router-dom";
import {handleApiError} from "../utils/handleApiError";
import {registerUser} from "../features/auth/auth.thunks";

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<IRegisterUserParams>({
        resolver: zodResolver(RegisterUserInputSchema),
    });

    const onSubmit = async (data: IRegisterUserParams) => {
        const resultAction = await dispatch(registerUser(data));

        if (registerUser.fulfilled.match(resultAction)) {
            navigate("/");
            toast.success("Registered successfully!");
        } else {
            // console.error("Registration Error:", resultAction.payload);
            // If you want to set form errors from the API validation error,
            // you can call your handleApiError function here, passing the error payload.
            handleApiError(resultAction.payload, setError);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Login</h2>

                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        {...register("name", {required: "Name is required"})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        {...register("email", {required: "Email is required"})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        {...register("password", {required: "Password is required"})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    Register
                </button>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;
