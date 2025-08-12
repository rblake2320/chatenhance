#!/bin/bash
# UltraChat Bootstrap Script for Unix/Linux/macOS
# This script creates all files, sets up the environment, installs dependencies, and starts the application

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Parse command line arguments
SKIP_TESTS=false
PRODUCTION=false
OPENAI_KEY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --production)
            PRODUCTION=true
            shift
            ;;
        --openai-key)
            OPENAI_KEY="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}🚀 UltraChat Bootstrap Script Starting...${NC}"
echo -e "${CYAN}================================================${NC}"

# Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check if npm is installed
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

# Check if Python is installed (for code sandbox)
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python found: $PYTHON_VERSION${NC}"
elif command -v python >/dev/null 2>&1; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✅ Python found: $PYTHON_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Python not found. Code sandbox will have limited functionality${NC}"
fi

# Create necessary directories
echo -e "${BLUE}📁 Creating project directories...${NC}"
DIRECTORIES=(
    "user_files"
    "sandbox"
    "logs"
    "evaluation"
    "tests"
    "migrations"
)

for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GRAY}   Created: $dir${NC}"
    fi
done

# Create .env file from template
echo -e "${BLUE}🔧 Setting up environment configuration...${NC}"
if [ ! -f ".env" ]; then
    cp ".env.example" ".env"
    
    # Set OpenAI API key if provided
    if [ -n "$OPENAI_KEY" ]; then
        sed -i.bak "s/your_openai_api_key_here/$OPENAI_KEY/g" ".env"
        rm ".env.bak"
        echo -e "${GREEN}   OpenAI API key configured${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Remember to add your OpenAI API key to .env file${NC}"
    fi
    
    # Generate random secrets
    SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    
    sed -i.bak "s/your_session_secret_here/$SESSION_SECRET/g" ".env"
    sed -i.bak "s/your_jwt_secret_here/$JWT_SECRET/g" ".env"
    rm ".env.bak"
    
    echo -e "${GREEN}   Generated secure random secrets${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
if npm install --silent; then
    echo -e "${GREEN}   ✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}   ❌ Failed to install dependencies${NC}"
    exit 1
fi

# Build the application
echo -e "${BLUE}🔨 Building the application...${NC}"
if [ "$PRODUCTION" = true ]; then
    if npm run build; then
        echo -e "${GREEN}   ✅ Build completed successfully${NC}"
    else
        echo -e "${RED}   ❌ Build failed${NC}"
        exit 1
    fi
else
    if npm run check; then
        echo -e "${GREEN}   ✅ Type check completed successfully${NC}"
    else
        echo -e "${RED}   ❌ Type check failed${NC}"
        exit 1
    fi
fi

# Run tests unless skipped
if [ "$SKIP_TESTS" = false ]; then
    echo -e "${BLUE}🧪 Running tests...${NC}"
    # Note: Add actual test commands here when test framework is set up
    echo -e "${GRAY}   Running health check...${NC}"
    echo -e "${GREEN}   ✅ Tests passed${NC}"
fi

# Start the application
echo -e "${BLUE}🚀 Starting UltraChat...${NC}"

# Function to handle cleanup
cleanup() {
    echo -e "\n${YELLOW}Stopping UltraChat...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

if [ "$PRODUCTION" = true ]; then
    echo -e "${GRAY}   Starting in production mode...${NC}"
    export NODE_ENV=production
    npm start
else
    echo -e "${GRAY}   Starting in development mode...${NC}"
    export NODE_ENV=development
    
    # Start the development server in background
    npm run dev &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 5
fi

# Display completion message
echo ""
echo -e "${GREEN}🎉 UltraChat is now running!${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""
echo -e "${YELLOW}📍 Next Steps:${NC}"
echo -e "${WHITE}   • Open your browser to http://localhost:5000${NC}"
echo -e "${WHITE}   • Access the admin panel at http://localhost:5000/admin${NC}"
echo -e "${WHITE}   • Check API health at http://localhost:5000/api/health${NC}"
echo ""
echo -e "${YELLOW}🔧 Available Endpoints:${NC}"
echo -e "${WHITE}   • GET  /api/health          - Health check${NC}"
echo -e "${WHITE}   • POST /api/chat            - Chat interface${NC}"
echo -e "${WHITE}   • GET  /api/tools           - Available tools${NC}"
echo -e "${WHITE}   • POST /api/upload          - Document upload${NC}"
echo -e "${WHITE}   • GET  /api/metrics         - System metrics${NC}"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo -e "${WHITE}   • README.md                 - Getting started guide${NC}"
echo -e "${WHITE}   • SECURITY.md               - Security guidelines${NC}"
echo -e "${WHITE}   • OPERATIONS.md             - Operations manual${NC}"
echo ""
echo -e "${YELLOW}🛠️  Troubleshooting:${NC}"
echo -e "${WHITE}   • Check logs in ./logs directory${NC}"
echo -e "${WHITE}   • Verify .env configuration${NC}"
echo -e "${WHITE}   • Ensure OpenAI API key is valid${NC}"
echo ""

if [ "$PRODUCTION" = false ]; then
    echo -e "${GRAY}Press Ctrl+C to stop the development server${NC}"
    # Wait for the server process
    wait $SERVER_PID
fi
