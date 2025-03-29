# Custom MCP Server

A custom Machine Conversation Protocol (MCP) server that integrates various tools including:

- Brave Search
- Secure Filesystem Operations
- GitHub Integration
- Sequential Thinking

## Setup

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run `npm start`

## Available Functions

This MCP server integrates the following function groups:

### Brave Search
- brave_web_search
- brave_local_search

### Filesystem Operations
- read_file
- read_multiple_files
- write_file
- edit_file
- create_directory
- list_directory
- directory_tree
- move_file
- search_files
- get_file_info
- list_allowed_directories

### GitHub Integration
- create_repository
- search_repositories
- get_file_contents
- create_or_update_file
- push_files
- create_issue
- create_pull_request
- fork_repository
- create_branch
- list_commits
- list_issues
- update_issue
- add_issue_comment
- search_code
- search_issues
- search_users
- get_issue

### Sequential Thinking
- sequentialthinking
