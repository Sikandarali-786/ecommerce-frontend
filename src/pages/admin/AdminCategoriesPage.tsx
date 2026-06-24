import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiHash } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import toast from 'react-hot-toast';
import type { Category } from '../../types';

type CategoryFormData = {
  name: string;
  slug: string;
};

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories();
  const categories = data?.categories || [];

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: { name: '', slug: '' },
  });

  const watchedName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (!showModal) return;
    if (editing) return;

    const slug = (watchedName || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    setValue('slug', slug, { shouldValidate: true });
  }, [watchedName, editing, setValue, showModal]);

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
    reset({ name: '', slug: '' });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    reset({ name: cat.name, slug: cat.slug });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    reset({ name: '', slug: '' });
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, data });
    } else {
      createMutation.mutate(data);
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
                  className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(cat._id)}
                  className="text-red-600 hover:bg-red-50 cursor-pointer"
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
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 px-2!">✕</Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <FormField
                id="name"
                label="Name *"
                placeholder="Enter Category Name"
                icon={<FiTag size={16} />}
                registration={register('name', { required: 'Category name is required' })}
                error={errors.name?.message}
              />
              <FormField
                id="slug"
                label="Slug *"
                placeholder="Auto slug create"
                icon={<FiHash size={16} />}
                registration={register('slug', { required: 'Slug is required' })}
                error={errors.slug?.message}
              />
              <p className="text-xs text-gray-400 -mt-1">Auto-generated from name. Used in URLs.</p>
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
