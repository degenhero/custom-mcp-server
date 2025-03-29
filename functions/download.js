const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

/**
 * Handler for Download functions
 * @param {string} functionName - The name of the function to call
 * @param {object} parameters - The parameters for the function
 * @returns {Promise<object>} - The result of the function call
 */
async function handleFunction(functionName, parameters) {
  switch (functionName) {
    case 'download_file':
      return await downloadFile(parameters);
    case 'download_multiple_files':
      return await downloadMultipleFiles(parameters);
    default:
      throw new Error(`Unknown Download function: ${functionName}`);
  }
}

/**
 * Ensure a path is within allowed directories
 * @param {string} filePath - Path to check
 * @returns {Promise<string>} - The validated path
 */
async function validatePath(filePath) {
  // Import filesystem module for validation logic
  const filesystemModule = require('./filesystem');
  // This function is not directly exposed, so we'll use a simpler approach
  
  // Get the list of allowed directories
  const allowedDirs = await filesystemModule.handleFunction('list_allowed_directories', {});
  const absolutePath = path.resolve(filePath);
  
  for (const dir of allowedDirs.directories) {
    const allowedPath = path.resolve(dir);
    if (absolutePath === allowedPath || absolutePath.startsWith(allowedPath + path.sep)) {
      return absolutePath;
    }
  }
  
  throw new Error(`Access denied: Path '${filePath}' is outside allowed directories`);
}

/**
 * Download a file from a URL and save it locally
 * @param {object} parameters - Function parameters
 * @param {string} parameters.url - URL to download from
 * @param {string} parameters.destination - Local path to save the file to
 * @param {object} parameters.headers - Optional HTTP headers for the request
 * @returns {Promise<object>} - The result of the operation
 */
async function downloadFile({ url: fileUrl, destination, headers = {} }) {
  if (!fileUrl || !destination) {
    throw new Error('URL and destination parameters are required');
  }
  
  try {
    // Validate the destination path
    const validPath = await validatePath(destination);
    
    // Ensure the directory exists
    const dirname = path.dirname(validPath);
    await fs.mkdir(dirname, { recursive: true });
    
    // Download the file
    const response = await fetch(fileUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    
    // Get the file content as a buffer
    const buffer = await response.buffer();
    
    // Save the file
    await fs.writeFile(validPath, buffer);
    
    // Get file info
    const stats = await fs.stat(validPath);
    
    return {
      success: true,
      url: fileUrl,
      destination,
      size: stats.size,
      contentType: response.headers.get('content-type'),
      lastModified: response.headers.get('last-modified')
    };
  } catch (error) {
    throw new Error(`Error downloading file from '${fileUrl}': ${error.message}`);
  }
}

/**
 * Download multiple files from URLs and save them locally
 * @param {object} parameters - Function parameters
 * @param {Array<{url: string, destination: string, headers: object}>} parameters.files - Files to download
 * @returns {Promise<object>} - The result of the operation
 */
async function downloadMultipleFiles({ files }) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('Files parameter must be a non-empty array');
  }
  
  const results = [];
  
  for (const file of files) {
    try {
      const result = await downloadFile(file);
      results.push({ ...result, success: true });
    } catch (error) {
      results.push({
        url: file.url,
        destination: file.destination,
        error: error.message,
        success: false
      });
    }
  }
  
  return { results };
}

module.exports = {
  handleFunction
};