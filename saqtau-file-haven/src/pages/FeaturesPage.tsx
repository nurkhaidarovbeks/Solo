const FeaturesPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Removed Back button */}
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">Our Features</h1>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-gray-700 text-lg mb-8">
            Detailed information about the features of Saqtau File Haven.
            Explore our advanced file storage, sharing, and security capabilities.
          </p>
          {/* Placeholder for feature list or sections */}
          <div className="space-y-10">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-semibold text-blue-700 mb-3">Secure Cloud Storage</h2>
              <p className="text-gray-600 leading-relaxed">Bank-grade encryption and robust access controls ensure your files are always protected. Store sensitive documents with peace of mind.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-semibold text-green-700 mb-3">Lightning-Fast Access</h2>
              <p className="text-gray-600 leading-relaxed">Upload, download, and access your files instantly from anywhere in the world. Our optimized infrastructure guarantees high-speed performance.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-semibold text-purple-700 mb-3">Seamless Collaboration</h2>
              <p className="text-gray-600 leading-relaxed">Share files and folders with team members or clients effortlessly. Set permissions, track versions, and comment directly on files for streamlined teamwork.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-3xl font-semibold text-amber-700 mb-3">Smart Organization</h2>
              <p className="text-gray-600 leading-relaxed">Intelligent folder structures, tagging, and powerful search capabilities help you find what you need, when you need it. Keep your digital life tidy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
