import { Card, CardContent } from "@/components/ui/card"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { Loader } from "lucide-react"
// import { CreateTaskForm } from "./create-task-form"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetTask } from "../api/use-get-task"
import { EditTaskForm } from "./edit-task-form"

interface EditTaskFormWrapperProps {
    onCancel: () => void 
    id: string
}

export const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()

    const { data: initialValues, isLoading: isLoadingTask } = useGetTask({ taskId: id })

    const { data: projects, isLoading: isLoadingProject } = useGetProjects({ workspaceId })
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        image: project.image
    }))

    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
        // image: member.image
    }))

    const isLoading = isLoadingMembers || isLoadingProject || isLoadingTask

    if (isLoading) {
        return (
            <Card className="w-full h-[714px]">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-4 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (!initialValues) {
        return null
    }

    return (
        <EditTaskForm initialValues={initialValues} onCancel={() => onCancel()} memberOptions={memberOptions ?? []} projectOptions={projectOptions ?? []} />
    )
}