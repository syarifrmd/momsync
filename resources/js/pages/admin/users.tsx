import { Head, Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Plus, Edit, Trash2, User, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileNav from "@/components/MobileNav";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
}

export default function UserManagement({ users }: Props) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const editForm = useForm({
        name: "",
        email: "",
        role: "user",
    });

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setEditDialogOpen(true);
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        editForm.patch(`/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditDialogOpen(false);
                toast.success("User updated successfully");
            },
            onError: () => {
                toast.error("Failed to update user");
            },
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        createForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                setCreateDialogOpen(false);
                createForm.reset();
                toast.success("User created successfully");
            },
            onError: () => {
                toast.error("Failed to create user");
            },
        });
    };

    const handleDelete = (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

        router.delete(`/admin/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("User deleted successfully");
            },
            onError: () => {
                toast.error("Failed to delete user");
            },
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'doctor': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'user': return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    const filteredUsers = users.data.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <Head title="User Management" />

            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 pb-10 rounded-b-3xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-purple-100 text-sm opacity-90">Manage all system users</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                </div>
            </header>

            <div className="px-5 -mt-4 relative z-20 space-y-4">
                {/* Add User Button */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        {users.total} total users
                    </p>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="w-4 h-4 mr-1" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        placeholder="********"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={createForm.data.role}
                                        onChange={(e) => createForm.setData('role', e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full bg-purple-600" disabled={createForm.processing}>
                                    {createForm.processing ? 'Creating...' : 'Create User'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Users List */}
                <div className="space-y-3">
                    {filteredUsers.map((user) => (
                        <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-slate-100 p-2.5 rounded-full shrink-0">
                                        <User className="w-5 h-5 text-slate-600" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{user.name}</h4>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <Badge variant="secondary" className={`text-[10px] shrink-0 ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-slate-400">
                                                Joined {formatDate(user.created_at)}
                                            </p>
                                            
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={editForm.data.role}
                                onChange={(e) => editForm.setData('role', e.target.value)}
                            >
                                <option value="user">User</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full bg-purple-600" disabled={editForm.processing}>
                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <MobileNav />
        </div>
    );
}
