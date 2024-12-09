const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const notesRoutes = require("./routes/notesRoutes");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use("/notes", notesRoutes);

app.listen(port, () => {
	console.log(`Sunucu çalışıyor: http://127.0.0.1:${port}`);
});
