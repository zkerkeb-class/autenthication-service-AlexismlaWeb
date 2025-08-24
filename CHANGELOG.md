# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial authentication service setup
- JWT token generation and validation
- User registration and login endpoints
- Password reset functionality
- Email verification system
- Comprehensive test coverage

### Changed
- Updated dependencies to latest stable versions
- Improved error handling and logging

### Fixed
- JWT token expiration handling
- Password hashing security improvements

## [1.0.1] - 2024-08-24

### Fixed
- JWT_SECRET environment variable validation
- Token refresh mechanism
- Error response formatting

### Security
- Updated bcryptjs to latest version
- Enhanced input validation

## [1.0.0] - 2024-08-20

### Added
- Initial release
- User authentication endpoints
- JWT-based session management
- Password reset functionality
- Email verification system
- Comprehensive API documentation
