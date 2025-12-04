import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'https://stayease-1-mijo.onrender.com';

export default function ReviewCreate() {
  const [form, setForm] = useState({ 
    title: '', 
    comment: '', 
    rating: 5, 
    userId: 'test-user-id', 
    listingId: '' 
  });
  const [loading, setLoading] = useState(false);

  // ✅ AUTO-FILL listingId from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('listingId');
    if (listingId) {
      setForm(prev => ({ ...prev, listingId }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        window.location.href = `/listing/${form.listingId}`; // ✅ BACK TO LISTING
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create review'}`);
      }
    } catch (err) {
      alert('Network error - check console');
      console.error('Review create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Write a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Input 
            placeholder="Title" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })}
            required 
          />
          <Textarea 
            placeholder="Your review..." 
            value={form.comment} 
            onChange={e => setForm({ ...form, comment: e.target.value })}
            rows={4}
            required 
          />
          <Input 
            type="number" 
            min={1} 
            max={5} 
            placeholder="Rating (1-5)" 
            value={form.rating} 
            onChange={e => setForm({ ...form, rating: +e.target.value })}
            required 
          />
          
          {form.listingId && (
            <div className="text-sm bg-green-50 p-3 rounded">
              ✅ Listing ID: <code>{form.listingId}</code>
            </div>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            User ID auto-set for demo
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Review'}
            </Button>
            <Link href={form.listingId ? `/listing/${form.listingId}` : '/'}>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
