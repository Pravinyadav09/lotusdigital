"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useAuth } from "@/providers/auth-provider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const INITIAL_USERS = [
    { id: "1", name: "Super Admin", email: "admin@lotus.com", role: "super_admin", status: "active" },
    { id: "2", name: "Sales Manager", email: "manager@lotus.com", role: "sales_manager", status: "active" },
    { id: "3", name: "Vikram Singh", email: "sales1@lotus.com", role: "senior_sales_rep", status: "active" },
    { id: "4", name: "Finance Dept", email: "finance@lotus.com", role: "finance_user", status: "active" },
    { id: "5", name: "Rahul Engineer", email: "service1@lotus.com", role: "service_engineer", status: "active" },
    { id: "6", name: "Pixel Printers", email: "customer1@example.com", role: "customer", status: "active" },
];

export default function UserManagementPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState(INITIAL_USERS);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "customer" });

    if (user?.role !== "super_admin") {
        return <div className="p-8 text-center text-muted-foreground">Access Denied. Super Admin only.</div>;
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const id = (users.length + 1).toString();
        setUsers([...users, { ...newUser, id, status: "active" }]);
        toast.success("New user created and added to directory.");
        setIsAddOpen(false);
        setNewUser({ name: "", email: "", role: "customer" });
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        toast.success("User details updated.");
        setIsEditOpen(false);
        setEditingUser(null);
    };

    const handleDeactivate = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: "inactive" } : u));
        toast.success("User deactivated successfully.");
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Manage organizational roles and access control.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full md:w-auto">
                            <Icons.add className="mr-2 h-4 w-4" />
                            Create New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="e.g. John Doe"
                                    required
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="john@lotus.com"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role Assignment</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={v => setNewUser({ ...newUser, role: v })}
                                    required
                                >
                                    <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="sales_manager">Sales Manager</SelectItem>
                                        <SelectItem value="senior_sales_rep">Senior Sales Rep</SelectItem>
                                        <SelectItem value="finance_user">Finance User</SelectItem>
                                        <SelectItem value="service_engineer">Service Engineer</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Directory</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {u.role.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-xs capitalize">{u.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    toast.info(`Viewing system audit trail for ${u.name}...`);
                                                    toast.promise(new Promise(r => setTimeout(r, 1500)), {
                                                        loading: 'Fetching user logs from global ledger...',
                                                        success: 'Audit Trail: 14 actions today. Last IP: 202.45.1.2',
                                                        error: 'Failed to fetch logs'
                                                    });
                                                }}
                                            >
                                                <Icons.history className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingUser(u);
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                <Icons.settings className="h-4 w-4" />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Icons.delete className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Deactivate User: {u.name}</DialogTitle>
                                                        <DialogDescription>
                                                            CRITICAL: You must transfer all active leads and customer assignments before deactivation.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4 text-sm">
                                                        <div className="p-3 bg-amber-50 rounded border border-amber-200">
                                                            <p className="font-bold text-amber-700">Active Assets Found:</p>
                                                            <ul className="list-disc ml-4 text-amber-600">
                                                                <li>12 Open Leads</li>
                                                                <li>4 Ongoing Service Calls</li>
                                                                <li>₹ 24.5L Outstanding Collections</li>
                                                            </ul>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Transfer Assignments To:</Label>
                                                            <Select>
                                                                <SelectTrigger><SelectValue placeholder="Select Team Member" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="m1">Amit Kumar (Sales Manager)</SelectItem>
                                                                    <SelectItem value="r2">Neha Sharma (Sr Rep)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDeactivate(u.id)}
                                                            disabled={u.status === 'inactive'}
                                                        >
                                                            {u.status === 'inactive' ? 'Deactivated' : 'Transfer & Deactivate'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                        <form onSubmit={handleEditUser} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={editingUser.name}
                                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                    value={editingUser.role}
                                    onValueChange={v => setEditingUser({ ...editingUser, role: v })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="sales_manager">Sales Manager</SelectItem>
                                        <SelectItem value="senior_sales_rep">Senior Sales Rep</SelectItem>
                                        <SelectItem value="finance_user">Finance User</SelectItem>
                                        <SelectItem value="service_engineer">Service Engineer</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={editingUser.status}
                                    onValueChange={v => setEditingUser({ ...editingUser, status: v })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-100 bg-blue-50/20">
                    <CardHeader>
                        <CardTitle className="text-sm">Role Permissions Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            System enforces strict isolation. **Finance** cannot see Lead pipelines. **Service Engineers** cannot see Quotations. **Customers** only see their own assets. Changes to these policies require immutable audit log generation.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50/20">
                    <CardHeader>
                        <CardTitle className="text-sm">Audit Trail Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Every login, role change, and pricing override is being recorded with Geo-stamps. Current session: IP: 192.168.1.45 (Delhi, IN). 2FA is active for all Admin roles.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
