exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb://localhost:27017/queen';
exports.secret = process.env.JWT_SECRET || '104d7a31bd5babd695ba92c8cd18b57b8c275edfdc86a80359253185a05cb74d';
exports.adminEmail = process.env.ADMIN_EMAIL || 'andrea@gmail.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || '123456';
