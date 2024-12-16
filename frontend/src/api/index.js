import { postRequest } from "./requests";

export const auth = async (login, password) => {
    const res =  await postRequest({
        url: "/login",
        data: {
            username: login,
            password
        }
    });
    return res
}

export const register = async (login, password) => {
    const res =  await postRequest({
        url: "/sign_up",
        data: {
            username: login,
            password
        }
    });
    return res
}