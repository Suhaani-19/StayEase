import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'https://stayease-1-mijo.onrender.com';

export default function ReviewCreate() {
  const [form, setForm] = useState({ title: '', comment: '', rating: 5, userId: 'test', listingId: '' });

  // Pre-fill listingId from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('listingId');
    if (listingId) {
      setForm((prev) => ({ ...prev, listingId }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      window.location.href = `/listing/${form.listingId}`; // redirect back to listing detail 
    } catch (err) {
      alert('Error creating review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Comment" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
          <Input placeholder="Rating (1-5)" type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} />
          <div className="text-sm text-gray-500">User ID and Listing ID are set automatically</div>
          <div className="flex gap-2">
            <Button type="submit">Create</Button>
            <Link href={`/listing/${form.listingId || ''}`}><Button variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
