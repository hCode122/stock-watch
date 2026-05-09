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
import { useSignUp } from '@/hooks/useSignUp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGetStockCalcData } from '@/hooks/useGetStockCalcData';

const formSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Doesn't match a valid email format"),
        password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        ,
        confirmPassword: z.string(),
        rememberMe: z.boolean()
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type formSchemaType = z.infer<typeof formSchema>

const SignUpForm = () => {
 
    const [stage, setStage] = useState(1); 
    const router = useRouter()
    const {calcData, calcLoading, calcError} = useGetStockCalcData()
    
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            rememberMe: false
        }
    })

    const watchUsername = form.watch("username");
    const watchEmail = form.watch("email");
    const watchPw = form.watch('password')
    const watchConf = form.watch('confirmPassword')

    const isStage1Valid = watchUsername?.length >= 3 && 
          watchEmail?.includes('@'); 

    const isStage2Valid = watchPw?.length >= 8 &&  
          watchConf == watchPw; 

    async function onSubmit(data: formSchemaType) {
        const resp = await useSignUp(data)
         if (resp.success) {
            console.log('Signup successful:', resp.data);
            toast.success("Account created successfully! Please log in.");
            router.push('/sign-in');
        } else {
            console.log('Signup failed:', resp.error);
            toast.error(resp.error || "Signup failed. Please try again.");
        }
    }

    const handleNext = async () => {
        const isValid = await form.trigger(['username', 'email']);
        if (isValid) {
            setStage(2);
        }
    }

    const handleBack = () => {
        setStage(1);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-md mx-auto'>
           {stage === 1 && (
                <>
                    <StageOne form={form} />
                    <Field className='mt-6'>
                        <Button 
                            type="button" 
                            onClick={handleNext}
                            className='w-full bg-special cursor-pointer hover:bg-blue-500'
                            disabled={!isStage1Valid}
                        >
                            Next
                        </Button>
                    </Field>
                </>
            )}
            
            {stage === 2 && (
                <>
                    <StageTwo form={form} />
                    
                    <div className='flex gap-3 mt-6'>
                        <Button 
                            type="button" 
                            onClick={handleBack}
                            className='flex-1 bg-gray-500 cursor-pointer hover:bg-gray-600'
                        >
                            Back
                        </Button>
                        <Button 
                            type="submit" 
                            className='flex-1 bg-special cursor-pointer hover:bg-blue-500'
                            disabled={!isStage2Valid}
                        >
                            Sign Up
                        </Button>
                    </div>
                </>
            )}
        </form>
    )
}

const StageOne = ({form} : {form : UseFormReturn<formSchemaType>}) => {

    return (
         <FieldGroup className='space-y-4'>
            <Controller 
                name="username"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel className='text-[0.8rem] text-white' htmlFor='form-username'>
                            Username
                        </FieldLabel>
                        <Input {...field} className='h-9 w-full text-white' id="form-username" aria-invalid={fieldState.invalid} />
                        <div className='h-5'>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </div>
                    </Field>
                )}    
            />
            <Controller 
                name="email"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel className='text-[0.8rem] text-white' htmlFor='form-email'>
                            Email address
                        </FieldLabel>
                        <Input {...field} className='h-9 w-full text-white' id="form-email" aria-invalid={fieldState.invalid} placeholder="email@company.com" />
                        <div className='h-5'>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </div>
                    </Field>
                )}    
            />
        </FieldGroup>
    )
}

const StageTwo = ({form} : {form : UseFormReturn<formSchemaType>}) => {
    const [passwordVisible, setVisible] = useState(false)
    const [passwordConfirmVisible, setConfirmVisible] = useState(false)

    return (
        <FieldGroup className='space-y-4'>
            <Controller 
                name="password"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel className='text-[0.8rem] text-white' htmlFor='form-password'>
                            Password
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                type={passwordVisible ? "text" : "password"}
                                className="pr-10 h-9 w-full text-white"
                                id="form-password"
                            />
                            <button
                                type="button"
                                onClick={() => setVisible(!passwordVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted p-1 rounded-md"
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
            <Controller 
                name="confirmPassword"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel className='text-[0.8rem] text-white' htmlFor='form-confirm'>
                            Confirm Password
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                {...field}
                                type={passwordConfirmVisible ? "text" : "password"}
                                className="pr-10 h-9 w-full text-white"
                                id="form-confirm"
                            />
                            <button
                                type="button"
                                onClick={() => setConfirmVisible(!passwordConfirmVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted p-1 rounded-md"
                                tabIndex={-1}
                            >
                                {passwordConfirmVisible ? (
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
        </FieldGroup>
    )
}

export default SignUpForm