
import { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { 
  Cloud, LogOut, Upload, FolderPlus, Home, Loader2, ChevronRight,
  User, Search, Files, HardDrive, Database, Star, Folder
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "@/components/StatsCard";
import FileCard from "@/components/FileCard";
import PaymentDialog from "@/components/PaymentDialog"; // Import PaymentDialog

interface FileItem {
  name: string;
  size?: number;
  isDirectory: boolean;
}

interface DashboardPageProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const DashboardPage = ({ setIsAuthenticated }: DashboardPageProps) => {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // User storage and plan details
  interface UserStorageDetails {
    totalFiles: number; // Overall total files
    totalFolders: number; // Overall total folders
    usedStorageBytes: number; // Overall used storage
    availableStorageBytes: number; // Total storage allocated by plan
    planName: string;
  }
  const [userStorageDetails, setUserStorageDetails] = useState<UserStorageDetails | null>(null);
  const [isDirectUpgrading, setIsDirectUpgrading] = useState(false); 
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // Dialog states
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<FileItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchFolderContents = async (path: string = "") => {
    console.log(`fetchFolderContents called with path: '${path}'`);
    setLoading(true);
    setError("");
    
    try {
      console.log("fetchFolderContents: About to make API call to /folder/view");
      const url = path ? `/api/cloud/folder/view/${path}` : '/api/cloud/folder/view';
      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });
      console.log("fetchFolderContents: /folder/view API call successful", response.data);
      
      const folders = response.data.folders?.map((folder: any) => ({
        name: folder.name,
        isDirectory: true
      })) || [];
      
      const files = response.data.files?.map((file: any) => ({
        name: file.name,
        size: file.size,
        isDirectory: false
      })) || [];
      
      setItems([...folders, ...files]);
      console.log("fetchFolderContents: setItems called");
    } catch (err: any) {
      console.error("fetchFolderContents: Error caught", err);
      const errorMessage = err.response?.data?.message || "Failed to load folder contents";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log("fetchFolderContents: Finally block, setting loading to false");
    setLoading(false);
    }
  };

  const fetchUserStorageDetails = async () => {
    try {
      const response = await axios.get("/api/me/stats", { headers: getAuthHeaders() });
      const data = response.data;
      setUserStorageDetails({
        totalFiles: data.totalFiles,
        totalFolders: data.totalFolders,
        usedStorageBytes: data.usedStorageBytes,
        availableStorageBytes: data.planStorageLimitBytes, // Backend sends total capacity as planStorageLimitBytes
        planName: data.planName
      });
    } catch (err) {
      console.error("Failed to fetch user storage details:", err);
      toast({
        title: "Error",
        description: "Could not load storage statistics.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Memoize handlers that don't depend on the specific 'item' from the loop directly
  const memoizedHandleNavigateToFolder = useCallback((folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  }, [currentPath]);

  const memoizedHandleDownloadFile = useCallback(async (fileName: string) => {
    try {
      const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
      const response = await axios.get(`/api/cloud/file/download/${filePath}`, {
        headers: getAuthHeaders(),
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: `"${fileName}" is downloading.`,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to download file";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [currentPath, toast]); // getAuthHeaders is stable if localStorage doesn't change during this component's lifecycle

  const openRenameDialogForItem = useCallback((item: FileItem) => {
    setItemToRename(item);
    setNewItemName(item.name);
    setRenameOpen(true);
  }, []); // Dependencies: setItemToRename, setNewItemName, setRenameOpen (stable from useState)

  const openDeleteDialogForItem = useCallback((item: FileItem) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  }, []); // Dependencies: setItemToDelete, setDeleteOpen (stable from useState)


  const handleNavigateUp = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/');
    setCurrentPath(newPath);
  };

  const handleNavigateToRoot = () => {
    setCurrentPath("");
  };

  const handleUploadFile = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const url = currentPath ? `/api/cloud/file/create/${currentPath}` : '/api/cloud/file/create';
        await axios.post(url, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        });
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || `Failed to upload ${file.name}`;
        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    });
    
    try {
      await Promise.all(uploadPromises);
      await fetchFolderContents(currentPath);
      fetchUserStorageDetails(); // Fetch stats after upload
    } catch (err) {
      // Error handling is done in individual uploads
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const folderPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName;
      await axios.post(`/api/cloud/folder/create/${folderPath}`, {}, {
        headers: getAuthHeaders()
      });
      
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created successfully.`,
      });
      
      setCreateFolderOpen(false);
      setNewFolderName("");
      await fetchFolderContents(currentPath);
      fetchUserStorageDetails(); // Fetch stats after creating folder
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create folder";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRenameItem = async () => {
    if (!itemToRename || !newItemName.trim()) return;
    
    try {
      const itemPath = currentPath ? `${currentPath}/${itemToRename.name}` : itemToRename.name;
      const endpoint = itemToRename.isDirectory ? '/api/cloud/folder/rename' : '/api/cloud/file/rename';
      const paramName = itemToRename.isDirectory ? 'newFolderName' : 'newFileName';
      
      await axios.put(`${endpoint}?itemPath=${encodeURIComponent(itemPath)}&${paramName}=${encodeURIComponent(newItemName)}`, null, {
        headers: getAuthHeaders()
      });
      
      toast({
        title: "Renamed successfully",
        description: `"${itemToRename.name}" has been renamed to "${newItemName}".`,
      });
      
      setRenameOpen(false);
      setItemToRename(null);
      setNewItemName("");
      console.log("handleRenameItem: Before calling fetchFolderContents");
      await fetchFolderContents(currentPath); // Added await
      console.log("handleRenameItem: After calling fetchFolderContents");
      // Optionally fetch stats if renaming could affect them, though less direct than delete/upload
      // fetchUserStorageDetails(); 
    } catch (err: any) {
      console.error("handleRenameItem: Error caught", err);
      const errorMessage = err.response?.data?.message || "Failed to rename item";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const itemPath = currentPath ? `${currentPath}/${itemToDelete.name}` : itemToDelete.name;
      const endpoint = itemToDelete.isDirectory ? '/api/cloud/folder/delete' : '/api/cloud/file/delete';
      
      await axios.delete(`${endpoint}?itemPath=${encodeURIComponent(itemPath)}`, {
        headers: getAuthHeaders()
      });
      
      toast({
        title: "Deleted successfully",
        description: `"${itemToDelete.name}" has been deleted.`,
      });
      
      setDeleteOpen(false);
      setItemToDelete(null);
      console.log("handleDeleteItem: Before calling fetchFolderContents");
      await fetchFolderContents(currentPath); // Added await
      fetchUserStorageDetails(); // Fetch stats after delete
      console.log("handleDeleteItem: After calling fetchFolderContents");
    } catch (err: any) {
      console.error("handleDeleteItem: Error caught", err);
      const errorMessage = err.response?.data?.message || "Failed to delete item";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // handleDownloadFile is now memoizedHandleDownloadFile

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(`DashboardPage render: items.length=${items.length}, filteredItems.length=${filteredItems.length}, loading=${loading}`);

  const breadcrumbParts = currentPath ? currentPath.split('/') : [];

  useEffect(() => {
    fetchFolderContents(currentPath);
    if (currentPath === "") { // Fetch user storage details on initial load (when path is root)
        fetchUserStorageDetails();
    }
  }, [currentPath]);

  // Removed the useEffect that depended on [items] to fetchUserStorageDetails
  // console.log("useEffect for [items] triggered. fetchUserStorageDetails() is currently commented out for diagnosis.");

  // Calculate stats for the current view (can be kept for other potential uses or removed if not needed elsewhere)
  const currentViewTotalFiles = items.filter(item => !item.isDirectory).length;
  const currentViewTotalFolders = items.filter(item => item.isDirectory).length;
  const currentViewUsedStorageBytes = items.reduce((acc, item) => acc + (item.size || 0), 0);
  const currentViewUsedStorageFormatted = formatFileSize(currentViewUsedStorageBytes);

  // Stats for display - use overall stats from userStorageDetails
  const displayTotalFiles = userStorageDetails ? userStorageDetails.totalFiles.toString() : "Loading...";
  const displayTotalFolders = userStorageDetails ? userStorageDetails.totalFolders.toString() : "Loading...";
  const displayUsedStorageFormatted = userStorageDetails 
    ? formatFileSize(userStorageDetails.usedStorageBytes) 
    : "Loading...";
  // Available storage is total capacity minus used overall storage
  const displayAvailableStorageFormatted = userStorageDetails 
    ? formatFileSize(userStorageDetails.availableStorageBytes - userStorageDetails.usedStorageBytes) 
    : "Loading...";
  const planName = userStorageDetails ? userStorageDetails.planName : "Loading...";


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Saqtau
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 rounded-full border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-9 w-9 p-0 rounded-full relative focus:ring-2 focus:ring-offset-2
                                ${userStorageDetails?.planName?.toUpperCase() === 'PREMIUM' 
                                  ? 'bg-amber-100 border-2 border-amber-400 hover:bg-amber-200 focus:ring-amber-500' 
                                  : 'bg-blue-50 hover:bg-blue-100 focus:ring-blue-500'}`}
                  >
                    <User className={`h-4 w-4 ${userStorageDetails?.planName?.toUpperCase() === 'PREMIUM' ? 'text-amber-600' : 'text-blue-600'}`} />
                    {userStorageDetails?.planName?.toUpperCase() === 'PREMIUM' && (
                      <Star className="h-3 w-3 absolute -top-1 -right-1 text-amber-500 fill-amber-400" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                  {userStorageDetails?.planName && (
                    <DropdownMenuItem disabled className="opacity-100">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                        ${userStorageDetails.planName.toUpperCase() === 'PREMIUM' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-blue-100 text-blue-700'}`}>
                        {userStorageDetails.planName} Plan
                      </span>
                    </DropdownMenuItem>
                  )}
                   {userStorageDetails?.planName?.toUpperCase() !== 'PREMIUM' && (
                    <DropdownMenuItem 
                      onClick={() => setIsPaymentDialogOpen(true)}
                      disabled={isDirectUpgrading} // Keep disabled if an upgrade process is somehow stuck
                    >
                      <Star className="mr-2 h-4 w-4 text-amber-500" />
                      Upgrade to Premium
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Manage your files easily and securely</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <StatsCard 
            title="Total Files" 
            value={displayTotalFiles} 
            icon={Files} 
            iconColor="bg-blue-600" 
          />
          <StatsCard 
            title="Total Folders" 
            value={displayTotalFolders} 
            icon={Folder} 
            iconColor="bg-purple-600" 
          />
          <StatsCard 
            title="Used Storage" 
            value={displayUsedStorageFormatted} 
            icon={HardDrive} 
            iconColor="bg-green-600" 
          />
          <StatsCard 
            title="Available Storage" 
            value={displayAvailableStorageFormatted} 
            icon={Database} 
            iconColor="bg-amber-600" 
          />
        </div>

        {/* Premium Banner */}
        {planName === "FREE" && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-6 mb-8 shadow-lg animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white mb-2">Upgrade to Premium</h2>
                <p className="text-amber-100">Get 100GB storage and unlimited features</p>
              </div>
              <Button 
                className="bg-white text-amber-600 hover:bg-amber-50 shadow-md font-semibold"
                onClick={() => setIsPaymentDialogOpen(true)}
                disabled={isDirectUpgrading}
              >
                <Star className="mr-2 h-4 w-4 fill-amber-400 text-amber-500" />
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToRoot}
            className="text-blue-600 hover:text-blue-700"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          {breadcrumbParts.map((part, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newPath = breadcrumbParts.slice(0, index + 1).join('/');
                  setCurrentPath(newPath);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {part}
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCreateFolderOpen(true)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          
          {currentPath && (
            <Button
              variant="ghost"
              onClick={handleNavigateUp}
              className="text-gray-600 hover:text-gray-800"
            >
              Back
            </Button>
          )}
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleUploadFile(e.target.files)}
          className="hidden"
        />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* All Files and Folders */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentPath ? `Contents of ${currentPath}` : 'All Files'}
                {filteredItems.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({filteredItems.length} items)</span>}
              </h2>
              
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No matching items found" : "This folder is empty"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Try adjusting your search terms" : "Upload files or create folders to get started"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <FileCard
                      key={item.name}
                      item={item}
                      onNavigate={item.isDirectory ? memoizedHandleNavigateToFolder : undefined}
                      onDownload={!item.isDirectory ? memoizedHandleDownloadFile : undefined}
                      onRename={openRenameDialogForItem}
                      onDelete={openDeleteDialogForItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            className="border-gray-300 focus:border-blue-500"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename {itemToRename?.isDirectory ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Enter a new name for "{itemToRename?.name}".
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New name"
            onKeyPress={(e) => e.key === 'Enter' && handleRenameItem()}
            className="border-gray-300 focus:border-blue-500"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameItem} disabled={!newItemName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete {itemToDelete?.isDirectory ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPaymentDialogOpen && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          planName="Premium"
          planPrice="$9.00" // As requested by user
          onPaymentSuccess={async () => {
            setIsDirectUpgrading(true); // Use the existing loading state for the API call
            try {
              await axios.post('/api/plan/me/upgrade', { planName: 'PREMIUM' }, { headers: getAuthHeaders() });
              toast({
                title: 'Upgrade Successful!',
                description: 'You are now on the PREMIUM plan.',
                variant: 'default',
                className: 'bg-green-500 text-white',
              });
              fetchUserStorageDetails(); // Refresh stats
            } catch (error: any) {
              const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upgrade plan.';
              toast({ title: 'Upgrade Failed', description: errorMessage, variant: 'destructive' });
              // Optionally re-throw or handle to prevent dialog closure if API call fails immediately
            } finally {
              setIsDirectUpgrading(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
