import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigDown, Plus } from "lucide-react";
import { Flex } from "antd";
import { Pagination } from "antd";

import CreateProjectModal from "../components/CreateProject";
import { getProjectsByUserId, type Project } from "../services/projectService";
import { getCurrentUserId, isAuthenticated } from "../services/authService";
import { toast } from "react-toastify";
import ProjectContainer from "../components/ProjectContainer";

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
  });
  const [totalProjects, setTotalProjects] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      // Check authentication
      if (!isAuthenticated()) {
        console.warn("User is not authenticated");
        navigate("/login");
        return;
      }

      const userId = getCurrentUserId();
      console.log("Current userId:", userId);

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        navigate("/login");
        return;
      }

      const { projects, totalCount } = await getProjectsByUserId(
        userId,
        pagination.current,
        pagination.pageSize,
      );
      console.log(" Fetched projects response:", { projects, totalCount }); // Debug
      setProjects(projects || []);
      setTotalProjects(totalCount || 0);
      console.log(" State updated with", projects?.length || 0, "projects"); // Debug
    } catch (error) {
      console.error("Error while fetching projects:", error);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    // Listen for project creation event
    const handleProjectCreated = () => {
      fetchProjects();
    };

    window.addEventListener("projectCreated", handleProjectCreated);
    return () => {
      window.removeEventListener("projectCreated", handleProjectCreated);
    };
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 md:px-0">
      <h1 className="text-3xl md:text-5xl font-bold text-center mt-4 text-blue-400">
        Welcome to <br />
      </h1>
      <h2 className="font-bold text-2xl md:text-4xl mt-2 text-black text-center">
        Let's{" "}
        <span className="bg-[#eff759] text-black px-2 rounded-md">DoIt</span>
      </h2>
      <p className="text-center mt-4 text-base md:text-lg">
        Your ultimate task management solution. Organize, prioritize, and
        conquer your to-do list with ease.
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-xl flex items-center justify-center gap-2 mt-8 px-4 md:px-6 py-4 md:py-10 bg-green-600 text-white rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black w-full max-w-70 md:max-w-md mx-auto"
      >
        <Plus size={24} />
        <span className="md:text-lg lg:text-2xl">Create Your Project</span>
      </button>
      <span className="block w-[80%] max-w-3xl h-1 bg-black mt-8 md:mt-10 mx-auto rounded-full" />

      <div
        className="max-w-6xl mx-auto border-dashed border-2 border-gray-400 rounded-lg p-4 md:p-6 my-8 md:mt-10 min-h-48 md:min-h-64"
        id="projects-container"
      >
        {" "}
        {/* Header Row: Gom title và pagination lại một chỗ cho gọn gàng */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <span className="bg-[#48b979] text-black font-semibold px-3 py-1 rounded-md text-xs uppercase tracking-wider shadow-[1px_8px_8px_1px_rgba(200,200,200,1)] ">
              Live
            </span>
            <h2 className="text-2xl text-black tracking-tight">
              Your Projects <ArrowBigDown className="inline-block" />
            </h2>
          </div>

          <div>
            <Flex justify="end">
              <Pagination
                size="large"
                className="custom-pagination" // Có thể thêm class để custom màu nút bấm nếu muốn
                style={{ fontSize: 16 }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={totalProjects}
                showSizeChanger={false}
                onChange={(page, pageSize) =>
                  setPagination({ ...pagination, current: page, pageSize })
                }
              />
            </Flex>
          </div>
        </div>
        {/* Grid danh sách Project */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {projects.map((project) => (
              <ProjectContainer
                key={project.projectId}
                projectId={project.projectId}
                title={project.title}
                createdAt={project.createdAt}
                numberOfMembers={project.numberOfMembers || 1}
                authorName={project.authorName}
                onUpdate={fetchProjects}
                onOpen={(id) => navigate(`/project/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
            <h3 className="text-xl text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              Your projects will appear here. Click the button above to start
              organizing your workspace.
            </h3>
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default Home;
