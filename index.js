require('dotenv').config();
const express = require('express');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'custom-mcp-server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Initialize Express app
const app = express();
app.use(express.json());

// Load function handlers
const braveSearch = require('./functions/brave-search');
const filesystem = require('./functions/filesystem');
const github = require('./functions/github');
const sequentialThinking = require('./functions/sequential-thinking');
const download = require('./functions/download');

// Define routes
app.post('/mcp', async (req, res) => {
  try {
    const { functionName, parameters } = req.body;
    
    logger.info(`Function call received: ${functionName}`);
    logger.debug('Parameters:', parameters);
    
    let result;
    
    // Route to appropriate function handler
    switch (functionName) {
      case 'brave_web_search':
      case 'brave_local_search':
        result = await braveSearch.handleFunction(functionName, parameters);
        break;
        
      case 'read_file':
      case 'read_multiple_files':
      case 'write_file':
      case 'edit_file':
      case 'create_directory':
      case 'list_directory':
      case 'directory_tree':
      case 'move_file':
      case 'search_files':
      case 'get_file_info':
      case 'list_allowed_directories':
        result = await filesystem.handleFunction(functionName, parameters);
        break;
        
      case 'create_repository':
      case 'search_repositories':
      case 'get_file_contents':
      case 'create_or_update_file':
      case 'push_files':
      case 'create_issue':
      case 'create_pull_request':
      case 'fork_repository':
      case 'create_branch':
      case 'list_commits':
      case 'list_issues':
      case 'update_issue':
      case 'add_issue_comment':
      case 'search_code':
      case 'search_issues':
      case 'search_users':
      case 'get_issue':
        result = await github.handleFunction(functionName, parameters);
        break;
        
      case 'sequentialthinking':
        result = await sequentialThinking.handleFunction(functionName, parameters);
        break;

      case 'download_file':
      case 'download_multiple_files':
        result = await download.handleFunction(functionName, parameters);
        break;
        
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
    
    logger.info(`Function call successful: ${functionName}`);
    res.json({ result });
    
  } catch (error) {
    logger.error(`Error handling function call: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});