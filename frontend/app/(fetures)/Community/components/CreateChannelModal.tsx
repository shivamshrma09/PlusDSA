import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { communicationService } from '../services/communicationService';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: () => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onChannelCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Channel name is required');
      return;
    }

    try {
      setCreating(true);
      await communicationService.createChannel({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://ik.imagekit.io/qwzhnpeqg/PlusDSA/default-channel.png'
      });
      
      setFormData({ name: '', description: '', image: '' });
      onChannelCreated();
      onClose();
    } catch (error) {
      setError('Failed to create channel. Please try again.');
      console.error('Failed to create channel:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', image: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create Channel</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Channel Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter channel name"
              className="w-full bg-black text-white p-3 rounded-lg border border-neutral-500/30 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter channel description"
              rows={3}
              className="w-full bg-black text-white p-3 rounded-lg border border-neutral-500/30 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Channel Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Enter image URL (optional)"
              className="w-full bg-black text-white p-3 rounded-lg border border-neutral-500/30 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-300 border border-neutral-500/30 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;