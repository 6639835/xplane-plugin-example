# Changelog

All notable changes to the OpenAL Shared Example Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/6639835/xplane-plugin-example/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/6639835/xplane-plugin-example/releases/tag/v1.0.0
