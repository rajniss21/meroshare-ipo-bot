# Locators

Locator strategies used in this repo (ordered by preference):

- `data-testid` or `data-qa` attributes (most stable)
- `role` or ARIA selectors when accessible roles exist
- `text=` exact/partial for visible labels
- CSS selectors for structural elements

Examples

```ts
// preferred: stable test id
const addToCart = this.page.locator('[data-testid="add-to-cart"]');

// role-based
const submit = this.page.getByRole('button', { name: 'Submit' });

// text
await this.page.locator('text=Checkout').click();
```

Avoid

- Fragile selectors that depend on visual layout (deep CSS paths) unless necessary.
- Using XPath unless no other option exists.
