# Changelog

All notable changes to the OpenAL Shared Example Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/6639835/xplane-plugin-example/releases/tag/v1.0.0
