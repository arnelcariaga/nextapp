"use client"
import { useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { TLeftSidebar, TLeftSidebarMenuItem } from '@/lib/types'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import Icon from '../Icon'
import { usePathname } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area"

const menuItems: TLeftSidebarMenuItem[] = [
    {
        "name": "Inicio",
        "url": "/dashboard",
        "active": true,
        "subRoutes": [],
        "isHeader": false,
        "icon": "House",
        "expandable": false
    },
    {
        "name": "PowerBI",
        "url": "/powerbi",
        "active": false,
        "subRoutes": [],
        "isHeader": false,
        "icon": "ChartPie",
        "expandable": false
    },
    {
        "name": "PowerBI PrEP",
        "url": "/powerbiPrep",
        "active": true,
        "subRoutes": [],
        "isHeader": false,
        "icon": "ChartPie",
        "expandable": false
    },
    {
        "name": "Formularios Clínicos",
        "url": "",
        "active": false,
        "subRoutes": [
            {
                "name": "Pacientes",
                "url": "/",
                "active": false,
                "subRoutes": [
                    {
                        "name": "Agregar paciente",
                        "url": "/patients",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "User",
                        "expandable": false
                    },
                    {
                        "name": "Lista de pacientes",
                        "url": "/patient/list",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "User",
                        "expandable": false
                    },
                    {
                        "name": "Combinar pacientes",
                        "url": "/merge_patients",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "User",
                        "expandable": false
                    },
                    {
                        "name": "Transferidos",
                        "url": "/transfer_patient",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "User",
                        "expandable": false
                    }
                ],
                "isHeader": true,
                "icon": "User",
                "expandable": true
            },
            {
                "name": "Usuarios PrEP",
                "url": "/",
                "active": false,
                "subRoutes": [
                    {
                        "name": "Agregar Usuarios PrEP",
                        "url": "/userPrep",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "BookUser",
                        "expandable": false
                    },
                    {
                        "name": "Lista de usuarios PrEP",
                        "url": "/patient/list",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "BookUser",
                        "expandable": false
                    }
                ],
                "isHeader": true,
                "icon": "BookUser",
                "expandable": true
            },
            {
                "name": "Consejería",
                "url": "/",
                "active": false,
                "subRoutes": [
                    {
                        "name": "Registro diario",
                        "url": "/counseling",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "Contact",
                        "expandable": false
                    },
                    {
                        "name": "Pre-Consejería",
                        "url": "/pre_counseling",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "Contact",
                        "expandable": false
                    },
                    {
                        "name": "Post-Consejería",
                        "url": "/post_counseling",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "Contact",
                        "expandable": false
                    }
                ],
                "isHeader": true,
                "icon": "Contact",
                "expandable": true
            }
        ],
        "isHeader": true,
        "icon": "BookOpenText",
        "expandable": false
    },
    {
        "name": "Comunidad",
        "url": "",
        "active": false,
        "subRoutes": [
            {
                "name": "Operativo Comunidad",
                "url": "/",
                "active": false,
                "subRoutes": [
                    {
                        "name": "Agregar Operativo Comunidad",
                        "url": "/operational_community",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "BookOpenText",
                        "expandable": false
                    },
                    {
                        "name": "Listado Operativo Comunidad",
                        "url": "/operational_community/list",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "BookOpenText",
                        "expandable": false
                    },
                    {
                        "name": "Listado Usuarios Comunidad",
                        "url": "/users_community",
                        "active": false,
                        "subRoutes": [],
                        "isHeader": false,
                        "icon": "BookOpenText",
                        "expandable": false
                    }
                ],
                "isHeader": true,
                "icon": "UsersRound",
                "expandable": true
            }
        ],
        "isHeader": true,
        "icon": "UsersRound",
        "expandable": false
    },
    {
        "name": "Docs",
        "url": "",
        "active": false,
        "subRoutes": [
            {
                "name": "Detección de Violencia",
                "url": "/violence_detection",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "ListChecks",
                "expandable": false
            }
        ],
        "isHeader": true,
        "icon": "ListChecks",
        "expandable": false
    },
    {
        "name": "Administración",
        "url": "",
        "active": false,
        "subRoutes": [
            {
                "name": "Usuarios",
                "url": "/users",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "Users",
                "expandable": false
            },
            {
                "name": "Roles",
                "url": "/roles",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "FolderLock",
                "expandable": false
            },
            {
                "name": "Socios / SAIs",
                "url": "/sais",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "Building2",
                "expandable": false
            },
            {
                "name": "Configuración PowerBI",
                "url": "/powerbi_settings",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "Cog",
                "expandable": false
            },
            {
                "name": "Audit Log",
                "url": "/audit_log",
                "active": false,
                "subRoutes": [],
                "isHeader": false,
                "icon": "ScrollText",
                "expandable": false
            }
        ],
        "isHeader": true,
        "icon": "ScrollText",
        "expandable": false
    }
]

const LeftSidebar = ({ isSidebarOpen }: TLeftSidebar) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const router = usePathname();

    const toggleExpand = (item: string) => {
        setExpandedItems(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        )
    }

    return (
        <ScrollArea>
            <aside className={`bg-green-600 dark:bg-green-900 text-white w-72 space-y-2 py-[2.5%] px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
                <nav>
                    {
                        menuItems.map((item, i) => {
                            if (item.isHeader) {
                                return <div key={i}>
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium leading-none ms-2">{item.name}</h4>
                                    </div>
                                    <Separator className="mt-3 mb-2" />

                                    {
                                        item.subRoutes.map((subItem, subI) => {
                                            return <div key={subI}>
                                                {
                                                    subItem.expandable ?
                                                        <Collapsible open={expandedItems.includes(subItem.name)} onOpenChange={() => toggleExpand(subItem.name)} className={`${expandedItems.includes(subItem.name) && subItem.url === router && 'bg-green-700'}`}>
                                                            <CollapsibleTrigger asChild>
                                                                <Button variant="ghost" className="flex mt-2 items-center space-x-2 w-full justify-between hover:bg-green-700">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Icon name={subItem.icon} className="h-5 w-5" />
                                                                        <span>{subItem.name}</span>
                                                                    </div>
                                                                    <Icon name="ChevronRight" className={`h-4 w-4 transition-transform ${expandedItems.includes(subItem.name) ? 'rotate-90' : ''}`} />
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="pl-7 space-y-1">
                                                                {
                                                                    subItem.subRoutes.map((collaapsibleItem, collapsibleItemIndex) => {
                                                                        return <Button key={collapsibleItemIndex} variant="ghost" size="sm" className={`${expandedItems.includes(subItem.name) && collaapsibleItem.url === router && "bg-green-700"} mt-2 flex items-center space-x-2 w-full justify-start hover:bg-green-700`} asChild>
                                                                            <Link href={collaapsibleItem.url as string}>
                                                                                <Icon name="Dot" className="h-5 w-5" />
                                                                                {collaapsibleItem.name}
                                                                            </Link>
                                                                        </Button>
                                                                    })
                                                                }
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                        : <Button key={subI} variant="ghost" className={`${subItem.url === router && 'bg-green-700'} mt-2 flex items-center space-x-2 w-full justify-start hover:bg-green-700`} asChild>
                                                            <Link href={subItem.url as string}>
                                                                <Icon name={subItem.icon} className="h-5 w-5" />
                                                                <span>{subItem.name}</span>
                                                            </Link>
                                                        </Button>
                                                }
                                            </div>
                                        })
                                    }
                                </div>
                            } else {
                                return <Button key={i} variant="ghost" className={`${item.url === router && 'bg-green-700'} mt-2 flex items-center space-x-2 w-full justify-start hover:bg-green-700`} asChild>
                                    <Link href={item.url as string}>
                                        <Icon name={item.icon} className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </Button>
                            }
                        })
                    }
                </nav>
            </aside>
        </ScrollArea>
    )
}

export default LeftSidebar