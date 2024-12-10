import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]['$delete']>


export const useDeleteTask = () => {


    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.tasks[':taskId']['$delete']({param})

            if (!response.ok) {
                throw new Error('Failed to delete task')
            }

            return await response.json() 
        },
        onSuccess: ({ data }) => {
            toast.success('Task deleted successfully')
            // router.refresh()
            queryClient.invalidateQueries({
                queryKey: ['tasks']
            })
            queryClient.invalidateQueries({
                queryKey: ['tasks', data.$id]
            })
        },
        onError: () => {
            toast.error('Failed to delete task')
        }
    })

    return mutation
}
