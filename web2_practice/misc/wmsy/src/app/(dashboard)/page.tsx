
import {getCurrent} from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import {redirect} from "next/navigation";
import { Models } from "node-appwrite";

export const dynamic = 'force-dynamic';


export default async function Home() {

  const currentUser = await getCurrent()
  
  if (!currentUser) {
    redirect('/sign-in')
  }

   // Type assertion to handle the potential return types
   const workspaces = await getWorkspaces() as Models.DocumentList<Models.Document>;

   // Ensure workspaces exists and has documents
   if (!workspaces || workspaces.total === 0) {
     redirect('/workspaces/create')
   }
 
   // Safe navigation with type guard
   if (workspaces.documents && workspaces.documents.length > 0) {
     redirect(`/workspaces/${workspaces.documents[0].$id}`)
   }

  redirect(`/workspaces/${workspaces?.documents[0].$id}`)
  

  return(
      <div>
        Homepage
      </div>
  )
}
