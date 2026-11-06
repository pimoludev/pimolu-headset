"use client";

import { useEffect, useState } from "react";
import { useCart } from "./use-cart";
import CartEntrance from "./cart-entrance";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CircleDashed,
  Check,
  Headphones,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Heading,
  Image,
  Input,
  Link,
  Paragraph,
  PimoluProvider,
  Separator,
  Text,
} from "@pimolu/react";

const finishes = [
  {
    id: "champagne",
    name: "Champagne",
    color: "#c5b59e",
    image: "/images/headset-champagne-transparent.webp",
    thumbnail: "/images/headset-champagne-thumbnail.webp",
    note: "Softness in every detail.",
  },
  {
    id: "graphite",
    name: "Graphite",
    color: "#333432",
    image: "/images/headset-graphite-transparent.webp",
    thumbnail: "/images/headset-graphite-thumbnail.webp",
    note: "Quietly distinctive.",
  },
] as const;
type Finish = (typeof finishes)[number]["id"];
const price = 249;
const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
const faq = [
  [
    "What makes Pimolu Headset different?",
    "An enveloping silhouette, soft textures and two timeless finishes. Pimolu Headset is a headphone concept designed to be a beautiful part of everyday life. These visuals showcase our design direction.",
  ],
  [
    "Which finishes are available?",
    "Discover two finishes: Champagne, with ivory and warm gold tones, and Graphite, in black and charcoal. Explore both and add them separately to your cart.",
  ],
  [
    "Where can I find the technical specifications?",
    "The full specifications will be published at launch. Battery life, codecs, connectivity and audio features are still to be confirmed. We will share accurate details once the product is finalised.",
  ],
  [
    "Can I order now?",
    "You can prepare your selection in this demo store. The €249 price is indicative: no payment is taken and no real order is placed.",
  ],
  [
    "What about shipping and returns?",
    "Shipping destinations, delivery times, costs and return conditions will be confirmed when sales open. Final sales terms have not yet been announced.",
  ],
];

const icons = {
  bag: ShoppingBag,
  arrow: ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "arrow-down-right": ArrowDownRight,
  headphones: Headphones,
  comfort: CircleDashed,
  sparkle: Sparkles,
  menu: Menu,
  plus: Plus,
  minus: Minus,
  check: Check,
  trash: Trash2,
};

function Icon({ name }: { name: keyof typeof icons }) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      className="line-icon"
      size={22}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

function Brand() {
  return (
    <Link
      href="#"
      className="brand"
      aria-label="Pimolu Headset home"
      underline="none"
    >
      <Image
        src="/pimolu-icon.svg"
        alt=""
        width={32}
        height={36}
        containerClassName="brand-mark"
        rounded="none"
        showSkeleton={false}
      />
      <Text className="brand-wordmark" aria-hidden="true">
        imolu<Text className="brand-product">Headset</Text>
      </Text>
    </Link>
  );
}

