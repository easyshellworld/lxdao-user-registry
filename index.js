const { readFile, updateFile } = require("./utils/github");
const { userVerification } = require("./utils/userverif");

async function main() {
  try {
    const fileContent = await readFile("Template.md");
    console.log("File content:", fileContent);
    await userVerification()
   // await updateFile("file.txt", "New content", "Update file content");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();