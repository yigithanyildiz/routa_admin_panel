'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { importDestinations } from '@/lib/firebase-service';
import { Destination } from '@/types';
import { Upload, FileJson, Loader2, CheckCircle2, AlertCircle, FileUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportPage() {
    const [importing, setImporting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState<{ destinations: any[]; places: any[] } | null>(null);
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.json')) {
            toast.error('Sadece JSON dosyaları desteklenir');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                setPreviewData({
                    destinations: data.destinations || [],
                    places: data.places || [],
                });
                setImportResult(null);
            } catch (error) {
                toast.error('JSON dosyası okunamadı');
            }
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!previewData) return;
        setImporting(true);

        try {
            let success = 0;
            let failed = 0;

            // Import destinations
            for (const dest of previewData.destinations) {
                try {
                    await importDestinations([dest]);
                    success++;
                } catch (error) {
                    failed++;
                    console.error('Error importing destination:', dest.name, error);
                }
            }

            setImportResult({ success, failed });
            toast.success(`${success} destinasyon başarıyla içe aktarıldı`);
            if (failed > 0) {
                toast.warning(`${failed} destinasyon aktarılamadı`);
            }
        } catch (error) {
            console.error('Error importing:', error);
            toast.error('İçe aktarma başarısız oldu');
        } finally {
            setImporting(false);
        }
    };

    const clearPreview = () => {
        setPreviewData(null);
        setImportResult(null);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white">İçe Aktar</h1>
                <p className="text-slate-400">JSON dosyasından toplu veri yükleyin</p>
            </div>

            {/* Upload Area */}
            {!previewData ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-8">
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-slate-700 hover:border-slate-600'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6">
                                <FileUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                JSON dosyasını sürükleyin
                            </h3>
                            <p className="text-slate-400 mb-6">
                                veya dosya seçmek için tıklayın
                            </p>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button
                                    type="button"
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 cursor-pointer"
                                    asChild
                                >
                                    <span>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Dosya Seç
                                    </span>
                                </Button>
                            </label>
                            <p className="text-xs text-slate-500 mt-4">
                                Dışa Aktar sayfasından indirilen JSON formatı desteklenir
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Preview */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                        <FileJson className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">İçe Aktarma Önizleme</CardTitle>
                                        <CardDescription className="text-slate-400">
                                            Aşağıdaki veriler içe aktarılacak
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={clearPreview}
                                    className="border-slate-700 text-slate-300"
                                >
                                    İptal
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                            Destinasyonlar
                                        </Badge>
                                        <span className="text-2xl font-bold text-white">
                                            {previewData.destinations.length}
                                        </span>
                                    </div>
                                    {previewData.destinations.length > 0 && (
                                        <p className="text-sm text-slate-400">
                                            İlk 3: {previewData.destinations.slice(0, 3).map(d => d.name).join(', ')}
                                            {previewData.destinations.length > 3 && '...'}
                                        </p>
                                    )}
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                            Yerler
                                        </Badge>
                                        <span className="text-2xl font-bold text-white">
                                            {previewData.places.length}
                                        </span>
                                    </div>
                                    {previewData.places.length > 0 && (
                                        <p className="text-sm text-slate-400">
                                            İlk 3: {previewData.places.slice(0, 3).map(p => p.name).join(', ')}
                                            {previewData.places.length > 3 && '...'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {importResult ? (
                                <div className="p-4 rounded-lg bg-slate-800/50 space-y-2">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>{importResult.success} kayıt başarıyla içe aktarıldı</span>
                                    </div>
                                    {importResult.failed > 0 && (
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <AlertCircle className="w-5 h-5" />
                                            <span>{importResult.failed} kayıt aktarılamadı</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    onClick={handleImport}
                                    disabled={importing || previewData.destinations.length === 0}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                >
                                    {importing ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    İçe Aktar
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Info Card */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">İçe Aktarma Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-400">
                    <p>• Sadece <strong className="text-white">JSON</strong> formatı desteklenir</p>
                    <p>• Dışa Aktar sayfasından indirilen dosya formatı kullanılmalıdır</p>
                    <p>• Mevcut veriler üzerine yazılmaz, yeni kayıtlar eklenir</p>
                    <p>• Aynı ID'li kayıtlar zaten varsa hata verebilir</p>
                </CardContent>
            </Card>
        </div>
    );
}
