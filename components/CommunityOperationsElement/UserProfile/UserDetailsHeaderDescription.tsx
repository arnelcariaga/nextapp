import Icon from "@/components/Icon"
import { ICommunityOperationUserDetails } from "@/lib/interfaces"

interface IPropsParams {
    userDetails: ICommunityOperationUserDetails
    showDescription: boolean
}

const UserDetailsHeaderDescription = ({ userDetails, showDescription }: IPropsParams) => {
    if (!showDescription) {
        return <></>
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
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
    )
}

export default UserDetailsHeaderDescription