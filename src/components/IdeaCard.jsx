import React from 'react';

const IdeaCard = ({ idea, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(idea.title);
  const [editedDescription, setEditedDescription] = React.useState(idea.description);
  const [editedTags, setEditedTags] = React.useState(idea.tags.join(', '));

  const handleSave = () => {
    onEdit(idea.id, { title: editedTitle, description: editedDescription, tags: editedTags.split(',').map(tag => tag.trim()) });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            className="text-xl font-semibold mb-2 w-full p-2 border rounded"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="text-gray-700 mb-4 w-full p-2 border rounded h-32"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <input
            type="text"
            className="text-sm text-gray-500 w-full p-2 border rounded"
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            placeholder="Tags (comma-separated)"
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
          <p className="text-gray-700 mb-4">{idea.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;