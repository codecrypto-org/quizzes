# Plataforma de Quizzes con Certificados NFT

Plataforma completa de quizzes interactivos que emite certificados NFT (Soulbound Tokens) en la blockchain usando Strapi como CMS, Next.js para el frontend, y contratos inteligentes en Solidity.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Backend CMS**: Strapi (headless CMS)
- **Base de Datos**: PostgreSQL
- **Frontend**: Next.js 16 + React 19 + TailwindCSS
- **Smart Contracts**: Solidity + Foundry
- **Blockchain**: Ethereum (Local: Anvil)
- **Web3**: ethers.js

### Componentes

1. **Strapi CMS** - Gestión de quizzes
2. **Next.js App** - Interfaz de usuario
3. **Smart Contract** - Emisión de certificados NFT (SBT)
4. **PostgreSQL** - Base de datos

## 📋 Prerrequisitos

- Node.js v18+
- Docker & Docker Compose
- PostgreSQL (instalado localmente en puerto 5432)
- Foundry (para contratos inteligentes)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd quizzes
```

### 2. Configurar PostgreSQL

Crea las bases de datos necesarias:

```bash
psql -U postgres -h localhost
CREATE DATABASE strapi2;
```

### 3. Configurar y Ejecutar Strapi

```bash
# Iniciar Strapi con Docker Compose
docker-compose up -d

# Strapi estará disponible en http://localhost:1338
# Primera vez: crea tu usuario administrador en http://localhost:1338/admin
```

### 4. Importar Quizzes de Ejemplo

```bash
cd quiz-examples
chmod +x import.sh
./import.sh
```

Esto importará 7 quizzes de ejemplo:
- 2 de TypeScript (Beginner y Advanced)
- 2 de Solidity (Beginner y Intermediate)
- 3 de Docker (Beginner, Intermediate y Advanced)

### 5. Configurar Blockchain Local (Anvil)

```bash
# En una terminal separada
anvil
```

Esto iniciará un nodo local de Ethereum en `http://localhost:8545`

### 6. Deploy del Smart Contract

```bash
cd sc

# Compilar contratos
forge build

# Ejecutar tests
forge test -vv

# Deploy en Anvil
forge script script/DeployQuizCertificate.s.sol:DeployQuizCertificate \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

El contrato se deployará en: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 7. Configurar Next.js

```bash
cd web

# Instalar dependencias
npm install

# Crear archivo .env.local
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎮 Uso de la Plataforma

### Realizar un Quiz

1. Accede a `http://localhost:3000`
2. Haz clic en "Comenzar ahora" o selecciona una categoría
3. Selecciona un quiz de la lista
4. Responde las preguntas
5. Al finalizar, verás tus resultados

### Reclamar Certificado NFT

Después de completar un quiz con al menos 60% de respuestas correctas:

1. En la pantalla de resultados, verás la opción "Reclamar Certificado NFT"
2. Ingresa una dirección de wallet (puedes usar una de las cuentas de prueba de Anvil)
3. Haz clic en "Reclamar Certificado NFT"
4. El certificado será mintado y recibirás el Token ID

**Cuentas de Prueba de Anvil:**
```
Account #1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account #2: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account #3: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

### Ver Certificados

1. Accede a `http://localhost:3000/certificates`
2. Ingresa una dirección de wallet
3. Haz clic en "Buscar"
4. Verás todos los certificados NFT asociados a esa dirección

## 📁 Estructura del Proyecto

