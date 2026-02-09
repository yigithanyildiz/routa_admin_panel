import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    Timestamp,
    GeoPoint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Destination, PopularPlace, DashboardStats } from '@/types';

const CITIES_COLLECTION = 'cities';
const PLACES_COLLECTION = 'places';

// Helper to convert Firestore document to Destination
// IMPORTANT: We use doc.id (Firestore document ID) as the primary ID for all operations
function convertToDestination(docSnapshot: any): Destination {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id, // Always use Firestore document ID
        name: data.name,
        country: data.country,
        description: data.description,
        imageURL: data.imageURL,
        popularMonths: data.popularMonths || [],
        averageTemperature: data.averageTemperature || { summer: 25, winter: 10 },
        currency: data.currency,
        language: data.language,
        coordinates: data.coordinates instanceof GeoPoint
            ? { latitude: data.coordinates.latitude, longitude: data.coordinates.longitude }
            : data.coordinates,
        address: data.address,
        climate: data.climate,
        costOfLiving: data.costOfLiving,
        topAttractions: data.topAttractions,
        travelStyle: data.travelStyle,
        bestFor: data.bestFor,
        popularity: data.popularity,
        rating: data.rating,
        createdAt: data.createdAt?.toDate?.() || undefined,
        updatedAt: data.updatedAt?.toDate?.() || undefined,
    };
}

// Helper to convert Firestore document to PopularPlace
// IMPORTANT: We use doc.id (Firestore document ID) as the primary ID for all operations
function convertToPlace(docSnapshot: any): PopularPlace {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id, // Always use Firestore document ID
        name: data.name,
        type: data.type || 'Genel',
        cityId: data.cityId,
        coordinates: data.coordinates instanceof GeoPoint
            ? { latitude: data.coordinates.latitude, longitude: data.coordinates.longitude }
            : data.coordinates,
        rating: data.rating || 0,
        imageURL: data.imageURL,
        description: data.description,
    };
}

// ==================== DESTINATIONS ====================

export async function getDestinations(): Promise<Destination[]> {
    const snapshot = await getDocs(collection(db, CITIES_COLLECTION));
    return snapshot.docs.map(convertToDestination);
}

export async function getDestination(id: string): Promise<Destination | null> {
    const docRef = doc(db, CITIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return convertToDestination(docSnap);
}

export async function createDestination(data: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, CITIES_COLLECTION), {
        ...data,
        coordinates: new GeoPoint(data.coordinates.latitude, data.coordinates.longitude),
        createdAt: now,
        updatedAt: now,
    });

    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}

export async function updateDestination(id: string, data: Partial<Destination>): Promise<void> {
    const docRef = doc(db, CITIES_COLLECTION, id);
    const updateData: any = { ...data, updatedAt: Timestamp.now() };

    if (data.coordinates) {
        updateData.coordinates = new GeoPoint(data.coordinates.latitude, data.coordinates.longitude);
    }

    await updateDoc(docRef, updateData);
}

export async function deleteDestination(id: string): Promise<void> {
    await deleteDoc(doc(db, CITIES_COLLECTION, id));
}

// ==================== PLACES ====================

export async function getPlaces(): Promise<PopularPlace[]> {
    const snapshot = await getDocs(collection(db, PLACES_COLLECTION));
    return snapshot.docs.map(convertToPlace);
}

export async function getPlacesByCity(cityId: string): Promise<PopularPlace[]> {
    const snapshot = await getDocs(collection(db, PLACES_COLLECTION));
    return snapshot.docs
        .map(convertToPlace)
        .filter(place => place.cityId === cityId);
}

export async function createPlace(data: Omit<PopularPlace, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, PLACES_COLLECTION), {
        ...data,
        coordinates: new GeoPoint(data.coordinates.latitude, data.coordinates.longitude),
    });

    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
}

export async function updatePlace(id: string, data: Partial<PopularPlace>): Promise<void> {
    const docRef = doc(db, PLACES_COLLECTION, id);
    const updateData: any = { ...data };

    if (data.coordinates) {
        updateData.coordinates = new GeoPoint(data.coordinates.latitude, data.coordinates.longitude);
    }

    await updateDoc(docRef, updateData);
}

export async function deletePlace(id: string): Promise<void> {
    await deleteDoc(doc(db, PLACES_COLLECTION, id));
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats(): Promise<DashboardStats> {
    const [destinations, places] = await Promise.all([
        getDestinations(),
        getPlaces(),
    ]);

    const countries = new Set(destinations.map(d => d.country));

    // Sort by createdAt for recent items
    const sortedDestinations = [...destinations].sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA;
    });

    return {
        totalDestinations: destinations.length,
        totalPlaces: places.length,
        totalCountries: countries.size,
        recentDestinations: sortedDestinations.slice(0, 5),
        recentPlaces: places.slice(0, 5),
    };
}

// ==================== BULK OPERATIONS ====================

export async function exportAllData(): Promise<{ destinations: Destination[]; places: PopularPlace[] }> {
    const [destinations, places] = await Promise.all([
        getDestinations(),
        getPlaces(),
    ]);

    return { destinations, places };
}

export async function importDestinations(destinations: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
    let count = 0;
    for (const dest of destinations) {
        await createDestination(dest);
        count++;
    }
    return count;
}
