import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { IUserCredentials } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import { signInServerFunc } from './signInServerFunc'

const Form = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserCredentials>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const onSubmit: SubmitHandler<IUserCredentials> = async (data) => {
        setSendingForm(true)
        const res = await signInServerFunc(data)
        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Inicio se sesion || " + appName,
                description: res.message,
            })
        }
        //Don't redirect becouse if there is not error the signIn function from Auth.js redirect the user efter sign in it's correct
        setSendingForm(false)
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
                <Label htmlFor="email" className='text-white'>Usuario</Label>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Ejemplo: jondoe"
                        className={`${errors.username ? "dark:focus:border-red-500" : "dark:focus:border-indigo-600"} pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                        {...register("username", {
                            required: true
                        })}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className='text-white'>Contrase&ntilde;a</Label>
                <div className="relative">
                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...register("password", {
                            required: true
                        })}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className='dark:border-slate-100'
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">Recordarme</Label>
                </div>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-300 hover:underline">Olvid&oacute; su contrase&ntilde;a?</a>
            </div>
            <Button type="submit" className="w-full group" disabled={sendingForm}>
                {
                    sendingForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                Iniciar
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </form>
    )
}

export default Form