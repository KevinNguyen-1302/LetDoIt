import api from "./api";


export interface Project {
  title: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface CreateProjectRequest {
    title: string;
}


export const createProject = async (request: CreateProjectRequest) => {
  const response = await api.post<any>(`/Project/CreateProject`, request);
  // Response được wrap bởi middleware: { result, error, message, data: Project }
  return response.data?.data;
};


