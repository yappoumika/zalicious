require('dotenv/config')
const db = require('./db.js')

const rows = [
  // Nav
  { key: 'nav.home', label: 'Nav — Home', en: 'Home', es: 'Inicio' },
  { key: 'nav.shop', label: 'Nav — Shop Now', en: 'Shop Now', es: 'Comprar' },
  { key: 'nav.collections', label: 'Nav — Collections', en: 'Collections', es: 'Colecciones' },
  { key: 'nav.wholesale', label: 'Nav — Wholesale', en: 'Wholesale', es: 'Mayoreo' },
  { key: 'nav.howToOrder', label: 'Nav — How To Order', en: 'How To Order', es: 'Cómo Pedir' },
  { key: 'nav.about', label: 'Nav — About', en: 'About', es: 'Nosotros' },
  { key: 'nav.contact', label: 'Nav — Contact', en: 'Contact', es: 'Contacto' },

  // Header
  {
    key: 'header.promoPrefix',
    label: 'Header — Promo bar text (before code)',
    en: '$25 OFF EACH BAG 5+ | 10% Off Genetics Box with Code',
    es: '$25 de descuento en cada bolsa 5+ | 10% de descuento en Caja de Genética con el código',
  },
  { key: 'header.promoCode', label: 'Header — Promo code', en: 'ZALICIOUS2026', es: 'ZALICIOUS2026' },
  { key: 'header.toggleMenu', label: 'Header — Mobile menu button label', en: 'Toggle menu', es: 'Abrir menú' },
  {
    key: 'marquee',
    label: 'Scrolling marquee text',
    en: 'PURE QUALITY ✦ PURE FLAVOR ✦ ZALICIOUS ✦ PURE QUALITY ✦ PURE FLAVOR ✦ ZALICIOUS ✦',
    es: 'PURA CALIDAD ✦ PURO SABOR ✦ ZALICIOUS ✦ PURA CALIDAD ✦ PURO SABOR ✦ ZALICIOUS ✦',
  },

  // Footer
  { key: 'footer.brandName', label: 'Footer — Brand name', en: 'ZALICIOUS', es: 'ZALICIOUS' },
  {
    key: 'footer.tagline',
    label: 'Footer — Tagline',
    en: 'Pure quality. Pure flavor. California-grown premium THC.',
    es: 'Pura calidad. Puro sabor. THC premium cultivado en California.',
  },
  { key: 'footer.shopTitle', label: 'Footer — "Shop" column title', en: 'Shop', es: 'Tienda' },
  { key: 'footer.companyTitle', label: 'Footer — "Company" column title', en: 'Company', es: 'Empresa' },
  { key: 'footer.adminTitle', label: 'Footer — "Admin" column title', en: 'Admin', es: 'Admin' },
  {
    key: 'footer.copyrightSuffix',
    label: 'Footer — Copyright line (after year)',
    en: 'Zalicious. Demo storefront for educational purposes.',
    es: 'Zalicious. Tienda de demostración con fines educativos.',
  },

  // Home — Hero
  {
    key: 'home.stickerText',
    label: 'Home — Spinning sticker text',
    en: 'PURE QUALITY ✦ PURE FLAVOR ✦ ZALICIOUS ✦ ',
    es: 'PURA CALIDAD ✦ PURO SABOR ✦ ZALICIOUS ✦ ',
  },
  { key: 'home.heroShopCta', label: 'Home — Hero button text', en: 'SHOP ZALICIOUS', es: 'COMPRA ZALICIOUS' },

  // Home — Tiers
  { key: 'home.tiersEyebrow', label: 'Home — Tiers eyebrow label', en: 'ZALICIOUS', es: 'ZALICIOUS' },
  { key: 'home.tiersTitle1', label: 'Home — Tiers heading line 1', en: 'Pure Quality.', es: 'Pura Calidad.' },
  {
    key: 'home.tiersTitle2',
    label: 'Home — Tiers heading line 2',
    en: 'Pure Flavor.',
    es: 'Puro Sabor.',
  },
  {
    key: 'home.tiersSub',
    label: 'Home — Tiers paragraph',
    en: 'Clean, California-grown flower with nothing to hide. Quality you can see, flavor you can taste. Zalicious.',
    es: 'Flor limpia cultivada en California, sin nada que esconder. Calidad que se ve, sabor que se siente. Zalicious.',
  },

  // Home — Shop Now banner
  { key: 'home.shopNow', label: 'Home — "Shop Now" button text (reused across page)', en: 'SHOP NOW', es: 'COMPRAR AHORA' },

  // Home — Diamonds
  {
    key: 'home.diamondsEyebrow',
    label: 'Home — Diamonds eyebrow label',
    en: 'Pure Quality * Pure Flavor * Zalicious',
    es: 'Pura Calidad * Puro Sabor * Zalicious',
  },
  { key: 'home.diamondsTitle1', label: 'Home — Diamonds heading line 1', en: 'Taste The Difference', es: 'Siente La Diferencia' },
  { key: 'home.diamondsTitle2', label: 'Home — Diamonds heading line 2', en: 'From Zalicious', es: 'De Zalicious' },
  {
    key: 'home.diamondsBody',
    label: 'Home — Diamonds paragraph',
    en: 'Every strain is hand-picked for clean smoke and loud terps. If it doesn’t taste right, it doesn’t make the shelf.',
    es: 'Cada cepa es seleccionada a mano por su humo limpio y terpenos intensos. Si no sabe bien, no llega al estante.',
  },

  // Home — Fresh Drops
  { key: 'home.freshDrops', label: 'Home — "Fresh Drops" heading', en: 'Fresh Drops', es: 'Nuevos Lanzamientos' },
  { key: 'home.loadingProducts', label: 'Home — Loading products message', en: 'Loading products…', es: 'Cargando productos…' },
  {
    key: 'home.noFeatured',
    label: 'Home — No featured products message',
    en: 'No featured products yet — add some from the admin dashboard.',
    es: 'Aún no hay productos destacados — agrega algunos desde el panel de administración.',
  },

  // Shop page
  { key: 'shop.eyebrow', label: 'Shop — Eyebrow label', en: 'California-Grown Premium THC', es: 'THC Premium Cultivado en California' },
  { key: 'shop.title', label: 'Shop — Page title', en: 'Shop Now', es: 'Comprar Ahora' },
  { key: 'shop.all', label: 'Shop — "All" category filter', en: 'All', es: 'Todo' },
  { key: 'shop.loading', label: 'Shop — Loading message', en: 'Loading products…', es: 'Cargando productos…' },
  { key: 'shop.error', label: 'Shop — Error message', en: 'Could not load products.', es: 'No se pudieron cargar los productos.' },
  { key: 'shop.empty', label: 'Shop — Empty category message', en: 'No products in this category yet.', es: 'Aún no hay productos en esta categoría.' },
  { key: 'shop.comingSoon', label: 'Shop — Empty section message', en: 'Dropping soon. Check back.', es: 'Muy pronto. Vuelve después.' },

  // Collections page
  { key: 'collections.eyebrow', label: 'Collections — Eyebrow label', en: 'Shop By Category', es: 'Compra Por Categoría' },
  { key: 'collections.title', label: 'Collections — Page title', en: 'Collections', es: 'Colecciones' },
  { key: 'collections.loading', label: 'Collections — Loading message', en: 'Loading collections…', es: 'Cargando colecciones…' },
  {
    key: 'collections.empty',
    label: 'Collections — Empty message',
    en: 'No collections yet — add products from the admin dashboard.',
    es: 'Aún no hay colecciones — agrega productos desde el panel de administración.',
  },
  { key: 'collections.product', label: 'Collections — "product" singular', en: 'product', es: 'producto' },
  { key: 'collections.products', label: 'Collections — "products" plural', en: 'products', es: 'productos' },
  { key: 'collections.shopAll', label: 'Collections — "Shop All" button', en: 'SHOP ALL', es: 'VER TODO' },

  // About page
  { key: 'about.eyebrow', label: 'About — Eyebrow label', en: 'About', es: 'Nosotros' },
  { key: 'about.title', label: 'About — Page title', en: 'Zalicious', es: 'Zalicious' },
  {
    key: 'about.intro',
    label: 'About — Intro paragraph',
    en: "California-grown premium THC flower, sold at a price that actually makes sense. We started Zalicious because fire quality and fair pricing shouldn't be a tradeoff — you should get both, every time.",
    es: 'Flor de THC premium cultivada en California, vendida a un precio que realmente tiene sentido. Fundamos Zalicious porque la calidad de primera y los precios justos no deberían ser una cosa u otra — deberías tener ambos, siempre.',
  },
  { key: 'about.value1Title', label: 'About — Value card 1 title', en: 'Quality First', es: 'Calidad Primero' },
  {
    key: 'about.value1Body',
    label: 'About — Value card 1 body',
    en: 'Every drop is California-grown and checked before it goes on the shelf. If it isn’t fire, it doesn’t make the cut.',
    es: 'Cada tanda es cultivada en California y revisada antes de llegar al estante. Si no está de fuego, no pasa el corte.',
  },
  { key: 'about.value2Title', label: 'About — Value card 2 title', en: 'Fair Prices', es: 'Precios Justos' },
  {
    key: 'about.value2Body',
    label: 'About — Value card 2 body',
    en: 'Premium flower shouldn’t come with a premium markup. We keep the margins honest so you keep more of your money.',
    es: 'La flor premium no debería tener un sobreprecio premium. Mantenemos los márgenes honestos para que te quedes con más de tu dinero.',
  },
  { key: 'about.value3Title', label: 'About — Value card 3 title', en: 'Built On Trust', es: 'Basado En Confianza' },
  {
    key: 'about.value3Body',
    label: 'About — Value card 3 body',
    en: 'From first order to reorder, we want you back — not just once. That means real answers and real consistency.',
    es: 'Desde tu primer pedido hasta el siguiente, queremos que regreses — no solo una vez. Eso significa respuestas reales y consistencia real.',
  },
  { key: 'about.cta', label: 'About — Button text', en: 'SHOP NOW', es: 'COMPRAR AHORA' },

  // Contact page
  { key: 'contact.eyebrow', label: 'Contact — Eyebrow label', en: 'Contact', es: 'Contacto' },
  { key: 'contact.title', label: 'Contact — Page title', en: 'Get In Touch', es: 'Ponte en Contacto' },
  {
    key: 'contact.intro',
    label: 'Contact — Intro paragraph',
    en: "Questions about an order, wholesale, or anything else — reach out and we'll get back to you.",
    es: '¿Preguntas sobre un pedido, mayoreo, o cualquier otra cosa? Escríbenos y te responderemos.',
  },
  { key: 'contact.emailLabel', label: 'Contact — "Email" card label', en: 'Email', es: 'Correo' },
  { key: 'contact.email', label: 'Contact — Email address', en: 'hello@zalicious.com', es: 'hello@zalicious.com' },
  { key: 'contact.wholesaleLabel', label: 'Contact — "Wholesale" card label', en: 'Wholesale', es: 'Mayoreo' },
  {
    key: 'contact.wholesaleValue',
    label: 'Contact — Wholesale card text',
    en: 'Bulk & Reseller Inquiries',
    es: 'Consultas de Mayoreo y Revendedores',
  },

  // How To Order page
  { key: 'howToOrder.eyebrow', label: 'How To Order — Eyebrow label', en: 'How To Order', es: 'Cómo Pedir' },
  { key: 'howToOrder.title', label: 'How To Order — Page title', en: 'How To Order', es: 'Cómo Pedir' },
  {
    key: 'howToOrder.intro',
    label: 'How To Order — Intro paragraph',
    en: "We keep it simple — orders aren't placed or paid for on this website. Every order is handled directly, one on one. Here's how it works.",
    es: 'Lo mantenemos simple — los pedidos no se realizan ni se pagan en este sitio web. Cada pedido se maneja directamente, uno a uno. Así es como funciona.',
  },
  { key: 'howToOrder.step1Title', label: 'How To Order — Step 1 title', en: 'Browse The Menu', es: 'Explora El Menú' },
  {
    key: 'howToOrder.step1Body',
    label: 'How To Order — Step 1 body',
    en: 'Check out Shop and Collections to see what’s in stock and find what you’re after.',
    es: 'Revisa Comprar y Colecciones para ver qué hay disponible y encontrar lo que buscas.',
  },
  { key: 'howToOrder.step2Title', label: 'How To Order — Step 2 title', en: 'Reach Out', es: 'Contáctanos' },
  {
    key: 'howToOrder.step2Body',
    label: 'How To Order — Step 2 body',
    en: 'Contact us with the products, tiers, and quantities you want. We’ll get back to you fast.',
    es: 'Escríbenos con los productos, niveles y cantidades que deseas. Te responderemos rápido.',
  },
  { key: 'howToOrder.step3Title', label: 'How To Order — Step 3 title', en: 'Confirm & Get It', es: 'Confirma Y Recíbelo' },
  {
    key: 'howToOrder.step3Body',
    label: 'How To Order — Step 3 body',
    en: 'We’ll confirm availability and pricing, then arrange pickup or delivery directly with you.',
    es: 'Confirmaremos disponibilidad y precio, y luego coordinaremos la recogida o entrega directamente contigo.',
  },
  {
    key: 'howToOrder.note',
    label: 'How To Order — Callout note',
    en: 'All orders are handled through direct contact with Zalicious — not through this website.',
    es: 'Todos los pedidos se manejan por contacto directo con Zalicious — no a través de este sitio web.',
  },
  { key: 'howToOrder.cta', label: 'How To Order — Button text', en: 'CONTACT US', es: 'CONTÁCTANOS' },

  // Product card
  { key: 'product.soldOut', label: 'Product card — "Sold Out" badge', en: 'Sold Out', es: 'Agotado' },
  { key: 'product.placeholderBrand', label: 'Product card — Placeholder brand text (no image)', en: 'ZALICIOUS', es: 'ZALICIOUS' },

  // Product detail page
  { key: 'productDetail.backToShop', label: 'Product Detail — "Back to Shop" link', en: 'Back to Shop', es: 'Volver a la Tienda' },
  { key: 'productDetail.notFound', label: 'Product Detail — Not found message', en: 'Product not found.', es: 'Producto no encontrado.' },
  { key: 'productDetail.thc', label: 'Product Detail — "THC" label', en: 'THC', es: 'THC' },
  { key: 'productDetail.weight', label: 'Product Detail — "Weight" label', en: 'Weight', es: 'Peso' },
]

const assets = [
  { key: 'assets.logo', label: 'Header logo', url: '/logo-wordmark.png' },
  { key: 'assets.heroBanner', label: 'Home — Hero banner image', url: '/hero-banner.png' },
  { key: 'assets.shopNowBg', label: 'Home — Shop Now section background', url: '/shop-now-bg.png' },
  { key: 'assets.tiersBadge', label: 'Home — Tiers section image', url: '/tiers-badge.jpg' },
]

async function main() {
  await db.ensureSchema()

  await db.batch(
    [
      ...rows.map((row) => ({
        sql: `INSERT OR IGNORE INTO site_content (key, value_en, value_es, type, label)
              VALUES (@key, @en, @es, 'text', @label)`,
        args: row,
      })),
      ...assets.map((row) => ({
        sql: `INSERT OR IGNORE INTO site_content (key, value_en, value_es, type, label)
              VALUES (@key, @url, @url, 'image', @label)`,
        args: row,
      })),
    ],
    'write'
  )

  console.log(`Seeded ${rows.length} content fields and ${assets.length} assets.`)
}

main()