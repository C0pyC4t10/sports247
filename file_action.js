const fs = require('fs').promises;
const path = require('path');

async function createFileStructure() {
  try {
    const folderPath = path.join(__dirname, 'MyAutomation');
    const filePath = path.join(folderPath, 'note.txt');
    const fileContent = 'This file was created by AI-powered JS!';

    // Check if folder exists, if not create it
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath);
      console.log('Folder "MyAutomation" created successfully');
    }

    // Create and write to file
    await fs.writeFile(filePath, fileContent);
    console.log('File "note.txt" created successfully');
    console.log('Success: File structure created!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createFileStructure();
