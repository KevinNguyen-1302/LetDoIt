import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectsByUserId } from "../services/projectService";
import { getCurrentUserId } from "../services/authService";
import KanbanBoard from "../components/KanbanBoard";

const KanbanPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState<string>("");

  useEffect(() => {
    if (!projectId) {
      navigate("/home");
      return;
    }

    // Fetch project title for display in KanbanBoard header
    const fetchProjectTitle = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) return;
        const { projects } = await getProjectsByUserId(userId, 1, 100);
        const found = projects?.find((p) => p.projectId === projectId);
        if (found) setProjectTitle(found.title);
      } catch {
        // Non-critical: title will fallback to "Project Board"
      }
    };

    fetchProjectTitle();
  }, [projectId, navigate]);

  if (!projectId) return null;

  return <KanbanBoard projectId={projectId} projectTitle={projectTitle} />;
};

export default KanbanPage;
