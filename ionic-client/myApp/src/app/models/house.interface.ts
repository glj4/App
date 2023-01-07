export interface House {
    _id: string,
    name: string,
    description: string,
    location: string,
    price: number,
    people: number,
    rooms: number,
    bookings: string[],
    images: string[],
    baths: number,
    ubication: {
        lat: any,
        lng: any
    }
}