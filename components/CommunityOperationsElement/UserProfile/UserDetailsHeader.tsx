import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Icon from "@/components/Icon"
import { useToast } from "@/hooks/use-toast"
import copyToClipboard from "@/lib/copyToClickboard"
import { appName } from "@/lib/appInfo"
import { ICommunityOperationUserDetails } from "@/lib/interfaces"
import { useDispatch } from "react-redux"
import { setCloseModalEditCommunityOperationUser } from "@/redux/slices/communityOperationUsersSlice"
import UserDetailsHeaderDescription from "./UserDetailsHeaderDescription"
import Link from "next/link"

interface IPropsParams {
    userDetails: ICommunityOperationUserDetails
    canEdit: boolean
    showDescription: boolean
}

const UserDetailsHeader = ({ userDetails, canEdit, showDescription }: IPropsParams) => {
    const { toast } = useToast()
    const dispatch = useDispatch()

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

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarFallback>{userDetails?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link href={`/community_operations/${userDetails.id}/user_profile`}>
                                <CardTitle className="text-2xl sm:text-3xl">
                                    {userDetails?.name + " " + userDetails?.last_name}
                                </CardTitle>
                            </Link>
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
                        {
                            canEdit && <Button variant="outline" className="mt-2 sm:mt-0 border-green-700" onClick={() => dispatch(setCloseModalEditCommunityOperationUser(true))}>
                                <Icon name="Edit" className="h-4 w-4" />
                            </Button>
                        }
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{userDetails?.genre.name}</Badge>
                        {userDetails?.is_pregnant === 1 && <Badge className="bg-green-700">Embarazada</Badge>}
                        <Badge className="bg-blue-700">{userDetails?.serology_status.name}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className={`${!showDescription && "p-0"} grid gap-4`}>
                <UserDetailsHeaderDescription userDetails={userDetails} showDescription={showDescription} />
            </CardContent>
        </Card>
    )
}

export default UserDetailsHeader