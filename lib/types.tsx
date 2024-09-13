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

type TLeftSidebarItemSubRoute = {
    name: string;
    url: string | object;
    active: boolean;
    subRoutes: TLeftSidebarItemSubRoute[];
    isHeader: boolean;
    icon: keyof typeof Icons;
    expandable: boolean
};

export type TLeftSidebarMenuItem = {
    name: string;
    url: string | object;
    active: boolean;
    subRoutes: TLeftSidebarItemSubRoute[];
    isHeader: boolean;
    icon: keyof typeof Icons;
    expandable: boolean
};

// Tyoe for lucide icons
export type TIconProps = {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
    className: string
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
};