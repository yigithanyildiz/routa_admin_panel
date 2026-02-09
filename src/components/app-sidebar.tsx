'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    LayoutDashboard,
    MapPin,
    Building2,
    Download,
    Upload,
    LogOut,
    ChevronUp,
    Settings,
} from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Destinasyonlar',
        url: '/dashboard/destinations',
        icon: MapPin,
    },
    {
        title: 'Yerler',
        url: '/dashboard/places',
        icon: Building2,
    },
];

const utilityItems = [
    {
        title: 'Dışa Aktar',
        url: '/dashboard/export',
        icon: Download,
    },
    {
        title: 'İçe Aktar',
        url: '/dashboard/import',
        icon: Upload,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Çıkış yapıldı');
        } catch (error) {
            toast.error('Çıkış yapılırken hata oluştu');
        }
    };

    return (
        <Sidebar className="border-r border-slate-800 bg-slate-900">
            <SidebarHeader className="border-b border-slate-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white">Routa Admin</h1>
                        <p className="text-xs text-slate-400">Yönetim Paneli</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 text-xs font-medium px-2 mb-2">
                        Ana Menü
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500/20 data-[active=true]:to-indigo-500/20 data-[active=true]:text-white data-[active=true]:border-l-2 data-[active=true]:border-purple-500 transition-all duration-200"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-slate-500 text-xs font-medium px-2 mb-2">
                        Araçlar
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {utilityItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500/20 data-[active=true]:to-indigo-500/20 data-[active=true]:text-white transition-all duration-200"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-800 p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-2 py-6 hover:bg-slate-800"
                        >
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.photoURL || undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.displayName || 'Admin'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 bg-slate-900 border-slate-700"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuItem
                            className="text-slate-300 focus:text-white focus:bg-slate-800 cursor-pointer"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
