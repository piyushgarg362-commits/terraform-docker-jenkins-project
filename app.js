const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });

    res.end(`
        <h1>Hello from DevOps!</h1>
        <h2>Terraform + Docker + Jenkins</h2>
        <p>Automated deployment on AWS EC2.</p>
    `);
});

server.listen(3000, "0.0.0.0", () => {
    console.log("Application running on port 3000");
});
