import api from "./api";

export interface Project {
  title: string;
  projectId: string;
  createdAt: string;
  role: string;
  numberOfMembers?: number;
  authorName?: string;
}

export interface CreateProjectRequest {
  title: string;
}

export const createProject = async (request: CreateProjectRequest) => {
  const response = await api.post<any>(`/Project/CreateProject`, request);
  // Response được wrap bởi middleware: { result, error, message, data: Project }
  return response.data?.data;
};

export const getProjectsByUserId = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
) => {
  const response = await api.get<any>(
    `/Project/GetProjectsByUserId/${userId}`,
    {
      params: { pageNumber, pageSize, searchTerm },
    },
  );
  console.log("📦 API Response:", response.data); // Debug response
  const responseData = response.data?.data || {};
  console.log("🔍 Response data structure:", responseData); // Debug structure

  const data = responseData.data || responseData.Data || [];
  const totalCount = responseData.totalCount || responseData.TotalCount || 0;

  console.log("✅ Extracted projects:", { count: data.length, totalCount }); // Debug
  console.log("Member of project:", data[0]?.MemberCount);
  return { projects: data, totalCount };
};

export const updateProject = async (projectId: string, title: string) => {
  const response = await api.put<any>(`/Project/UpdateProject/${projectId}`, {
    title,
  });
  return response.data?.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete<any>(`/Project/DeleteProject/${projectId}`);
  return response.data?.data;
};

export const changeProjectAuthor = async (
  projectId: string,
  newAuthorId: string,
) => {
  const response = await api.put<any>(
    `/Project/ChangeProjectAuthor/${projectId}`,
    newAuthorId,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data?.data;
};

export const getProjectsByUserIdWithDapper = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
) => {
  const response = await api.get<any>(
    `/Project/GetProjectsByUserIdWithDapper`,
    {
      params: { userId, pageNumber, pageSize, searchTerm },
    },
  );
  return response.data?.data;
};

export const getProjectMembers = async (projectId: string) => {
  const response = await api.get<any>(
    `/project/GetProjectMembers/${projectId}`,
  );
  return response.data?.data;
};

export const addMemberToProject = async (
  projectId: string,
  memberId: string,
) => {
  const response = await api.post<any>(
    `/Project/AddMemberToProject/${projectId}/members/${memberId}`,
  );
  return response.data?.data;
};

export const removeMemberFromProject = async (
  projectId: string,
  memberId: string,
) => {
  const response = await api.delete<any>(
    `/Project/RemoveMemberFromProject/${projectId}/${memberId}`,
  );
  return response.data?.data;
};
