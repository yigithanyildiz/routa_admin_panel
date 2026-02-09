'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDestinations, deleteDestination } from '@/lib/firebase-service';
import { Destination } from '@/types';
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    MapPin,
    Star,
    Loader2,
    RefreshCw,
    X,
    Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCountry, setFilterCountry] = useState('all');
    const [filterClimate, setFilterClimate] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadDestinations();
    }, []);

    // Extract unique countries and climates for filters
    const countries = useMemo(() => {
        const set = new Set(destinations.map((d) => d.country).filter(Boolean));
        return Array.from(set).sort();
    }, [destinations]);

    const climates = useMemo(() => {
        const set = new Set(destinations.map((d) => d.climate).filter(Boolean) as string[]);
        return Array.from(set).sort();
    }, [destinations]);

    // Advanced filtering
    const filteredDestinations = useMemo(() => {
        return destinations.filter((d) => {
            // Text search
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    d.name.toLowerCase().includes(query) ||
                    d.country.toLowerCase().includes(query) ||
                    d.climate?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Country filter
            if (filterCountry !== 'all' && d.country !== filterCountry) return false;

            // Climate filter
            if (filterClimate !== 'all' && d.climate !== filterClimate) return false;

            // Rating filter
            if (filterRating !== 'all') {
                const rating = d.rating || 0;
                if (filterRating === '4+' && rating < 4) return false;
                if (filterRating === '3+' && rating < 3) return false;
                if (filterRating === '2+' && rating < 2) return false;
                if (filterRating === 'none' && d.rating) return false;
            }

            return true;
        });
    }, [destinations, searchQuery, filterCountry, filterClimate, filterRating]);

    const hasActiveFilters = filterCountry !== 'all' || filterClimate !== 'all' || filterRating !== 'all';

    const clearFilters = () => {
        setFilterCountry('all');
        setFilterClimate('all');
        setFilterRating('all');
        setSearchQuery('');
    };

    const loadDestinations = async () => {
        setLoading(true);
        try {
            const data = await getDestinations();
            setDestinations(data);
        } catch (error) {
            console.error('Error loading destinations:', error);
            toast.error('Destinasyonlar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (destination: Destination) => {
        setDestinationToDelete(destination);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!destinationToDelete) return;
        setDeleting(true);
        try {
            await deleteDestination(destinationToDelete.id);
            toast.success(`"${destinationToDelete.name}" silindi`);
            setDestinations((prev) => prev.filter((d) => d.id !== destinationToDelete.id));
        } catch (error) {
            console.error('Error deleting destination:', error);
            toast.error('Silme işlemi başarısız oldu');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setDestinationToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Destinasyonlar</h1>
                    <p className="text-slate-400">
                        {filteredDestinations.length === destinations.length
                            ? `Toplam ${destinations.length} destinasyon`
                            : `${filteredDestinations.length} / ${destinations.length} destinasyon gösteriliyor`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={loadDestinations}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Link href="/dashboard/destinations/new">
                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Destinasyon
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search & Filters */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="İsim, ülke veya iklim ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Filter className="w-4 h-4" />
                            Filtreler:
                        </div>

                        {/* Country Filter */}
                        <Select value={filterCountry} onValueChange={setFilterCountry}>
                            <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="Ülke" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="all" className="text-slate-300">Tüm Ülkeler</SelectItem>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country} className="text-slate-300">
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Climate Filter */}
                        <Select value={filterClimate} onValueChange={setFilterClimate}>
                            <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="İklim" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="all" className="text-slate-300">Tüm İklimler</SelectItem>
                                {climates.map((climate) => (
                                    <SelectItem key={climate} value={climate} className="text-slate-300">
                                        {climate}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Rating Filter */}
                        <Select value={filterRating} onValueChange={setFilterRating}>
                            <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="all" className="text-slate-300">Tüm Ratingler</SelectItem>
                                <SelectItem value="4+" className="text-slate-300">⭐ 4+ Puan</SelectItem>
                                <SelectItem value="3+" className="text-slate-300">⭐ 3+ Puan</SelectItem>
                                <SelectItem value="2+" className="text-slate-300">⭐ 2+ Puan</SelectItem>
                                <SelectItem value="none" className="text-slate-300">Puansız</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Temizle
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Destinasyon</TableHead>
                                <TableHead className="text-slate-400">Ülke</TableHead>
                                <TableHead className="text-slate-400">İklim</TableHead>
                                <TableHead className="text-slate-400">Rating</TableHead>
                                <TableHead className="text-slate-400">Yaşam Maliyeti</TableHead>
                                <TableHead className="text-slate-400 text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-slate-800">
                                        <TableCell><Skeleton className="h-10 w-40 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-12 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 bg-slate-800 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredDestinations.length === 0 ? (
                                <TableRow className="border-slate-800">
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        {searchQuery || hasActiveFilters
                                            ? 'Filtrelere uygun destinasyon bulunamadı'
                                            : 'Henüz destinasyon eklenmemiş'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDestinations.map((destination) => (
                                    <TableRow
                                        key={destination.id}
                                        className="border-slate-800 hover:bg-slate-800/50"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    {destination.imageURL ? (
                                                        <img
                                                            src={destination.imageURL}
                                                            alt={destination.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                                            <MapPin className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{destination.name}</p>
                                                    <p className="text-xs text-slate-400">{destination.address}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{destination.country}</TableCell>
                                        <TableCell>
                                            {destination.climate ? (
                                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                                    {destination.climate}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {destination.rating ? (
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span>{destination.rating}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {destination.costOfLiving ? (
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        destination.costOfLiving.level === 'Low'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : destination.costOfLiving.level === 'High'
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                    }
                                                >
                                                    {destination.costOfLiving.symbol}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="bg-slate-900 border-slate-700"
                                                >
                                                    <DropdownMenuItem
                                                        className="text-slate-300 focus:text-white focus:bg-slate-800"
                                                        asChild
                                                    >
                                                        <Link href={`/dashboard/destinations/${destination.id}/edit`}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Düzenle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                                                        onClick={() => handleDeleteClick(destination)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Destinasyonu Sil</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            <strong className="text-white">{destinationToDelete?.name}</strong> destinasyonunu
                            silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            İptal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                        >
                            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
