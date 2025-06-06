import api from "./axios.ts";
import type {INewUser} from "../models";
import {
    type ILoginUserParams,
    type ILoginUserResponseSchema,
    type IRegisterUserParams,
    LoginUserInputSchema,
    RegisterUserInputSchema,
    UserLoginResponseSchema
} from "../schemas/auth.schema.ts";
import {validateApiResponseData} from "../utils/validateApiResponseData.ts";
import type {IAPIResponse} from "./types.ts";
import {callApi} from "./callApi.ts";
import {validateInput} from "../utils/validate-input.ts";
import {validateApiResponseSuccess} from "../utils/validate-api-response-success.ts";
import type {AxiosResponse} from "axios";

export const loginUserAPI = async ({payload}: { payload: ILoginUserParams }) => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload: ILoginUserParams = validateInput<ILoginUserParams>(LoginUserInputSchema, payload);

    // Step 2: Call backend API using centralized axios call wrapper
    const data: IAPIResponse<INewUser> = await callApi<IAPIResponse<INewUser>>((): Promise<AxiosResponse<IAPIResponse<INewUser>>> =>
        api.post<IAPIResponse<INewUser>>(`/auth/login`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const user: INewUser = validateApiResponseSuccess(data);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedUser: ILoginUserResponseSchema = validateApiResponseData(user, UserLoginResponseSchema);

    // Step 5: Return the validatedUser
    return validatedUser;
};

export const registerUserAPI = async ({payload,}: {
    payload: IRegisterUserParams;
}): Promise<ILoginUserResponseSchema> => {
    // Step 1: Local input validation with Zod schema (frontend-side)
    const validatedPayload: IRegisterUserParams = validateInput<IRegisterUserParams>(RegisterUserInputSchema, payload);

    // Step 2: Call backend API using centralized axios call wrapper
    const apiResponse: IAPIResponse<INewUser> = await callApi((): Promise<AxiosResponse<IAPIResponse<INewUser>>> =>
        api.post<IAPIResponse<INewUser>>(`/auth/register`, validatedPayload)
    );

    // Step 3: Check if API response success flag is true and extract data
    const user: INewUser = validateApiResponseSuccess(apiResponse);

    // Step 4: Validate the actual data payload matches expected schema
    const validatedUser: ILoginUserResponseSchema = validateApiResponseData(user, UserLoginResponseSchema);

    // Step 5: Return the validatedUser
    return validatedUser;
};

