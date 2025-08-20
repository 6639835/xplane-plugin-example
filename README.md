# OpenAL Shared Example Plugin for X-Plane

A cross-platform X-Plane plugin demonstrating OpenAL sound playback functionality. This plugin serves as a practical example for developers learning to create audio-enabled X-Plane plugins.

## 🚀 **Automated Builds with GitHub Actions**

**You don't need to compile this plugin yourself!** This repository uses GitHub Actions to automatically compile binaries for all supported platforms whenever code changes are made.

### Download Pre-compiled Binaries

1. **Latest Release**: Go to the [Releases page](../../releases) to download the latest stable version
2. **Development Builds**: Check the [Actions tab](../../actions) for the latest development builds from recent commits

Each release includes:
- `win.xpl` - Windows (64-bit)
- `mac.xpl` - macOS Universal (Intel + Apple Silicon)
- `lin.xpl` - Linux (64-bit)
- `OpenALSharedExample.tar.gz` - All platforms bundled together

### Automatic Release Process

The GitHub Actions workflow automatically:
- ✅ Builds for Windows, macOS, and Linux on every commit
- ✅ Runs comprehensive cross-platform tests
- ✅ Creates releases when the `VERSION` file is updated
- ✅ Packages all platforms into convenient downloads
- ✅ Generates installation instructions

**Simply update the `VERSION` file and push to trigger a new release!**

## 📋 Features

- **Cross-platform compatibility**: Windows, macOS (Intel & Apple Silicon), Linux
- **OpenAL integration**: Demonstrates proper OpenAL context management in X-Plane
- **Automatic sound playback**: Plays sound when aircraft is loaded
- **Pitch shifting**: Each playback increases pitch slightly for demonstration
- **Proper plugin lifecycle**: Shows correct initialization and cleanup procedures

## 🛠 Installation

### Option 1: Use Pre-compiled Binaries (Recommended)

1. Download the appropriate `.xpl` file for your platform from the [Releases page](../../releases)
2. Create the plugin directory: `X-Plane/Resources/plugins/OpenALSharedExample/`
3. Copy the `.xpl` file to this directory
4. Add a `sound.wav` file to the same directory (any WAV file will work)
5. Restart X-Plane

### Option 2: Manual Compilation

If you need to modify the code or prefer to compile yourself:

#### Prerequisites
- **CMake** 3.16 or later
- **C++ compiler** with C++17 support
- **OpenAL development libraries** (Linux only - Windows/macOS include OpenAL)

#### Quick Build
```bash
# Clone the repository
git clone https://github.com/6639835/xplane-plugin-example
cd xplane-plugin-example

# Build for your platform
python build_all.py

# Or build with cleanup
python build_all.py clean
```

#### Platform-Specific Build Commands
```bash
# Windows
python build_all.py --platform windows

# macOS  
python build_all.py --platform mac

# Linux
python build_all.py --platform linux
```

The compiled plugin will be in the `build/` directory.

## 🎮 Usage

1. **Load X-Plane** with the plugin installed
2. **Load any aircraft** - the plugin will automatically play a sound
3. **Check Log.txt** for plugin status messages and OpenAL information
4. **Each aircraft load** will play the sound at a progressively higher pitch

## 🔧 Development

### Project Structure
```
├── src/                    # Source code
│   └── OpenAL-Shared-Example.cpp
├── SDK/                    # X-Plane SDK (included)
├── build/                  # Build output directory
├── .github/workflows/      # GitHub Actions CI/CD
├── CMakeLists.txt         # CMake configuration
├── build_all.py           # Cross-platform build script
├── VERSION                # Version file (triggers releases)
└── README.md              # This file
```

### Making Changes

1. **Fork the repository**
2. **Make your changes** to the source code
3. **Test locally** using `python build_all.py`
4. **Push your changes** - GitHub Actions will automatically build and test
5. **Create a pull request**

### Creating a New Release

1. **Update the `VERSION` file** with the new version number (e.g., `1.1.0`)
2. **Commit and push** the change to the main branch
3. **GitHub Actions will automatically**:
   - Build all platforms
   - Create a git tag
   - Generate a GitHub release
   - Upload all binaries

## 🏗 GitHub Actions Workflow

The repository includes a comprehensive CI/CD pipeline that:

### On Every Push/PR:
- Builds the plugin for Windows, macOS, and Linux
- Uploads build artifacts for download
- Runs cross-platform compatibility tests

### On Version Updates:
- Automatically creates git tags
- Generates GitHub releases with changelogs
- Packages all platform binaries
- Creates installation instructions

### Workflow Features:
- **Matrix builds** across all platforms simultaneously
- **Artifact retention** for 30-90 days
- **Automatic dependency installation** (CMake, OpenAL, etc.)
- **Universal macOS binaries** (Intel + Apple Silicon)
- **Comprehensive error handling** and logging

## 📚 Technical Details

### OpenAL Integration
- Creates its own OpenAL device and context
- Properly shares OpenAL with X-Plane and other plugins
- Demonstrates correct context switching
- Includes comprehensive error checking

### X-Plane Plugin API
- Uses XPLM SDK version 4.1.0 (backwards compatible)
- Proper plugin lifecycle management
- Cross-platform file path handling
- Deferred initialization pattern

### Build System
- **CMake-based** with platform-specific configurations
- **Symbol export control** for proper plugin loading
- **Compiler optimization** and security flags
- **Framework linking** on macOS, static linking on other platforms

## 🐛 Troubleshooting

### Plugin Not Loading
1. Check X-Plane's `Log.txt` for error messages
2. Ensure the correct `.xpl` file for your platform
3. Verify the plugin directory structure
4. Make sure `sound.wav` exists in the plugin directory

### No Sound Playing
1. Check that OpenAL is working on your system
2. Verify the `sound.wav` file is a valid WAV file
3. Check X-Plane's audio settings
4. Look for OpenAL error messages in `Log.txt`

### Build Issues
1. **Use pre-compiled binaries** from GitHub releases instead
2. Check that all dependencies are installed
3. Ensure CMake 3.16+ is available
4. Verify the X-Plane SDK is present in the `SDK/` directory

## 📄 License

This project is licensed under the terms specified in the `LICENSE` file.

## 🤝 Contributing

Contributions are welcome! The GitHub Actions workflow ensures that all contributions are automatically tested across platforms.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push and create a pull request
5. GitHub Actions will automatically build and test your changes

## 🔗 Related Resources

- [X-Plane SDK Documentation](https://developer.x-plane.com/sdk/)
- [OpenAL Programming Guide](https://www.openal.org/documentation/)
- [X-Plane Plugin Development](https://developer.x-plane.com/article/developing-plugins/)

---

**💡 Remember: You can rely on GitHub Actions to compile files for all platforms automatically. No need for manual compilation unless you're actively developing!**
