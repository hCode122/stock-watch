'use client'
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Field, FieldGroup, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useSignIn } from '@/hooks/useSignIn';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authorize } from '@/state/slices/authSlice';
import { useDispatch } from 'react-redux';


const formSchema = z.object({
        email: z.string().email("Doesn't match a valid email format"),
        password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        ,
        rememberMe: z.boolean()
    })

type formSchemaType = z.infer<typeof formSchema>

const SigninForm = () => {
    const router = useRouter()
    const [passwordVisible, setVisible] = useState(false)

    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    })

    const watchEmail = form.watch("email");
    const watchPw = form.watch('password')

    const isStage1Valid = watchEmail?.includes('@') && watchPw?.length >= 8; 

    const dispatch = useDispatch()

    async function onSubmit(data: formSchemaType) {
        const resp = await useSignIn(data)
        if (resp.success) {
            toast.success("Logged in successfully! Redirecting to dashboard.");
            dispatch(authorize({
                user: resp.data.data.user,
                token: resp.data.data.token
            }))
            router.push('/dashboard');
        } else {
            toast.error(resp.error || "Signup failed. Please try again.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
            <FieldGroup className='space-y-4'>
                <Controller 
                    name="email"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel className='text-[0.8rem] text-white' htmlFor='form-email'>
                                Email address
                            </FieldLabel>
                            <Input {...field} className='h-8 w-full text-white border-background' id="form-email" aria-invalid={fieldState.invalid} placeholder="email@company.com" />
                            <div className='h-5'>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </div>
                        </Field>
                    )}    
                />
                
                <Controller 
                    name="password"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel className='text-[0.8rem] text-white ' htmlFor='form-password'>
                                Password
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={passwordVisible ? "text" : "password"}
                                    className="pr-10 h-8 w-full text-white border-background"
                                    id="form-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setVisible(!passwordVisible)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-300 p-1 rounded-md"
                                    tabIndex={-1}
                                >
                                    {passwordVisible ? (
                                        <Eye className="h-4 w-4 text-special" />
                                    ) : (
                                        <EyeClosed className="h-4 w-4 text-special" />
                                    )}
                                </button>
                            </div>
                            <div className='h-5'>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </div>
                        </Field>
                    )}    
                />
                
                
                
                <Field className='mt-6'>
                    <Button 
                        type="submit" 
                        className='w-full bg-special cursor-pointer hover:bg-blue-500'
                        disabled={!isStage1Valid}
                    >
                        Sign In
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default SigninForm