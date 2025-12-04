import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_API_URL || 'https://stayease-1-mijo.onrender.com';

export default function ReviewEdit() {
  const [match, params] = useRoute('/reviews/edit/:id');
  const [review, setReview] = useState<any>(null);
  const [form, setForm] = useState({ title: '', comment: '', rating: 5 });
  const id = params?.id;

  useEffect(() => {
    if (id) fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`);
      const data = await res.json();
      setReview(data);
      setForm({ title: data.title || '', comment: data.comment || '', rating: data.rating || 5 });
    } catch (err) {
      window.location.href = '/reviews';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      window.location.href = '/reviews';
    } catch (err) { 
      alert('Error'); 
    }
  };

  const handleCancel = () => {
    window.location.href = '/reviews';
  };

  if (!review && !id) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Input 
            placeholder="Title" 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
          />
          <Textarea 
            placeholder="Comment" 
            value={form.comment} 
            onChange={e => setForm({...form, comment: e.target.value})} 
          />
          <Input 
            type="number" 
            min={1} 
            max={5} 
            value={form.rating} 
            onChange={e => setForm({...form, rating: +e.target.value})} 
          />
          <div className="flex gap-2">
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
