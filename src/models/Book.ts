export interface Book {
    id: number;
    title: string;
    author: string;
    available: boolean;
    memberId?: number;
    publicationYear: number;
    category: string;
    isbn: string;
    synopsis: string;
}