export default function Storefront() {
  const [finish, setFinish] = useState<Finish>("champagne");
  const [view, setView] = useState(0);
  const { cart, setCart, ready } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewRequested, setReviewRequested] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [info, setInfo] = useState<"checkout" | "privacy" | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const selected = finishes.find((item) => item.id === finish)!;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!reviewRequested || cartOpen) return;
    // Match Pimolu Drawer's 180 ms exit before activating a second modal.
    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 180;
    const timer = window.setTimeout(() => {
      setInfo("checkout");
      setReviewRequested(false);
    }, exitDuration);
    return () => window.clearTimeout(timer);
  }, [cartOpen, reviewRequested]);

  function openCart() {
    setReviewRequested(false);
    setCartOpen(true);
  }

  function choose(value: Finish) {
    setFinish(value);
    setView(0);
  }
  function addToCart(value: Finish = finish) {
    setCart((current) =>
      current.some((item) => item.finish === value)
        ? current.map((item) =>
            item.finish === value
              ? { ...item, quantity: Math.min(9, item.quantity + 1) }
              : item,
          )
        : [...current, { finish: value, quantity: 1 }],
    );
    openCart();
  }
  function changeQuantity(value: Finish, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.finish === value
            ? { ...item, quantity: Math.min(9, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <PimoluProvider
      theme="light"
      stylePreset="monochrome"
      brandColor="#272822"
      radius="round"
      persist={false}
      className="storefront"
    >
      <Link href="#main" className="skip-link">
        Skip to content
      </Link>
      <Box className="announcement">
        <Text>A little less noise. A little more you.</Text>
        <Link href="#collection" underline="none">
          Discover the collection <Icon name="arrow-up-right" />
        </Link>
      </Box>
      <Box as="header" className="site-header">
        <Brand />
        <Box as="nav" className="desktop-nav" aria-label="Main navigation">
          <Link href="#casque" underline="none" className="active-nav">
            The headset
          </Link>
          <Link href="#experience" underline="none">
            The experience
          </Link>
          <Link href="#design" underline="none">
            The design
          </Link>
          <Link href="#faq" underline="none">
            FAQs
          </Link>
        </Box>
        <Box className="nav-actions">
          <Text className="locale">EN / EUR</Text>
          <Button
            appearance="ghost"
            className="bag-button"
            startIcon={<Icon name="bag" />}
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <Text className="cart-count">{count}</Text>
          </Button>
          <Button
            className="mobile-menu icon-button"
            appearance="ghost"
            iconOnly
            startIcon={<Icon name="menu" />}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          />
        </Box>
      </Box>
      <Box as="main" id="main">
        <Box
          as="section"
          className="hero section-shell"
          id="casque"
          aria-labelledby="hero-title"
        >
          <Box className="hero-copy">
            <Text className="eyebrow">
              <Text className="tiny-line" /> PIMOLU HEADSET · COLLECTION 01
            </Text>
            <Heading level={1} id="hero-title" className="hero-title">
              The world
              <br /> on pause.
              <br />
              <Text>Just you. And music.</Text>
            </Heading>
            <Paragraph className="hero-description">
              Rediscover the joy of listening. Essential design, made for the
              moments that are yours alone.
            </Paragraph>
            <Box className="finish-control">
              <Text className="small-label">
                Your finish —{" "}
                <Text className="finish-name">{selected.name}</Text>
              </Text>
              <Box
                className="swatches"
                role="group"
                aria-label="Choose a finish"
              >
                {finishes.map((item) => (
                  <Button
                    key={item.id}
                    className={`swatch ${finish === item.id ? "selected" : ""}`}
                    style={
                      {
                        "--swatch-color": item.color,
                        "--swatch-contrast":
                          item.id === "graphite" ? "#faf9f6" : "#292b25",
                      } as React.CSSProperties
                    }
                    onClick={() => choose(item.id)}
                    aria-label={`${item.name} finish`}
                    aria-pressed={finish === item.id}
                    iconOnly
                    startIcon={
                      <Text className="swatch-fill">
                        {finish === item.id && <Icon name="check" />}
                      </Text>
                    }
                  />
                ))}
              </Box>
            </Box>
            <Box className="purchase-row">
              <Button
                size="lg"
                className="primary-cta"
                endIcon={<Icon name="arrow" />}
                onClick={() => addToCart()}
                disabled={!ready}
              >
                Add to cart <Text className="button-price">{money(price)}</Text>
              </Button>
            </Box>
            <Text className="demo-note">
              Concept collection · Indicative price · Demo purchase
            </Text>
            <Link href="#design" className="discover-link" underline="none">
              It’s all in the details <Icon name="arrow-down-right" />
            </Link>
          </Box>
          <Box className="hero-visual">
            <Box className="visual-label">
              <Badge
                variant="neutral"
                appearance="outline"
                className="edition-badge"
              >
                THE ESSENTIAL, REIMAGINED.
              </Badge>
              <Text className="visual-number">
                {finish === "champagne" ? "01" : "02"} / 02
              </Text>
            </Box>
            <Box className={`product-stage view-${view}`}>
              <Image
                key={selected.image}
                src={selected.image}
                alt={`Pimolu Headset in ${selected.name}, ${view === 0 ? "full view" : view === 1 ? "earcup close-up" : "headband close-up"}`}
                width={1254}
                height={1254}
                fetchPriority="high"
                rounded="none"
                showSkeleton={false}
                className="hero-product"
                containerClassName="hero-product-wrap"
              />
            </Box>
            <Box className="visual-footer">
              <Box>
                <Text className="visual-product-name">Pimolu Headset</Text>
                <Text className="visual-finish">{selected.name} edition</Text>
              </Box>
              <Box
                className="gallery-controls"
                role="group"
                aria-label="Headset views"
              >
                {["Full view", "Earcup detail", "Headband detail"].map(
                  (label, index) => (
                    <Button
                      key={label}
                      className={`gallery-dot ${view === index ? "selected" : ""}`}
                      iconOnly
                      onClick={() => setView(index)}
                      aria-label={label}
                      aria-pressed={view === index}
                      startIcon={<Text className="gallery-indicator" />}
                    />
                  ),
                )}
              </Box>
              <Text className="visual-signature">Designed to feel.</Text>
            </Box>
          </Box>
        </Box>
        <Box className="values-strip section-shell">
          <Box>
            <Icon name="headphones" />
            <Text>Your own space, anywhere.</Text>
          </Box>
          <Box>
            <Icon name="comfort" />
            <Text>Comfort comes naturally.</Text>
          </Box>
          <Box>
            <Icon name="sparkle" />
            <Text>The difference is in the details.</Text>
          </Box>
          <Link href="#experience" underline="none">
            Step into the experience <Icon name="arrow-up-right" />
          </Link>
        </Box>
        <Box
          as="section"
          id="experience"
          className="experience section-shell"
          aria-labelledby="experience-title"
        >
          <Box className="section-heading">
            <Text className="eyebrow">01 — A MOMENT FOR YOU</Text>
            <Heading level={2} id="experience-title">
              The best place to be?
              <br />
              <Text className="muted-title">Inside your favourite song.</Text>
            </Heading>
            <Paragraph>
              An album rediscovered. A commute that becomes an escape. Press
              pause on everything else.
            </Paragraph>
          </Box>
          <Box className="lifestyle-banner">
            <Image
              src="/images/lifestyle.webp"
              alt="A woman enjoying music with Pimolu Headset in Champagne in a warmly sunlit apartment"
              width={1536}
              height={1024}
              loading="lazy"
              rounded="none"
              containerClassName="lifestyle-image"
            />
            <Box className="lifestyle-caption">
              <Text className="eyebrow">JUST YOU. JUST THE MUSIC.</Text>
              <Heading level={3}>
                Less world.
                <br />
                More moments.
              </Heading>
              <Link href="#collection" className="light-link" underline="none">
                Find your signature <Icon name="arrow-up-right" />
              </Link>
            </Box>
            <Text className="photo-caption">PIMOLU — THE ART OF LISTENING</Text>
          </Box>
        </Box>
        <Box
          as="section"
          id="design"
          className="design-section section-shell"
          aria-labelledby="design-title"
        >
          <Box className="design-image">
            <Image
              src="/images/headset-champagne-transparent.webp"
              alt="Close-up of the champagne metal grille and woven ear cushion on Pimolu Headset"
              width={1254}
              height={1254}
              loading="lazy"
              rounded="none"
              containerClassName="detail-image"
            />
            <Badge
              variant="neutral"
              appearance="outline"
              className="detail-badge"
            >
              A FEEL FOR DETAIL
            </Badge>
          </Box>
          <Box className="design-copy">
            <Text className="eyebrow">02 — THE BEAUTY OF LESS</Text>
            <Heading level={2} id="design-title">
              Beautiful to see.
              <br />
              <Text className="muted-title">Effortless to wear.</Text>
            </Heading>
            <Paragraph>
              Soft lines. Materials that invite your touch. Every detail shapes
              a new way to live with music.
            </Paragraph>
            <Accordion
              type="single"
              defaultValue="comfort"
              collapsible
              className="design-accordion"
            >
              <AccordionItem value="comfort">
                <AccordionTrigger>
                  01 <Text>Comfort, naturally.</Text>
                </AccordionTrigger>
                <AccordionContent>
                  Generous cushions, a textile interior and an enveloping
                  silhouette: comfort guides every line of this concept.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials">
                <AccordionTrigger>
                  02 <Text>Materials in harmony.</Text>
                </AccordionTrigger>
                <AccordionContent>
                  Satin-finished metal meets woven textures. A subtle play of
                  contrasts, in Champagne and Graphite.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="signature">
                <AccordionTrigger>
                  03 <Text>A signature. Yours.</Text>
                </AccordionTrigger>
                <AccordionContent>
                  A discreet P monogram. A recognisable silhouette. The Pimolu
                  Headset identity speaks without raising its voice.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Link href="#collection" className="discover-link" underline="none">
              Choose my headset <Icon name="arrow-up-right" />
            </Link>
          </Box>
        </Box>
        <Box
          as="section"
          id="collection"
          className="collection-section section-shell"
          aria-labelledby="collection-title"
        >
          <Box className="collection-heading">
            <Box>
              <Text className="eyebrow">03 — YOUR SIGNATURE</Text>
              <Heading level={2} id="collection-title">
                Two shades.
                <br />
                <Text className="muted-title">One essential.</Text>
              </Heading>
            </Box>
            <Paragraph>
              Light and warm. Dark and distinctive.
              <br />A finish for every personality.
            </Paragraph>
          </Box>
          <Box className="collection-grid">
            {finishes.map((item, index) => (
              <Box as="article" className="finish-card" key={item.id}>
                <Box className="finish-card-image">
                  <Text className="card-index">0{index + 1}</Text>
                  <Image
                    src={item.image}
                    alt={`Pimolu Headset in ${item.name}`}
                    width={1254}
                    height={1254}
                    loading="lazy"
                    rounded="none"
                  />
                  <Button
                    iconOnly
                    startIcon={<Icon name="plus" />}
                    className="card-add"
                    aria-label={`Add ${item.name} headset to cart`}
                    onClick={() => addToCart(item.id)}
                    disabled={!ready}
                  />
                </Box>
                <Box className="finish-card-caption">
                  <Box>
                    <Heading level={3}>
                      Pimolu Headset <Text>{item.name}</Text>
                    </Heading>
                    <Paragraph>{item.note}</Paragraph>
                  </Box>
                  <Text className="card-price">{money(price)}</Text>
                </Box>
              </Box>
            ))}
          </Box>
          <Text className="collection-note">
            Concept visuals and demo pricing. Final specifications will be
            announced at launch.
          </Text>
        </Box>
        <Box
          as="section"
          id="faq"
          className="faq-section section-shell"
          aria-labelledby="faq-title"
        >
          <Box>
            <Text className="eyebrow">WE’RE LISTENING.</Text>
            <Heading level={2} id="faq-title">
              A few notes
              <br />
              <Text className="muted-title">to clear things up.</Text>
            </Heading>
            <Paragraph>Answers to your first questions.</Paragraph>
            <Link
              href="https://pimolu.com/"
              external
              showExternalIcon={false}
              className="discover-link"
              underline="none"
            >
              Explore the Pimolu world <Icon name="arrow-up-right" />
            </Link>
          </Box>
          <Accordion type="single" collapsible className="faq-accordion">
            {faq.map(([question, answer], index) => (
              <AccordionItem value={`faq-${index}`} key={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
        <Box
          as="section"
          className="newsletter section-shell"
          aria-labelledby="newsletter-title"
        >
          <Box className="newsletter-mark" aria-hidden="true">
            <Image
              src="/pimolu-icon.svg"
              alt=""
              width={260}
              height={260}
              loading="lazy"
            />
          </Box>
          <Box className="newsletter-copy">
            <Text className="eyebrow">LET’S STAY ON THE SAME WAVELENGTH.</Text>
            <Heading level={2} id="newsletter-title">
              Let’s hear what comes next.
            </Heading>
            <Paragraph>
              The latest notes from Pimolu Headset, straight to your inbox.
            </Paragraph>
            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubscribed(true);
              }}
            >
              <Input
                type="email"
                autoComplete="email"
                required
                aria-label="Your email address"
                placeholder="Your email address"
                value={email}
                onValueChange={(value) => {
                  setEmail(value);
                  setSubscribed(false);
                }}
                containerClassName="newsletter-input"
              />
              <Button
                type="submit"
                aria-label="Try the newsletter signup"
                className="newsletter-submit"
                endIcon={<Icon name="arrow" />}
              >
                Keep me in the loop
              </Button>
            </form>
            <Text className="newsletter-note" role="status">
              {subscribed
                ? "Thank you! Demo complete: your email address has not been saved or sent."
                : "Demo form — no email addresses are collected."}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box as="footer" className="site-footer section-shell">
        <Box className="footer-top">
          <Box>
            <Brand />
            <Paragraph>Your music. Your moment.</Paragraph>
          </Box>
          <Box className="footer-links">
            <Link href="#casque">The headset</Link>
            <Link href="#design">Our approach</Link>
            <Link href="#faq">FAQs</Link>
            <Link href="https://pimolu.com/" external showExternalIcon={false}>
              Explore Pimolu <Icon name="arrow-up-right" />
            </Link>
            <Link
              href="https://github.com/pimoludev/pimolu-headset"
              external
              showExternalIcon={false}
              aria-label="Pimolu Headset source code on GitHub (opens in a new tab)"
            >
              <Image src="/github.svg" alt="" width={16} height={16} />
              GitHub
            </Link>
          </Box>
          <Link href="#" className="back-top" aria-label="Back to top">
            <Icon name="arrow-up" />
          </Link>
        </Box>
        <Separator />
        <Box className="footer-bottom">
          <Text>© 2026 Pimolu Headset. Another way to listen.</Text>
          <Text>
            Concept store · Built with{" "}
            <Link href="https://pimolu.com/" external showExternalIcon={false}>
              Pimolu UI
            </Link>
          </Text>
          <Button appearance="link" onClick={() => setInfo("privacy")}>
            Privacy
          </Button>
        </Box>
      </Box>
      <Drawer open={cartOpen} onOpenChange={setCartOpen}>
        <DrawerContent
          closeLabel="Close cart"
          className="cart-drawer"
          classNames={{ overlay: "cart-drawer-overlay" }}
        >
          <CartEntrance open={cartOpen} />
          <DrawerHeader>
            <DrawerTitle>
              Your cart <Text className="muted-title">({count})</Text>
            </DrawerTitle>
            <DrawerDescription>
              One step closer to your next moment.
            </DrawerDescription>
          </DrawerHeader>
          {cart.length ? (
            <Box className="cart-body">
              <Box className="cart-items">
                {cart.map((item) => {
                  const product = finishes.find((f) => f.id === item.finish)!;
                  return (
                    <Box className="cart-item" key={item.finish}>
                      <Image
                        src={product.thumbnail}
                        alt={`${product.name} headset`}
                        width={110}
                        height={110}
                        rounded="md"
                        fit="contain"
                        showSkeleton={false}
                        decoding="async"
                      />
                      <Box className="cart-item-info">
                        <Heading level={3}>Pimolu Headset</Heading>
                        <Text>
                          {product.name} · {money(price)}
                        </Text>
                        <Box className="quantity-row">
                          <Button
                            iconOnly
                            startIcon={<Icon name="minus" />}
                            appearance="outline"
                            size="sm"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() => changeQuantity(item.finish, -1)}
                          />
                          <Text aria-live="polite">{item.quantity}</Text>
                          <Button
                            iconOnly
                            startIcon={<Icon name="plus" />}
                            appearance="outline"
                            size="sm"
                            aria-label={`Increase ${product.name} quantity`}
                            disabled={item.quantity >= 9}
                            onClick={() => changeQuantity(item.finish, 1)}
                          />
                          <Button
                            appearance="soft"
                            variant="neutral"
                            className="cart-remove"
                            size="sm"
                            startIcon={<Icon name="trash" />}
                            aria-label={`Remove ${product.name} headset from cart`}
                            onClick={() =>
                              setCart((current) =>
                                current.filter(
                                  (entry) => entry.finish !== item.finish,
                                ),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box className="cart-summary">
                <Separator />
                <Box className="total-row">
                  <Text>Indicative subtotal</Text>
                  <Text>{money(count * price)}</Text>
                </Box>
                <Paragraph className="cart-disclaimer">
                  Demo store. No payment will be taken. Shipping and sales terms
                  will be confirmed at launch.
                </Paragraph>
                <Button
                  fullWidth
                  size="lg"
                  className="primary-cta"
                  endIcon={<Icon name="arrow" />}
                  onClick={() => {
                    setReviewRequested(true);
                    setCartOpen(false);
                  }}
                >
                  Review my selection
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="empty-cart">
              <Icon name="bag" />
              <Heading level={3}>
                Your next moment
                <br />
                starts here.
              </Heading>
              <Paragraph>
                Your cart is waiting for your favourite finish.
              </Paragraph>
              <Button
                className="primary-cta"
                onClick={() => {
                  setCartOpen(false);
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Discover the headsets
              </Button>
            </Box>
          )}
        </DrawerContent>
      </Drawer>
      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent closeLabel="Close menu" className="menu-drawer">
          <DrawerHeader>
            <DrawerTitle>Pimolu Headset</DrawerTitle>
            <DrawerDescription>Your music. Your moment.</DrawerDescription>
          </DrawerHeader>
          <Box as="nav" className="mobile-nav" aria-label="Mobile navigation">
            {[
              ["The headset", "casque"],
              ["The experience", "experience"],
              ["The design", "design"],
              ["The collection", "collection"],
              ["FAQs", "faq"],
            ].map(([title, id]) => (
              <Link key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {title} <Icon name="arrow-up-right" />
              </Link>
            ))}
          </Box>
        </DrawerContent>
      </Drawer>
      <Dialog
        open={info !== null}
        onOpenChange={(open) => {
          if (!open) setInfo(null);
        }}
      >
        <DialogContent closeLabel="Close" className="info-dialog">
          <DialogHeader>
            <DialogTitle>
              {info === "checkout"
                ? "Your selection is ready."
                : "Your privacy, simply."}
            </DialogTitle>
            <DialogDescription>
              {info === "checkout"
                ? `${count} headset${count === 1 ? "" : "s"} · ${money(count * price)} indicative total.`
                : "What this demo stores."}
            </DialogDescription>
          </DialogHeader>
          <Paragraph>
            {info === "checkout"
              ? "This collection is a concept. Sales and payments are not open yet: no order has been placed and no payment has been taken. Your cart remains available on this device."
              : "Only your cart is saved in your browser’s local storage. The newsletter form does not send or save email addresses. No analytics or payment services are connected."}
          </Paragraph>
          <Button className="primary-cta" onClick={() => setInfo(null)}>
            Keep exploring <Icon name="arrow" />
          </Button>
        </DialogContent>
      </Dialog>
    </PimoluProvider>
  );
}
