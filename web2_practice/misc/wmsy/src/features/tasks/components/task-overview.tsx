import { Button } from "@/components/ui/button";
import { Task } from "@/schemas/types";
import { PencilIcon } from "lucide-react";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-update-task-modal";

interface TaskOverveiwProps {
    task: Task
}

export const TaskOverview = ({ task }: TaskOverveiwProps) => {

    const { open } = useEditTaskModal()

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted p-4  rounded-lg">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Overview
                    </p>
                    <Button onClick={() => open(task.$id)} size={'sm'} variant='secondary' className="">
                        <PencilIcon className="size-4 mr-2" /> Edit
                    </Button>
                </div>
                {/* <DottedSeparator className="my-4" /> */}
                <Separator className="my-4" />
                <div className="flex flex-col gap-y-4">
                    <OverviewProperty label="Assignee">
                        <MemberAvatar name={task.assignee.name} classname="size-6" />
                        <p className="text-sm font-medium">
                            {task.assignee.name}
                        </p>
                    </OverviewProperty>
                    <OverviewProperty label="Due Date">
                        <TaskDate value={task.dueDate} className="text-sm font-medium" />
                    </OverviewProperty>
                    <OverviewProperty label="Status">
                        <Badge variant={task.status}>
                            {snakeCaseToTitleCase(task.status)}
                        </Badge>
                    </OverviewProperty>
                </div>
            </div>
        </div>
    )
}