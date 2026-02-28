import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuth } from './useAuth';

export const useIdeas = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdeas = useCallback(async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Ensure that 'ideas' collection has a filter by user.id or an appropriate rule
      const records = await pb.collection('ideas').getFullList({
        sort: '-created',
        filter: `user = "${user.id}"`,
      });
      setIdeas(records);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
      setError('Failed to fetch ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIdeas();

    // Subscribe to real-time updates for ideas related to the current user
    let unsubscribe;
    const subscribeToIdeas = async () => {
      if (user) {
        unsubscribe = await pb.collection('ideas').subscribe('*', (e) => {
            // Only update if the event concerns an idea owned by the current user
            if (e.record.user === user.id) {
                if (e.action === 'create') {
                    setIdeas((prev) => [e.record, ...prev]);
                } else if (e.action === 'update') {
                    setIdeas((prev) => prev.map((idea) => (idea.id === e.record.id ? e.record : idea)));
                } else if (e.action === 'delete') {
                    setIdeas((prev) => prev.filter((idea) => idea.id !== e.record.id));
                }
            }
        });
      }
    };

    subscribeToIdeas();

    return () => {
      if (unsubscribe) {
        // Unsubscribe from real-time updates when the component unmounts or user changes
        pb.collection('ideas').unsubscribe('*');
      }
    };
  }, [fetchIdeas, user]);

  const addIdea = async (ideaData) => {
    if (!user) {
      setError('You must be logged in to add an idea.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newIdea = await pb.collection('ideas').create({ ...ideaData, user: user.id });
      // Real-time subscription will handle updating the state, no need to manually setIdeas
      return newIdea;
    } catch (err) {
      console.error('Failed to add idea:', err);
      setError('Failed to add idea. Please check your input.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIdea = async (id, ideaData) => {
    if (!user) {
      setError('You must be logged in to update an idea.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedIdea = await pb.collection('ideas').update(id, ideaData);
      // Real-time subscription will handle updating the state
      return updatedIdea;
    } catch (err) {
      console.error('Failed to update idea:', err);
      setError('Failed to update idea. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (id) => {
    if (!user) {
      setError('You must be logged in to delete an idea.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await pb.collection('ideas').delete(id);
      // Real-time subscription will handle updating the state
    } catch (err) {
      console.error('Failed to delete idea:', err);
      setError('Failed to delete idea. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    addIdea,
    updateIdea,
    deleteIdea,
  };
};