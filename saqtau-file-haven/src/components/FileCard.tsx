
import React, { useState } from 'react'; // Import React, useState
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Restore Button
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Restore DropdownMenu
import { Separator } from "@/components/ui/separator"; // Restore Separator
import { File, Folder, Download, Edit, Trash2, MoreVertical } from "lucide-react";

interface FileCardProps {
  item: {
    name: string;
    size?: number;
    isDirectory: boolean;
  };
  // Update prop types to expect functions that take an item or its name
  onNavigate?: (itemName: string) => void;
  onDownload?: (itemName: string) => void;
  onRename?: (item: FileCardProps['item']) => void;
  onDelete?: (item: FileCardProps['item']) => void;
}

interface FileItem { // Define FileItem here if not already globally available for FileCardProps
  name: string;
  size?: number;
  isDirectory: boolean;
}

const FileCardComponent = ({ item, onNavigate, onDownload, onRename, onDelete }: FileCardProps) => {
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);
  // console.log(`Rendering FileCard: ${item.name}`); // Optional: for debugging re-renders
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'bg-red-500';
      case 'doc': case 'docx': return 'bg-blue-500';
      case 'xls': case 'xlsx': return 'bg-green-500';
      case 'ppt': case 'pptx': return 'bg-orange-500';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'bg-purple-500';
      case 'mp4': case 'mov': case 'avi': return 'bg-indigo-500';
      case 'mp3': case 'wav': return 'bg-pink-500';
      case 'zip': case 'rar': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white border-0 shadow-sm hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-center space-x-4 flex-1 min-w-0"
            // Call onNavigate with item.name if it's a directory and onNavigate is provided
            onClick={item.isDirectory && onNavigate ? () => onNavigate(item.name) : undefined}
          >
            <div className={`p-3 rounded-xl ${item.isDirectory ? 'bg-blue-500' : getFileTypeColor(item.name)}`}>
              {item.isDirectory ? (
                <Folder className="h-8 w-8 text-white" />
              ) : (
                <File className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-gray-900 truncate mb-1">
                {item.name}
              </p>
              {!item.isDirectory && item.size && (
                <p className="text-sm text-gray-500">
                  {formatFileSize(item.size)}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* End of main item info flex item */}
          
          {/* ShadCN DropdownMenu with conditional content rendering */}
          <DropdownMenu open={isCustomDropdownOpen} onOpenChange={setIsCustomDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {isCustomDropdownOpen && ( // Conditionally render DropdownMenuContent
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                {!item.isDirectory && onDownload && (
                  <DropdownMenuItem onClick={() => { onDownload(item.name); setIsCustomDropdownOpen(false); }}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                )}
                {onRename && (
                  <DropdownMenuItem onClick={() => { onRename(item); setIsCustomDropdownOpen(false); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                )}
                <Separator />
                {onDelete && (
                  <DropdownMenuItem onClick={() => { onDelete(item); setIsCustomDropdownOpen(false); }} className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

const fileCardPropsAreEqual = (prevProps: FileCardProps, nextProps: FileCardProps) => {
  return (
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.size === nextProps.item.size &&
    prevProps.item.isDirectory === nextProps.item.isDirectory &&
    prevProps.onNavigate === nextProps.onNavigate &&
    prevProps.onDownload === nextProps.onDownload &&
    prevProps.onRename === nextProps.onRename &&
    prevProps.onDelete === nextProps.onDelete
  );
};

export default React.memo(FileCardComponent, fileCardPropsAreEqual);
