'use client'

import React from 'react';
import {useCurrentRole} from "@/hooks/use-current-role";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RoleGate} from "@/components/auth/role-gate";
import {FormSuccess} from "@/components/form-success";
import {UserRole} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {admin} from "@/actions/admin";
// import {currentRole} from "@/lib/auth";

function Page() {

    const onServerActionClick = () =>{
        admin()
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                } else {
                    toast.success(data.success)
                }
            })
    }

    const onApiRouteClick = () => {
        fetch('/api/admin')
            .then((res) => {
                if (!res.ok) {
                    toast.error('Not allowed')
                } else
                toast.success('You ok')
            })
    }

    // const role = await currentRole();
    const role = useCurrentRole()

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className={'text-2xl font-semibold text-center'}>🔑 Admin</p>
            </CardHeader>
            <CardContent className={'space-y-4'}>
                <RoleGate allowedRole={UserRole.USER}>
                    <FormSuccess message={'you are allowed for this'} />
                </RoleGate>
                <div className={'flex flex-row items-center justify-between rounded-lg border p-3 shadow-lg'}>
                    <p className={'text-sm font-medium'}>

                    Admin only Api route
                    </p>
                    <Button onClick={onApiRouteClick}>Test</Button>
                </div>

                <div className={'flex flex-row items-center justify-between rounded-lg border p-3 shadow-lg'}>
                    <p className={'text-sm font-medium'}>
                        Admin only Server Action
                    </p>
                    <Button onClick={onServerActionClick}>Test</Button>
                </div>
            </CardContent>
            Role: {role}
        </Card>
    );
}

export default Page;