export interface Hotel {
    _id: string,
    name: string,
    description: string,
    location: string,
    price: number,
    people: number,
    rooms: number,
    bookings: string[],
    images: string[],
    parking: boolean,
    buffet: boolean,
    ubication: {
        lat: any,
        lng: any
    }
}