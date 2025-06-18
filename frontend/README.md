# FreqVault Frontend

A React-based frontend for the FreqVault secure file encryption system.

## Features

- 🔐 Secure file encryption with hybrid RSA-AES encryption
- 👨‍💼 Admin dashboard for file upload and encryption
- 👤 User dashboard for file access and decryption
- 🎨 Modern, responsive UI with drag-and-drop file upload
- 🔒 Role-based access control
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 8888

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Usage

### Admin Features
1. Register as an admin at `/admin/register`
2. Login at `/admin/login`
3. Upload files using drag-and-drop or file picker
4. Encrypt uploaded files with hybrid RSA-AES encryption

### User Features
1. Register as a user at `/user/register`
2. Login at `/user/login`
3. View available encrypted files
4. Download and decrypt files

## API Endpoints

The frontend communicates with the backend API:

- `POST /api/admin` - Admin registration
- `POST /api/admin/login` - Admin login
- `POST /api/admin/upload` - File upload
- `POST /api/admin/encrypt` - File encryption
- `POST /api/user` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/files` - Get available files
- `GET /api/user/download/:id` - Download file
- `POST /api/user/decrypt/:id` - Decrypt file

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Hybrid RSA-AES encryption
- Quantum random number generation
- Secure file storage in MongoDB

## Technologies Used

- React 18
- React Router DOM
- Axios for API calls
- CSS3 with modern design patterns
- HTML5 File API for drag-and-drop

## Development

To build for production:
```bash
npm run build
```

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 