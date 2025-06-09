import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

const CODE_EXTENSIONS = [
  '.js', '.ts', '.jsx', '.tsx',
  '.py', '.java', '.cpp', '.c', '.h',
  '.cs', '.php', '.rb', '.go', '.rs',
  '.html', '.css', '.scss', '.sass',
  '.json', '.xml', '.yaml', '.yml',
  '.md', '.txt', '.sql', '.sh', '.bat',
  '.vue', '.svelte', '.dart', '.kt'
];

const IGNORED_PATTERNS = [
  'node_modules/', '.git/', 'dist/', 'build/',
  '.next/', '__pycache__/', '.vscode/', '.idea/',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.DS_Store', 'Thumbs.db', '.gitignore'
];

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  children?: FileNode[];
  content?: string; // Only for code files
}

function buildDirectoryTree(filePaths: string[]): FileNode {
  const root: FileNode = { name: 'root', path: '', type: 'directory', children: [] };
  
  filePaths.forEach(filePath => {
    const parts = filePath.split('/').filter(part => part.length > 0);
    let current = root;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let existing = current.children?.find(child => child.name === part);
      
      if (!existing) {
        existing = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : []
        };
        current.children!.push(existing);
      }
      
      if (!isFile) current = existing;
    });
  });
  
  return root;
}

function isZipFile(file: File): boolean {
  const zipMimeTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/octet-stream'
  ];
  
  return zipMimeTypes.includes(file.type) || 
         file.name.toLowerCase().endsWith('.zip');
}

function isCodeFile(filename: string): boolean {
  const extension = path.extname(filename).toLowerCase();
  return CODE_EXTENSIONS.includes(extension);
}

function shouldIgnoreFile(filename: string): boolean {
  return IGNORED_PATTERNS.some(pattern => {
    if (pattern.endsWith('/')) {
      return filename.includes(pattern);
    }
    return filename.includes(pattern) || filename.endsWith(pattern);
  });
}

async function processZipFile(buffer: Buffer, tempDir: string): Promise<FileNode[]> {
  const extractedFiles: FileNode[] = [];
  
  try {
    const zip = await JSZip.loadAsync(buffer);
    console.log('ZIP loaded successfully. Files found:', Object.keys(zip.files).length);
    
    for (const filename in zip.files) {
      const zipEntry = zip.files[filename];
      
      // Skip directories
      if (zipEntry.dir) {
        console.log(`Skipping directory: ${filename}`);
        continue;
      }
      
      // Check if should be ignored
      if (shouldIgnoreFile(filename)) {
        console.log(`Skipping ignored file: ${filename}`);
        continue;
      }
      
      // Check if it's a code file
      if (!isCodeFile(filename)) {
        console.log(`Skipping non-code file: ${filename}`);
        continue;
      }
      
      try {
        const content = await zipEntry.async('nodebuffer');
        const filePath = path.join(tempDir, filename);
        
        // Create directory structure
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
        
        // Read as text for code files
        const textContent = content.toString('utf-8');
        
        // Validate content
        if (textContent.trim().length === 0) {
          console.log(`Warning: Empty file content for ${filename}`);
          continue;
        }
        
        extractedFiles.push({
          name: path.basename(filename),
          path: filename,
          type: 'file',
          size: content.length,
          extension: path.extname(filename).toLowerCase(),
          content: textContent
        });
        
        console.log(`Extracted code file: ${filename} (${content.length} bytes)`);
      } catch (fileError) {
        console.error(`Error processing file ${filename}:`, fileError);
      }
    }
  } catch (zipError) {
    console.error('Error processing ZIP file:', zipError);
    throw new Error(`Failed to process ZIP file: ${zipError instanceof Error ? zipError.message : 'Unknown error'}`);
  }
  
  return extractedFiles;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  console.log('=== UPLOAD API CALLED ===');
  console.log('Content-Type:', request.headers.get('content-type'));
  console.log('Method:', request.method);

  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Request content type:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      console.log('ERROR: Not multipart/form-data');
      return NextResponse.json({
        error: 'Content-Type must be multipart/form-data',
        received: contentType
      }, { status: 400 });
    }

    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, typeof value]));

    const file = formData.get('file') as File;
    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      exists: !!file
    });

    if (!file) {
      console.log('ERROR: No file in FormData');
      return NextResponse.json({
        error: 'No file uploaded',
        formDataKeys: Array.from(formData.keys())
      }, { status: 400 });
    }

    if (file.size === 0) {
      console.log('ERROR: Empty file');
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // Enhanced file type detection
    console.log('File type detection:', {
      fileName: file.name,
      fileType: file.type,
      isZip: isZipFile(file),
      extension: path.extname(file.name),
      size: file.size
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sessionId = uuidv4();
    const tempDir = path.join(os.tmpdir(), `uploads-${sessionId}`);
    await fs.mkdir(tempDir, { recursive: true });

    const extractedFiles: FileNode[] = [];
    const allFilePaths: string[] = [];

    if (isZipFile(file)) {
      console.log('Processing ZIP file:', file.name);
      const zipExtractedFiles = await processZipFile(buffer, tempDir);
      extractedFiles.push(...zipExtractedFiles);
      allFilePaths.push(...zipExtractedFiles.map(f => path.join(tempDir, f.path)));
    } else {
      console.log('Processing single file:', file.name);
      
      // Check if single file should be ignored
      if (shouldIgnoreFile(file.name)) {
        console.log(`Skipping ignored single file: ${file.name}`);
        return NextResponse.json({
          error: 'File type not supported',
          message: 'The uploaded file is in the ignored patterns list',
          filename: file.name
        }, { status: 400 });
      }
      
      // Check if it's a code file
      if (!isCodeFile(file.name)) {
        console.log(`Skipping non-code single file: ${file.name}`);
        return NextResponse.json({
          error: 'File type not supported',
          message: 'The uploaded file is not a supported code file',
          filename: file.name,
          supportedExtensions: CODE_EXTENSIONS
        }, { status: 400 });
      }
      
      // Save and read content
      const filePath = path.join(tempDir, file.name);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      const textContent = buffer.toString('utf-8');
      if (textContent.trim().length === 0) {
        console.log(`Warning: Empty file content for ${file.name}`);
      } else {
        extractedFiles.push({
          name: file.name,
          path: file.name,
          type: 'file',
          size: file.size,
          extension: path.extname(file.name).toLowerCase(),
          content: textContent
        });
        allFilePaths.push(filePath);
      }
    }

    // Build directory tree for UI
    const directoryTree = buildDirectoryTree(extractedFiles.map(f => f.path));

    console.log('File upload successful');
    console.log('Total extracted code files:', extractedFiles.length);
    console.log('Extracted files:', extractedFiles.map(f => f.name));

    return NextResponse.json({
      message: 'File upload successful',
      filename: file.name,
      size: file.size,
      sessionId,
      directoryTree,
      codeFiles: extractedFiles,
      totalCodeFiles: extractedFiles.length,
      tempDir,
      extractedFiles: extractedFiles.map(f => ({
        name: f.name,
        path: f.path,
        type: f.type,
        extension: f.extension,
        size: f.size,
        content: f.content,
      }))
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in upload API:', error);
    return NextResponse.json({
      error: 'An error occurred during file upload',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}