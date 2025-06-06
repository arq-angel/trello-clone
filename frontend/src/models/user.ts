export type Role = 'user' | 'admin';

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserShort {
    id: string;
    name: string;
    email: string;
}

export interface INewUser extends IUserShort {
    user: IUser;
    token: string;
}