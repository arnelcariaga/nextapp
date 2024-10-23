import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "./ui/scroll-area"

type TMyDialog = {
    title: string,
    description: string,
    content: JSX.Element,
    btnTrigger: JSX.Element
    myClassName: string
    closeModal: boolean
    onOpenChange: () => void
}

const MyDialog = ({ title, description, content, btnTrigger, myClassName, closeModal, onOpenChange }: TMyDialog) => {
    return (
        <Dialog open={closeModal} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {btnTrigger}
            </DialogTrigger>

            <DialogContent className={`${myClassName} p-1`}>
                <ScrollArea className="p-5">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mx-1 mt-[2%]">
                        {content}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default MyDialog