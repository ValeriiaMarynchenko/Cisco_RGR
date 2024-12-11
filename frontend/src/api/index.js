import { postRequest } from "./requests";

export const auth = async (login, password) => {
    const res =  await postRequest(login, password);
    return res
}

export const register = async (login, password, repeatPassword) => {
    const respons = await postRequest(login, password, repeatPassword)
    return respons
}