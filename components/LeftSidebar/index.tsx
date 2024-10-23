"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeftSidebarMenuItem } from '@/lib/types'
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { Button } from '../ui/button';
import Icon from '../Icon';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useSession } from 'next-auth/react';
import SidebarSkeleton from "@/components/SidebarSkeleton"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const menuItems: LeftSidebarMenuItem[] = [
    {
        title: 'Inicio',
        path: '/dashboard',
        category: 'General',
        icon: "House"
    },
    {
        title: 'PowerBI',
        path: '/powerbi',
        category: 'General',
        icon: "ChartPie"
    },
    {
        title: 'PowerBI PrEP',
        path: '/powerbiprep',
        category: 'General',
        icon: "ChartPie"
    },
    {
        title: 'Pacientes',
        path: '/patients',
        category: 'Formularios Clínicos',
        icon: "User",
        subItems: [
            { title: 'Agregar', path: '/patients/add', category: 'Formularios Clínicos', icon: "Dot" },
            { title: 'Lista de pacientes', path: '/patients', category: 'Formularios Clínicos', icon: "Dot" },
            { title: 'Combinar pacientes', path: '/patients/merge', category: 'Formularios Clínicos', icon: "Dot" },
            { title: 'Transferiridos', path: '/patients/transfered', category: 'Formularios Clínicos', icon: "Dot" },
        ],
    },
    {
        title: 'Usuarios PrEP',
        path: '/prep_users',
        category: 'Formularios Clínicos',
        icon: "BookUser",
        subItems: [
            { title: 'Agregar', path: '/prep_users/add', category: 'Formularios Clínicos', icon: "Dot" },
            { title: 'Lista de pacientes', path: '/prep_users', category: 'Formularios Clínicos', icon: "Dot" },
        ],
    },
    {
        title: 'Consejería',
        path: '/counceling',
        category: 'Formularios Clínicos',
        icon: "Contact",
        subItems: [
            { title: 'Registro Diario', path: '/counceling/add', category: 'Formularios Clínicos', icon: "Dot", action: "view" },
            { title: 'Pre-Consejería', path: '/counceling', category: 'Formularios Clínicos', icon: "Dot", action: "create" },
            { title: 'Post-Consejería', path: '/counceling', category: 'Formularios Clínicos', icon: "Dot", action: "view" },
        ],
    },
    {
        title: 'Operativo Comunidad',
        path: '/community_operations',
        category: 'Comunidad',
        icon: "UsersRound",
        subItems: [
            { title: 'Agregar', path: '/community_operations/add', category: 'Comunidad', icon: "Dot", action: "create" },
            { title: 'Listado', path: '/community_operations', category: 'Comunidad', icon: "Dot", action: "view" },
            { title: 'Usuarios Comunidad', path: '/community_operations/user_list', category: 'Comunidad', icon: "Dot", action: "view" },
        ],
    },
    {
        title: 'Detección de violencia',
        path: '/violence_detection',
        category: 'Docs',
        icon: "ListChecks"
    },
    {
        title: 'Usuarios',
        path: '/users',
        category: 'Administración',
        icon: "Users"
    },
    {
        title: 'Roles',
        path: '/roles',
        category: 'Administración',
        icon: "FolderLock"
    }, {
        title: 'SAIs',
        path: '/sais',
        category: 'Administración',
        icon: "Building2"
    }, {
        title: 'Configuración PowerBI',
        path: '/powerbi_settings',
        category: 'Administración',
        icon: "Cog"
    }, {
        title: 'Audit Logs',
        path: '/audit_log',
        category: 'Administración',
        icon: "ScrollText"
    },
];

