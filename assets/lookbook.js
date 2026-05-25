
class Lookbook extends HTMLElement {

  connectedCallback() {
    this.productHandles = JSON.parse(this.getAttribute('product-handles') || '[]');
    this.getProducts();
  }

  /* 
    Fetches products from graphQL being passed productHandles. 
    GraphQl uses inContext to ensure correct market values are returned.
  */

  async getProducts() {
    try {
        const query = `
        query LookbookProducts(
          $country: CountryCode,
          $language: LanguageCode
        )
        @inContext(country: $country, language: $language) {

          ${this.productHandles
            .map(
              (handle, index) => `
                product${index}: product(handle: "${handle}") {
                  id
                  title
                  handle
      
                  featuredImage {
                    url
                    altText
                  }
      
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
      
                  compareAtPriceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              `,
            )
            .join('\n')}
        }
      `;

      const response = await fetch('/api/2025-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storeFrontAccessToken,
        },
        body: JSON.stringify(
            { query, 
              variables: {
                country: this.dataset.country,
                language: this.dataset.language,
              },
            }
        ),
      });

      const result = await response.json();
      const products = result.data

      this.renderProducts(products);
    } catch (error) {
      console.error('Lookbook fetch failed', error);
    }
  }


    /* Renders a simple product card from shopify graphQL results to target DOM */

  async renderProducts(products){
    const container = this.querySelector('.lookbook-products');
    if (!container) return;

    const productsArray = Object.values(products).filter(Boolean);

    container.innerHTML = productsArray.map((product) => {
    const url = `/products/${product.handle}`;
    const image = product.featuredImage;

    const price = product.priceRange?.minVariantPrice;
    const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

      const formattedPrice = price
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: price.currencyCode,
          currencyDisplay: 'narrowSymbol',
        }).format(parseFloat(price.amount))
      : '';
    
    const formattedCompareAtPrice = compareAtPrice
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: compareAtPrice.currencyCode,
          currencyDisplay: 'narrowSymbol',
        }).format(parseFloat(compareAtPrice.amount))
      : '';

    const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

    return `
      <a href="${url}" class="lookbook-product-card">
        ${
          image
            ? `
              <img
                src="${image.url}"
                alt="${image.altText ?? product.title}"
                loading="lazy"
              >
            `
            : ''
        }

        <p class="lookbook-product-title">${product.title}</p>

        <div class="lookbook-product-price h6">
          ${
            isOnSale
              ? `
                <span class="lookbook-product-price-sale">
                  ${formattedPrice}
                </span>

                <s class="lookbook-product-price-compare">
                  ${formattedCompareAtPrice}
                </s>
              `
              : formattedPrice
          }
        </div>
      </a>
    `;
  })
  .join('');
    }
}

if (!customElements.get('look-book')) {
  customElements.define('look-book', Lookbook);
}
