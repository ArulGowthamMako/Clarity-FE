import axios, { AxiosResponse } from "axios";
import store from "../store";

export const baseUrl = process.env.REACT_APP_API_URL;

export const API = {
  get: async <R>(url: string, params?: Record<string, any>): Promise<R> => {
    const res: AxiosResponse<R> = await axios.get(`${baseUrl}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${store.getState()?.auth?.token}`,
      },
    });
    return res.data;
  },

  post: async <R, D>(url: string, data: D): Promise<R> => {
    const res: AxiosResponse<R> = await axios.post(`${baseUrl}${url}`, data, {
      headers: {
        Authorization: `Bearer ${store.getState()?.auth?.token}`,
      },
    });
    return res.data;
  },

  put: async <R, D>(url: string, data: D): Promise<R> => {
    const res: AxiosResponse<R> = await axios.put(`${baseUrl}${url}`, data, {
      headers: {
        Authorization: `Bearer ${store.getState()?.auth?.token}`,
      },
    });
    return res.data;
  },

  delete: async <R>(url: string): Promise<R> => {
    const res: AxiosResponse<R> = await axios.delete(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${store.getState()?.auth?.token}`,
      },
    });
    return res.data;
  },
};
