# PayTrack API

A comprehensive and secure payment tracking API with webhook events, JWT authentication, audit-ready logs, and advanced features.

## Features

- **User Management**: Registration, login, profile updates with role-based access
- **Payment Tracking**: Create, update, and manage payments with transaction history
- **Transaction Management**: Detailed transaction records with multiple gateways
- **Invoicing**: Generate and manage invoices
- **Webhook Integration**: Secure webhook handling with Stripe integration
- **Admin Panel**: Administrative functions for user and data management
- **Security**: Rate limiting, input validation, XSS protection, MongoDB sanitization
- **Audit Logging**: Comprehensive logging with Winston for all actions
- **API Versioning**: v1 API endpoints

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MongoDB
5. Run the server: `npm start` or `npm run dev` for development

## Landing Page (Next.js Multi-Page)

A complete Next.js front-end is available in the `frontend/` folder with multi-page UI:
- `GET /` (Home)
- `GET /about` (About PayTrack)
- `GET /docs` (API Docs)

### Frontend Usage

1. `cd frontend`
2. `npm install`
3. `npm run dev` (default Next.js in development on 3000)

### API Server Usage

1. `npm install` (root)
2. `npm start` (root API server on 3000) or set `PORT=4000` if Next.js is on 3000
3. API endpoints served on `/api/v1/*`

Note: To run both simultaneously, start API on `PORT=4000`:
- `PORT=4000 npm start`
- `cd frontend && npm run dev`

## No Mock Data

This API does not seed or depend on mock data. All data is live from backend MongoDB models (`User`, `Payment`, `Transaction`, `Invoice`, `AuditLog`).

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `PORT`: Server port (default 3000)
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret for verification
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### Authentication (v1)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/me` - Update user profile

### Payments (v1)
- `GET /api/v1/payments` - Get user payments
- `POST /api/v1/payments` - Create payment
- `PATCH /api/v1/payments/:id` - Update payment
- `DELETE /api/v1/payments/:id` - Delete payment

### Transactions (v1)
- `GET /api/v1/transactions` - Get user transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/:id` - Get transaction details

### Invoices (v1)
- `GET /api/v1/invoices` - Get user invoices
- `POST /api/v1/invoices` - Create invoice
- `PUT /api/v1/invoices/:id` - Update invoice
- `DELETE /api/v1/invoices/:id` - Delete invoice

### Webhooks (v1)
- `POST /api/v1/webhooks/stripe` - Stripe webhook endpoint
- `POST /api/v1/webhooks` - Generic webhook
- `GET /api/v1/webhooks/logs` - Get webhook logs

### Admin (v1) - Requires admin role
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/payments` - Get all payments
- `GET /api/v1/admin/transactions` - Get all transactions
- `GET /api/v1/admin/audit-logs` - Get audit logs
- `PATCH /api/v1/admin/users/:id/deactivate` - Deactivate user

## Security Features

- JWT authentication with role-based access control
- Rate limiting on auth endpoints
- Input validation with Joi
- XSS protection and MongoDB injection prevention
- Helmet for secure headers
- Compression for performance
- Winston logging for audit trails

## Testing

Run tests with `npm test`

## License

ISC# PayTrack
# PayTrack
# PayTrack
# PayTrack
