'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardStats, getDestinations } from '@/lib/firebase-service';
import { DashboardStats, Destination, PopularPlace } from '@/types';
import { MapPin, Building2, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const PIE_COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7'];

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, destData] = await Promise.all([
                getDashboardStats(),
                getDestinations(),
            ]);
            setStats(statsData);
            setAllDestinations(destData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Chart data: destinations per country
    const countryData = useMemo(() => {
        const countMap: Record<string, number> = {};
        allDestinations.forEach((d) => {
            countMap[d.country] = (countMap[d.country] || 0) + 1;
        });
        return Object.entries(countMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [allDestinations]);

    // Chart data: climate distribution
    const climateData = useMemo(() => {
        const countMap: Record<string, number> = {};
        allDestinations.forEach((d) => {
            const climate = d.climate || 'Belirtilmemiş';
            countMap[climate] = (countMap[climate] || 0) + 1;
        });
        return Object.entries(countMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allDestinations]);

    // Chart data: rating distribution
    const ratingData = useMemo(() => {
        const buckets = [
            { name: '0-1', min: 0, max: 1, count: 0 },
            { name: '1-2', min: 1, max: 2, count: 0 },
            { name: '2-3', min: 2, max: 3, count: 0 },
            { name: '3-4', min: 3, max: 4, count: 0 },
            { name: '4-5', min: 4, max: 5.1, count: 0 },
        ];
        allDestinations.forEach((d) => {
            if (d.rating !== undefined) {
                const bucket = buckets.find((b) => d.rating! >= b.min && d.rating! < b.max);
                if (bucket) bucket.count++;
            }
        });
        return buckets.map((b) => ({ name: b.name, value: b.count }));
    }, [allDestinations]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-white font-medium">{label || payload[0].name}</p>
                    <p className="text-purple-400 text-sm">{payload[0].value} destinasyon</p>
                </div>
            );
        }
        return null;
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
                                allDestinations.reduce((acc, d) => acc + (d.rating || 0), 0) /
                                (allDestinations.filter((d) => d.rating).length || 1)
                            ).toFixed(1)
                            : undefined
                    }
                    loading={loading}
                    icon={Star}
                    gradient="from-amber-500 to-orange-600"
                    suffix="/ 5"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Country Distribution Bar Chart */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Ülkelere Göre Destinasyonlar</CardTitle>
                        <CardDescription className="text-slate-400">
                            En fazla destinasyona sahip ülkeler
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-64 w-full bg-slate-800" />
                        ) : countryData.length === 0 ? (
                            <p className="text-slate-500 text-center py-12">Veri yok</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={countryData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#barGradient)"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={48}
                                    />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Climate Pie Chart */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">İklim Dağılımı</CardTitle>
                        <CardDescription className="text-slate-400">
                            Destinasyonların iklim tiplerine göre dağılımı
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-64 w-full bg-slate-800" />
                        ) : climateData.length === 0 ? (
                            <p className="text-slate-500 text-center py-12">Veri yok</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={climateData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {climateData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                                        iconType="circle"
                                        iconSize={8}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Rating Chart */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Rating Dağılımı</CardTitle>
                    <CardDescription className="text-slate-400">
                        Destinasyonların puan aralıklarına göre sayısı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-48 w-full bg-slate-800" />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={ratingData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} />
                                <Bar
                                    dataKey="value"
                                    fill="url(#ratingGradient)"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={60}
                                />
                                <defs>
                                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

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
