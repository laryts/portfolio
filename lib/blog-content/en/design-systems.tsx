export const DesignSystemsContent = () => {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <p className="lead">
        Design systems are essential for maintaining consistency across large applications. In this article, I'll share
        how to leverage StencilJS to create reusable web components that work across any framework.
      </p>

      <h2>What is a Design System?</h2>
      <p>
        A design system is a collection of reusable components, guided by clear standards, that can be assembled to
        build any number of applications. It's more than just a UI kit or component library—it's a comprehensive system
        that includes:
      </p>
      <ul>
        <li>Design principles and guidelines</li>
        <li>Component library</li>
        <li>Documentation</li>
        <li>Design tokens (colors, typography, spacing, etc.)</li>
        <li>Accessibility standards</li>
        <li>Implementation patterns</li>
      </ul>
      <p>
        When implemented effectively, a design system creates a shared language between designers and developers,
        accelerates development, ensures consistency, and improves the overall user experience.
      </p>

      <h2>The Challenge of Framework Agnosticism</h2>
      <p>
        One of the biggest challenges in building a design system is ensuring that it works across different frameworks
        and technologies. In many organizations, different teams might use React, Angular, Vue, or even vanilla
        JavaScript. Creating and maintaining separate implementations for each framework is time-consuming and
        error-prone.
      </p>
      <p>This is where Web Components and specifically StencilJS come in.</p>

      <h2>Introduction to StencilJS</h2>
      <p>
        StencilJS is a compiler that generates Web Components (specifically, Custom Elements) and builds
        high-performance components that run in any framework or with no framework at all. Created by the Ionic
        Framework team, Stencil combines the best concepts of the most popular frameworks:
      </p>
      <ul>
        <li>Virtual DOM</li>
        <li>Async rendering</li>
        <li>Reactive data binding</li>
        <li>TypeScript support</li>
        <li>JSX templating</li>
      </ul>

      <h3>Why StencilJS for Design Systems?</h3>
      <p>StencilJS offers several advantages that make it ideal for building design systems:</p>
      <ul>
        <li>
          <strong>Framework Agnostic:</strong> Components work with any framework or no framework
        </li>
        <li>
          <strong>Small Footprint:</strong> Minimal runtime, focused on performance
        </li>
        <li>
          <strong>Familiar Developer Experience:</strong> Uses TypeScript, JSX, and modern JavaScript features
        </li>
        <li>
          <strong>Built-in Optimizations:</strong> Lazy loading, tree shaking, and minification
        </li>
        <li>
          <strong>Framework Bindings:</strong> Can generate framework-specific wrappers
        </li>
      </ul>

      <h2>Setting Up a Design System with StencilJS</h2>

      <h3>1. Project Setup</h3>
      <p>Let's start by setting up a new StencilJS project for our design system:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`# Create a new StencilJS project
npm init stencil

# Select the 'component' starter
# Navigate to your project
cd my-design-system

# Install dependencies
npm install`}
        </code>
      </pre>

      <h3>2. Project Structure</h3>
      <p>A well-organized project structure is crucial for a maintainable design system:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`my-design-system/
├── src/
│   ├── components/      # Component implementations
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   └── ...
│   ├── utils/           # Shared utilities
│   ├── styles/          # Global styles and tokens
│   │   ├── tokens.css   # Design tokens as CSS variables
│   │   └── global.css   # Global styles
│   └── index.html       # Test page
├── stencil.config.ts    # Stencil configuration
└── package.json`}
        </code>
      </pre>

      <h3>3. Defining Design Tokens</h3>
      <p>
        Design tokens are the foundation of your design system. They represent the smallest visual elements like colors,
        typography, spacing, etc.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`/* src/styles/tokens.css */
:root {
  /* Colors */
  --color-primary: #4a148c;
  --color-primary-light: #7c43bd;
  --color-primary-dark: #12005e;
  --color-secondary: #ff6f00;
  --color-secondary-light: #ffa040;
  --color-secondary-dark: #c43e00;
  
  /* Text colors */
  --text-primary: rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.6);
  --text-disabled: rgba(0, 0, 0, 0.38);
  
  /* Background colors */
  --bg-default: #ffffff;
  --bg-paper: #f5f5f5;
  --bg-disabled: #e0e0e0;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  
  /* Font weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}`}
        </code>
      </pre>

      <h3>4. Creating a Button Component</h3>
      <p>Let's create a button component as an example:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/components/button/button.tsx
import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'ds-button',
  styleUrl: 'button.css',
  shadow: true,
})
export class Button {
  /**
   * The button variant
   */
  @Prop() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  /**
   * The button size
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * If true, the button will be disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * If true, the button will take up the full width of its container
   */
  @Prop() fullWidth: boolean = false;

  render() {
    return (
      <Host>
        <button
          class={{
            'ds-button': true,
            ['ds-button--' + this.variant]: true,
            ['ds-button--' + this.size]: true,
            'ds-button--full-width': this.fullWidth,
          }}
          disabled={this.disabled}
        >
          <slot></slot>
        </button>
      </Host>
    );
  }
}`}
        </code>
      </pre>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`/* src/components/button/button.css */
