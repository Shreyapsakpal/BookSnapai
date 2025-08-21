import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, BookOpen, Calendar, Tag, Share2, Download, Star } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { api } from '../utils/api';

const LibraryView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api<any[]>('/api/books');
        setBooks(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = books.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (Array.isArray(b.tags) ? b.tags : []).some((t: string) => t.toLowerCase().includes(q))
    );
  });

  const BookCard = ({ book }: { book: any }) => (
    <Card variant="elevated" className="overflow-hidden hover:scale-105 transition-transform duration-200">
      <div className="relative">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">No cover</div>
        )}
        <div className="absolute top-3 right-3">
          {book.isPublic && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              Public
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {book.author || 'Unknown author'}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(book.scanDate).toLocaleDateString()}
          <span className="mx-2">•</span>
          <BookOpen className="w-4 h-4 mr-1" />
          {book.totalPages} pages
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(book.tags || []).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <BookOpen className="w-4 h-4 mr-1" />
            Read
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const BookListItem = ({ book }: { book: any }) => (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-16 h-20 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">No cover</div>
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {book.author || 'Unknown author'}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(book.scanDate).toLocaleDateString()}
                <span className="mx-2">•</span>
                <BookOpen className="w-4 h-4 mr-1" />
                {book.totalPages} pages
              </div>

              <div className="flex flex-wrap gap-1">
                {(book.tags || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm">
                <BookOpen className="w-4 h-4 mr-1" />
                Read
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return <div className="p-6 text-gray-600 dark:text-gray-300">Loading library...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Library</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {books.length} books scanned
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search books, authors, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Books Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;