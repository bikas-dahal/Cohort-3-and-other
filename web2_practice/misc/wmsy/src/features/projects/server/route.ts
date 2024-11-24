import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMembers } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { MemberRole } from "@/schemas/memberTypes";
import { createProjectSchema, updateProjectSchema } from "@/schemas/projectSchema";
import { Project } from "@/schemas/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

const app = new Hono()
    .delete(
        '/:projectId',
        sessionMiddleware,
        async (c) => {
            const databases = c.get('databases')
            const user = c.get('user')

            const { projectId } = c.req.param()

            const existingProject = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )

            const member = await getMembers({ databases, workspaceId: existingProject.workspaceId, userId: user.$id })

            if (!member) {
                return c.json({ error: 'You are not authorized to delete this workspace' }, 401)
            }
            await databases.deleteDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )
            return c.json({ data: {$id: projectId} })
        }
    )                                   
    .patch(
        '/:projectId',
        sessionMiddleware,
        zValidator('form', updateProjectSchema),
        async (c) => {
            const databases = c.get('databases')
            const storage = c.get('storage')
            const user = c.get('user')

            const { projectId } = c.req.param()
            const { name, image } = c.req.valid('form')

            const existingProject = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            )

            const member = await getMembers({ databases, workspaceId: existingProject.workspaceId, userId: user.$id })

            if (!member ) {
                return c.json({ error: 'You are not authorized to update this workspace' }, 401)
            }

            let uploadedImageUrl: string | undefined

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )
                
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                )

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`

            } else {
                uploadedImageUrl = image!
            }

            const project = await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId,
                {
                    name,
                    image: uploadedImageUrl
                }
            )

            return c.json({ data: project })

        }
    )
    .post(
        '/',
        sessionMiddleware,
        zValidator('form', createProjectSchema),
        async (c) => {
            const databases = c.get('databases')
            const user = c.get('user')
            const storage = c.get('storage')

            const { name, image, workspaceId } = c.req.valid('form')

            const member = getMembers({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                return c.json({
                    error: 'Unauthorized'
                }, 401)
            }

            let uploadedImageUrl: string | undefined

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )
                
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                )

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`

            } 

            const project = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                {
                    name,
                    image: uploadedImageUrl,
                    workspaceId
                }
            )

            return c.json({ data: project})
        }
    )
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({
            workspaceId: z.string()
        })),
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const { workspaceId } = c.req.valid('query')

            if (!workspaceId) { 
                return c.json({
                    error: 'Missing workspaceId'
                }, 400)
            }

            const member = await getMembers({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                c.json({
                    error: 'Unauthorized'
                }, 401)
            }

            const projects = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_ID,
                [
                    Query.equal('workspaceId', workspaceId),
                    Query.orderDesc('$createdAt')
                ]
            )

            return c.json({
                data: projects
            })
        }
    )

export default app;