:host {
  display: inline-block;
}

.ds-button {
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  border-radius: var(--radius-md);
}

/* Variants */
.ds-button--primary {
  background-color: var(--color-primary);
  color: white;
}

.ds-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.ds-button--secondary {
  background-color: var(--color-secondary);
  color: white;
}

.ds-button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
}

.ds-button--tertiary {
  background-color: transparent;
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);
}

.ds-button--tertiary:hover:not(:disabled) {
  background-color: rgba(74, 20, 140, 0.05);
}

/* Sizes */
.ds-button--small {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  height: 32px;
}

.ds-button--medium {
  font-size: var(--font-size-md);
  padding: var(--spacing-sm) var(--spacing-md);
  height: 40px;
}

.ds-button--large {
  font-size: var(--font-size-lg);
  padding: var(--spacing-sm) var(--spacing-lg);
  height: 48px;
}

/* Full width */
.ds-button--full-width {
  width: 100%;
}

/* Disabled state */
.ds-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`}
        </code>
      </pre>

      <h3>5. Stencil Configuration</h3>
      <p>Configure Stencil to generate the necessary output formats:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// stencil.config.ts
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'design-system',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
};`}
        </code>
      </pre>

      <h2>Creating Framework-Specific Bindings</h2>
      <p>
        While Web Components work in any framework, creating framework-specific bindings can improve the developer
        experience for teams using specific frameworks.
      </p>

      <h3>React Bindings</h3>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// stencil.config.ts (updated)
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'design-system',
  outputTargets: [
    // ... other output targets
    reactOutputTarget({
      componentCorePackage: 'my-design-system',
      proxiesFile: '../react/src/components.ts',
    }),
  ],
};`}
        </code>
      </pre>

      <h3>Angular Bindings</h3>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// stencil.config.ts (updated)
import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'design-system',
  outputTargets: [
    // ... other output targets
    angularOutputTarget({
      componentCorePackage: 'my-design-system',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
    }),
  ],
};`}
        </code>
      </pre>

      <h2>Building Complex Components</h2>
      <p>Let's look at a more complex component example - a modal dialog:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/components/modal/modal.tsx
import { Component, Prop, Method, Event, EventEmitter, h, Host, Element } from '@stencil/core';

@Component({
  tag: 'ds-modal',
  styleUrl: 'modal.css',
  shadow: true,
})
export class Modal {
  @Element() el!: HTMLElement;
  
  /**
   * If true, the modal is open
   */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;
  
  /**
   * The modal size
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  
  /**
   * If true, clicking the backdrop will close the modal
   */
  @Prop() closeOnBackdropClick: boolean = true;
  
  /**
   * Emitted when the modal opens
   */
  @Event() dsOpen!: EventEmitter<void>;
  
  /**
   * Emitted when the modal closes
   */
  @Event() dsClose!: EventEmitter<void>;
  
  private backdrop!: HTMLDivElement;
  
