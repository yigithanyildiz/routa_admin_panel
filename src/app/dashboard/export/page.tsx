'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportAllData, getDestinations, getPlaces } from '@/lib/firebase-service';
import { Download, FileJson, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportPage() {
    const [exporting, setExporting] = useState<string | null>(null);

    const handleExportJSON = async () => {
        setExporting('json');
        try {
            const data = await exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `routa-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('JSON dosyası başarıyla indirildi');
        } catch (error) {
            console.error('Error exporting:', error);
            toast.error('Dışa aktarma başarısız oldu');
        } finally {
            setExporting(null);
        }
    };

    const handleExportDestinationsCSV = async () => {
        setExporting('destinations-csv');
        try {
            const destinations = await getDestinations();

            const headers = ['ID', 'İsim', 'Ülke', 'Açıklama', 'İklim', 'Rating', 'Para Birimi', 'Dil', 'Enlem', 'Boylam'];
            const rows = destinations.map(d => [
                d.id,
                d.name,
                d.country,
                d.description.replace(/"/g, '""'),
                d.climate || '',
                d.rating?.toString() || '',
                d.currency,
                d.language,
                d.coordinates.latitude.toString(),
                d.coordinates.longitude.toString(),
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `routa-destinations-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Destinasyonlar CSV olarak indirildi');
        } catch (error) {
            console.error('Error exporting:', error);
            toast.error('Dışa aktarma başarısız oldu');
        } finally {
            setExporting(null);
        }
    };

    const handleExportPlacesCSV = async () => {
        setExporting('places-csv');
        try {
            const places = await getPlaces();

            const headers = ['ID', 'İsim', 'Tip', 'Şehir ID', 'Açıklama', 'Rating', 'Enlem', 'Boylam'];
            const rows = places.map(p => [
                p.id,
                p.name,
                p.type,
                p.cityId,
                p.description.replace(/"/g, '""'),
                p.rating.toString(),
                p.coordinates.latitude.toString(),
                p.coordinates.longitude.toString(),
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `routa-places-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Yerler CSV olarak indirildi');
        } catch (error) {
            console.error('Error exporting:', error);
            toast.error('Dışa aktarma başarısız oldu');
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white">Dışa Aktar</h1>
                <p className="text-slate-400">Tüm verileri JSON veya CSV formatında indirin</p>
            </div>

            {/* Export Options */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Full JSON Export */}
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <FileJson className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Tam JSON Export</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Tüm destinasyonlar ve yerler
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                    Destinasyonlar
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                    Yerler
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400">
                                Tüm verileri tek bir JSON dosyası olarak indirir. İçe aktarma için idealdir.
                            </p>
                            <Button
                                onClick={handleExportJSON}
                                disabled={exporting !== null}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                                {exporting === 'json' ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                JSON İndir
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Destinations CSV */}
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <FileSpreadsheet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Destinasyonlar CSV</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Excel uyumlu format
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                                Excel / Google Sheets
                            </Badge>
                            <p className="text-sm text-slate-400">
                                Destinasyonları CSV formatında indirir. Excel veya Google Sheets'te açılabilir.
                            </p>
                            <Button
                                onClick={handleExportDestinationsCSV}
                                disabled={exporting !== null}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                {exporting === 'destinations-csv' ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                CSV İndir
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Places CSV */}
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <FileSpreadsheet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Yerler CSV</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Excel uyumlu format
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                Excel / Google Sheets
                            </Badge>
                            <p className="text-sm text-slate-400">
                                Popüler yerleri CSV formatında indirir. Excel veya Google Sheets'te açılabilir.
                            </p>
                            <Button
                                onClick={handleExportPlacesCSV}
                                disabled={exporting !== null}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                                {exporting === 'places-csv' ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 mr-2" />
                                )}
                                CSV İndir
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
