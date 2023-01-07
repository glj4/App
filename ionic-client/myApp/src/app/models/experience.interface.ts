export interface Experience {
    _id: string,
    user: string,
    title: string,
    description: string,
    location: string,
    finalPrice: Number,
    images: string[],
    isPublished: boolean
}