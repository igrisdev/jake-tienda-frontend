# Optimizaciones de Caché para Reducir Invocaciones de Netlify Functions

## Resumen del Problema

El proyecto presentaba un alto número de invocaciones de Netlify Functions (miles) en comparación con el número de pageviews (78) y usuarios únicos (13). Esto se debía a:

1. **Funciones con `cache: "no-store"`** que se ejecutaban en cada request del servidor
2. **Creación automática de carritos** en cada render del componente modal
3. **Falta de estrategia de caché** para contenido estático (páginas, listados)

---

## Cambios Implementados

### 1. ✅ Optimización de `getPages()` y `getPage()`

**Archivo:** `src/lib/shopify/index.ts`

**Antes:**
```typescript
export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: "no-store",  // ❌ Sin caché
    variables: { handle },
  });
  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "no-store",  // ❌ Sin caché
  });
  return removeEdgesAndNodes(res.body.data.pages);
}
```

**Después:**
```typescript
export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: "force-cache",  // ✅ Con caché
    variables: { handle },
    tags: [TAGS.collections],  // ✅ Permite revalidación por webhook
  });
  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "force-cache",  // ✅ Con caché
    tags: [TAGS.collections],  // ✅ Permite revalidación por webhook
  });
  return removeEdgesAndNodes(res.body.data.pages);
}
```

**Impacto:** Las páginas estáticas ahora se cachean y solo se revalidan cuando hay cambios en Shopify (vía webhooks).

---

### 2. ✅ Optimización de `getCart()`

**Archivo:** `src/lib/shopify/index.ts`

**Antes:**
```typescript
export async function getCart(
  cartId: string | undefined,
): Promise<Cart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    // cache por defecto (force-cache)
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}
```

**Después:**
```typescript
export async function getCart(
  cartId: string | undefined,
): Promise<Cart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: "force-cache",  // ✅ Explícitamente con caché
    tags: [TAGS.cart],
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}
```

**Impacto:** El carrito se cachea y solo se revalida cuando hay operaciones mutativas (add/update/remove).

---

### 3. ✅ Prevención de Creación Múltiple de Carritos

**Archivo:** `src/components/cart/modal.tsx`

**Antes:**
```typescript
export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();  // ❌ Se ejecuta en cada render
    }
  }, [cart]);
```

**Después:**
```typescript
export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const cartCreationAttempted = useRef(false);  // ✅ Flag para evitar duplicados
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Solo crear carrito una vez si no existe y no se ha intentado crear antes
    if (!cart && !cartCreationAttempted.current) {
      cartCreationAttempted.current = true;  // ✅ Marca como intentado
      createCartAndSetCookie();
    }
  }, [cart]);
```

**Impacto:** El carrito solo se crea una vez por sesión del usuario, evitando múltiples llamadas a `createCart()`.

---

### 4. ✅ Operaciones Mutativas Mantienen `no-store`

Las siguientes funciones **mantienen** `cache: "no-store"` porque son operaciones que modifican estado:

- `createCart()` - Línea 446-453
- `removeFromCart()` - Línea 473-487
- `updateCart()` - Línea 489-503
- `addToCart()` - Línea 505-519

**Esto es correcto** porque estas operaciones deben ejecutarse en tiempo real.

---

## Resultado Esperado

### Antes de las Optimizaciones
- **78 pageviews**
- **13 usuarios únicos**
- **Miles de invocaciones** de Netlify Functions

### Después de las Optimizaciones
- **78 pageviews**
- **13 usuarios únicos**
- **~100-200 invocaciones** (reducción del 90-95%)

### Desglose de Invocaciones Esperadas
1. **Páginas estáticas** (`getPage`, `getPages`): ~10-20 invocaciones (solo en primera carga o revalidación)
2. **Productos** (`getProduct`, `getProducts`): ~30-50 invocaciones (cacheadas con tags)
3. **Carrito** (`getCart`): ~13 invocaciones (una por usuario único)
4. **Operaciones de carrito** (`createCart`, `addToCart`, etc.): ~20-40 invocaciones (solo en interacciones)
5. **Otros** (menús, colecciones): ~20-30 invocaciones

---

## Recomendaciones Adicionales

### 1. Monitoreo de Netlify Logs

Para identificar endpoints con alto tráfico:

1. Ir a **Netlify Dashboard** → **Functions** → **Logs**
2. Filtrar por rutas específicas:
   - `/api/cart/*`
   - `/product/*`
   - `/search/*`
3. Identificar patrones de invocaciones repetidas

### 2. Persistencia del `cartId` en Cliente

El proyecto ya implementa persistencia del `cartId` en cookies:

**Archivo:** `src/app/layout.tsx` (línea 95-97)
```typescript
const cookieStore = await cookies();
const cartId = cookieStore?.get("cartId")?.value;
const cart = getCart(cartId);
```

**Archivo:** `src/components/cart/actions.ts` (línea 143-147)
```typescript
export async function createCartAndSetCookie() {
  const cookieStore = await cookies();
  const cart = await createCart();
  cookieStore.set("cartId", cart.id!);
}
```

✅ **Esto está bien implementado** y evita crear múltiples carritos por usuario.

### 3. Configuración de Revalidación ISR (Opcional)

Si necesitas revalidación automática sin webhooks, puedes usar ISR:

```typescript
export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "force-cache",
    tags: [TAGS.collections],
    // Revalidar cada 60 segundos
    next: { revalidate: 60 }
  });
  return removeEdgesAndNodes(res.body.data.pages);
}
```

**Nota:** Actualmente usamos `tags` para revalidación por webhooks, que es más eficiente.

### 4. Verificación de Webhooks de Shopify

Asegúrate de que los webhooks de Shopify estén configurados para revalidar el caché:

**Archivo:** `src/lib/shopify/index.ts` (línea 521-558)

Los webhooks configurados:
- `collections/create`
- `collections/delete`
- `collections/update`
- `products/create`
- `products/delete`
- `products/update`

Estos webhooks llaman a `revalidateTag()` para invalidar el caché cuando hay cambios en Shopify.

---

## Verificación de Cambios

### 1. Verificar en Local

```bash
npm run dev
```

1. Abrir DevTools → Network
2. Navegar por el sitio
3. Verificar que las páginas estáticas no generen múltiples requests

### 2. Verificar en Netlify

Después del deploy:

1. Ir a **Netlify Dashboard** → **Functions**
2. Monitorear invocaciones durante 24 horas
3. Comparar con métricas anteriores

### 3. Verificar Caché

```bash
# Verificar headers de respuesta
curl -I https://jaketiendaelectronica.com/about-us
```

Buscar headers como:
- `x-nextjs-cache: HIT` (caché funcionando)
- `x-nextjs-cache: MISS` (primera carga)

---

## Archivos Modificados

1. ✅ `src/lib/shopify/index.ts`
   - `getPage()` - Línea 560-569
   - `getPages()` - Línea 571-579
   - `getCart()` - Línea 455-472

2. ✅ `src/components/cart/modal.tsx`
   - `CartModal()` - Línea 24-38

---

## Próximos Pasos

1. ✅ **Deploy a producción**
2. ⏳ **Monitorear métricas de Netlify** durante 24-48 horas
3. ⏳ **Verificar reducción de invocaciones**
4. ⏳ **Ajustar estrategia de caché** si es necesario

---

## Contacto y Soporte

Si tienes dudas o necesitas ajustar la estrategia de caché, revisa:

- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Netlify Functions Pricing](https://www.netlify.com/pricing/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

---

**Fecha de implementación:** 2025-10-05  
**Versión:** 1.0  
**Estado:** ✅ Completado
