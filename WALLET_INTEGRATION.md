# Integración de Wallet con Firma de Mensajes

## 🔐 Flujo Completo de Firma y Verificación

### Arquitectura

El sistema ahora permite a los usuarios conectar su wallet de MetaMask para firmar sus resultados del quiz antes de reclamar el certificado NFT. Esto proporciona:

1. **Autenticación descentralizada**: El usuario prueba ser el dueño de la wallet
2. **Integridad de datos**: Los resultados firmados no pueden ser alterados
3. **Experiencia Web3 nativa**: Integración completa con MetaMask

### Componentes

#### 1. Hook `useWallet` (`hooks/useWallet.ts`)

Hook personalizado que maneja:
- ✅ Conexión con MetaMask
- ✅ Detección automática de conexión existente
- ✅ Cambio/Adición de red (Anvil local)
- ✅ Firma de mensajes
- ✅ Gestión de estado de conexión

**Funciones principales:**
```typescript
const {
  address,          // Dirección de la wallet conectada
  isConnected,      // Estado de conexión
  isConnecting,     // Estado de proceso de conexión
  provider,         // Provider de ethers
  signer,           // Signer de ethers
  connectWallet,    // Función para conectar
  disconnectWallet, // Función para desconectar
  signMessage,      // Función para firmar mensajes
  error            // Errores de conexión
} = useWallet();
```

#### 2. Componente `ClaimCertificate` Actualizado

**Flujo de usuario:**

1. **Usuario completa el quiz** → Ve sus resultados
2. **Si score ≥ 60%** → Puede reclamar certificado
3. **Click en "Conectar Wallet"** → MetaMask solicita conexión
4. **Wallet conectada** → Se muestra la dirección
5. **Click en "Firmar y Reclamar"** → MetaMask solicita firma
6. **Usuario firma** → Mensaje con resultados del quiz
7. **API verifica firma** → Valida integridad y autenticidad
8. **Certificado minteado** → NFT creado en blockchain

**Mensaje Firmado:**
```json
{
  "quiz": "TypeScript Basics",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "difficulty": "beginner",
  "category": "typescript",
  "timestamp": 1702234567890
}
```

#### 3. API de Verificación (`api/mint-certificate/route.ts`)

La API realiza múltiples validaciones:

**Verificaciones de firma:**
1. ✅ Recuperar dirección del firmante usando `ethers.verifyMessage()`
2. ✅ Verificar que la dirección firmante = dirección del destinatario
3. ✅ Verificar que los datos del mensaje coincidan con los parámetros
4. ✅ Verificar timestamp (firma no expirada, máximo 5 minutos)

**Validaciones de datos:**
- Dirección de wallet válida (formato 0x...)
- Puntaje ≤ total de preguntas
- Todos los parámetros requeridos presentes

Si todas las verificaciones pasan → Mintea el certificado

## 🎯 Casos de Uso

### Caso 1: Usuario con MetaMask

```
1. Completa quiz → 8/10 respuestas correctas
2. Click "Conectar Wallet" → MetaMask popup
3. Aprueba conexión → Wallet conectada
4. Sistema verifica red → Cambia a Anvil si es necesario
5. Click "Firmar y Reclamar" → MetaMask solicita firma
6. Firma mensaje → Contiene sus resultados
7. API verifica firma → Valida que es auténtica
8. Certificado minteado → NFT en su wallet
```

### Caso 2: Usuario sin MetaMask

```
1. Completa quiz → 8/10 respuestas correctas
2. Click "Conectar Wallet" → Error: MetaMask no instalado
3. Sistema muestra mensaje → "Por favor instala MetaMask..."
4. Usuario puede usar dirección de Anvil (para testing)
```

## 🔒 Seguridad

### Protecciones Implementadas

**1. Verificación de Firma Criptográfica**
- La firma solo puede ser creada por el dueño de la private key
- No se puede falsificar sin acceso a la wallet

**2. Validación de Integridad**
- Los datos firmados deben coincidir exactamente con los enviados
- Cualquier modificación invalida la firma

**3. Expiración Temporal**
- Las firmas expiran después de 5 minutos
- Previene ataques de replay

**4. Vinculación Wallet-Certificado**
- El certificado se mintea exactamente a la dirección que firmó
- No se puede reclamar para otra dirección

### Flujo de Seguridad

```
Usuario → Firma mensaje con MetaMask
         ↓
API ← Recibe: mensaje + firma + address
         ↓
API → ethers.verifyMessage(mensaje, firma)
         ↓
API → Recupera address del firmante
         ↓
API → Verifica: address firmante === address destinatario
         ↓
API → Verifica: datos del mensaje === parámetros
         ↓
API → Verifica: timestamp no expirado
         ↓
API → ✅ Todas las verificaciones OK
         ↓
Blockchain ← Mintea certificado NFT
```

## 📱 Configuración de MetaMask para Anvil

### Agregar Red Anvil Manualmente

