import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Bell,
    Calendar,
    ChevronDown,
    ClipboardList,
    Clock,
    Menu,
    User,
} from "lucide-react"

const DashboardElement = () => {
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today is Overview</h2>
                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Appointments Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15</div>
                            <p className="text-xs text-muted-foreground">3 more than yesterday</p>
                        </CardContent>
                    </Card>
                    {/* Patients Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">1 less than yesterday</p>
                        </CardContent>
                    </Card>
                    {/* Lab Results Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Lab Results</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">7</div>
                            <p className="text-xs text-muted-foreground">2 processed today</p>
                        </CardContent>
                    </Card>
                    {/* Average Wait Time Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18 min</div>
                            <p className="text-xs text-muted-foreground">2 min less than average</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Appointments */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
                <Card>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Patient Name</th>
                                        <th scope="col" className="px-6 py-3">Time</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">John Doe</td>
                                        <td className="px-6 py-4">10:00 AM</td>
                                        <td className="px-6 py-4">Check-up</td>
                                        <td className="px-6 py-4">
                                            <Button size="sm">View Details</Button>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Jane Smith</td>
                                        <td className="px-6 py-4">11:30 AM</td>
                                        <td className="px-6 py-4">Follow-up</td>
                                        <td className="px-6 py-4">
                                            <Button size="sm">View Details</Button>
                                        </td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">Robert Johnson</td>
                                        <td className="px-6 py-4">2:00 PM</td>
                                        <td className="px-6 py-4">Consultation</td>
                                        <td className="px-6 py-4">
                                            <Button size="sm">View Details</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

export default DashboardElement