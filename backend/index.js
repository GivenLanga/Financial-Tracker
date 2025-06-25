const cors = require("cors");
app.use(
  cors({
    origin: [
      "https://budgetapp-b4aff.web.app",
      "https://budgetapp-b4aff.firebaseapp.com",
    ],
    credentials: true,
  })
);
