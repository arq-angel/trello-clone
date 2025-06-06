import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch} from "../hooks";
import toast from "react-hot-toast";
import {useForm} from "react-hook-form";
import {
    type ILoginUserParams,
    LoginUserInputSchema,
} from "../schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginUser} from "../features/auth/auth.thunks";
import {handleApiError} from "../utils/handleApiError";

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<ILoginUserParams>({
        resolver: zodResolver(LoginUserInputSchema),
    });

    const onSubmit = async (data: ILoginUserParams) => {
        const resultAction = await dispatch(loginUser(data));

        if (loginUser.fulfilled.match(resultAction)) {
            navigate("/");
            toast.success("Logged in successfully!");
        } else {
            // console.error("Login Error:", resultAction.payload);
            // If you want to set form errors from the API validation error,
            // you can call your handleApiError function here, passing the error payload.
            handleApiError(resultAction.payload, setError);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">

                <div>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="w-full bloginorder p-2 rounded"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </>
    );
};

export default LoginPage;