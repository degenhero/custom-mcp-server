#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'custom-mcp-protocol' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'mcp-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'mcp-combined.log' }),
  ],
});

// Read MCP schema
const schemaPath = path.join(__dirname, 'mcp-schema.json');
let mcpSchema;

try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  mcpSchema = JSON.parse(schemaContent);
  logger.info('MCP schema loaded successfully');
} catch (error) {
  logger.error(`Error loading MCP schema: ${error.message}`);
  process.exit(1);
}

// Custom MCP server URL
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000/mcp';

// Setup Express app
const app = express();
app.use(bodyParser.json());

// MCP Protocol endpoint - function_manifests
app.get('/mcp/v1/function_manifests', (req, res) => {
  try {
    // Return the function manifests from our schema
    res.json({
      functions: mcpSchema.functions
    });
  } catch (error) {
    logger.error(`Error serving function manifests: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// MCP Protocol endpoint - execute_function
app.post('/mcp/v1/execute_function', async (req, res) => {
  try {
    const { name, parameters, conversation_id } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Function name is required' });
    }
    
    logger.info(`Executing function: ${name}`);
    logger.debug('Parameters:', parameters);
    logger.debug('Conversation ID:', conversation_id);
    
    // Forward the request to our custom MCP server
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        functionName: name,
        parameters: parameters || {}
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      logger.error(`Error from MCP server: ${result.error || 'Unknown error'}`);
      return res.status(response.status).json({
        error: result.error || 'Error executing function'
      });
    }
    
    logger.info(`Function ${name} executed successfully`);
    res.json({
      output: result.result
    });
    
  } catch (error) {
    logger.error(`Error executing function: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.MCP_PROTOCOL_PORT || 3001;
app.listen(PORT, () => {
  logger.info(`MCP Protocol server running on port ${PORT}`);
  logger.info(`Connected to Custom MCP server at ${MCP_SERVER_URL}`);
});
