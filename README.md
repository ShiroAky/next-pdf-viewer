
# next-manga-pdf

A lightweight, high-performance PDF viewer for Next.js, optimized for manga and document reading.

## Features

* **Next.js Ready**: Built with `use client` support and SSR-safe dynamic loading.
* **Highly Customizable**: Pass your own Tailwind classes for full control over layout.
* **Performance Optimized**: Uses `pdf.js` with canvas render cancellation to prevent memory leaks and rendering collisions.
* **Flexible**: Not just for manga—use it for any multi-page PDF document.

## Installation

```bash
pnpm add next-manga-pdf
```

## Usage

Since this component interacts with the browser's DOM (Canvas API), it must be loaded dynamically in Next.js to avoid SSR errors (ReferenceError: DOMMatrix is not defined).

## Usage/Examples

```tsx
'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(
  () => import('next-manga-pdf').then((mod) => mod.PdfViewer),
  { ssr: false }
);

export default function MyPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <PdfViewer 
        url="/your-file.pdf" 
        scale={2.0}
        className="w-full flex flex-col items-center"
      />
    </div>
  );
}
```

## Props

| Prop         | Type     | Default       | Description                               |
| :--------    | :------- | :-------      | :-------------------------                |
| `url`        | `string` | **Required**. | URL to the PDF file.                      |
| `scale`      | `number` | `1.5`         | The zoom/scaling level of the PDF pages.  |
| `className`  | `string` | `''`          | Tailwind classes for the main wrapper.    |

## Important Considerations

### 1. Global CSS

To ensure the canvas doesn't overflow its container, add this to your global CSS:

```css
.pdf-viewer-wrapper canvas {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### 2. SSR

Always use next/dynamic with `{ ssr: false }` when importing this component to ensure the code only executes in the client-side environment where the Canvas API exists.

## Authors

- [@ShiroAky](https://www.github.com/ShiroAky)

## License

[MIT](https://choosealicense.com/licenses/mit/)