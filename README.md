# Finance Tracker

A modern web application to track your personal finances with a clean, user-friendly interface.

## Features

- Track transactions with amount, description, date, and category
- View spending by category with interactive charts
- Edit and delete transactions
- Filter transactions by category
- Responsive design with a modern purple and coral color scheme

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/manelcasado/Finance-Tracker.git
   cd Finance-Tracker
   ```

2. Install dependencies:
   ```
   cd client/client
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env` in the root directory
   - Update the values in the `.env` file with your database credentials

4. Start the development server:
   ```
   npm start
   ```

## Environment Variables

The application uses the following environment variables:

- `DB_HOST`: Database host (default: localhost)
- `DB_USER`: Database username
- `DB_PASS`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port (default: 3306)

## Technologies Used

- React
- Bootstrap
- Chart.js
- Font Awesome
- Node.js (backend)
- MySQL (database)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
