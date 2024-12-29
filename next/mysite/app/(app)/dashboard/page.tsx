'use client'

import { useCallback, useEffect, useState } from "react";
import { Message } from '@/models/userModel';
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/signUpSchema";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const { toast } = useToast();
    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/accept_messages`);
            setValue('acceptMessages', response.data.isAcceptingMessage);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Error fetching message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/get_messages`);
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: 'Refreshed messages',
                    description: 'Showing latest messages',
                });
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Error fetching messages',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (session?.user) {
            fetchMessages();
            fetchAcceptMessages();
        }
    }, [session?.user, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('api/accept_messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message ?? 'Success',
                variant: 'default',
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Error toggling message settings',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "URL Copied.",
            description: 'Profile url copied to clipboard',
        });
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen bg-gray-50">Loading...</div>;
    }

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
                No available message, Please <Link href='/login' className="text-blue-500 hover:underline ml-1">Login</Link>.
            </div>
        );
    }

    const { username } = session.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6">User Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-medium mb-4">Copy your unique link</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <Button onClick={() => copyToClipboard(profileUrl)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Copy
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="text-gray-700">Accept Messages: {acceptMessages ? 'On' : 'Off'}</span>
            </div>

            <Separator className="my-6" />

            <Button
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
                {isLoading ? (
                    <Loader2 className='animate-spin' />
                ) : (
                    <RefreshCcw />
                )}
                <span>Refresh Messages</span>
            </Button>

            <div className="mt-8">
                {messages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {messages.map((message) => (
                            <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No messages to display</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
