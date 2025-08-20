#!/bin/bash

# OpenAL Shared Example Plugin - Website Deployment Script
# This script helps deploy the static website to various platforms

set -e

echo "🚀 OpenAL Plugin Website Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the website directory
if [ ! -f "index.html" ]; then
    print_error "Please run this script from the website directory"
    exit 1
fi

# Function to validate files
validate_files() {
    print_status "Validating website files..."
    
    required_files=("index.html" "styles.css" "script.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_success "All required files present"
}

# Function to start local development server
start_local_server() {
    print_status "Starting local development server..."
    
    # Check if Python is available
    if command -v python3 &> /dev/null; then
        print_status "Using Python 3 HTTP server on port 8000"
        print_status "Open http://localhost:8000 in your browser"
        print_warning "Press Ctrl+C to stop the server"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        print_status "Using Python 2 HTTP server on port 8000"
        print_status "Open http://localhost:8000 in your browser"
        print_warning "Press Ctrl+C to stop the server"
        python -m SimpleHTTPServer 8000
    elif command -v node &> /dev/null; then
        if command -v npx &> /dev/null; then
            print_status "Using Node.js HTTP server on port 8000"
            print_status "Open http://localhost:8000 in your browser"
            print_warning "Press Ctrl+C to stop the server"
            npx http-server -p 8000
        else
            print_error "Node.js found but npx not available"
            exit 1
        fi
    else
        print_error "No suitable HTTP server found. Please install Python or Node.js"
        exit 1
    fi
}

# Function to prepare for GitHub Pages
prepare_github_pages() {
    print_status "Preparing for GitHub Pages deployment..."
    
    # Create .nojekyll file to bypass Jekyll processing
    touch .nojekyll
    print_success "Created .nojekyll file"
    
    # Check if CNAME file exists for custom domain
    if [ -f "CNAME" ]; then
        print_success "CNAME file found for custom domain"
    else
        print_warning "No CNAME file found. Add one if you're using a custom domain"
    fi
    
    print_status "GitHub Pages preparation complete"
    echo ""
    echo "To deploy to GitHub Pages:"
    echo "1. Commit and push all changes to your repository"
    echo "2. Go to repository Settings > Pages"
    echo "3. Select source: 'Deploy from a branch'"
    echo "4. Choose branch: 'main' and folder: '/website'"
    echo "5. Your site will be available at: https://username.github.io/repository-name"
}

# Function to create Netlify deployment files
prepare_netlify() {
    print_status "Preparing for Netlify deployment..."
    
    # Create _redirects file for SPA routing (if needed)
    if [ ! -f "_redirects" ]; then
        echo "# Netlify redirects file" > _redirects
        echo "# Add any custom redirects here" >> _redirects
        print_success "Created _redirects file"
    fi
    
    # Create netlify.toml configuration
    cat > netlify.toml << EOF
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
EOF
    
    print_success "Created netlify.toml configuration"
    print_status "Netlify preparation complete"
    echo ""
    echo "To deploy to Netlify:"
    echo "1. Go to https://netlify.com"
    echo "2. Drag and drop this website folder, or"
    echo "3. Connect your GitHub repository"
    echo "4. Set build directory to 'website'"
}

# Function to create Vercel deployment files
prepare_vercel() {
    print_status "Preparing for Vercel deployment..."
    
    # Create vercel.json configuration
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF
    
    print_success "Created vercel.json configuration"
    print_status "Vercel preparation complete"
    echo ""
    echo "To deploy to Vercel:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your GitHub repository"
    echo "3. Set output directory to 'website'"
    echo "4. Deploy automatically on commits"
}

# Function to optimize files
optimize_files() {
    print_status "Optimizing website files..."
    
    # Check if HTML file is properly formatted
    if command -v tidy &> /dev/null; then
        print_status "Validating HTML..."
        tidy -q -e index.html || print_warning "HTML validation warnings found"
    fi
    
    # Check file sizes
    html_size=$(wc -c < index.html)
    css_size=$(wc -c < styles.css)
    js_size=$(wc -c < script.js)
    
    print_status "File sizes:"
    echo "  - index.html: $(($html_size / 1024))KB"
    echo "  - styles.css: $(($css_size / 1024))KB"
    echo "  - script.js: $(($js_size / 1024))KB"
    
    total_size=$(($html_size + $css_size + $js_size))
    print_success "Total size: $(($total_size / 1024))KB"
}

# Function to test website
test_website() {
    print_status "Testing website functionality..."
    
    # Check if all external resources are accessible
    print_status "Checking external resources..."
    
    # Test Google Fonts
    if curl -s --head "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" | head -n 1 | grep -q "200 OK"; then
        print_success "Google Fonts accessible"
    else
        print_warning "Google Fonts may not be accessible"
    fi
    
    # Test Font Awesome
    if curl -s --head "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" | head -n 1 | grep -q "200 OK"; then
        print_success "Font Awesome accessible"
    else
        print_warning "Font Awesome may not be accessible"
    fi
    
    print_success "Website testing complete"
}

# Main menu
show_menu() {
    echo ""
    echo "Choose a deployment option:"
    echo "1) Start local development server"
    echo "2) Prepare for GitHub Pages"
    echo "3) Prepare for Netlify"
    echo "4) Prepare for Vercel"
    echo "5) Optimize and test website"
    echo "6) Validate files only"
    echo "7) Exit"
    echo ""
}

# Main script logic
main() {
    validate_files
    
    while true; do
        show_menu
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                start_local_server
                ;;
            2)
                prepare_github_pages
                ;;
            3)
                prepare_netlify
                ;;
            4)
                prepare_vercel
                ;;
            5)
                optimize_files
                test_website
                ;;
            6)
                validate_files
                print_success "File validation complete"
                ;;
            7)
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
