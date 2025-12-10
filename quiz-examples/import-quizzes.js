const fs = require('fs');
const path = require('path');

// Configuración de Strapi
const STRAPI_URL = 'http://localhost:1338';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Función para leer archivos JSON
function readQuizFiles() {
  const quizDir = __dirname;
  const files = fs.readdirSync(quizDir).filter(file => file.endsWith('.json'));

  return files.map(file => {
    const filePath = path.join(quizDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  });
}

// Función para importar un quiz a Strapi
async function importQuiz(quiz) {
  try {
    const response = await fetch(`${STRAPI_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(quiz)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error importing ${quiz.title}: ${error}`);
    }

    const result = await response.json();
    console.log(`✓ Imported: ${quiz.title}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to import ${quiz.title}:`, error.message);
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🚀 Starting quiz import...\n');

  if (!STRAPI_API_TOKEN) {
    console.log('⚠️  No STRAPI_API_TOKEN provided. Make sure authentication is disabled or provide a token.');
  }

  try {
    const quizzes = readQuizFiles();
    console.log(`Found ${quizzes.length} quiz files\n`);

    for (const quiz of quizzes) {
      await importQuiz(quiz);
    }

    console.log(`\n✅ Successfully imported ${quizzes.length} quizzes!`);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { importQuiz, readQuizFiles };
