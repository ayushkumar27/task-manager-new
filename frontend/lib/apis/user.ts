import { api } from "../utils/base"

export const RegisterUser = async(payload:any) =>{
    const res = await api.post('/register',{
        payload
    })
    return res
}

export const loginUser = async(email: String,password: String) =>{
    const res = await api.post('/login',
        {email,password}
    )
    return res
}