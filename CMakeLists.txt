cmake_minimum_required(VERSION 3.16)
project(OpenAL_Shared_Example)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set X-Plane SDK path (relative path)
set(XPLM_SDK_PATH "${CMAKE_CURRENT_SOURCE_DIR}/SDK")

# Check if macOS
if(APPLE)
    # Set minimum macOS version support
    set(CMAKE_OSX_DEPLOYMENT_TARGET "10.15")
    
    # Set architectures (support Intel and Apple Silicon)
    set(CMAKE_OSX_ARCHITECTURES "x86_64;arm64")
    
    # X-Plane plugins must disable some default settings
    set(CMAKE_SHARED_LIBRARY_PREFIX "")
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".xpl")
    
    # Compiler flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -fvisibility=hidden")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wformat -Wformat-security")
    
    # X-Plane specific compiler definitions
    add_definitions(-DAPL=1 -DIBM=0 -DLIN=0)
    add_definitions(-DXPLM200=1 -DXPLM300=1 -DXPLM400=1 -DXPLM410=1)  # Support X-Plane SDK versions
    
    # Header file include paths
    include_directories(
        "${XPLM_SDK_PATH}/CHeaders/XPLM"
        "${XPLM_SDK_PATH}/CHeaders/Widgets"
        "${CMAKE_CURRENT_SOURCE_DIR}/src"
    )
    
    # Source files
    set(SOURCES
        src/OpenAL-Shared-Example.cpp
    )
    
    # Create dynamic library (X-Plane plugin)
    add_library(${PROJECT_NAME} SHARED ${SOURCES})
    
    # Set output name to mac.xpl
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "mac"
        SUFFIX ".xpl"
        PREFIX ""
    )
    
    # Link X-Plane frameworks and OpenAL
    target_link_libraries(${PROJECT_NAME}
        "${XPLM_SDK_PATH}/Libraries/Mac/XPLM.framework"
        "${XPLM_SDK_PATH}/Libraries/Mac/XPWidgets.framework"
        "-framework OpenAL"
        "-framework Carbon"
    )
    
    # Set framework search paths
    set_target_properties(${PROJECT_NAME} PROPERTIES
        FRAMEWORK_SEARCH_PATHS "${XPLM_SDK_PATH}/Libraries/Mac"
    )
    
    # Set linker flags
    set_target_properties(${PROJECT_NAME} PROPERTIES
        LINK_FLAGS "-F${XPLM_SDK_PATH}/Libraries/Mac"
    )
    
    # Ensure necessary symbols are exported
    set_target_properties(${PROJECT_NAME} PROPERTIES
        LINK_FLAGS "${CMAKE_SHARED_LIBRARY_CREATE_CXX_FLAGS} -Wl,-exported_symbols_list,${CMAKE_CURRENT_SOURCE_DIR}/mac_exports.txt"
    )

