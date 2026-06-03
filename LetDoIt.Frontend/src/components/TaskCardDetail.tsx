import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit2, CheckCircle, Clock, Eye, EyeOff, Save, Check, RotateCcw } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { updateTask, type TaskResponse, type UpdateTaskRequest } from "../services/taskService";
import { getProjectMembers } from "../services/projectService";
import { useParams } from "react-router-dom";
import type { Column } from "../services/columnService";

// Helper component to dynamically render category icons from Lucide library
export const CategoryIcon = ({ iconName, size = 18, className = "" }: { iconName?: string; size?: number; className?: string }) => {
    if (!iconName) return <Icons.Folder size={size} className={className} />;

    // Format to PascalCase to match Lucide naming convention
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = (Icons as any)[formattedName] || (Icons as any)[iconName] || Icons.Folder;

    return <IconComponent size={size} className={className} />;
};

interface Props {
    task: TaskResponse;
    isOpen: boolean;
    onClose: () => void;
    columns: Column[];
}

const TaskCardDetail = ({ task, isOpen, onClose, columns }: Props) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: task.title || "",
        description: task.description || "",
        dueDate: "",
        dueTime: "",
        priority: String(task.priority || 2),
        visibility: task.visibility === 2 ? "2" : "1", // 1 = Private, 2 = Public
        assigneeId: task.assigneeId || "",
    });

    // Load task values into form data on open or task update
    useEffect(() => {
        if (task) {
            const taskDateObj = new Date(task.dueDate);
            const isUtc = !isNaN(taskDateObj.getTime());

            const localDate = isUtc
                ? taskDateObj.toLocaleDateString("sv-SE") // Swedish locale returns YYYY-MM-DD
                : "";
            const localTime = isUtc
                ? taskDateObj.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }) // HH:MM
                : "";

            setFormData({
                title: task.title,
                description: task.description || "",
                dueDate: localDate,
                dueTime: localTime,
                priority: String(task.priority),
                visibility: String(task.visibility || 1),
                assigneeId: task.assigneeId || "",
            });
        }
    }, [task, isOpen]);

    useEffect(() => {
        if (isOpen && projectId) {
            const fetchMembers = async () => {
                try {
                    setIsLoadingMembers(true);
                    const membersList = await getProjectMembers(projectId);
                    setMembers(membersList || []);
                } catch (error) {
                    console.error("Failed to load project members", error);
                } finally {
                    setIsLoadingMembers(false);
                }
            };
            fetchMembers();
        }
    }, [isOpen, projectId]);

    if (!isOpen) return null;

    // Determine Background Colors based on Priority
    const getBgColor = (priority: number) => {
        switch (priority) {
            case 1: return "bg-[#A2D2FF]"; // Low
            case 2: return "bg-[#FFF9A6]"; // Medium
            case 3: return "bg-[#FFD166]"; // High
            case 4: return "bg-[#FFADAD]"; // Urgent
            default: return "bg-gray-100";
        }
    };

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 1: return "Low";
            case 2: return "Medium";
            case 3: return "High";
            case 4: return "Urgent";
            default: return "Medium";
        }
    };

    const getPriorityBadgeColor = (priority: number) => {
        switch (priority) {
            case 1: return "bg-blue-100 text-blue-900 border-black";
            case 2: return "bg-yellow-100 text-yellow-900 border-black";
            case 3: return "bg-orange-100 text-orange-950 border-black";
            case 4: return "bg-red-100 text-red-900 border-black";
            default: return "bg-gray-100 text-gray-900 border-black";
        }
    };

    // Find Category info

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleCompletionStatus = async () => {
        try {
            setLoading(true);
            const newStatus = !task.isCompleted;
            await updateTask(task.taskId, {
                isCompleted: newStatus,
            });
            toast.success(newStatus ? "Task marked as Completed!" : "Task marked as Incomplete");
            window.dispatchEvent(new Event("taskUpdate")); // Dispatch event to refresh list
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update completion status");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Task Title is required");
            return;
        }

        try {
            setLoading(true);
            // Combine date and time
            const dateTimeString = formData.dueDate && formData.dueTime
                ? `${formData.dueDate}T${formData.dueTime}:00`
                : formData.dueDate
                    ? `${formData.dueDate}T23:59:59`
                    : new Date().toISOString();

            const updatedFields = {
                title: formData.title,
                description: formData.description,
                dueDate: new Date(dateTimeString).toISOString(),
                priority: parseInt(formData.priority),
                visibility: parseInt(formData.visibility),
                assigneeId: formData.assigneeId || null,
            } as UpdateTaskRequest;

            await updateTask(task.taskId, updatedFields);
            toast.success("Task updated successfully!");
            setIsEditing(false);
            window.dispatchEvent(new Event("taskCreated"));
        } catch (error) {
            console.error("Failed to update task", error);
            toast.error("Failed to update task details");
        } finally {
            setLoading(false);
        }
    };


    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={`relative w-full max-w-xl ${getBgColor(isEditing ? parseInt(formData.priority) : task.priority)} text-black rounded-3xl p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 scale-100 z-10`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-transform active:scale-95 border-2 border-black bg-white rounded-full p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {isEditing ? (
                    /* EDIT MODE FORM */
                    <form onSubmit={handleSave} className="space-y-4 pt-2">
                        <h3 className="font-cherry text-3xl mb-4 text-gray-900">Edit Task</h3>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-black mb-1">Task Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none focus:bg-white bg-white/70"
                                placeholder="Title..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-black mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none focus:bg-white bg-white/70 resize-none"
                                placeholder="Description..."
                            />
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-black mb-1">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none bg-white/70 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black mb-1">Due Time</label>
                                <input
                                    type="time"
                                    name="dueTime"
                                    value={formData.dueTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none bg-white/70 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Priority & Category Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-black mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none bg-white/70 focus:bg-white"
                                >
                                    <option value="1">Low</option>
                                    <option value="2">Medium</option>
                                    <option value="3">High</option>
                                    <option value="4">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-black mb-1">Assignee</label>
                                <select
                                    name="assigneeId"
                                    value={formData.assigneeId}
                                    onChange={handleInputChange}
                                    disabled={isLoadingMembers}
                                    className="w-full px-3 py-2 rounded-xl border-2 border-black outline-none bg-white/70 focus:bg-white disabled:opacity-50"
                                >
                                    <option value="">Unassigned</option>
                                    {Array.isArray(members) && members.map((member) => (
                                        <option key={member.userId} value={member.userId}>
                                            {member.username} ({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Visibility Settings */}
                        <div>
                            <label className="block text-sm font-black mb-1">Visibility</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 font-bold cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="1"
                                        checked={formData.visibility === "1"}
                                        onChange={handleInputChange}
                                        className="accent-black w-4 h-4 cursor-pointer"
                                    />
                                    <span>Private</span>
                                </label>
                                <label className="flex items-center gap-2 font-bold cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="2"
                                        checked={formData.visibility === "2"}
                                        onChange={handleInputChange}
                                        className="accent-black w-4 h-4 cursor-pointer"
                                    />
                                    <span>Public</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black/10">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-white border-2 border-black text-black px-4 py-2 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#E8FF46] border-2 border-black text-black px-5 py-2 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    /* VIEW MODE DETAILED VIEW */
                    <div className="space-y-6 pt-2">
                        {/* Header badges */}
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Priority badge */}
                            <span className={`text-xs px-3 py-1 font-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider ${getPriorityBadgeColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)} Priority
                            </span>

                            {/* Status Badge */}
                            <span className={`text-xs px-3 py-1 font-bold rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 ${task.isCompleted ? 'bg-[#548e76] text-white' : 'bg-white'}`}>
                                {task.isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
                                {task.isCompleted ? "Completed" : columns.find((c) => c.columnId === task.columnId)?.title}
                            </span>

                            {/* Visibility Badge */}
                            <span className="text-xs px-3 py-1 font-bold rounded-full border-2 border-black bg-white/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                                {task.visibility === 2 ? <Eye size={14} /> : <EyeOff size={14} />}
                                {task.visibility === 2 ? "Public" : "Private"}
                            </span>
                        </div>

                        {/* Task Title */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none mb-1 wrap-break-words">
                                {task.title}
                            </h2>
                            {task.dueDate && (
                                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mt-2">
                                    <Clock size={16} />
                                    Deadline: <span className="underline">{new Date(task.dueDate).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short"
                                    })}</span>
                                </p>
                            )}
                            {task.assigneeId && (
                                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mt-2">
                                    <Icons.User size={16} />
                                    Assignee: <span className="underline">{task.assigneeName || 'Unknown'}</span>
                                </p>
                            )}
                        </div>

                        {/* Description Box */}
                        <div className="bg-white/50 border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-25 flex flex-col justify-between">
                            <div>
                                <h4 className="text-xs font-black uppercase text-gray-600 tracking-wider mb-2">Description</h4>
                                <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                                    {task.description || "No description provided for this task."}
                                </p>
                            </div>
                        </div>

                        {/* Control Panel Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-black/10">
                            <div className="flex gap-2">
                                {/* Complete / Reopen Button */}
                                <button
                                    onClick={toggleCompletionStatus}
                                    disabled={loading}
                                    className={`border-2 border-black px-4 py-2 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 ${task.isCompleted ? 'bg-[#ffc66d]' : 'bg-[#76c893] text-black'}`}
                                >
                                    {task.isCompleted ? (
                                        <>
                                            <RotateCcw size={16} />
                                            Mark Incomplete
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Complete Task
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                {/* Edit Button */}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white border-2 border-black text-black px-4 py-2 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
                                >
                                    <Edit2 size={16} />
                                    Edit Task
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default TaskCardDetail;
