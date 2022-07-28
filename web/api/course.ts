import axios, { AxiosResponse } from "axios";

const CourseAPI = {
  me: (): Promise<AxiosResponse> => axios.get(`/api/current-user`),
  login: (data: any): Promise<AxiosResponse> => axios.post(`/api/login`, data),
  register: (data: any): Promise<AxiosResponse> =>
    axios.post("/api/register", data),
  logout: (): Promise<AxiosResponse> => axios.get(`/api/logout`),
  requestPasswordChangesVerificationCode: (data: any): Promise<AxiosResponse> =>
    axios.post(`/api/forgot-password`, data),
  requestPasswordChanges: (data: any): Promise<AxiosResponse> =>
    axios.post(`/api/reset-password`, data),
  requestToBeInstructor: (): Promise<AxiosResponse> =>
    axios.post(`/api/make-instructor`),
};

export default CourseAPI;