elseif(WIN32)
    # Windows configuration
    message(STATUS "Configuring for Windows...")
    
    # X-Plane plugin settings
    set(CMAKE_SHARED_LIBRARY_PREFIX "")
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".xpl")
    
    # Compiler flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W3")
    if(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /EHsc")
    endif()
    
    # X-Plane specific compiler definitions
    add_definitions(-DAPL=0 -DIBM=1 -DLIN=0)
    add_definitions(-DXPLM200=1 -DXPLM300=1 -DXPLM400=1 -DXPLM410=1)  # Support X-Plane SDK versions
    
    # Find OpenAL - comprehensive search for Windows
    set(OPENAL_FOUND FALSE)
    
    # Search paths for OpenAL
    set(OPENAL_SEARCH_PATHS
        "$ENV{OPENAL_ROOT}"
        "C:/OpenAL-SDK/openal-soft-1.23.1-bin"
        "C:/Program Files/OpenAL 1.1 SDK"
        "C:/Program Files (x86)/OpenAL 1.1 SDK"
        "C:/OpenAL"
    )
    
    # Find include directory
    find_path(OPENAL_INCLUDE_DIR
        NAMES AL/al.h OpenAL/al.h
        PATHS ${OPENAL_SEARCH_PATHS}
        PATH_SUFFIXES include
        NO_DEFAULT_PATH
    )
    
    # Find library
    find_library(OPENAL_LIBRARY
        NAMES OpenAL32 openal32 OpenAL
        PATHS ${OPENAL_SEARCH_PATHS}
        PATH_SUFFIXES 
            lib
            libs
            libs/Win64
            libs/Win32
            lib/Win64
            lib/Win32
        NO_DEFAULT_PATH
    )
    
    # Check if we found both
    if(OPENAL_INCLUDE_DIR AND OPENAL_LIBRARY)
        set(OPENAL_FOUND TRUE)
        set(OPENAL_INCLUDE_DIRS ${OPENAL_INCLUDE_DIR})
        set(OPENAL_LIBRARIES ${OPENAL_LIBRARY})
        message(STATUS "✓ Found OpenAL include: ${OPENAL_INCLUDE_DIR}")
        message(STATUS "✓ Found OpenAL library: ${OPENAL_LIBRARY}")
    else()
        message(STATUS "✗ OpenAL include dir: ${OPENAL_INCLUDE_DIR}")
        message(STATUS "✗ OpenAL library: ${OPENAL_LIBRARY}")
        message(FATAL_ERROR "OpenAL not found! Please ensure OpenAL SDK is installed.")
    endif()

    # Header file include paths
    include_directories(
        "${XPLM_SDK_PATH}/CHeaders/XPLM"
        "${XPLM_SDK_PATH}/CHeaders/Widgets"
        "${CMAKE_CURRENT_SOURCE_DIR}/src"
    )
    
    # Add OpenAL include directory
    include_directories(${OPENAL_INCLUDE_DIRS})
    
    # Source files
    set(SOURCES
        src/OpenAL-Shared-Example.cpp
    )
    
    # Create dynamic library (X-Plane plugin)
    add_library(${PROJECT_NAME} SHARED ${SOURCES})
    
    # Set output name to win.xpl
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "win"
        SUFFIX ".xpl"
        PREFIX ""
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}"
        RUNTIME_OUTPUT_DIRECTORY_DEBUG "${CMAKE_CURRENT_BINARY_DIR}"
        RUNTIME_OUTPUT_DIRECTORY_RELEASE "${CMAKE_CURRENT_BINARY_DIR}"
    )
    
    # Link X-Plane libraries and OpenAL
    target_link_libraries(${PROJECT_NAME}
        "${XPLM_SDK_PATH}/Libraries/Win/XPLM_64.lib"
        "${XPLM_SDK_PATH}/Libraries/Win/XPWidgets_64.lib"
    )
    
    # Link OpenAL
    target_link_libraries(${PROJECT_NAME} ${OPENAL_LIBRARIES})
    
    # Use Windows symbol export file
    set_target_properties(${PROJECT_NAME} PROPERTIES
        LINK_FLAGS "/DEF:${CMAKE_CURRENT_SOURCE_DIR}/win_exports.def"
    )

elseif(UNIX AND NOT APPLE)
    # Linux configuration
    message(STATUS "Configuring for Linux...")
    
    # X-Plane plugin settings
    set(CMAKE_SHARED_LIBRARY_PREFIX "")
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".xpl")
    
    # Compiler flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -fvisibility=hidden")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wformat -Wformat-security")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2 -pipe")
    
    # X-Plane specific compiler definitions
    add_definitions(-DAPL=0 -DIBM=0 -DLIN=1)
    add_definitions(-DXPLM200=1 -DXPLM300=1 -DXPLM400=1 -DXPLM410=1)  # Support X-Plane SDK versions
    
    # Header file include paths
    include_directories(
        "${XPLM_SDK_PATH}/CHeaders/XPLM"
        "${XPLM_SDK_PATH}/CHeaders/Widgets"
        "${CMAKE_CURRENT_SOURCE_DIR}/src"
    )
    
    # Source files
    set(SOURCES
        src/OpenAL-Shared-Example.cpp
    )
    
    # Create dynamic library (X-Plane plugin)
    add_library(${PROJECT_NAME} SHARED ${SOURCES})
    
    # Set output name to lin.xpl
    set_target_properties(${PROJECT_NAME} PROPERTIES
        OUTPUT_NAME "lin"
        SUFFIX ".xpl"
        PREFIX ""
    )
    
    # Link X-Plane libraries and OpenAL
    target_link_libraries(${PROJECT_NAME}
        "${XPLM_SDK_PATH}/Libraries/Lin/XPLM_64.so"
        "${XPLM_SDK_PATH}/Libraries/Lin/XPWidgets_64.so"
        openal
        dl  # Dynamic link library
    )
    
    # Use Linux symbol export file
    set_target_properties(${PROJECT_NAME} PROPERTIES
        LINK_FLAGS "-Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/linux_exports.txt"
    )
endif()

# Output compilation information
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "SDK Path: ${XPLM_SDK_PATH}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
if(APPLE)
    message(STATUS "Target Architectures: ${CMAKE_OSX_ARCHITECTURES}")
    message(STATUS "macOS Deployment Target: ${CMAKE_OSX_DEPLOYMENT_TARGET}")
endif()