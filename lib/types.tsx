import * as Icons from "lucide-react";
import {
    ColumnDef,
    VisibilityState
} from "@tanstack/react-table"

// Tyoe for main Navbar
export type TNavbar = {
    setIsSidebarOpen: () => void;
}

export type TNavbarUserDropdown = {
    name: string
    url: string
    icon: keyof typeof Icons;
}

// Tyoe for main Leftsidebar
export type TLeftSidebar = {
    isSidebarOpen: boolean;
}

export interface LeftSidebarMenuItem {
    title: string;
    path: string;
    subItems?: LeftSidebarMenuItem[] | [];
    category: string;
    icon: keyof typeof Icons;
    action?: string
    isActive?: boolean
    isOpen?: boolean
}

// Tyoe for lucide icons
export type TIconProps = {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
    className?: string
};

// Type for adding rol fields
export type TAddRol = {
    name: string
    isAdmin: boolean
}

// Define the table component
export type TTableProps<T extends object> = {
    columns: ColumnDef<T>[];
    data: T[];
    addBtn: JSX.Element | null
    columnBtnFilter: boolean
    columnHidden: VisibilityState
    orderByObj: {
        desc: boolean
        id: string
    }
    exportData: boolean
};

// Type when editing rol
export type TSelectedRolObj = {
    id: number
    name: string
}

export type TEditRolForm = {
    selectedRol: TSelectedRolObj
}

export type TCommunityOperativeUserParams = {
    params: {
        id: number
    }
}