```
quizzes/
├── docker-compose.yml          # Configuración de Strapi
├── strapi-app/                 # Aplicación Strapi
│   ├── api/quiz/              # Content-type de Quiz
│   └── components/quiz/       # Componente Question
├── quiz-examples/              # Quizzes de ejemplo
│   ├── typescript-basics.json
│   ├── solidity-security.json
│   ├── docker-compose.json
│   └── import.sh
├── sc/                         # Smart Contracts (Foundry)
│   ├── src/
│   │   └── QuizCertificate.sol
│   ├── test/
│   │   └── QuizCertificate.t.sol
│   └── script/
│       └── DeployQuizCertificate.s.sol
└── web/                        # Aplicación Next.js
    ├── app/
    │   ├── page.tsx           # Página principal
    │   ├── quizzes/           # Páginas de quizzes
    │   ├── certificates/      # Página de certificados
    │   └── api/mint-certificate/  # API para mintear
    ├── components/
    │   ├── QuizCard.tsx
    │   ├── QuizQuestion.tsx
    │   ├── QuizResults.tsx
    │   ├── ClaimCertificate.tsx
    │   └── MyCertificates.tsx
    ├── contracts/
    │   ├── QuizCertificate.json  # ABI del contrato
    │   └── config.ts             # Configuración blockchain
    ├── lib/
    │   ├── api.ts                # API de Strapi
    │   └── certificate.ts        # Utilidades blockchain
    └── types/
        └── quiz.ts
```

## 🔧 Configuración de Servicios

### Strapi
- URL: `http://localhost:1338`
- Admin Panel: `http://localhost:1338/admin`
- API: `http://localhost:1338/quizzes`

### Next.js
- URL: `http://localhost:3000`
- Páginas principales:
  - `/` - Home
  - `/quizzes` - Lista de quizzes
  - `/quizzes/[id]` - Quiz individual
  - `/certificates` - Ver certificados

### Anvil (Blockchain Local)
- RPC URL: `http://localhost:8545`
- Chain ID: 31337
- Contrato: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### PostgreSQL
- Host: `localhost`
- Port: 5432
- Usuario: postgres
- Password: postgres
- Database: strapi2

## 🎨 Características del Certificado NFT

- **Soulbound Token (SBT)**: No transferible
- **Metadata On-Chain**: Toda la información en blockchain
- **SVG Generado**: Imagen dinámica basada en puntaje
- **Actualización Automática**: Si retomas el quiz y mejoras, el certificado se actualiza
- **Sin Duplicados**: Un certificado por usuario por quiz

### Datos del Certificado

- Nombre del quiz
- Puntaje (correctas/total)
- Porcentaje
- Dificultad
- Categoría
- Fecha de emisión

## 🧪 Testing

### Smart Contracts

```bash
cd sc
forge test -vv
```

11 tests que verifican:
- Minteo de certificados
- Bloqueo de transferencias (Soulbound)
- Actualización de scores
- Validaciones de datos
- Generación de metadata

### Aplicación Next.js

```bash
cd web
npm run build
```

## 🐛 Troubleshooting

### Strapi no responde
```bash
docker-compose restart strapi
docker logs strapi2 --tail 50
```

### Anvil no está corriendo
```bash
# En una terminal separada
anvil
```

### Error al mintear certificado
- Verifica que Anvil esté corriendo
- Verifica que el contrato esté deployado
- Revisa la dirección del contrato en `web/contracts/config.ts`

### Error de conexión a PostgreSQL
```bash
# Verifica que PostgreSQL esté corriendo
psql -U postgres -h localhost -c "SELECT version();"

# Verifica que la base de datos exista
psql -U postgres -h localhost -c "\l" | grep strapi2
```

## 📚 Recursos Adicionales

- [Documentación de Strapi](https://docs.strapi.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Foundry Book](https://book.getfoundry.sh/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 🤝 Contribuciones

Para añadir nuevos quizzes:

1. Crea un archivo JSON siguiendo la estructura de ejemplo
2. Colócalo en `quiz-examples/`
3. Ejecuta el script de importación

Para modificar el contrato:

1. Edita `sc/src/QuizCertificate.sol`
2. Ejecuta los tests: `forge test`
3. Re-deploy: `forge script script/DeployQuizCertificate.s.sol...`
4. Actualiza la dirección en `web/contracts/config.ts`

## 📄 Licencia

MIT
