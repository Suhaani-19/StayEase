import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const API_URL = import.meta.env.VITE_API_URL || 'https://stayease-1-mijo.onrender.com';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchReviews();
  }, [search, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10', search });
      const res = await fetch(`${API_URL}/api/reviews?${params}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (confirm('Delete?')) {
      await fetch(`${API_URL}/api/reviews/${id}`, { method: 'DELETE' });
      fetchReviews();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <Link href="/reviews/create"><Button>Add Review</Button></Link>
        </div>
        <Input placeholder="Search..." value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);}} className="mb-6 max-w-md" />
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Rating</TableHead><TableHead>Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r: any) => (
              <TableRow key={r._id}>
                <TableCell>{r.title}</TableCell>
                <TableCell>{'★'.repeat(r.rating)}</TableCell>
                <TableCell>
                  <Link href={`/reviews/edit/${r._id}`}><Button variant="outline" size="sm" className="mr-2">Edit</Button></Link>
                  <Button variant="destructive" size="sm" onClick={() => deleteReview(r._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center gap-4 mt-6">
          <Button disabled={page === 1} onClick={() => setPage(p => p-1)}>Previous</Button>
          <span>Page {page} of {pagination.pages}</span>
          <Button disabled={page === pagination.pages} onClick={() => setPage(p => p+1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
