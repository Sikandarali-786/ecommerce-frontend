import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiUpload, FiX } from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Table from '../../components/Table';
import type { TableColumn } from '../../components/Table';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { API_ENDPOINTS } from '../../api/endpoints';
import { deleteProduct } from '../../api';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { getImageUrl } from '../../utils/image';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

const emptyForm: ProductFormData = {
  title: '',
  description: '',
  price: '',
  stock: '',
  category: '',
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  // Pass server-side params (search applied server-side)
  const { data: productsData, isLoading } = useProducts({ page, limit, search });
  const { data: categoriesData } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // ─── Create mutation (multipart/form-data) ───────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.post(API_ENDPOINTS.PRODUCT.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create product'),
  });

  // ─── Update mutation (multipart/form-data) ───────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await axiosInstance.put(API_ENDPOINTS.PRODUCT.UPDATE(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update product'),
  });

  // ─── Delete mutation ─────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
      setDeleteConfirm(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete product'),
  });

  // ─── File selection ──────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setRemovedImages([]);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: typeof product.category === 'object' ? product.category._id : product.category,
    });
    setExistingImages(product.images || []);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setRemovedImages([]);
    setShowModal(true);
  };

  const closeModal = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setRemovedImages([]);
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category', form.category);

    // Attach image files
    selectedFiles.forEach((file) => formData.append('images', file));

    // Tell backend which existing images to remove
    removedImages.forEach((url) => formData.append('removeImages', url));

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <LoadingSpinner />;

  // ─── Table columns ───────────────────────────────────────────────────────
  const columns: TableColumn<Product>[] = [
    {
      header: 'Product',
      cell: (product) => (
        <div className="flex items-center space-x-3">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-lg border"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/48x48?text=No+Img'; }}
          />
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (product) =>
        product.category
          ? typeof product.category === 'object'
            ? product.category.name || 'Uncategorized'
            : product.category
          : 'Uncategorized',
    },
    {
      header: 'Price',
      cell: (product) => (
        <span className="font-semibold text-gray-900">{product.price.toFixed(2)}</span>
      ),
    },
    {
      header: 'Stock',
      cell: (product) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          product.stock === 0
            ? 'bg-red-100 text-red-800'
            : product.stock < 10
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (product) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(product)}
            className="text-blue-600 hover:bg-blue-50 px-2!"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm(product._id)}
            className="text-red-600 hover:bg-red-50 px-2!"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{productsData?.pagination?.total ?? products.length} total products</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={openCreate}
          leftIcon={<FiPlus size={18} />}
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={products}
          rowKey={(p) => p._id}
          emptyState={
            <div className="p-12 text-center">
              <FiPackage className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No products found</p>
            </div>
          }
        />
      </div>

      {/* Pagination Controls */}
      {productsData?.pagination && productsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {productsData.pagination.page} of {productsData.pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={productsData.pagination.page === 1}
            >
              Prev
            </Button>
            <div className="text-sm text-gray-700">{productsData.pagination.page}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(productsData.pagination.totalPages, p + 1))}
              disabled={!productsData.pagination.hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ─── Create / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal} className="text-gray-400 hover:text-gray-600 px-2! text-xl">✕</Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Product description"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* ─── Image Upload ─────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                  <span className="text-gray-400 font-normal ml-1">(max 5, up to 5MB each)</span>
                </label>

                {/* Existing images (edit mode) */}
                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Current images (click × to remove):</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((url) => (
                        <div key={url} className="relative group">
                          <img
                            src={getImageUrl(url)}
                            alt="existing"
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80?text=Err'; }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New image previews */}
                {previewUrls.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">New images to upload:</p>
                    <div className="flex flex-wrap gap-2">
                      {previewUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt={`preview-${index}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload button */}
                {(existingImages.length + selectedFiles.length) < 5 && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="upload"
                      size="md"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<FiUpload size={18} />}
                    >
                      Click to upload images
                    </Button>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      JPEG, PNG, GIF, WebP · Max 5MB per file ·{' '}
                      {5 - existingImages.length - selectedFiles.length} slot(s) remaining
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button variant="secondary" size="md" type="button" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isPending}
                  className="flex-1"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure? This will permanently delete the product and all its images.
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

export default AdminProductsPage;
