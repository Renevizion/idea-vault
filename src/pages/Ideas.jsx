import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import Header from '../components/Header';
import IdeaCard from '../components/IdeaCard';
import IdeaForm from '../components/IdeaForm';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      const records = await pb.collection('ideas').getFullList({
        sort: '-created',
        filter: `user="${pb.authStore.model.id}"` // Filter ideas by the logged-in user
      });
      setIdeas(records);
    } catch (err) {
      setError('Failed to fetch ideas: ' + err.message);
      console.error('Error fetching ideas:', err);
      if (err.status === 403 || err.status === 401) {
        // Redirect to auth if unauthorized
        pb.authStore.clear();
        window.location.href = '/auth';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdea = async (newIdea) => {
    try {
      await pb.collection('ideas').create({ ...newIdea, user: pb.authStore.model.id });
      setShowForm(false);
      fetchIdeas();
    } catch (err) {
      setError('Failed to add idea: ' + err.message);
      console.error('Error adding idea:', err);
    }
  };

  const handleUpdateIdea = async (id, updatedIdea) => {
    try {
      await pb.collection('ideas').update(id, updatedIdea);
      setEditingIdea(null);
      setShowForm(false);
      fetchIdeas();
    } catch (err) {
      setError('Failed to update idea: ' + err.message);
      console.error('Error updating idea:', err);
    }
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await pb.collection('ideas').delete(id);
        fetchIdeas();
      } catch (err) {
        setError('Failed to delete idea: ' + err.message);
        console.error('Error deleting idea:', err);
      }
    }
  };

  const handleEditClick = (idea) => {
    setEditingIdea(idea);
    setShowForm(true);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.href = '/auth';
  };

  if (!pb.authStore.isValid) {
    window.location.href = '/auth'; // Redirect to auth if not logged in
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Your Startup Ideas</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => { setShowForm(true); setEditingIdea(null); }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Idea
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <IdeaForm
                onSubmit={editingIdea ? handleUpdateIdea : handleAddIdea}
                initialData={editingIdea}
                onCancel={() => { setShowForm(false); setEditingIdea(null); }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center">Loading ideas...</p>
        ) : ideas.length === 0 ? (
          <p className="text-center">No ideas yet. Add your first idea!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={handleEditClick}
                onDelete={handleDeleteIdea}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ideas;
