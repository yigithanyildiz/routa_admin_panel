'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardStats } from '@/lib/firebase-service';
import { DashboardStats, Destination, PopularPlace } from '@/types';
import { MapPin, Building2, Globe, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400">Routa destinasyon verilerine genel bakış</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Toplam Destinasyon"
                    value={stats?.totalDestinations}
                    loading={loading}
                    icon={MapPin}
                    gradient="from-purple-500 to-indigo-600"
                />
                <StatsCard
                    title="Toplam Yer"
                    value={stats?.totalPlaces}
                    loading={loading}
                    icon={Building2}
                    gradient="from-blue-500 to-cyan-600"
                />
                <StatsCard
                    title="Ülke Sayısı"
                    value={stats?.totalCountries}
                    loading={loading}
                    icon={Globe}
                    gradient="from-emerald-500 to-teal-600"
                />
                <StatsCard
                    title="Ortalama Rating"
                    value={
                        stats
                            ? (
                                stats.recentDestinations.reduce((acc, d) => acc + (d.rating || 0), 0) /
                                (stats.recentDestinations.filter((d) => d.rating).length || 1)
                            ).toFixed(1)
                            : undefined
                    }
                    loading={loading}
                    icon={Star}
                    gradient="from-amber-500 to-orange-600"
                    suffix="/ 5"
                />
            </div>

            {/* Recent Items */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Destinations */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Son Destinasyonlar</CardTitle>
                                <CardDescription className="text-slate-400">
                                    En son eklenen destinasyonlar
                                </CardDescription>
                            </div>
                            <Link
                                href="/dashboard/destinations"
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Tümünü Gör →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full bg-slate-800" />
                            ))
                        ) : stats?.recentDestinations.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Henüz destinasyon yok</p>
                        ) : (
                            stats?.recentDestinations.map((dest) => (
                                <DestinationCard key={dest.id} destination={dest} />
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Recent Places */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Son Yerler</CardTitle>
                                <CardDescription className="text-slate-400">
                                    En son eklenen popüler yerler
                                </CardDescription>
                            </div>
                            <Link
                                href="/dashboard/places"
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Tümünü Gör →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full bg-slate-800" />
                            ))
                        ) : stats?.recentPlaces.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Henüz yer yok</p>
                        ) : (
                            stats?.recentPlaces.map((place) => (
                                <PlaceCard key={place.id} place={place} />
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Stats Card Component
function StatsCard({
    title,
    value,
    loading,
    icon: Icon,
    gradient,
    suffix,
}: {
    title: string;
    value?: number | string;
    loading: boolean;
    icon: any;
    gradient: string;
    suffix?: string;
}) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group hover:border-slate-700 transition-colors">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-400">{title}</p>
                        {loading ? (
                            <Skeleton className="h-8 w-16 bg-slate-800" />
                        ) : (
                            <p className="text-2xl font-bold text-white">
                                {value}
                                {suffix && <span className="text-sm text-slate-400 ml-1">{suffix}</span>}
                            </p>
                        )}
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Destination Card Component
function DestinationCard({ destination }: { destination: Destination }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {destination.imageURL ? (
                    <img
                        src={destination.imageURL}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{destination.name}</p>
                <p className="text-sm text-slate-400">{destination.country}</p>
            </div>
            {destination.rating && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    <Star className="w-3 h-3 mr-1" />
                    {destination.rating}
                </Badge>
            )}
        </div>
    );
}

// Place Card Component
function PlaceCard({ place }: { place: PopularPlace }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {place.imageURL ? (
                    <img
                        src={place.imageURL}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{place.name}</p>
                <p className="text-sm text-slate-400">{place.type}</p>
            </div>
            {place.rating && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    <Star className="w-3 h-3 mr-1" />
                    {place.rating}
                </Badge>
            )}
        </div>
    );
}
