/* ════════════════════════════════════════
   SHOPIFY STOREFRONT API INTEGRATION
   Custom frontend → Shopify checkout
════════════════════════════════════════ */

// ── Your Shopify store domain ──
const SHOPIFY_DOMAIN = "starsinfern0.myshopify.com";

// ── Storefront API access token (from Shopify Admin → Apps → Netlify Storefront) ──
const SHOPIFY_TOKEN = "85af096903f03a1d94f1d7dbbebca931";

const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

/* ── Variant ID Map ──────────────────────
   Maps frontend product keys → Shopify variant GIDs.
   To add a new product, copy its variant URL from Shopify Admin
   and extract the numeric ID from the end.
─────────────────────────────────────────*/
const VARIANT_IDS = {
  "time-expire":    "gid://shopify/ProductVariant/47808435945629",
  "coma":           "gid://shopify/ProductVariant/47808665583773",
  "power-of-the-p": "gid://shopify/ProductVariant/47808555974813",
  "boobi-bucla6":   "gid://shopify/ProductVariant/47808588546205",
  "dumo-effect":    "gid://shopify/ProductVariant/47808632324253",
};

/* ── createCheckout ──────────────────────
   Accepts: [{ key: "product-key", quantity: 1 }]
   Returns: Shopify checkout URL (string)
─────────────────────────────────────────*/
async function createCheckout(cartItems) {
  const lineItems = cartItems
    .filter(item => VARIANT_IDS[item.key])
    .map(item => ({
      variantId: VARIANT_IDS[item.key],
      quantity:  item.quantity,
    }));

  if (!lineItems.length) throw new Error("No valid items in cart.");

  const res = await fetch(SHOPIFY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":                      "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({
      query: `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
          checkoutCreate(input: $input) {
            checkout { webUrl }
            checkoutUserErrors { message field code }
          }
        }
      `,
      variables: { input: { lineItems } },
    }),
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);

  const { data, errors } = await res.json();

  if (errors?.length)                                 throw new Error(errors[0].message);
  if (data?.checkoutCreate?.checkoutUserErrors?.length)
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);

  const url = data?.checkoutCreate?.checkout?.webUrl;
  if (!url) throw new Error("No checkout URL returned.");

  return url;
}

/* ── redirectToCheckout ──────────────────
   Called by the cart checkout button.
   Sends the current cart to Shopify and
   redirects the user to the checkout page.
─────────────────────────────────────────*/
async function redirectToCheckout(cartItems) {
  const btn = document.getElementById("cart-checkout-btn");
  if (btn) { btn.textContent = "Loading…"; btn.disabled = true; }

  try {
    const url = await createCheckout(cartItems);
    window.location.href = url;
  } catch (err) {
    console.error("Checkout failed:", err);
    if (btn) { btn.textContent = "Checkout →"; btn.disabled = false; }
    alert("Checkout is currently unavailable. Please try again.");
  }
}
