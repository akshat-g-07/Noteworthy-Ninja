const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream("Noteworthy-Ninja.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => console.log("Zip file created successfully"));
archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.directory("dist/", false);
archive.finalize();
