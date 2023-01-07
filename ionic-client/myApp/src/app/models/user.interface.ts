export interface User {
    _id: string,
    name: string | undefined,
    surname: string | undefined,
    password: string | undefined,
    phone: string | undefined,
    points: number | undefined,
    bookings: JSON | undefined,
    tripsPublished: JSON | undefined,
    favorites: JSON | undefined
}