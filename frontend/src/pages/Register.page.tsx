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
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
                <div>
                    <input
                        {...register("name")}
                        placeholder="Name"
                        className="w-full border p-2 rounded"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

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
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                {/*<div>
                <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2 rounded"
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>*/}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </>
    )
        ;

}

export default RegisterPage;
