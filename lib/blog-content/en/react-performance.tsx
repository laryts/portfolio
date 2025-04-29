"use client"

export const ReactPerformanceContent = () => {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <p className="lead">
        Performance optimization is crucial for delivering a smooth user experience in React applications. In this
        article, I'll explore advanced techniques for identifying and resolving performance bottlenecks.
      </p>

      <h2>Understanding React's Rendering Process</h2>
      <p>
        Before diving into optimization techniques, it's essential to understand how React's rendering process works.
        React uses a virtual DOM to efficiently update the actual DOM. When a component's state or props change, React
        creates a new virtual DOM tree, compares it with the previous one (a process called "diffing"), and then updates
        only the parts of the actual DOM that have changed.
      </p>
      <p>This process happens in several phases:</p>
      <ul>
        <li>
          <strong>Render Phase:</strong> React calls your component functions and creates a new virtual DOM tree.
        </li>
        <li>
          <strong>Reconciliation Phase:</strong> React compares the new virtual DOM with the previous one.
        </li>
        <li>
          <strong>Commit Phase:</strong> React applies the necessary changes to the actual DOM.
        </li>
      </ul>

      <h2>Common Performance Issues in React Applications</h2>
      <p>Several common issues can lead to performance problems in React applications:</p>
      <ul>
        <li>Unnecessary re-renders</li>
        <li>Expensive calculations in render functions</li>
        <li>Large component trees</li>
        <li>Inefficient state management</li>
        <li>Unoptimized context usage</li>
      </ul>

      <h2>Identifying Performance Bottlenecks</h2>
      <p>
        Before optimizing, you need to identify where the performance issues are. React provides several tools to help
        with this:
      </p>

      <h3>React DevTools Profiler</h3>
      <p>
        The React DevTools Profiler is an essential tool for identifying performance issues. It allows you to record a
        session of your application and see which components are rendering and how long they take.
      </p>
      <p>To use the Profiler:</p>
      <ol>
        <li>Install React DevTools in your browser</li>
        <li>Open DevTools and navigate to the "Profiler" tab</li>
        <li>Click the record button and interact with your application</li>
        <li>Stop recording and analyze the results</li>
      </ol>

      <h3>
        Performance Monitoring with <code>why-did-you-render</code>
      </h3>
      <p>
        The <code>why-did-you-render</code> library helps identify unnecessary re-renders in your application. It
        patches React to notify you when a component re-renders when the props or state are the same.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Setup in your app's entry point
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Then in your component
class ExampleComponent extends React.Component {
  static whyDidYouRender = true;
  render() {
    return <div>{this.props.value}</div>;
  }
}`}
        </code>
      </pre>

      <h2>Optimization Techniques</h2>

      <h3>1. Memoization with React.memo</h3>
      <p>
        <code>React.memo</code> is a higher-order component that memoizes the result of a component render. If a
        component's props haven't changed, React will skip rendering the component and reuse the last rendered result.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React from 'react';

// Without memoization
function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// With memoization
const MemoizedExpensiveComponent = React.memo(
  function ExpensiveComponent({ data }) {
    console.log('Rendering MemoizedExpensiveComponent');
    return (
      <div>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
);

// Custom comparison function
const areEqual = (prevProps, nextProps) => {
  return prevProps.data.length === nextProps.data.length;
};

const OptimizedComponent = React.memo(ExpensiveComponent, areEqual);`}
        </code>
      </pre>

      <h3>2. Optimizing Hooks with useMemo and useCallback</h3>
      <p>
        <code>useMemo</code> and <code>useCallback</code> are hooks that help prevent unnecessary calculations and
        function recreations.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { useState, useMemo, useCallback } from 'react';

