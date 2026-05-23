interface AdminPlaceholderPageProps {
  title: string;
  description: string;
}

const AdminPlaceholderPage = ({ title, description }: AdminPlaceholderPageProps) => {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
      <div className="mt-8 bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
        This section is coming soon.
      </div>
    </div>
  );
};

export default AdminPlaceholderPage;
