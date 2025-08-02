# Context7 MCP Server: Configuration and Best Practices

## Installation Methods

### NPX Installation (Recommended)
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Alternative Package Managers
```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @upstash/context7-mcp
CMD ["context7-mcp"]
```

## Environment Variable Configuration

### Core Configuration Variables
- **DEFAULT_MINIMUM_TOKENS**: Sets minimum token count for documentation retrieval
- **CACHE_TTL**: Controls documentation cache duration
- **SEARCH_LIMITS**: Configures maximum search results
- **FUZZY_THRESHOLD**: Adjusts fuzzy matching sensitivity
- **LOG_LEVEL**: Controls server logging verbosity

### Configuration Example
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "1000",
        "CACHE_TTL": "3600",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## Project-Specific Configuration

### Workspace-Level Configuration
Create `.cursor/mcp.json` or `.vscode/mcp.json` in your project directory:
```json
{
  "mcpServers": {
    "context7-paroflow": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "1500",
        "PROJECT_CONTEXT": "dental-management"
      }
    }
  }
}
```

### Global vs Project Configuration
- **Global Configuration**: Available across all projects
- **Project Configuration**: Scoped to specific project directories
- **Hierarchy**: Project configurations override global settings

## Best Practices for Development Workflows

### 1. Context-First Approach
- Start development sessions by reading relevant project files
- Use Context7 to provide current documentation context
- Leverage subagents for complex problem exploration

### 2. Iterative Enhancement
- Allow for 2-3 iterations to refine Context7 outputs
- Provide verification mechanisms for fast feedback loops
- Use Context7's tools to see and validate outputs

### 3. Prompt Optimization
- Include "use context7" at the end of coding prompts
- Be specific about library versions and requirements
- Combine Context7 with project-specific context

## Configuration for Different Development Environments

### Development Environment
```json
{
  "mcpServers": {
    "context7-dev": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "LOG_LEVEL": "debug",
        "CACHE_TTL": "300",
        "DEFAULT_MINIMUM_TOKENS": "800"
      }
    }
  }
}
```

### Production Environment
```json
{
  "mcpServers": {
    "context7-prod": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "LOG_LEVEL": "error",
        "CACHE_TTL": "7200",
        "DEFAULT_MINIMUM_TOKENS": "1200"
      }
    }
  }
}
```

## Security Configuration

### Basic Security Measures
- Always use HTTPS for remote connections
- Implement proper authentication mechanisms
- Configure appropriate rate limiting
- Enable audit logging for compliance

### Healthcare-Specific Security
```json
{
  "mcpServers": {
    "context7-healthcare": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "SECURITY_MODE": "healthcare",
        "AUDIT_LOGGING": "true",
        "ENCRYPTION_LEVEL": "high",
        "ACCESS_CONTROL": "strict"
      }
    }
  }
}
```

## Debugging and Troubleshooting

### Debug Mode Configuration
Launch Claude with debug flag:
```bash
claude --mcp-debug
```

### Common Configuration Issues
1. **Server Not Found**: Check scope configuration
2. **Permission Denied**: Verify file permissions and authentication
3. **Slow Performance**: Adjust cache settings and token limits
4. **Version Conflicts**: Ensure consistent package versions

### Logging Configuration
```json
{
  "env": {
    "LOG_LEVEL": "debug",
    "LOG_OUTPUT": "/var/log/context7.log",
    "ERROR_REPORTING": "true"
  }
}
```

## Integration with Claude Code

### CLAUDE.md Integration
Add Context7 instructions to your CLAUDE.md file:
```markdown
# Context7 Usage Guidelines

When working on Paroflow dental management system:
- Always use `use context7` for library-specific questions
- Prefer Context7 documentation over generic examples
- Verify API versions match project dependencies
```

### Slash Commands
Create `.claude/commands/context7.md`:
```markdown
# Context7 Documentation Request

Please provide current documentation for [LIBRARY_NAME] focusing on [SPECIFIC_TOPIC]. Use context7 to ensure accuracy.
```

## Performance Optimization

### Memory Management
- Configure appropriate token limits
- Use topic-specific queries to reduce context size
- Implement intelligent caching strategies

### Response Time Optimization
- Set reasonable cache TTL values
- Use local deployment for development
- Configure appropriate timeout values

### Resource Usage
```json
{
  "env": {
    "MAX_CONCURRENT_REQUESTS": "5",
    "REQUEST_TIMEOUT": "30000",
    "MEMORY_LIMIT": "512MB"
  }
}
```

## Advanced Configuration Options

### Multi-Server Setup
```json
{
  "mcpServers": {
    "context7-frontend": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "FOCUS_AREA": "frontend",
        "DEFAULT_LIBRARIES": "react,next,tailwind"
      }
    },
    "context7-backend": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "FOCUS_AREA": "backend",
        "DEFAULT_LIBRARIES": "prisma,fastify,node"
      }
    }
  }
}
```

### Custom Library Mappings
```json
{
  "env": {
    "LIBRARY_ALIASES": "{\"dental-lib\": \"paroflow-core\", \"ui-kit\": \"shadcn-ui\"}",
    "VERSION_OVERRIDES": "{\"react\": \"18.x\", \"prisma\": \"5.x\"}"
  }
}
```

## Deployment Strategies

### Local Development
- Use npx for quick setup
- Enable debug logging
- Configure short cache TTL for rapid iteration

### Team Collaboration
- Check configuration into version control
- Use consistent environment variables
- Document team-specific conventions

### Production Deployment
- Use containerized deployment
- Implement proper monitoring
- Configure appropriate security measures

## Source References

- Context7 Installation Guide: https://apidog.com/blog/context7-mcp-server/
- MCP Configuration Best Practices: https://www.marktechpost.com/2025/07/23/7-mcp-server-best-practices-for-scalable-ai-integrations-in-2025/
- Claude Code Configuration: https://docs.anthropic.com/en/docs/claude-code/tutorials
- VS Code MCP Integration: https://code.visualstudio.com/docs/copilot/chat/mcp-servers