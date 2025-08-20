# Contributing to OpenAL Shared Example Plugin

Thank you for your interest in contributing to the OpenAL Shared Example Plugin! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Building the Project](#building-the-project)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Issue Reporting](#issue-reporting)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **CMake 3.16+**
- **C++17 compatible compiler**
- **X-Plane SDK** (included in this repository)
- **OpenAL development libraries** (platform-specific)

#### Platform-Specific Requirements

**Windows:**
- Visual Studio 2019+ or MinGW-w64
- OpenAL SDK (usually included with Windows)

**macOS:**
- Xcode Command Line Tools
- OpenAL framework (included with macOS)

**Linux:**
- GCC 7+ or Clang 6+
- OpenAL development packages: `sudo apt-get install libopenal-dev`

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/6639835/xplane-plugin-example.git
   cd xplane-openal-example
   ```

2. **Verify Setup**
   ```bash
   python3 test_cross_platform.py
   ```

3. **Build the Project**
   ```bash
   # Cross-platform build
   python3 build_all.py
   
   # Platform-specific builds
   ./build.sh              # macOS/Linux
   build_windows.bat       # Windows
   ./build_linux.sh        # Linux
   ```

## Building the Project

### Quick Build
```bash
python3 build_all.py
```

### Clean Build
```bash
python3 build_all.py clean
```

### Platform-Specific Builds
```bash
python3 build_all.py --platform windows
python3 build_all.py --platform mac
python3 build_all.py --platform linux
```

## Testing

### Run All Tests
```bash
python3 test_cross_platform.py
```

### Manual Testing
1. Build the plugin for your platform
2. Install using `./install.sh` (macOS/Linux)
3. Copy a `sound.wav` file to the plugin directory
4. Test in X-Plane by loading an aircraft

## Submitting Changes

### Before You Submit

1. **Test your changes** on your target platform(s)
2. **Run the test suite**: `python3 test_cross_platform.py`
3. **Update documentation** if needed
4. **Follow coding standards** (see below)

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer description if needed

- List specific changes
- Reference issues: Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `build`: Build system changes

## Coding Standards

### C++ Guidelines

- **Standard**: C++17
- **Naming**: Use `snake_case` for variables and functions
- **Classes**: Use `PascalCase` for class names
- **Constants**: Use `UPPER_SNAKE_CASE`
- **Indentation**: 4 spaces (no tabs)
- **Line Length**: Maximum 100 characters

### Code Style Example

```cpp
#include "XPLMUtilities.h"

class AudioManager {
private:
    static constexpr int MAX_BUFFER_SIZE = 4096;
    ALuint sound_buffer_;
    ALuint sound_source_;
    
public:
    bool initialize_audio();
    void play_sound(float pitch = 1.0f);
    void cleanup();
};

bool AudioManager::initialize_audio() {
    // Implementation here
    return true;
}
```

### Build Script Guidelines

- Use consistent error handling
- Provide clear status messages
- Support both clean and incremental builds
- Test on target platforms before submitting

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Platform**: Windows/macOS/Linux version
2. **X-Plane Version**: X-Plane 11/12 version
3. **Plugin Version**: Version number
4. **Steps to Reproduce**: Clear, numbered steps
5. **Expected Behavior**: What should happen
6. **Actual Behavior**: What actually happens
7. **Logs**: Relevant X-Plane Log.txt entries
8. **Additional Context**: Screenshots, audio files, etc.

### Feature Requests

For feature requests, please describe:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Additional Context**: Examples, mockups, etc.

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test Thoroughly**
   ```bash
   python3 test_cross_platform.py
   python3 build_all.py clean
   ```

4. **Submit Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe changes made
   - Include testing information

5. **Review Process**
   - Address reviewer feedback
   - Keep PR updated with main branch
   - Ensure CI/CD passes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests pass on target platform(s)
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts with main branch

## Development Tips

### Debugging

1. **Enable Debug Logging**
   ```cpp
   XPLMDebugString("Debug message\n");
   ```

2. **Check X-Plane Log.txt**
   - Location: X-Plane installation directory
   - Contains plugin loading and runtime messages

3. **Use Platform Tools**
   - **Windows**: Visual Studio debugger
   - **macOS**: Xcode debugger, Console.app
   - **Linux**: GDB, system logs

### Common Issues

1. **Build Failures**
   - Verify SDK path in CMakeLists.txt
   - Check OpenAL library installation
   - Ensure compiler supports C++17

2. **Plugin Not Loading**
   - Check symbol exports (mac_exports.txt, win_exports.def, linux_exports.txt)
   - Verify plugin architecture matches X-Plane
   - Check X-Plane Log.txt for error messages

3. **Audio Issues**
   - Ensure sound.wav file exists in plugin directory
   - Check OpenAL context creation
   - Verify audio file format (PCM WAV recommended)

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Documentation**: Check README.md and inline code comments

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- GitHub contributors list
- Release notes for major features

Thank you for contributing to the OpenAL Shared Example Plugin!
