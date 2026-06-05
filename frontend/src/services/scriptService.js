import api from "./api";

export const uploadScript = async(FormData) => {
    const response = await api.post(
        "/upload",
        FormData
    );

    return response.data;
};
 