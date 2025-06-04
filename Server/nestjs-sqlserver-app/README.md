# NestJS SQL Server Application

This project is a NestJS application that connects to a Microsoft SQL Server database. It serves as a backend for building scalable and maintainable server-side applications.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nestjs-sqlserver-app.git
   cd nestjs-sqlserver-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your database connection settings:
   ```
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

## Configuration

The application uses environment variables for configuration. Make sure to set the following variables in your `.env` file:

- `DB_HOST`: The host of your SQL Server database.
- `DB_PORT`: The port of your SQL Server database.
- `DB_USERNAME`: The username for your SQL Server database.
- `DB_PASSWORD`: The password for your SQL Server database.
- `DB_NAME`: The name of your SQL Server database.

## Running the Application

To start the application, run the following command:

```bash
npm run start
```

The application will be running on `http://localhost:3000`.

## Testing

To run the end-to-end tests, use the following command:

```bash
npm run test:e2e
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.