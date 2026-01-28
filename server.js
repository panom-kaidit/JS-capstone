const http = require("http");
const fs = require("fs");


const server = http.createServer((req, res) => {
    switch (req.url) {
        case "/":
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Home route");
            break;

        case "/kgl/procurement":
            if (req.method === "GET") {
                fs.readFile("data.json", "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        return res.end("Error reading file");
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(data);
                });

            } else if (req.method === "POST") {
                let body = "";

                req.on("data", chunk => {
                    body += chunk;
                });

                req.on("end", () => {
                    let newRecord;


                    try {
                        newRecord = JSON.parse(body);
                    } catch (error) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "Invalid JSON format" }));
                    }

                    fs.readFile("data.json", "utf8", (err, data) => {
                        let records = [];

                        if (!err && data) {
                            try {
                                records = JSON.parse(data);
                            } catch {
                                records = [];
                            }
                        }

                        records.push(newRecord);

                        fs.writeFile(
                            "data.json",
                            JSON.stringify(records, null, 2),
                            err => {
                                if (err) {
                                    res.writeHead(500, { "Content-Type": "application/json" });
                                    return res.end(
                                        JSON.stringify({ message: "Failed to write data" })
                                    );
                                }

                                res.writeHead(201, { "Content-Type": "application/json" });
                                return res.end(
                                    JSON.stringify({
                                        message: "Procurement record added successfully"
                                    })
                                );
                            }
                        );
                    });
                });

            } else {

                res.writeHead(405, { "Content-Type": "text/plain" });
                res.end("Method Not Allowed");
            }

            break;

        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Route not found");
    }
});

server.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
