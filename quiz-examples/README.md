# Quiz Examples for Strapi

Este directorio contiene ejemplos de quizzes listos para importar a Strapi.

## Contenido

### TypeScript
- `typescript-basics.json` - Quiz de conceptos básicos de TypeScript (Beginner)
- `typescript-advanced.json` - Quiz de conceptos avanzados de TypeScript (Advanced)

### Solidity
- `solidity-basics.json` - Quiz de fundamentos de Solidity (Beginner)
- `solidity-security.json` - Quiz de seguridad en Solidity (Intermediate)

### Docker
- `docker-basics.json` - Quiz de conceptos básicos de Docker (Beginner)
- `docker-compose.json` - Quiz de Docker Compose (Intermediate)
- `docker-advanced.json` - Quiz de técnicas avanzadas de Docker (Advanced)

## Estructura de un Quiz

Cada quiz tiene la siguiente estructura:

```json
{
  "title": "Título del quiz",
  "description": "Descripción del quiz",
  "category": "typescript|solidity|docker",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["tag1", "tag2"],
  "questions": [
    {
      "question": "Texto de la pregunta",
      "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      "correctAnswer": "Opción correcta",
      "explanation": "Explicación de por qué es correcta",
      "points": 10
    }
  ]
}
```

## Cómo Importar a Strapi

### Opción 1: Usando el Panel de Administración

1. Accede al panel de administración de Strapi: http://localhost:1338/admin
2. Crea tu usuario administrador si es la primera vez
3. Ve a "Content Manager" > "Quiz"
4. Haz clic en "Create new entry"
5. Copia y pega los datos de los archivos JSON manualmente

### Opción 2: Usando el Script de Importación

1. **Configura la autenticación en Strapi:**
   - Ve a Settings > Roles > Public
   - En "Permissions" > "Quiz", habilita `create`, `find`, `findOne`
   - O genera un API Token en Settings > API Tokens

2. **Ejecuta el script de importación:**

```bash
# Sin token (si deshabilitaste autenticación)
node import-quizzes.js

# Con token
STRAPI_API_TOKEN=tu_token_aqui node import-quizzes.js
```

### Opción 3: Usando la API REST directamente

```bash
curl -X POST http://localhost:1338/api/quizzes \
  -H "Content-Type: application/json" \
  -d @typescript-basics.json
```

## Verificar la Importación

Para verificar que los quizzes se importaron correctamente:

```bash
# Ver todos los quizzes
curl http://localhost:1338/api/quizzes

# Ver un quiz específico
curl http://localhost:1338/api/quizzes/1
```

## Personalización

Puedes crear tus propios quizzes siguiendo la estructura JSON proporcionada. Asegúrate de:

- Usar una de las categorías definidas: `typescript`, `solidity`, `docker`, `javascript`, `react`, `nodejs`
- Usar uno de los niveles de dificultad: `beginner`, `intermediate`, `advanced`
- Incluir al menos 3-5 preguntas por quiz
- Proporcionar explicaciones claras para cada respuesta correcta

## Troubleshooting

### Error: "Unauthorized"
- Asegúrate de haber configurado los permisos correctamente en Strapi
- O proporciona un API Token válido

### Error: "Component not found"
- Verifica que el content-type "Quiz" y el componente "Question" estén creados en Strapi
- Reinicia Strapi después de crear los modelos

### Error: "Cannot connect to Strapi"
- Verifica que Strapi esté corriendo en http://localhost:1338
- Verifica la conexión con: `curl http://localhost:1338`
