'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getPlaces, getDestinations, createPlace, updatePlace, deletePlace } from '@/lib/firebase-service';
import { PopularPlace, Destination } from '@/types';
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Building2,
    Star,
    Loader2,
    RefreshCw,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

const PLACE_TYPES = ['Museum', 'Monument', 'Park', 'Restaurant', 'Beach', 'Shopping', 'Viewpoint', 'Entertainment', 'Genel'];

export default function PlacesPage() {
    const [places, setPlaces] = useState<PopularPlace[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<PopularPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [placeToDelete, setPlaceToDelete] = useState<PopularPlace | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Add/Edit dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState<PopularPlace | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        cityId: '',
        description: '',
        imageURL: '',
        rating: '',
        latitude: '',
        longitude: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPlaces();
    }, [searchQuery, places]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [placesData, destData] = await Promise.all([getPlaces(), getDestinations()]);
            setPlaces(placesData);
            setDestinations(destData);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const filterPlaces = () => {
        if (!searchQuery.trim()) {
            setFilteredPlaces(places);
            return;
        }
        const query = searchQuery.toLowerCase();
        setFilteredPlaces(
            places.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.type.toLowerCase().includes(query)
            )
        );
    };

    const getCityName = (cityId: string) => {
        return destinations.find((d) => d.id === cityId)?.name || cityId;
    };

    const handleDeleteClick = (place: PopularPlace) => {
        setPlaceToDelete(place);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!placeToDelete) return;
        setDeleting(true);
        try {
            await deletePlace(placeToDelete.id);
            toast.success(`"${placeToDelete.name}" silindi`);
            setPlaces((prev) => prev.filter((p) => p.id !== placeToDelete.id));
        } catch (error) {
            console.error('Error deleting place:', error);
            toast.error('Silme işlemi başarısız oldu');
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setPlaceToDelete(null);
        }
    };

    const openAddDialog = () => {
        setEditingPlace(null);
        setFormData({
            name: '',
            type: '',
            cityId: '',
            description: '',
            imageURL: '',
            rating: '',
            latitude: '',
            longitude: '',
        });
        setDialogOpen(true);
    };

    const openEditDialog = (place: PopularPlace) => {
        setEditingPlace(place);
        setFormData({
            name: place.name,
            type: place.type,
            cityId: place.cityId,
            description: place.description,
            imageURL: place.imageURL,
            rating: place.rating.toString(),
            latitude: place.coordinates.latitude.toString(),
            longitude: place.coordinates.longitude.toString(),
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const placeData = {
                name: formData.name,
                type: formData.type,
                cityId: formData.cityId,
                description: formData.description,
                imageURL: formData.imageURL,
                rating: parseFloat(formData.rating) || 0,
                coordinates: {
                    latitude: parseFloat(formData.latitude) || 0,
                    longitude: parseFloat(formData.longitude) || 0,
                },
            };

            if (editingPlace) {
                await updatePlace(editingPlace.id, placeData);
                toast.success('Yer başarıyla güncellendi');
                setPlaces((prev) =>
                    prev.map((p) =>
                        p.id === editingPlace.id ? { ...p, ...placeData, id: editingPlace.id } : p
                    )
                );
            } else {
                const newId = await createPlace(placeData);
                toast.success('Yer başarıyla oluşturuldu');
                setPlaces((prev) => [...prev, { ...placeData, id: newId }]);
            }

            setDialogOpen(false);
        } catch (error) {
            console.error('Error saving place:', error);
            toast.error('Kaydetme işlemi başarısız oldu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Yerler</h1>
                    <p className="text-slate-400">Toplam {places.length} popüler yer</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={loadData}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Yer
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="İsim veya tip ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Yer</TableHead>
                                <TableHead className="text-slate-400">Tip</TableHead>
                                <TableHead className="text-slate-400">Şehir</TableHead>
                                <TableHead className="text-slate-400">Rating</TableHead>
                                <TableHead className="text-slate-400 text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-slate-800">
                                        <TableCell><Skeleton className="h-10 w-40 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-12 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 bg-slate-800 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredPlaces.length === 0 ? (
                                <TableRow className="border-slate-800">
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz yer eklenmemiş'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPlaces.map((place) => (
                                    <TableRow key={place.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    {place.imageURL ? (
                                                        <img src={place.imageURL} alt={place.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                                            <Building2 className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-medium text-white">{place.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                                {place.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{getCityName(place.cityId)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span>{place.rating}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                                                    <DropdownMenuItem
                                                        className="text-slate-300 focus:text-white focus:bg-slate-800"
                                                        onClick={() => openEditDialog(place)}
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Düzenle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                                                        onClick={() => handleDeleteClick(place)}
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

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingPlace ? 'Yer Düzenle' : 'Yeni Yer Ekle'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-200">İsim *</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="bg-slate-800 border-slate-700 text-white"
                                required
                            />
                        </div>

                        <div className="grid gap-4 grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Tip *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {PLACE_TYPES.map((type) => (
                                            <SelectItem key={type} value={type} className="text-slate-300">{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Şehir *</Label>
                                <Select
                                    value={formData.cityId}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, cityId: value }))}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {destinations.map((dest) => (
                                            <SelectItem key={dest.id} value={dest.id} className="text-slate-300">{dest.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Açıklama</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Görsel URL</Label>
                            <Input
                                value={formData.imageURL}
                                onChange={(e) => setFormData((prev) => ({ ...prev, imageURL: e.target.value }))}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="grid gap-4 grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Rating</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Enlem</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Boylam</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700 text-slate-300">
                                İptal
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingPlace ? 'Güncelle' : 'Kaydet'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Yeri Sil</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            <strong className="text-white">{placeToDelete?.name}</strong> yerini silmek istediğinizden emin misiniz?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-slate-700 text-slate-300">
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
                            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
