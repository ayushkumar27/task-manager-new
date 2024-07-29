import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://task-manager-new-lpbv.onrender.com'
})

export const getItemLocalStorage = (item:any, dataType?: any) =>{
    if(dataType)
        return dataType(localStorage.getItem(item))
    return String(localStorage.getItem(item))
}

export const getToken = () =>{
    return getItemLocalStorage('token')
}
