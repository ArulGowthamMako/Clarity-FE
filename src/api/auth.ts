import { API } from './index';

export interface ILoginForm {
  email: string;
  password: string;
}

export const loginUser = async (payload: ILoginForm): Promise<any> => {
  return API.post('login', payload);
};
