'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createDestination } from '@/lib/firebase-service';
import { ArrowLeft, Loader2, Save, MapPin, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const CLIMATE_OPTIONS = ['Tropical', 'Mediterranean', 'Continental', 'Oceanic', 'Desert', 'Temperate'];
const COST_LEVELS = [
    { level: 'Low', symbol: '$', description: 'Düşük maliyet' },
    { level: 'Medium', symbol: '$$', description: 'Orta maliyet' },
    { level: 'Medium-High', symbol: '$$$', description: 'Orta-yüksek maliyet' },
    { level: 'High', symbol: '$$$$', description: 'Yüksek maliyet' },
];

export default function NewDestinationPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        description: '',
        imageURL: '',
        address: '',
        currency: '',
        language: '',
        climate: '',
        latitude: '',
        longitude: '',
        summerTemp: '',
        winterTemp: '',
        popularMonths: [] as string[],
        costLevel: '',
        dailyBudgetMin: '',
        dailyBudgetMax: '',
        travelStyle: [] as string[],
        bestFor: [] as string[],
        rating: '',
        popularity: '',
    });
    const [newTravelStyle, setNewTravelStyle] = useState('');
    const [newBestFor, setNewBestFor] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const costInfo = COST_LEVELS.find((c) => c.level === formData.costLevel);

            await createDestination({
                name: formData.name,
                country: formData.country,
                description: formData.description,
                imageURL: formData.imageURL,
                address: formData.address,
                currency: formData.currency,
                language: formData.language,
                climate: formData.climate || undefined,
                coordinates: {
                    latitude: parseFloat(formData.latitude) || 0,
                    longitude: parseFloat(formData.longitude) || 0,
                },
                averageTemperature: {
                    summer: parseInt(formData.summerTemp) || 25,
                    winter: parseInt(formData.winterTemp) || 10,
                },
                popularMonths: formData.popularMonths,
                costOfLiving: costInfo
                    ? {
                        level: costInfo.level,
                        symbol: costInfo.symbol,
                        description: costInfo.description,
                        dailyBudgetMin: parseInt(formData.dailyBudgetMin) || 0,
                        dailyBudgetMax: parseInt(formData.dailyBudgetMax) || 0,
                    }
                    : undefined,
                travelStyle: formData.travelStyle.length > 0 ? formData.travelStyle : undefined,
                bestFor: formData.bestFor.length > 0 ? formData.bestFor : undefined,
                rating: formData.rating ? parseFloat(formData.rating) : undefined,
                popularity: formData.popularity ? parseInt(formData.popularity) : undefined,
            });

            toast.success('Destinasyon başarıyla oluşturuldu');
            router.push('/dashboard/destinations');
        } catch (error) {
            console.error('Error creating destination:', error);
            toast.error('Destinasyon oluşturulurken hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const addTravelStyle = () => {
        if (newTravelStyle.trim() && !formData.travelStyle.includes(newTravelStyle.trim())) {
            setFormData((prev) => ({
                ...prev,
                travelStyle: [...prev.travelStyle, newTravelStyle.trim()],
            }));
            setNewTravelStyle('');
        }
    };

    const removeTravelStyle = (style: string) => {
        setFormData((prev) => ({
            ...prev,
            travelStyle: prev.travelStyle.filter((s) => s !== style),
        }));
    };

    const addBestFor = () => {
        if (newBestFor.trim() && !formData.bestFor.includes(newBestFor.trim())) {
            setFormData((prev) => ({
                ...prev,
                bestFor: [...prev.bestFor, newBestFor.trim()],
            }));
            setNewBestFor('');
        }
    };

    const removeBestFor = (item: string) => {
        setFormData((prev) => ({
            ...prev,
            bestFor: prev.bestFor.filter((b) => b !== item),
        }));
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/destinations">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Yeni Destinasyon</h1>
                    <p className="text-slate-400">Yeni bir destinasyon ekleyin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            Temel Bilgiler
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Destinasyonun ana bilgilerini girin
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-slate-200">İsim *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Paris"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Ülke *</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                                    placeholder="Fransa"
                                    className="bg-slate-800 border-slate-700 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Açıklama *</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Destinasyon hakkında açıklama..."
                                className="bg-slate-800 border-slate-700 text-white min-h-24"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Görsel URL</Label>
                            <Input
                                value={formData.imageURL}
                                onChange={(e) => setFormData((prev) => ({ ...prev, imageURL: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Adres</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                placeholder="Paris, Fransa"
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Para Birimi</Label>
                                <Input
                                    value={formData.currency}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                                    placeholder="EUR"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Dil</Label>
                                <Input
                                    value={formData.language}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                                    placeholder="Fransızca"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Climate */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Konum ve İklim</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Enlem</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                                    placeholder="48.8566"
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
                                    placeholder="2.3522"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-slate-200">İklim</Label>
                                <Select
                                    value={formData.climate}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, climate: value }))}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {CLIMATE_OPTIONS.map((climate) => (
                                            <SelectItem key={climate} value={climate} className="text-slate-300">
                                                {climate}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Yaz Sıcaklığı (°C)</Label>
                                <Input
                                    type="number"
                                    value={formData.summerTemp}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, summerTemp: e.target.value }))}
                                    placeholder="25"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Kış Sıcaklığı (°C)</Label>
                                <Input
                                    type="number"
                                    value={formData.winterTemp}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, winterTemp: e.target.value }))}
                                    placeholder="5"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cost of Living */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Yaşam Maliyeti</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Maliyet Seviyesi</Label>
                                <Select
                                    value={formData.costLevel}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, costLevel: value }))}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {COST_LEVELS.map((cost) => (
                                            <SelectItem key={cost.level} value={cost.level} className="text-slate-300">
                                                {cost.symbol} - {cost.level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Min Günlük Bütçe ($)</Label>
                                <Input
                                    type="number"
                                    value={formData.dailyBudgetMin}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, dailyBudgetMin: e.target.value }))
                                    }
                                    placeholder="50"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Max Günlük Bütçe ($)</Label>
                                <Input
                                    type="number"
                                    value={formData.dailyBudgetMax}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, dailyBudgetMax: e.target.value }))
                                    }
                                    placeholder="200"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Etiketler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Travel Style */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Seyahat Tarzı</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newTravelStyle}
                                    onChange={(e) => setNewTravelStyle(e.target.value)}
                                    placeholder="Romantik, Macera, vb."
                                    className="bg-slate-800 border-slate-700 text-white"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTravelStyle())}
                                />
                                <Button type="button" onClick={addTravelStyle} size="icon" variant="outline">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.travelStyle.map((style) => (
                                    <span
                                        key={style}
                                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {style}
                                        <button type="button" onClick={() => removeTravelStyle(style)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Best For */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Kimler İçin</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newBestFor}
                                    onChange={(e) => setNewBestFor(e.target.value)}
                                    placeholder="Çiftler, Aileler, vb."
                                    className="bg-slate-800 border-slate-700 text-white"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBestFor())}
                                />
                                <Button type="button" onClick={addBestFor} size="icon" variant="outline">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.bestFor.map((item) => (
                                    <span
                                        key={item}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {item}
                                        <button type="button" onClick={() => removeBestFor(item)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Rating & Popularity */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-slate-200">Rating (0-5)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                                    placeholder="4.5"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-200">Popülerlik</Label>
                                <Input
                                    type="number"
                                    value={formData.popularity}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, popularity: e.target.value }))}
                                    placeholder="100"
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href="/dashboard/destinations">
                        <Button type="button" variant="outline" className="border-slate-700 text-slate-300">
                            İptal
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                    </Button>
                </div>
            </form>
        </div>
    );
}
