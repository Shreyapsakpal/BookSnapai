import React, { useState } from 'react';
import { Search, Filter, Grid, List, BookOpen, Calendar, Tag, Share2, Download, Star } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const LibraryView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockBooks = [
    {
      id: '1',
      title: 'Introduction to Quantum Physics',
      author: 'Dr. Sarah Chen',
      scanDate: '2024-01-15',
      pages: 15,
      tags: ['physics', 'quantum', 'science'],
      thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      isPublic: false,
      rating: 4.8,
      concepts: ['quantum mechanics', 'wave-particle duality']
    },
    {
      id: '2',
      title: 'Advanced Mathematics',
      author: 'Prof. Michael Johnson',
      scanDate: '2024-01-10',
      pages: 23,
      tags: ['mathematics', 'calculus', 'algebra'],
      thumbnail: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      isPublic: true,
      rating: 4.9,
      concepts: ['derivatives', 'integrals', 'linear algebra']
    },
    {
      id: '3',
      title: 'Organic Chemistry Basics',
      author: 'Dr. Emily Rodriguez',
      scanDate: '2024-01-08',
      pages: 18,
      tags: ['chemistry', 'organic', 'molecules'],
      thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      isPublic: false,
      rating: 4.7,
      concepts: ['carbon compounds', 'reaction mechanisms']
    }
  ];

  const BookCard = ({ book }: { book: any }) => (
    <Card variant="elevated" className="overflow-hidden hover:scale-105 transition-transform duration-200">
      <div className="relative">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {book.isPublic && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              Public
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center text-white text-xs">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {book.rating}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {book.author}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(book.scanDate).toLocaleDateString()}
          <span className="mx-2">•</span>
          <BookOpen className="w-4 h-4 mr-1" />
          {book.pages} pages
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {book.tags.map((tag: string, index: number) => (
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
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-16 h-20 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {book.author}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(book.scanDate).toLocaleDateString()}
                <span className="mx-2">•</span>
                <BookOpen className="w-4 h-4 mr-1" />
                {book.pages} pages
                <span className="mx-2">•</span>
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {book.rating}
              </div>

              <div className="flex flex-wrap gap-1">
                {book.tags.map((tag: string, index: number) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Library</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {mockBooks.length} books scanned
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
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Books</option>
              <option value="physics">Physics</option>
              <option value="mathematics">Mathematics</option>
              <option value="chemistry">Chemistry</option>
            </select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Books */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {mockBooks.map((book) => (
          <div key={book.id}>
            {viewMode === 'grid' ? <BookCard book={book} /> : <BookListItem book={book} />}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {mockBooks.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No books yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start scanning books to build your digital library
          </p>
          <Button>
            Start Scanning
          </Button>
        </Card>
      )}
    </div>
  );
};

export default LibraryView;