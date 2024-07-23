import { API } from '.';

export interface ITask {
  title: string;
  description: string;
  status: string;
  due_date: string;
  id?: string;
}

export const getTasks = async (pageNumber: number): Promise<any> => {
  const res = await API.get(`tasks?page=${pageNumber}`);
  return res;
};

export const deleteTasks = async (task_id: string): Promise<any> => {
  const res = await API.delete(`tasks/${task_id}`);
  return res;
};

export const createTasks = async (payload: ITask): Promise<any> => {
  return API.post('tasks', payload);
};

export const updateTask = async (payload: ITask): Promise<any> => {
  return API.put(`tasks/${payload.id}`, payload);
};

export const getTaskById = async (id: string): Promise<any> => {
  const res = await API.get(`tasks/${id}`);
  return res;
};
