# Quiz Certificate (SBT - Soulbound Token)

Smart contract que emite certificados NFT no-transferibles (Soulbound Tokens) para los usuarios que completan quizzes.

## Características

- **Soulbound Token (SBT)**: Los certificados no pueden ser transferidos una vez mintados
- **Metadata On-Chain**: Toda la información del certificado se almacena en la blockchain
- **SVG Generado**: La imagen del certificado se genera dinámicamente como SVG
- **Actualización de Score**: Si un usuario retoma el mismo quiz y obtiene mejor puntaje, el certificado se actualiza
- **Prevención de Duplicados**: No se pueden crear múltiples certificados para el mismo usuario y quiz

## Estructura del Certificado

Cada certificado contiene:
- Nombre del quiz
- Puntaje obtenido
- Total de preguntas
- Fecha de emisión (timestamp)
- Dificultad (beginner, intermediate, advanced)
- Categoría (typescript, solidity, docker, etc.)

## Compilación

```bash
forge build
```

## Tests

```bash
# Ejecutar todos los tests
forge test

# Ejecutar con verbosidad
forge test -vv

# Ejecutar solo los tests de QuizCertificate
forge test --match-contract QuizCertificateTest
```

## Deploy

### Deploy Local (Anvil)

1. Inicia Anvil (nodo local):
```bash
anvil
```

2. Deploy el contrato:
```bash
forge script script/DeployQuizCertificate.s.sol:DeployQuizCertificate \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Deploy a Sepolia

```bash
forge script script/DeployQuizCertificate.s.sol:DeployQuizCertificate \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Deploy a Base Sepolia (Recomendado para testing)

```bash
forge script script/DeployQuizCertificate.s.sol:DeployQuizCertificate \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --private-key $PRIVATE_KEY \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

## Variables de Entorno

Crea un archivo `.env` en el directorio `sc/`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
BASESCAN_API_KEY=your-basescan-api-key
```

## Uso del Contrato

### Mintear un Certificado

Solo el owner del contrato puede mintear certificados:

```solidity
function mintCertificate(
    address recipient,
    string memory quizName,
    uint256 score,
    uint256 totalQuestions,
    string memory difficulty,
    string memory category
) public onlyOwner returns (uint256)
```

Ejemplo:
```solidity
certificate.mintCertificate(
    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,
    "TypeScript Basics",
    8,
    10,
    "beginner",
    "typescript"
);
```

### Obtener Certificados de un Usuario

```solidity
uint256[] memory tokenIds = certificate.getCertificatesOf(userAddress);
```

### Ver Datos de un Certificado

```solidity
(
    string memory quizName,
    uint256 score,
    uint256 totalQuestions,
    uint256 timestamp,
    string memory difficulty,
    string memory category
) = certificate.certificates(tokenId);
```

### Ver el Metadata del Certificado

```solidity
string memory uri = certificate.tokenURI(tokenId);
```

El URI retorna un data URI con formato JSON que contiene:
- Nombre del NFT
- Descripción
- Imagen SVG (como data URI)
- Atributos del certificado

## Interacción desde la Aplicación Web

### Ejemplo con ethers.js

```typescript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contractAddress = "0x..."; // Dirección del contrato deployado
const contractABI = [...]; // ABI del contrato

const certificate = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

// Mintear un certificado (solo el owner)
const tx = await certificate.mintCertificate(
  userAddress,
  "TypeScript Basics",
  8,
  10,
  "beginner",
  "typescript"
);

await tx.wait();

// Obtener certificados de un usuario
const tokenIds = await certificate.getCertificatesOf(userAddress);

// Ver metadata
for (const tokenId of tokenIds) {
  const uri = await certificate.tokenURI(tokenId);
  // uri es un data URI que puedes parsear
  const jsonData = parseDataURI(uri);
  console.log(jsonData);
}
```

## Ejemplo de Metadata Generado

```json
{
  "name": "Quiz Certificate #1",
  "description": "Certificate of completion for TypeScript Basics",
  "image": "data:image/svg+xml;base64,...",
  "attributes": [
    {
      "trait_type": "Quiz",
      "value": "TypeScript Basics"
    },
    {
      "trait_type": "Score",
      "value": "8/10"
    },
    {
      "trait_type": "Percentage",
      "value": 80
    },
    {
      "trait_type": "Difficulty",
      "value": "beginner"
    },
    {
      "trait_type": "Category",
      "value": "typescript"
    },
    {
      "trait_type": "Date",
      "display_type": "date",
      "value": 1702234567
    }
  ]
}
```

## Visualización del SVG

El certificado genera un SVG con:
- Borde de color según el porcentaje (verde: ≥80%, azul: ≥60%, amarillo: <60%)
- Nombre del quiz
- Puntaje y porcentaje
- Dificultad y categoría
- Indicación de que es un Soulbound Token

Ejemplo visual:
```
┌─────────────────────────────────────┐
│       Quiz Certificate              │
│                                     │
│     TypeScript Basics               │
│                                     │
│   Score: 8/10 (80%)                │
│   Difficulty: beginner              │
│   Category: typescript              │
│                                     │
│   Issued on blockchain              │
│   Soulbound Token - Non-Transferable│
└─────────────────────────────────────┘
```

## Seguridad

- El contrato usa OpenZeppelin v5.5.0
- Solo el owner puede mintear certificados
- Los tokens son non-transferable (Soulbound)
- Los certificados no pueden ser quemados
- Todos los datos se almacenan on-chain

## Gas Optimization

El contrato está optimizado para:
- Almacenar solo información esencial on-chain
- Generar SVG dinámicamente (sin almacenamiento de imágenes)
- Reutilizar certificados existentes cuando se retoma un quiz

## Próximos Pasos

1. Deploy a una testnet (Base Sepolia recomendado)
2. Integrar con la aplicación Next.js
3. Crear un sistema de firma para permitir que los usuarios reclamen sus certificados
4. Agregar eventos para tracking on-chain
5. Considerar implementar EIP-712 para signatures

## Licencia

MIT
