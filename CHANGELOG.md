# Changelog

All notable changes to the OpenAL Shared Example Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2025-08-21

### Added
- **Notion-Style Website Redesign**: Complete visual overhaul with modern Notion-inspired design
- **Full-Screen Background Image**: Added X-Plane screenshot as hero background with parallax effect
- **Glass Morphism UI**: Modern glass-like buttons and cards with backdrop blur effects
- **Enhanced Animations**: Smooth fade-in animations and hover effects throughout the website
- **Improved Typography**: Better font hierarchy and readability with system fonts
- **Mobile Optimization**: Enhanced responsive design with better touch interactions

### Website Improvements
- **Visual Design**: Clean, minimal aesthetic inspired by Notion's design language
- **Color Palette**: Updated to Notion's signature colors (grays and blues)
- **Interactive Elements**: Ripple effects on buttons and enhanced hover states
- **Performance**: Optimized animations and effects for smooth 60fps experience
- **Accessibility**: Improved keyboard navigation and screen reader support

### Technical Enhancements
- **CSS Architecture**: Better organization with CSS custom properties
- **JavaScript Improvements**: Enhanced error handling and user interactions
- **Responsive Design**: Mobile-first approach with better breakpoints
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## [1.0.4] - 2025-08-21

### Added
- **Static Website**: Created a modern, responsive static website for the plugin
- **GitHub Pages Integration**: Added automatic deployment workflow for the website
- **Dynamic Release Downloads**: Website automatically fetches and displays latest releases from GitHub
- **Live Changelog Display**: Website parses and displays the CHANGELOG.md file automatically
- **Cross-Platform Download Cards**: Separate download buttons for Windows, macOS, Linux, and complete package
- **Mobile-Responsive Design**: Website works perfectly on desktop, tablet, and mobile devices

### Website Features
- **Modern UI**: Clean, professional design with smooth animations and modern typography
- **GitHub API Integration**: Real-time release information and download statistics
- **Installation Guide**: Step-by-step installation instructions for users
- **Feature Showcase**: Highlights plugin capabilities and technical details
- **SEO Optimized**: Semantic HTML structure and meta descriptions
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation support

### Technical Improvements
- **Automated Deployment**: GitHub Actions workflow for automatic website deployment
- **Performance Optimized**: Fast loading with minimal dependencies and optimized assets
- **Error Handling**: Graceful fallbacks when GitHub API is unavailable
- **Cross-Browser Support**: Compatible with all modern browsers
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Documentation
- **Website Documentation**: Comprehensive README for website deployment and customization
- **Deployment Scripts**: Automated scripts for various hosting platforms
- **Development Guide**: Instructions for local development and testing

## [1.0.3] - 2025-08-21

### Added
- **Community Templates**: Added GitHub issue templates for bug reports and feature requests
- **Pull Request Template**: Added comprehensive PR template with testing checklist and platform verification
- **Issue Template Configuration**: Added config file to guide users to appropriate channels for questions and discussions

### Community Improvements
- Enhanced project contribution workflow with standardized templates
- Improved issue reporting with structured bug report and feature request forms
- Streamlined pull request process with comprehensive checklists
- Better guidance for community members seeking help or documentation

## [1.0.2] - 2025-08-20

### Fixed
- **Critical Bug**: Fixed swapped endianness macros (SWAP_16/SWAP_32) that caused audio corruption on big-endian systems
- **Security**: Replaced unsafe `strcpy()` calls with `strncpy()` to prevent buffer overflow vulnerabilities
- **Security**: Replaced unsafe `strcat()` call with `strncat()` with proper bounds checking
- **Format Strings**: Fixed printf format string mismatches for pointer arguments
- **Code Quality**: Improved memory safety and reduced compiler warnings from 39 to 37

### Changed
- Enhanced string handling with proper bounds checking throughout the codebase
- Improved cross-platform compatibility with correct endianness handling
- Updated pointer formatting to use proper `%p` format specifiers

### Technical Improvements
- Eliminated buffer overflow security vulnerabilities in plugin initialization
- Fixed audio data corruption issues on big-endian architectures
- Enhanced code safety without affecting functionality or performance
- Maintained full backward compatibility with existing X-Plane installations

## [1.0.1] - 2025-08-20

### Fixed
- **Windows Build Issue**: Completely resolved Windows compilation problems with OpenAL headers
- **OpenAL SDK Integration**: Fixed Windows GitHub Actions workflow to automatically download and configure OpenAL-Soft SDK
- **Header Include Paths**: Corrected OpenAL header includes for Windows (`AL/al.h`) vs macOS (`OpenAL/al.h`)
- **CMake Configuration**: Enhanced Windows CMake configuration with comprehensive OpenAL detection and linking
- **CI/CD Pipeline**: Improved GitHub Actions workflow with robust OpenAL installation and verification steps

### Changed
- Updated Windows build process to use OpenAL-Soft SDK instead of system OpenAL
- Enhanced CMake error reporting with clear success/failure messages for OpenAL detection
- Improved GitHub Actions workflow with detailed OpenAL setup logging and verification

### Technical Improvements
- Added automatic OpenAL-Soft SDK download in GitHub Actions for Windows builds
- Implemented comprehensive OpenAL path searching in CMake for Windows
- Added environment variable support (`OPENAL_ROOT`) for flexible OpenAL SDK location
- Enhanced build verification with detailed OpenAL file structure logging

## [1.0.0] - 2025-08-20

### Added
- Initial release of OpenAL Shared Example Plugin
- Cross-platform support for Windows, macOS, and Linux
- OpenAL sound playback demonstration in X-Plane
- Automatic sound playback when aircraft is loaded
- Progressive pitch increase with each playback
- CMake-based build system for all platforms
- Comprehensive build scripts (build.sh, build_windows.bat, build_linux.sh)
- Cross-platform build automation with build_all.py
- GitHub Actions CI/CD pipeline for automated builds and releases
- Installation script (install.sh) for easy plugin deployment
- Cross-platform testing script (test_cross_platform.py)
- Support for X-Plane SDK versions 200, 300, 400, and 410
- Proper symbol export configuration for all platforms
- OpenAL framework integration for audio playback
- Carbon framework integration for macOS file path conversion

### Technical Details
- Built with C++17 standard
- Uses X-Plane Plugin SDK
- OpenAL for cross-platform audio
- CMake 3.16+ build system
- Universal binary support for macOS (Intel + Apple Silicon)
- 64-bit library support for all platforms

### Documentation
- Comprehensive README with build and installation instructions
- Cross-platform build documentation
- Plugin usage guidelines
- Installation and deployment instructions

[Unreleased]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/6639835/xplane-plugin-example/releases/tag/v1.0.0
