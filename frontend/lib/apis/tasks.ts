import { api, getToken } from "../utils/base"

export const createTask = async(payload:any) =>{
    const token = getToken()
    const res = await api.post('/tasks/create',
        payload,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

export const getTasks = async() =>{
    const token = getToken()
    const res = api.get('/tasks/all-tasks',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

export const getTasksbyRange = async(range:String) =>{
    const token = getToken()
    const res = api.get(`/tasks/all-tasks-range?range=${range}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

export const deleteTask = async(id: String) =>{
    const token = getToken()
    const res = api.delete(`/tasks/delete-task/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

export const getTaskbyId = async(id: String) =>{
    const token = getToken()
    const res = api.get(`/tasks/get-task/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}

export const editTask = async(id:any,payload:any) =>{
    const token = getToken()
    const res = await api.put(`/tasks/edit-task/${id}`,
        payload,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res
}