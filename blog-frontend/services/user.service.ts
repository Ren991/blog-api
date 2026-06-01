import { api } from "./api";

export const getUserProfile = async (
    userId: number
) => {
    const response = await api.get(
        `/users/${userId}/profile`
    );

    return response.data;
};