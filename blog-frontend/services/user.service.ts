import { api } from "./api";

export const getUserProfile = async (
    userId: number
) => {
    const response = await api.get(
        `/users/${userId}/profile`
    );

    return response.data;
};

export const uploadAvatar = async (
    file: File
) => {
    const formData = new FormData();

    formData.append(
        "avatar",
        file
    );

    const res = await api.post(
        "/user/avatar",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return res.data;
};