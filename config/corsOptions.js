const allowedOrigins = [
  "https://royalbuffet.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;