1. Abre MetaMask
2. Click en red actual (arriba)
3. "Agregar red" → "Agregar red manualmente"
4. Configura:

```
Nombre de Red: Anvil Local
RPC URL: http://localhost:8545
Chain ID: 31337
Símbolo de Moneda: ETH
```

### Importar Cuenta de Prueba

Puedes importar cualquier cuenta de Anvil:

```
Account #1 Private Key:
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #2 Private Key:
0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

**⚠️ IMPORTANTE**: Estas son cuentas de PRUEBA. NUNCA uses estas private keys en mainnet o con fondos reales.

## 🧪 Testing

### Probar Flujo Completo

1. **Inicia los servicios:**
```bash
# Terminal 1: Anvil
anvil

# Terminal 2: Strapi
docker-compose up -d

# Terminal 3: Next.js
cd web && npm run dev
```

2. **Configura MetaMask:**
- Agrega la red Anvil
- Importa una cuenta de prueba

3. **Completa un quiz:**
- Ve a http://localhost:3000
- Selecciona un quiz
- Responde las preguntas

4. **Reclama certificado:**
- Si score ≥ 60%, verás opción de reclamar
- Click "Conectar Wallet"
- Aprueba conexión en MetaMask
- Click "Firmar y Reclamar"
- Firma el mensaje en MetaMask
- ¡Recibe tu certificado NFT!

5. **Verifica en blockchain:**
```bash
# Desde la terminal
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url http://localhost:8545
```

## 🎨 UX Mejorada

### Estados Visuales

**No Conectado:**
- 🔐 Mensaje: "Conecta tu wallet para continuar"
- 🦊 Botón: "Conectar Wallet (MetaMask)"
- Gradiente azul-índigo

**Conectando:**
- ⏳ Spinner animado
- Botón deshabilitado
- Texto: "Conectando..."

**Conectado:**
- ✅ Banner verde con dirección de wallet
- ✍️ Botón: "Firmar y Reclamar Certificado NFT"
- Gradiente verde-esmeralda

**Firmando y Mintando:**
- ⏳ Spinner animado
- Botón deshabilitado
- Texto: "Firmando y Mintando..."

**Certificado Reclamado:**
- 🎉 Mensaje de éxito
- Token ID destacado
- Dirección de wallet mostrada
- Info: "Soulbound Token - No transferible"

## 📊 Datos del Mensaje Firmado

El mensaje contiene:

```typescript
interface SignedMessage {
  quiz: string;           // Nombre del quiz
  score: number;          // Respuestas correctas
  totalQuestions: number; // Total de preguntas
  percentage: number;     // Porcentaje de acierto
  difficulty: string;     // Nivel de dificultad
  category: string;       // Categoría del quiz
  timestamp: number;      // Unix timestamp en ms
}
```

## 🔄 Actualización de Componentes

### Componentes Modificados

1. **`components/ClaimCertificate.tsx`**
   - Integración completa con `useWallet`
   - Firma de mensajes
   - Estados de UI mejorados

2. **`app/api/mint-certificate/route.ts`**
   - Verificación de firma
   - Validaciones de seguridad
   - Manejo de errores mejorado

### Nuevos Archivos

1. **`hooks/useWallet.ts`**
   - Hook personalizado para wallet
   - Gestión de conexión
   - Firma de mensajes

## 🚀 Próximos Pasos Recomendados

1. **Añadir Soporte para WalletConnect**
   - Permitir otras wallets (no solo MetaMask)

2. **Implementar Gasless Transactions**
   - Meta-transactions para que usuarios no paguen gas

3. **Añadir Notificaciones**
   - Toast notifications para mejor UX

4. **Agregar Histórico de Firmas**
   - Guardar firmas en base de datos para auditoría

5. **Implementar Rate Limiting**
   - Prevenir spam de solicitudes de certificados

## 📝 Notas de Desarrollo

- El sistema funciona tanto con MetaMask como con cuentas manuales de Anvil
- La verificación de firma es completamente server-side (segura)
- Los certificados son Soulbound (no transferibles)
- Cada usuario solo puede tener un certificado por quiz
- Si retoma el quiz y mejora, el certificado se actualiza automáticamente

## 🐛 Troubleshooting

**Error: "MetaMask no está instalado"**
- Solución: Instala MetaMask o usa dirección de Anvil

**Error: "Wrong network"**
- Solución: El hook cambiará automáticamente a Anvil o agrega la red manualmente

**Error: "La firma no coincide"**
- Solución: Asegúrate de firmar con la misma wallet que recibirá el certificado

**Error: "La firma ha expirado"**
- Solución: Intenta nuevamente, tienes 5 minutos desde que conectas la wallet

## ✅ Checklist de Implementación

- [x] Hook useWallet creado
- [x] Conexión con MetaMask
- [x] Firma de mensajes
- [x] Verificación de firma en API
- [x] Validaciones de seguridad
- [x] UI actualizada
- [x] Estados visuales mejorados
- [x] Manejo de errores
- [x] Documentación completa
