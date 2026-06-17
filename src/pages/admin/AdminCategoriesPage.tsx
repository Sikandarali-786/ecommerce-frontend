import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import type { Category } from '../../types';

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories();
  const categories = data?.categories || [];

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm({ name, slug });
  };

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; slug: string } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      setDeleteConfirm(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete category'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', slug: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing._id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={openCreate}
          leftIcon={<FiPlus size={18} />}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FiTag className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No categories yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiTag className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(cat)}
                  className="text-blue-600 hover:bg-blue-50"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(cat._id)}
                  className="text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Category' : 'Add New Category'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 !px-2">✕</Button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. electronics"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-generated from name. Used in URLs.</p>
              </div>
              <div className="flex space-x-3 pt-2">
                <Button variant="secondary" size="md" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isPending}
                  className="flex-1"
                >
                  {isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-gray-600 mb-6">
              Are you sure? Categories with products cannot be deleted.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                loading={deleteMutation.isPending}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
