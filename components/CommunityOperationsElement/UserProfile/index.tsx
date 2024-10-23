"use client"
import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCommunityOperationUserDetails } from "@/lib/seed"
import { ICommunityOperationUserDetails } from "@/lib/interfaces"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { appName } from "@/lib/appInfo"
import { useRouter } from "next/navigation"
import Icon from "@/components/Icon"
import CommunityOperationUserProfileSkeleton from "@/components/CommunityOperationUserProfileSkeleton"
import MyDialog from "@/components/MyDialog"
import AddTrackingForm from "./AddTrackingForm"
import AddEnrollingForm from "./AddEnrollingForm"
import AddIndexForm from "./AddIndexForm"
import copyToClipboard from "@/lib/copyToClickboard"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import EditCommunityOperationUserForm from "../Users/EditCommunityOperationUserForm"
import { setCloseModalEditCommunityOperationUser } from "@/redux/slices/communityOperationUsersSlice"

export default function UserProfile({ params }: TCommunityOperativeUserParams) {
    const [userDetails, setUserDetails] = useState<ICommunityOperationUserDetails>()
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter()
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [openAddTrackingForm, setOpenAddTrackingForm] = useState<boolean>(false)
    const [countTracking, setCountTracking] = useState<number>(0)
    const [openAddEnrollingForm, setOpenAddEnrollingForm] = useState<boolean>(false)
    const [countEnrolling, setCountEnrolling] = useState<number>(0)
    const [openAddIndexForm, setOpenAddIndexForm] = useState<boolean>(false)
    const addedUserProfile = useSelector((state: RootState) => state.communityOperationUsers.addedUserProfile as ICommunityOperationUserDetails)
    const closeModalEditCommunityOperationUser = useSelector((state: RootState) => state.communityOperationUsers.closeModalEditCommunityOperationUser)
    const addedCommunityOperationUser = useSelector((state: RootState) => state.communityOperationUsers.addedCommunityOperationUser as ICommunityOperationUserDetails[])
    const dispatch = useDispatch()

    useEffect(() => {
        function getAddedCommunityOperationUserProfile() {
            // If a new community operation user added, update array for UI
            if (Object.keys(addedUserProfile).length > 0) {
                setUserDetails((prevS) => {
                    return { ...prevS, ...addedUserProfile } as ICommunityOperationUserDetails
                })
            }
        }
        getAddedCommunityOperationUserProfile()
    }, [addedUserProfile])

    useEffect(() => {
        function getAddedCommunityOperationUserUpdated() {
            // If a new community operation user updated, update array for UI
            if (addedCommunityOperationUser.length > 0) {
                setUserDetails((prevS) => {
                    return { ...prevS, ...addedCommunityOperationUser[0] }
                })
            }
        }
        getAddedCommunityOperationUserUpdated()
    }, [addedCommunityOperationUser])

    useEffect(() => {
        async function getCommnutiOperationUsersFn() {
            if (session) {
                const { error, data, message } = await getCommunityOperationUserDetails(Number(session?.user.id_sai), Number(session?.user.id_role), params.id)

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                        description: message,
                        duration: 5000
                    })
                    router.push("/not_found")
                } else {
                    setUserDetails(data)

                }
                setDataTableLoading(false)
            }
        }
        getCommnutiOperationUsersFn()
    }, [toast, session, params, router])

    const handleCopy = async (text: string) => {
        try {
            await copyToClipboard(text);
            toast({
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: "IDFAPPS copiado",
                duration: 5000
            })
        } catch {
            toast({
                variant: "destructive",
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: "Error al copiar el IDFAPPS",
                duration: 5000
            })
        }
    };

    const renderUserTrackingNumber = (): number => {
        if (countTracking !== 0) {
            return countTracking
        }
        return Number(userDetails?.trackings_count)
    }

    const renderUserEnrollingNumber = (): number => {
        if (countEnrolling !== 0) {
            return countEnrolling
        }
        return Number(userDetails?.enrolling_count)
    }

    if (dataTableLoading) {
        return <CommunityOperationUserProfileSkeleton />
    }
    return (
        <div className="container mx-auto p-4 max-w-full">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarFallback>{userDetails?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-2xl sm:text-3xl">{userDetails?.name + " " + userDetails?.last_name}</CardTitle>
                                        <div className="flex items-center gap-4">
                                            <CardDescription className="text-base sm:text-md font-bold">
                                                SAI: <span className="font-normal">
                                                    {userDetails?.sai ? userDetails?.sai.name : 'Sin SAI'}
                                                </span>
                                            </CardDescription>
                                            <div className="flex items-center">
                                                <CardDescription className="text-base sm:text-md font-bold">
                                                    IDFAPPS: <span className="font-normal">
                                                        {userDetails?.fapps_id}
                                                    </span>
                                                </CardDescription>
                                                <Button variant="ghost" size="icon" onClick={() => handleCopy(String(userDetails?.fapps_id))}>
                                                    <Icon name="Clipboard" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="mt-2 sm:mt-0 border-green-700" onClick={() => dispatch(setCloseModalEditCommunityOperationUser(true))}>
                                        <Icon name="Edit" className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge>{userDetails?.genre.name}</Badge>
                                    {userDetails?.is_pregnant === 1 && <Badge className="bg-green-700">Embarazada</Badge>}
                                    <Badge className="bg-blue-700">{userDetails?.serology_status.name}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 mt-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Icon name="Earth" className="h-4 w-4 text-muted-foreground" />
                                    <span><span className="font-bold">Nacionalidad:</span> {userDetails?.nationality.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="Phone" className="h-4 w-4 text-muted-foreground" />
                                    <span><span className="font-bold">Tel&eacute;fono:</span> {userDetails?.tel}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="RotateCcw" className="h-4 w-4 text-muted-foreground" />
                                    <span><span className="font-bold">Edad:</span> {userDetails?.age}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="IdCard" className="h-4 w-4 text-muted-foreground" />
                                    <span><span className="font-bold">Documento de identidad:</span> {userDetails?.doc_id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {
                    // If user negative = 2 don't show form
                    // If user positive = 1 show all forms
                    // If user known positive = 3 show one form only (registro INDEX)
                    userDetails?.serology_status.id === 2 ? null :
                        userDetails?.serology_status.id === 1 ?
                            <div className="w-full lg:w-1/3">
                                <Card className="w-full max-w-md mx-auto shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Icon name="BookCopy" className="mr-2" />
                                            Formularios
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="flex items-center justify-between py-3 border-b last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <Link href={`/community_operations/${params.id}/user_profile/trackings`}>
                                                    <p className="text-sm font-medium">Seguimientos</p>
                                                </Link>
                                                <p className="text-sm text-muted-foreground">{renderUserTrackingNumber()} {renderUserTrackingNumber() > 1 ? 'registros' : 'registro'}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                                onClick={() => setOpenAddTrackingForm(true)}
                                            >
                                                <Icon name="Plus" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div
                                            className="flex items-center justify-between py-3 border-b last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <Link href={`/community_operations/${params.id}/user_profile/enrollings`}>
                                                    <p className="text-sm font-medium">Situaci&oacute;n enrolamiento</p>
                                                </Link>
                                                <p className="text-sm text-muted-foreground">{renderUserEnrollingNumber()} {renderUserEnrollingNumber() > 1 ? 'registros' : 'registro'}</p>
                                            </div>
                                            {
                                                renderUserEnrollingNumber() === 0 && <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                                    onClick={() => setOpenAddEnrollingForm(true)}
                                                >
                                                    <Icon name="Plus" className="h-4 w-4" />
                                                </Button>
                                            }
                                        </div>
                                        <div
                                            className="flex items-center justify-between py-3 border-b last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Registro INDEX</p>
                                                <p className="text-sm text-muted-foreground">0 registros</p>
                                            </div>
                                            {
                                                renderUserEnrollingNumber() > 0 &&
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                                    onClick={() => setOpenAddIndexForm(true)}
                                                >
                                                    <Icon name="Plus" className="h-4 w-4" />
                                                </Button>
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            </div> : userDetails?.serology_status.id === 3 ?
                                <div className="w-full lg:w-1/3">
                                    <Card className="w-full max-w-md mx-auto shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Icon name="BookCopy" className="mr-2" />
                                                Formularios
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                                className="flex items-center justify-between py-3 border-b last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Registro INDEX</p>
                                                    <p className="text-sm text-muted-foreground">0 registros</p>
                                                </div>
                                                {
                                                    userDetails.fapps_id !== 0 &&
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                                        onClick={() => setOpenAddIndexForm(true)}
                                                    >
                                                        <Icon name="Plus" className="h-4 w-4" />
                                                    </Button>
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div> : null
                }
            </div>

            <MyDialog
                title="Paciente Operartivo Comunidad -> Agregar seguimiento"
                description=""
                content={<AddTrackingForm
                    params={params}
                    userName={userDetails?.name + " " + userDetails?.last_name}
                    setCountTracking={setCountTracking}
                    setOpenAddTrackingForm={setOpenAddTrackingForm}
                />}
                btnTrigger={<></>}
                myClassName="md:w-[50vw] w-[100vw] h-full max-h-[75vh]"
                closeModal={openAddTrackingForm}
                onOpenChange={() => setOpenAddTrackingForm(!openAddTrackingForm)}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />

            <MyDialog
                title="Paciente Operartivo Comunidad -> Agregar situación enrolamiento"
                description=""
                content={<AddEnrollingForm
                    params={params}
                    userName={userDetails?.name + " " + userDetails?.last_name}
                    setCountEnrolling={setCountEnrolling}
                    setOpenAddEnrollingForm={setOpenAddEnrollingForm}
                />}
                btnTrigger={<></>}
                myClassName="md:w-[40vw] w-[100vw] max-w-[95vw] h-full max-h-[75vh]"
                closeModal={openAddEnrollingForm}
                onOpenChange={() => setOpenAddEnrollingForm(!openAddEnrollingForm)}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />

            <MyDialog
                title="Paciente Operartivo Comunidad -> Agregar registro INDEX"
                description=""
                content={<AddIndexForm
                    params={params}
                    userName={userDetails?.name + " " + userDetails?.last_name}
                    userFappId={userDetails?.fapps_id as number}
                    setCountEnrolling={setCountEnrolling}
                    setOpenAddIndexForm={setOpenAddIndexForm}
                />}
                btnTrigger={<></>}
                myClassName="md:w-[100vw] w-[100vw] max-w-[100vw] h-full max-h-[100vh]"
                closeModal={openAddIndexForm}
                onOpenChange={() => setOpenAddIndexForm(!openAddIndexForm)}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />

            <MyDialog
                title="Paciente Operartivo Comunidad -> Editar Paciente"
                description=""
                content={
                    <EditCommunityOperationUserForm selectedItem={userDetails} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalEditCommunityOperationUser}
                onOpenChange={() => dispatch(setCloseModalEditCommunityOperationUser(!closeModalEditCommunityOperationUser))}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />
        </div>
    )
}