const Sidebar = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
    const { data: session, status } = useSession()
    const isSidebarOpen = useSelector((state: RootState) => state.appSettings.isSidebarOpen)

    // Can view ?
    const userCommunityOpScreens = session?.user.screens.find((screen) => screen.path === "/community_operations")

    const pathname = usePathname();

    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.subItems) {
                const isActive = item.subItems.some((subItem) => pathname === subItem.path);
                setOpenSections((prevState) => ({
                    ...prevState,
                    [item.title]: isActive,
                }));
            }
        });
    }, [pathname]);

    const toggleSection = (section: string) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const isActive = (path: string) => pathname === path;

    const filterMenuByPermissions = (menu: LeftSidebarMenuItem[]): LeftSidebarMenuItem[] => {
        return menu.filter((menuItem) => {
            // Encontrar la pantalla correspondiente en los permisos del usuario
            const screenPermission = session?.user.screens.find(screen => screen.name === menuItem.title);

            // Si no se encuentran permisos para la pantalla, devolver null
            // if (!screenPermission) {
            //     return null;
            // }

            // Si el item tiene subitems, filtrarlos según los permisos del usuario
            if (menuItem.subItems) {
                const filteredSubItems = menuItem.subItems.filter(subItem => {
                    //const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
                    if (subItem.action) {
                        // Filtrar subitems basado en el tipo de acción

                        // Verificar si el permiso correspondiente es '1'
                        return String(screenPermission?.permissions[subItem.action as keyof typeof screenPermission.permissions]) === '1';
                    }
                });

                // Si hay subitems permitidos, devolver el menú con los subitems filtrados
                if (filteredSubItems.length > 0) {
                    return {
                        ...menuItem,
                        subItems: filteredSubItems
                    };
                }
            }

            // Si no hay subitems, devolver el item directamente
            return {
                ...menuItem,
            };
        })
            .filter((menuItem): menuItem is LeftSidebarMenuItem => menuItem !== null); // Filtrar los elementos nulos
    };

    const filteredMenu = filterMenuByPermissions(menuItems);

    const groupedMenuItems = filteredMenu.reduce((acc: { [key: string]: LeftSidebarMenuItem[] }, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});


    if (status === "loading") {
        return <SidebarSkeleton />
    }
    return (
        <ScrollArea className='h-screen'>
            <aside className={`h-full sticky bg-green-600 dark:bg-green-900 text-white space-y-2 py-[2.5%] absolute inset-y-0 left-0 ${isSidebarOpen ? 'translate-x-full w-0' : 'translate-x-0 w-72 px-2'}`}>
                <nav>
                    {Object.keys(groupedMenuItems).map((category) => (
                        <div key={category}>
                            <div className="mt-4">
                                <h2 className="text-xs font-medium leading-none ms-2 uppercase tracking-wide text-gray-300">{category}</h2>
                            </div>
                            <Separator className="mt-3 mb-2" />
                            {groupedMenuItems[category].map((item) => (
                                <div key={item.title}>
                                    {item.subItems ? (
                                        <Collapsible open={openSections[item.title]} onOpenChange={() => toggleSection(item.title)}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" className="flex mt-2 items-center space-x-2 w-full justify-between hover:bg-green-700">
                                                    <div className="flex items-center space-x-2">
                                                        <Icon name={item.icon} className="h-5 w-5" />
                                                        <span>{item.title}</span>
                                                    </div>
                                                    <Icon name="ChevronRight" className={`h-4 w-4 transition-transform ${openSections[item.title] ? 'rotate-90' : ''}`} />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-3 space-y-1">
                                                {openSections[item.title] && (
                                                    <div className="pl-4 space-y-2">
                                                        {item.subItems.map((subItem) => {
                                                            if (
                                                                userCommunityOpScreens &&
                                                                userCommunityOpScreens.permissions.view === "0" &&
                                                                (subItem.path === userCommunityOpScreens.path || subItem.path === "/community_operations/user_list")
                                                            ) {
                                                                return false;
                                                            } else if (
                                                                userCommunityOpScreens &&
                                                                userCommunityOpScreens.permissions.create === "0" &&
                                                                subItem.path === "/community_operations/add"
                                                            ) {
                                                                return false
                                                            }
                                                            return (
                                                                <Button key={subItem.title} variant="ghost" size="sm" className={`${isActive(subItem.path) && "bg-green-700"} mt-2 flex items-center space-x-2 w-full justify-start hover:bg-green-700`} asChild>
                                                                    <Link href={subItem.path as string}>
                                                                        <Icon name="Dot" className="h-5 w-5" />
                                                                        {subItem.title}
                                                                    </Link>
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <Button variant="ghost" className={`${isActive(item.path) && 'bg-green-700'} mt-2 flex items-center space-x-2 w-full justify-start hover:bg-green-700`} asChild>
                                            <Link href={item.path as string}>
                                                <Icon name={item.icon} className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
        </ScrollArea>
    );
};

export default Sidebar;
