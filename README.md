# Custom MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Machine Conversation Protocol (MCP) server that integrates various tools for AI assistants:

- **Brave Search** - Web and local search capabilities
- **Secure Filesystem** - File operations with security controls
- **GitHub Integration** - Repository and code management
- **Sequential Thinking** - Step-by-step problem solving
- **Download Utility** - Download files from the internet

## Quick Start

```bash
# Clone the repository
git clone https://github.com/degenhero/custom-mcp-server.git
cd custom-mcp-server

# Install dependencies and set up environment
npm run install:all

# Start both servers
npm run start:both
```

The servers will run at:
- MCP Server: http://localhost:3000
- MCP Protocol Server: http://localhost:3001

## Usage with Claude

To use this custom MCP server with Claude, you need to install it as an MCP server:

```bash
npx @anthropic-ai/install-mcp custom-mcp-server http://localhost:3001
```

After installation, Claude will have access to all the functions provided by this server.

## Architecture

This project consists of two main components:

1. **Custom MCP Server** (index.js) - The core server that implements all the tool functions
2. **MCP Protocol Server** (mcp-protocol.js) - Adapts the custom server to the MCP protocol standard

## Available Functions

### Brave Search
- `brave_web_search` - Perform web searches
- `brave_local_search` - Search for local businesses and places

### Filesystem Operations
- `read_file` - Read file contents
- `write_file` - Create or update files
- `edit_file` - Make line-based edits
- `create_directory` - Create directories
- `list_directory` - List directory contents
- And more...

### GitHub Integration
- `create_repository` - Create new repositories
- `search_repositories` - Search for repositories
- `get_file_contents` - Read files from repositories
- `push_files` - Push files to repositories
- And more...

### Sequential Thinking
- `sequentialthinking` - Step-by-step problem solving

### Download Utility
- `download_file` - Download files from URLs
- `download_multiple_files` - Download multiple files at once

## Configuration

Configuration is managed through environment variables in a `.env` file:

```
PORT=3000                      # Port for the main server
MCP_PROTOCOL_PORT=3001         # Port for the MCP protocol server
BRAVE_API_KEY=your_key_here    # API key for Brave Search
GITHUB_TOKEN=your_token_here   # GitHub access token
```

## Development

### Adding New Functions

To add a new function:

1. Create a handler in the appropriate file in the `functions` directory
2. Add the function definition to `mcp-schema.json`
3. Update the routing in `index.js`

### Testing

You can test functions directly against the MCP server:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"functionName": "brave_web_search", "parameters": {"query": "test query"}}'
```

## Documentation

For detailed documentation on all available functions, see [documentation.md](./documentation.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
