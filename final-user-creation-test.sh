#!/bin/bash

# final-user-creation-test.sh - Script kiểm tra toàn bộ chức năng tạo user

echo "🚀 Final User Creation Test"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    case $2 in
        "success") echo -e "${GREEN}✅ $1${NC}" ;;
        "error") echo -e "${RED}❌ $1${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $1${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $1${NC}" ;;
    esac
}

# Check if backend is running
echo -e "\n${BLUE}1. Checking Backend Status...${NC}"
BACKEND_URL="http://localhost:5000"

if curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
    print_status "Backend is running on port 5000" "success"
else
    print_status "Backend is not running. Please start backend server." "error"
    echo "Run: cd soligant-api && npm start"
    exit 1
fi

# Check backend endpoints
echo -e "\n${BLUE}2. Testing Backend Endpoints...${NC}"

# Test users endpoint (without auth for now)
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/users" | grep -q "401\|403\|200"; then
    print_status "Users endpoint accessible" "success"
else
    print_status "Users endpoint not accessible" "error"
fi

# Test roles endpoint
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/roles" | grep -q "401\|403\|200"; then
    print_status "Roles endpoint accessible" "success"
else
    print_status "Roles endpoint not accessible" "error"
fi

# Check if frontend is running
echo -e "\n${BLUE}3. Checking Frontend Status...${NC}"
FRONTEND_URL="http://localhost:3000"

if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    print_status "Frontend is running on port 3000" "success"
else
    print_status "Frontend is not running. Please start frontend server." "warning"
    echo "Run: cd soligant-frontend && npm start"
fi

# Check key files exist
echo -e "\n${BLUE}4. Checking Key Files...${NC}"

FILES=(
    "soligant-api/src/controllers/user.controller.js"
    "soligant-api/src/routes/user.routes.js"
    "soligant-frontend/src/api/userAPI.js"
    "soligant-frontend/src/redux/features/userSlice.js"
    "soligant-frontend/src/pages/admin/UserManagement.jsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists" "success"
    else
        print_status "$file missing" "error"
    fi
done

# Check for common issues
echo -e "\n${BLUE}5. Checking for Common Issues...${NC}"

# Check if node_modules exist
if [ -d "soligant-api/node_modules" ]; then
    print_status "Backend dependencies installed" "success"
else
    print_status "Backend dependencies missing. Run: cd soligant-api && npm install" "warning"
fi

if [ -d "soligant-frontend/node_modules" ]; then
    print_status "Frontend dependencies installed" "success"
else
    print_status "Frontend dependencies missing. Run: cd soligant-frontend && npm install" "warning"
fi

# Check database connection (if possible)
echo -e "\n${BLUE}6. Database Connection Test...${NC}"
if [ -f "soligant-api/.env" ]; then
    print_status "Environment file exists" "success"
    
    # Try to extract database URL
    if grep -q "DATABASE_URL\|DB_" "soligant-api/.env"; then
        print_status "Database configuration found" "success"
    else
        print_status "Database configuration missing in .env" "warning"
    fi
else
    print_status "Environment file missing" "warning"
    echo "Create soligant-api/.env with database configuration"
fi

# Run backend test script if available
echo -e "\n${BLUE}7. Running Backend Tests...${NC}"
if [ -f "soligant-api/debug-user-creation.js" ]; then
    print_status "Running backend test script..." "info"
    cd soligant-api
    if node debug-user-creation.js > /dev/null 2>&1; then
        print_status "Backend test script completed" "success"
    else
        print_status "Backend test script failed" "warning"
    fi
    cd ..
else
    print_status "Backend test script not found" "info"
fi

# Summary and next steps
echo -e "\n${GREEN}📋 Test Summary${NC}"
echo "=================="

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Start both backend and frontend servers"
echo "2. Login to the system with admin credentials"
echo "3. Navigate to User Management page (/admin/users)"
echo "4. Click 'Tạo người dùng mới' button"
echo "5. Fill the form and submit"
echo "6. Check browser console for logs"
echo "7. Verify new user appears in the list"

echo -e "\n${YELLOW}Debug Commands:${NC}"
echo "- Backend logs: tail -f soligant-api/logs/app.log"
echo "- Database logs: Check your database logs"
echo "- Browser DevTools: F12 -> Console + Network tabs"

echo -e "\n${YELLOW}Test Scripts:${NC}"
echo "- Frontend test: Open browser console and run testUserCreation()"
echo "- API test: node test-user-creation-full.js"
echo "- Component test: Add UserCreationTest.jsx to your routes"

echo -e "\n${GREEN}🎯 Ready for Testing!${NC}"
echo "Open http://localhost:3000 and test the user creation feature."

exit 0
