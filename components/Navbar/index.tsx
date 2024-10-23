"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { TNavbarUserDropdown } from '@/lib/types'
import ThemeToggle from '../ThemeToggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Icon from "../Icon"
import { signOut } from "next-auth/react"
import { ISession } from "@/lib/interfaces"
import { usePathname } from "next/navigation"
import { signOutUser } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useDispatch } from "react-redux"
import { setIsSidebarOpen } from "@/redux/slices/appSettingsSlice"
import { signInServerFunc } from "../UsersElement/signInServerFunc"

const dropdownItems: TNavbarUserDropdown[] = [{
    name: "Mi Perfil",
    url: "/profile",
    icon: "User"
}, {
    name: "Facturas",
    url: "/billing",
    icon: "CreditCard"
}, {
    name: "Configuración",
    url: "/setting",
    icon: "Settings"
}]

const Navbar = ({ session }: ISession) => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const pathname = usePathname()
    const { toast } = useToast()
    const dispatch = useDispatch()
    const [isBackToUser, setIsBackToUser] = useState<boolean>(false)
    const [storedUser, setStoredUser] = useState<string>("")

    useEffect(() => {
        const signAdFromData = localStorage.getItem("@signAsFrom")
        if (signAdFromData) {
            setStoredUser(signAdFromData);
        }
    }, [])

    function subPathname() {
        const startsWithCommunityOperations = pathname.startsWith('/community_operations');
        const endsWithUsers = pathname.endsWith('/users');
        const endsWithUserProfile = pathname.endsWith('/user_profile');
        const endsWithUserProfileTrackings = pathname.endsWith('/trackings');

        if (startsWithCommunityOperations && endsWithUsers) {
            return "Operativo Comunidad -> Usuarios";
        } else if (startsWithCommunityOperations && endsWithUserProfile) {
            return "Operativo Comunidad -> Perfil Usuario"
        } else if (startsWithCommunityOperations && endsWithUserProfileTrackings) {
            return "Operativo Comunidad -> Seguimiento usuario"
        }
        return null; // Devolver null si no coincide
    }


    const renderNavbarTitle = () => {
        switch (pathname) {
            case "/dashboard":
                return "Panel De Control"
                break;
            case "/users":
                return "Usuarios"
                break;
            case "/roles":
                return "Roles"
                break;
            case "/sais":
                return "SAIs"
                break;
            case "/audit_log":
                return "Registros de auditoría"
                break;
            case "/community_operations/add":
                return "Operativo Comunidad -> Agregar"
                break;
            case "/community_operations":
                return "Operativo Comunidad -> Listado"
                break;
            case "/community_operations/user_list":
                return "Operativo Comunidad -> Lista De Usuarios"
                break;
            default:
                return subPathname() || '';
        }
    }

    const navbarTitle = renderNavbarTitle()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const logoutFn = async () => {
        const { error, message } = await signOutUser(session?.user.username as string)
        if (error) {
            toast({
                variant: "destructive",
                title: "Cerrar sesión || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            signOut({
                callbackUrl: "/"
            })
        }
    }

    const backToUserSignIn = async () => {
        setIsBackToUser(true)
        const signAdFromDataToJson = JSON.parse(storedUser)

        const userData = {
            to_user_id: Number(signAdFromDataToJson.id),
            rol_name: signAdFromDataToJson.role_name,
            from_user_id: Number(signAdFromDataToJson.id),
            from_username: signAdFromDataToJson.username,
            username: "",
            password: "",
            impersonatedBy: String(signAdFromDataToJson.username),
        }

        const res = await signInServerFunc(userData);

        if (res) {
            localStorage.removeItem("@signAsFrom")
            window.location.replace("/dashboard")
        }
        setIsBackToUser(false)
    }

    return (
        <header className={`${isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-white dark:bg-slate-900"} sticky top-0 z-50 w-full transition-all duration-300`}>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => dispatch(setIsSidebarOpen())}>
                        <Icon name="Menu" className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-semibold text-green-600 dark:text-green-400 ml-2">COIN | {navbarTitle}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <nav className="flex px-4 overflow-x-auto">
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Overview
                        </Button>
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Patients
                        </Button>
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Appointments
                        </Button>
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Lab Results
                        </Button>
                    </nav>

                    <Button variant="ghost" size="icon">
                        <Icon name="Bell" className="h-5 w-5" />
                    </Button>
                    <ThemeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session?.user?.name + " " + session?.user.last_name + " (" + session?.user.role_name + ")"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{session?.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                dropdownItems.map(({ name, url, icon }, i) => {
                                    return <DropdownMenuItem key={i} asChild className="cursor-pointer">
                                        <Link href={url}>
                                            <Icon className="mr-2 h-4 w-4" name={icon} />
                                            <span>{name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                })
                            }
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logoutFn}
                                className="cursor-pointer"
                            >
                                <Icon name="LogOut" className="mr-2 h-4 w-4" />
                                <span>Cerrar sesi&oacute;n</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {
                        storedUser !== "" && <Button variant="outline" className="border-amber-500" onClick={backToUserSignIn} disabled={isBackToUser}>
                            {
                                isBackToUser && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                            }
                            Volver a mi cuenta
                        </Button>
                    }
                </div>
            </div>
        </header>
    )
}

export default Navbar