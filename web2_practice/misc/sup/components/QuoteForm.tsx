import React, {useActionState} from 'react'
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import MDEditor from '@uiw/react-md-editor'
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {formSchema} from "@/lib/validation";
import {z} from "zod";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {createPitch} from "@/lib/actions";

const QuoteForm = () => {

    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [pitch, setPitch] = React.useState('')
    const {toast} = useToast()
    const router = useRouter()

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch
            }

            await formSchema.parseAsync(formValues)

            console.log(formValues)

            const result = await createPitch(prevState, formData, pitch)
            if (result.status === "SUCCESS") {
                toast({
                    title: 'Success',
                    description: 'Your idea is live.',
                    variant: 'default',
                })

            router.push(`/quote/${result._id}`)

            }
            return result

            console.log(result)

        } catch (e) {
            if (e instanceof z.ZodError) {
                const fieldErrors = e.flatten().fieldErrors

                setErrors(fieldErrors as unknown as Record<string, string>)

                toast({
                    title: 'Error',
                    description: 'Please check your input and try again',
                    variant: 'destructive',
                })

                return {
                    ...prevState, error: 'Validation failed', status: "ERROR"
                }
            }

            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
            })
            console.log('error is', e)
            return {
                ...prevState,
                error: 'Something went wrong',
                status: "ERROR"
            }
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL"
    })

    return (
        <form action={formAction} className={'startup-form '}>
            <div>
                <label htmlFor={'title'} className={'startup-form_label'}>
                    Title
                </label>
                <Input id={'title'} name={'title'} className={'startup-form_input'} placeholder={'Insight'}
                       required={true}/>
                {errors.title && <p className={'startup-form_error'}>{errors.title}</p>}
            </div>
            <div>
                <label htmlFor={'description'} className={'startup-form_label'}>
                    Description
                </label>
                <Textarea id={'description'} name={'description'} className={'startup-form_textarea'}
                          placeholder={'Elaborate your idea'}
                          required={true}/>
                {errors.description && <p className={'startup-form_error'}>{errors.description}</p>}
            </div>
            <div>
                <label htmlFor={'category'} className={'startup-form_label'}>
                    Category
                </label>
                <Input id={'category'} name={'category'} className={'startup-form_input'}
                       placeholder={'Category (Sankhya, Non-Duality, Duality, Budhha, Existentialism...)'}
                       required={true}/>
                {errors.category && <p className={'startup-form_error'}>{errors.category}</p>}
            </div>
            <div>
                <label htmlFor={'link'} className={'startup-form_label'}>
                    Image Link
                </label>
                <Input id={'link'} name={'link'} className={'startup-form_input'} placeholder={'Insight Image URL'}
                       required={true}/>
                {errors.link && <p className={'startup-form_error'}>{errors.link}</p>}
            </div>
            <div data-color-mode={'light'}>
                <label htmlFor={'pitch'} className={'startup-form_label'}>
                    Pitch
                </label>
                <MDEditor id={'pitch'} style={{borderRadius: 20, overflow: 'hidden'}} textareaProps={{
                    placeholder: 'Briefly explain your views and implementation'
                }} previewOptions={{
                    disallowedElements: ['style']
                }} value={pitch} onChange={(value) => setPitch(value as string)} height={'300px'}/>
                {errors.pitch && <p className={'startup-form_error'}>{errors.pitch}</p>}
            </div>
            <Button type={'submit'} className={'startup-form_btn text-white'} disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit your idea'}
                <Send className={'size-5 ml-1'} />
            </Button>
        </form>
    )
}
export default QuoteForm
