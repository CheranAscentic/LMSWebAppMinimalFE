import type { Book } from "@/models/Book";
import type { User } from "@/models/User";
import { BookOpen, Calendar, Hash, Key, UserIcon } from "lucide-react";
import { Button } from "./ui/button";

interface BookCardProps {
    book: Book;
    handleBorrow: (bookId: number) => void;
    appUser: User;
}

export default function BookCard({book, handleBorrow, appUser}: BookCardProps) {

    return(
        <div
            key={book.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            style={{
              background: 'var(--color-card)',
              color: 'var(--color-card-foreground)',
              borderRadius: 'var(--radius-xl)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="
                grid
                grid-cols-[5fr_5fr_1fr_5fr]
                grid-rows-[1fr_2fr_3fr_1fr]
              "
              style={{ minHeight: 320 }}
            >
              {/* 1,1: Book Icon */}
              <div className="col-start-1 row-start-1">
                <BookOpen className="w-8 h-8 text-primary flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              </div>

              {/* 5,1: Availability Badge */}
              <div className="col-start-4 row-start-1 justify-self-end self-start">
                <div
                  className="px-3 py-1 rounded-full text-xs border font-semibold"
                  style={{
                    background: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                    color: book.available ? 'var(--color-accent-foreground)' : '#fff',
                    borderColor: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  {book.available ? 'available' : 'Borrowed'}
                </div>
              </div>

              {/* 2,1 to 2,4: Book Title */}
              <div className="col-start-1 col-end-5 row-start-2 flex items-center">
                <h3 className="text-xl font-semibold mb-0" style={{ color: 'var(--color-foreground)' }}>
                  {book.title}
                </h3>
              </div>

              {/* 3,1 to 3,4: Book Info Block (spans 2 rows, all columns) */}
              <div className="col-start-1 col-end-5 row-start-3 row-end-5">
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>Published: {book.publicationYear}</span>
                  </div>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>ID: {book.id}</span>
                  </div>
                </div>
              </div>

              {/* 5,1 to 5,4: Borrow Button */}
              {appUser.type === "Member" && (
                <div className="col-start-1 col-end-5 row-start-4 flex items-center">
                  <Button
                    disabled={!book.available}
                    variant={book.available ? "default" : "secondary"}
                    className="ml-2"
                    title={book.available ? "Borrow this book" : "Not available"}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </Button>
                </div>
              )}
            </div>
          </div>
    );
} 