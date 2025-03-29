# Custom MCP Server Documentation

## Overview

This Custom MCP (Machine Conversation Protocol) Server integrates multiple tools into a single service:

1. **Brave Search** - Web and local search functionality
2. **Secure Filesystem** - File operations with security controls
3. **GitHub Integration** - Repository management and code operations
4. **Sequential Thinking** - Problem-solving through thought steps
5. **Download Utility** - Fetch files from the internet

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- GitHub Access Token (for GitHub functions)
- Brave Search API Key (for search functions)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/degenhero/custom-mcp-server.git
   cd custom-mcp-server
   ```

2. Run the installation script:
   ```
   node install.js
   ```

3. Start the server:
   ```
   npm start
   ```

## Available Functions

### Brave Search

#### brave_web_search

Performs a web search using the Brave Search API.

**Parameters:**
- `query` (string, required): Search query (max 400 chars)
- `count` (number, optional): Number of results (1-20, default 10)
- `offset` (number, optional): Pagination offset (0-9, default 0)

#### brave_local_search

Searches for local businesses and places using Brave's Local Search API.

**Parameters:**
- `query` (string, required): Local search query (e.g., 'pizza near Central Park')
- `count` (number, optional): Number of results (1-20, default 5)

### Filesystem Operations

#### read_file

Read the complete contents of a file from the file system.

**Parameters:**
- `path` (string, required): Path to the file

#### read_multiple_files

Read the contents of multiple files simultaneously.

**Parameters:**
- `paths` (array of strings, required): Paths to the files

#### write_file

Create a new file or completely overwrite an existing file with new content.

**Parameters:**
- `path` (string, required): Path where to create/update the file
- `content` (string, required): Content to write to the file

#### edit_file

Make line-based edits to a text file.

**Parameters:**
- `path` (string, required): Path to the file
- `edits` (array of objects, required): List of edits with `oldText` and `newText`
- `dryRun` (boolean, optional): Preview changes without applying (default: false)

#### create_directory

Create a new directory or ensure a directory exists.

**Parameters:**
- `path` (string, required): Path to create

#### list_directory

Get a detailed listing of all files and directories in a specified path.

**Parameters:**
- `path` (string, required): Directory path to list

#### directory_tree

Get a recursive tree view of files and directories as a JSON structure.

**Parameters:**
- `path` (string, required): Root path

#### move_file

Move or rename files and directories.

**Parameters:**
- `source` (string, required): Source path
- `destination` (string, required): Destination path

#### search_files

Recursively search for files and directories matching a pattern.

**Parameters:**
- `path` (string, required): Root path to search from
- `pattern` (string, required): Pattern to match
- `excludePatterns` (array of strings, optional): Patterns to exclude

#### get_file_info

Retrieve detailed metadata about a file or directory.

**Parameters:**
- `path` (string, required): Path to the file or directory

#### list_allowed_directories

Returns the list of directories that this server is allowed to access.

**Parameters:**
- None

### GitHub Integration

#### create_repository

Create a new GitHub repository.

**Parameters:**
- `name` (string, required): Repository name
- `description` (string, optional): Repository description
- `private` (boolean, optional): Whether the repository should be private (default: false)
- `autoInit` (boolean, optional): Initialize with README.md (default: false)

#### search_repositories

Search for GitHub repositories.

**Parameters:**
- `query` (string, required): Search query
- `page` (number, optional): Page number (default: 1)
- `perPage` (number, optional): Results per page (default: 30, max: 100)

#### get_file_contents

Get the contents of a file or directory from a GitHub repository.

**Parameters:**
- `owner` (string, required): Repository owner
- `repo` (string, required): Repository name
- `path` (string, required): Path to the file or directory
- `branch` (string, optional): Branch to get contents from (default: main)

### Download Utility

#### download_file

Download a file from a URL and save it locally.

**Parameters:**
- `url` (string, required): URL to download from
- `destination` (string, required): Local path to save the file to
- `headers` (object, optional): HTTP headers for the request

#### download_multiple_files

Download multiple files from URLs and save them locally.

**Parameters:**
- `files` (array of objects, required): Array of files to download, each with:
  - `url` (string, required): URL to download from
  - `destination` (string, required): Local path to save the file to
  - `headers` (object, optional): HTTP headers for the request

## Security Considerations

- All filesystem operations are restricted to allowed directories.
- API keys are stored in environment variables, not in the code.
- Input validation is performed on all parameters.

## Error Handling

All errors are logged to both the console and log files:
- `error.log` - Contains only error-level logs
- `combined.log` - Contains all log levels

## API Endpoints

### POST /mcp

The primary endpoint for all MCP functions.

**Request Body:**
```json
{
  "functionName": "name_of_function",
  "parameters": {
    // Function-specific parameters
  }
}
```

**Response:**
```json
{
  "result": {
    // Function-specific result
  }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Customization

To add new functions or modify existing ones:

1. Create or edit files in the `functions` directory
2. Update the schema in `mcp-schema.json`
3. Modify the routing in `index.js`