function DataProcessor({ data, filter }) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data.filter(item => item.name.includes(filter))
               .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, filter]); // Only recalculate when data or filter changes

  // Memoize callback function
  const handleItemClick = useCallback((id) => {
    console.log('Item clicked:', id);
    // Do something with the id
  }, []); // Empty dependency array means this function never changes

  return (
    <div>
      {processedData.map(item => (
        <div 
          key={item.id} 
          onClick={() => handleItemClick(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}`}
        </code>
      </pre>

      <h3>3. Virtualization for Long Lists</h3>
      <p>
        When rendering long lists, virtualization can significantly improve performance by only rendering the items that
        are currently visible in the viewport.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React from 'react';
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}`}
        </code>
      </pre>

      <h3>4. Code Splitting and Lazy Loading</h3>
      <p>
        Code splitting allows you to split your code into smaller chunks that can be loaded on demand, reducing the
        initial load time of your application.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { Suspense, lazy } from 'react';

// Instead of importing directly
// import ExpensiveComponent from './ExpensiveComponent';

// Use lazy loading
const ExpensiveComponent = lazy(() => import('./ExpensiveComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpensiveComponent />
      </Suspense>
    </div>
  );
}`}
        </code>
      </pre>

      <h3>5. State Management Optimization</h3>
      <p>How you structure your state can significantly impact performance. Consider these strategies:</p>
      <ul>
        <li>Keep state as local as possible</li>
        <li>Use context selectively and avoid putting everything in a single context</li>
        <li>Consider using state management libraries with built-in optimizations like Zustand or Jotai</li>
      </ul>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Using Zustand for efficient state management
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));

function Counter() {
  // Only re-renders when count changes
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  const decrement = useStore(state => state.decrement);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}`}
        </code>
      </pre>

      <h2>Real-World Optimization Example</h2>
      <p>
        Let's look at a real-world example of optimizing a dashboard component that displays multiple data
        visualizations.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';

// Lazy load heavy components
const DataTable = lazy(() => import('./DataTable'));
const ChartComponent = lazy(() => import('./ChartComponent'));
const FilterPanel = lazy(() => import('./FilterPanel'));

function Dashboard({ data }) {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: 'all',
  });

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      // More filter logic...
      return true;
    });
  }, [data, filters]);

  // Memoize aggregated data for charts
  const chartData = useMemo(() => {
    return {
      categories: getCategoryCounts(filteredData),
      timeline: getTimelineData(filteredData),
      // More aggregations...
    };
  }, [filteredData]);

  // Callbacks for filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className="dashboard">
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </Suspense>
      
      <div className="dashboard-content">
        <Suspense fallback={<div>Loading chart...</div>}>
          <ChartComponent data={chartData} />
        </Suspense>
        
        <Suspense fallback={<div>Loading table...</div>}>
          <DataTable 
            data={filteredData} 
            // Use windowing for large datasets
            virtualized={filteredData.length > 100}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Helper functions
function getCategoryCounts(data) {
  // Implementation...
}

function getTimelineData(data) {
  // Implementation...
}`}
        </code>
      </pre>

      <h2>Measuring Improvements</h2>
      <p>
        After implementing optimizations, it's important to measure the impact. Use the following metrics to quantify
        improvements:
      </p>
      <ul>
        <li>
          <strong>Time to Interactive (TTI):</strong> How long it takes for the page to become fully interactive.
        </li>
        <li>
          <strong>First Contentful Paint (FCP):</strong> When the first content is painted on the screen.
        </li>
        <li>
          <strong>Largest Contentful Paint (LCP):</strong> When the largest content element is painted.
        </li>
        <li>
          <strong>Total Blocking Time (TBT):</strong> The total time the main thread is blocked.
        </li>
        <li>
          <strong>Cumulative Layout Shift (CLS):</strong> Measures visual stability.
        </li>
      </ul>

      <h2>Conclusion</h2>
      <p>Optimizing React applications requires a systematic approach:</p>
      <ol>
        <li>Identify performance bottlenecks using profiling tools</li>
        <li>Apply targeted optimizations like memoization, code splitting, and virtualization</li>
        <li>Measure the impact of your optimizations</li>
        <li>Iterate and refine</li>
      </ol>
      <p>
        Remember that premature optimization can lead to unnecessary complexity. Always measure first, then optimize
        where it matters most. By applying these techniques strategically, you can create React applications that are
        both feature-rich and performant.
      </p>
    </div>
  )
}

export default { ReactPerformanceContent }