  /**
   * Open the modal
   */
  @Method()
  async openModal() {
    this.open = true;
    this.dsOpen.emit();
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close the modal
   */
  @Method()
  async closeModal() {
    this.open = false;
    this.dsClose.emit();
    document.body.style.overflow = '';
  }
  
  private handleBackdropClick = (e: MouseEvent) => {
    if (this.closeOnBackdropClick && e.target === this.backdrop) {
      this.closeModal();
    }
  }
  
  componentDidLoad() {
    this.backdrop.addEventListener('click', this.handleBackdropClick);
  }
  
  disconnectedCallback() {
    this.backdrop.removeEventListener('click', this.handleBackdropClick);
  }
  
  render() {
    return (
      <Host class={{ 'is-open': this.open }}>
        <div 
          class="modal-backdrop" 
          ref={(el) => this.backdrop = el as HTMLDivElement}
        ></div>
        <div class={{
          'modal-container': true,
          ['modal-container--' + this.size]: true,
        }}>
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}

/* src/components/modal/modal.css */
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear var(--transition-normal), opacity var(--transition-normal);
}

:host(.is-open) {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity var(--transition-normal);
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  background-color: var(--bg-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  overflow: auto;
  z-index: 1;
  transform: scale(0.9);
  opacity: 0;
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

:host(.is-open) .modal-container {
  transform: scale(1);
  opacity: 1;
}

/* Sizes */
.modal-container--small {
  width: 400px;
}

.modal-container--medium {
  width: 600px;
}

.modal-container--large {
  width: 800px;
}

.modal-content {
  padding: var(--spacing-lg);
}`}
        </code>
      </pre>

      <h2>Documenting Your Design System</h2>
      <p>
        Documentation is a critical part of any design system. Stencil generates component documentation automatically,
        but you'll want to enhance it with usage examples and guidelines.
      </p>
      <p>Consider using Storybook to create a living documentation site:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
};

// src/components/button/button.stories.tsx
export default {
  title: 'Components/Button',
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'tertiary'] },
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

const Template = (args) => \`
  <ds-button 
    variant="\${args.variant}" 
    size="\${args.size}" 
    \${args.disabled ? 'disabled' : ''} 
    \${args.fullWidth ? 'full-width' : ''}
  >
    \${args.children}
  </ds-button>
\`;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Primary.args,
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  ...Primary.args,
  variant: 'tertiary',
  children: 'Tertiary Button',
};`}
        </code>
      </pre>

      <h2>Testing Components</h2>
      <p>StencilJS comes with built-in testing capabilities using Jest and Puppeteer:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/components/button/button.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Button } from './button';

describe('ds-button', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: \`<ds-button>Click me</ds-button>\`,
    });
    
    expect(page.root).toEqualHtml(\`
      <ds-button>
        <mock:shadow-root>
          <button class="ds-button ds-button--medium ds-button--primary">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ds-button>
    \`);
  });
  
  it('renders with custom props', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: \`<ds-button variant="secondary" size="large" full-width>Click me</ds-button>\`,
    });
    
    expect(page.root).toEqualHtml(\`
      <ds-button variant="secondary" size="large" full-width>
        <mock:shadow-root>
          <button class="ds-button ds-button--large ds-button--secondary ds-button--full-width">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ds-button>
    \`);
  });
  
  it('renders in disabled state', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: \`<ds-button disabled>Click me</ds-button>\`,
    });
    
    const button = page.root.shadowRoot.querySelector('button');
    expect(button.disabled).toBe(true);
  });
});`}
        </code>
      </pre>

      <h2>Publishing and Versioning</h2>
      <p>Once your design system is ready, you'll want to publish it to npm and establish a versioning strategy:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// package.json
{
  "name": "my-design-system",
  "version": "1.0.0",
  "description": "A framework-agnostic design system built with StencilJS",
  "main": "dist/index.cjs.js",
  "module": "dist/index.js",
  "es2015": "dist/esm/index.mjs",
  "es2017": "dist/esm/index.mjs",
  "types": "dist/types/index.d.ts",
  "collection": "dist/collection/collection-manifest.json",
  "collection:main": "dist/collection/index.js",
  "unpkg": "dist/my-design-system/my-design-system.esm.js",
  "files": [
    "dist/",
    "loader/"
  ],
  "scripts": {
    "build": "stencil build --docs",
    "start": "stencil build --dev --watch --serve",
    "test": "stencil test --spec",
    "test.watch": "stencil test --spec --watchAll",
    "generate": "stencil generate",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
  },
  "dependencies": {
    "@stencil/core": "^2.13.0"
  },
  "devDependencies": {
    "@babel/core": "^7.16.0",
    "@storybook/addon-a11y": "^6.4.9",
    "@storybook/addon-actions": "^6.4.9",
    "@storybook/addon-essentials": "^6.4.9",
    "@storybook/addon-links": "^6.4.9",
    "@storybook/html": "^6.4.9",
    "@types/jest": "^27.0.3",
    "babel-loader": "^8.2.3",
    "jest": "^27.4.5",
    "jest-cli": "^27.4.5"
  }
}`}
        </code>
      </pre>

      <h2>Adoption and Governance</h2>
      <p>
        Creating a design system is just the beginning. For it to be successful, you need a strategy for adoption and
        governance:
      </p>
      <ul>
        <li>
          <strong>Adoption:</strong> Provide clear documentation, examples, and support to help teams adopt the design
          system.
        </li>
        <li>
          <strong>Governance:</strong> Establish processes for contributing to the design system, reviewing changes, and
          making decisions.
        </li>
        <li>
          <strong>Feedback:</strong> Create channels for users to provide feedback and report issues.
        </li>
        <li>
          <strong>Maintenance:</strong> Regularly update the design system to fix bugs, add features, and keep up with
          evolving design trends.
        </li>
      </ul>

      <h2>Conclusion</h2>
      <p>Building a scalable design system with StencilJS offers numerous benefits:</p>
      <ul>
        <li>Framework-agnostic components that work anywhere</li>
        <li>Consistent user experience across all applications</li>
        <li>Improved developer productivity</li>
        <li>Better collaboration between designers and developers</li>
        <li>Reduced maintenance burden</li>
      </ul>
      <p>
        By leveraging the power of Web Components through StencilJS, you can create a design system that stands the test
        of time and adapts to changing technology landscapes. The initial investment in setting up a robust design
        system pays dividends in the form of faster development cycles, consistent user experiences, and happier
        development teams.
      </p>
    </div>
  )
}
