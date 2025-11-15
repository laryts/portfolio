"use client"

export const MobileDevTipsContent = () => {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <p className="lead">
        After years of working with React Native, I've compiled a list of best practices that can help you build more
        maintainable and performant mobile applications.
      </p>

      <h2>The Evolution of React Native</h2>
      <p>
        React Native has come a long way since its initial release in 2015. With the introduction of the new
        architecture (Fabric and TurboModules), improved TypeScript support, and a growing ecosystem of libraries, React
        Native has matured into a robust platform for building cross-platform mobile applications.
      </p>
      <p>
        In 2024, React Native continues to evolve with better performance, improved developer experience, and closer
        parity with native platforms. This article shares best practices based on my experience working with React
        Native in production applications.
      </p>

      <h2>Project Structure and Organization</h2>
      <p>A well-organized project structure is the foundation of a maintainable React Native application.</p>

      <h3>Recommended Project Structure</h3>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`my-app/
├── src/
│   ├── api/                # API related code
│   ├── assets/             # Static assets
│   ├── components/         # Reusable components
│   │   ├── common/         # Truly reusable components
│   │   └── screens/        # Screen-specific components
│   ├── constants/          # App constants
│   ├── hooks/              # Custom hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   ├── services/           # Business logic
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── App.tsx                 # Entry point
└── index.js                # Register application`}
        </code>
      </pre>

      <h3>Feature-Based Organization</h3>
      <p>For larger applications, consider organizing by feature instead of technical role:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`my-app/
├── src/
│   ├── common/             # Shared code
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── profile/
│   │   ├── messaging/
│   │   └── ...
│   ├── navigation/
│   └── store/
├── App.tsx
└── index.js`}
        </code>
      </pre>

      <h2>TypeScript Best Practices</h2>
      <p>
        TypeScript has become the standard for React Native development, providing type safety and better developer
        experience.
      </p>

      <h3>Strict Type Checking</h3>
      <p>
        Enable strict type checking in your <code>tsconfig.json</code>:
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    // Other options...
  }
}`}
        </code>
      </pre>

      <h3>Type Definitions for Props</h3>
      <p>Define clear interfaces for component props:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Bad practice
const Button = (props) => {
  // ...
};

// Good practice
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline-solid';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  // ...
};`}
        </code>
      </pre>

      <h3>Type Utilities</h3>
      <p>Leverage TypeScript's utility types to create more flexible and reusable types:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/types/common.ts
import { TextStyle, ViewStyle } from 'react-native';

// Make all properties optional
export type PartialViewStyle = Partial<ViewStyle>;

// Pick specific properties
export type LayoutStyle = Pick<ViewStyle, 'margin' | 'padding' | 'width' | 'height'>;

// Combine types
export type TextWithLayoutStyle = TextStyle & LayoutStyle;

// Create a type for theme-aware components
export type ThemeVariant = 'light' | 'dark';
export type ThemedStyles<T> = Record<ThemeVariant, T>;

// Usage example
const styles: ThemedStyles<{
  container: ViewStyle;
  text: TextStyle;
}> = {
  light: {
    container: { backgroundColor: '#ffffff' },
    text: { color: '#000000' },
  },
  dark: {
    container: { backgroundColor: '#121212' },
    text: { color: '#ffffff' },
  },
};`}
        </code>
      </pre>

      <h2>Performance Optimization</h2>
      <p>
        Performance is critical for mobile applications. Here are some best practices to ensure your React Native app
        runs smoothly.
      </p>

      <h3>1. Memoization</h3>
      <p>Use React's memoization features to prevent unnecessary re-renders:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Memoize components
const MemoizedComponent = React.memo(MyComponent);

// Memoize callback functions
const handlePress = useCallback(() => {
  // Handle press event
}, [/* dependencies */]);

// Memoize expensive calculations
const processedData = useMemo(() => {
  return data.map(item => processItem(item));
}, [data]);`}
        </code>
      </pre>

      <h3>2. Virtualized Lists</h3>
      <p>
        Always use <code>FlatList</code>, <code>SectionList</code>, or <code>FlashList</code> for rendering lists:
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Bad practice
<ScrollView>
  {items.map(item => (
    <ItemComponent key={item.id} item={item} />
  ))}
</ScrollView>

// Good practice
<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// Even better with FlashList (from Shopify)
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  estimatedItemSize={100}
  keyExtractor={item => item.id}
/>`}
        </code>
      </pre>

      <h3>3. Image Optimization</h3>
      <p>Optimize images to reduce bundle size and improve loading times:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Use appropriate image resolutions
<Image
  source={{
    uri: 'https://example.com/image.jpg',
    width: 300,
    height: 200,
  }}
  style={{ width: 150, height: 100 }}
/>

// Use FastImage for better caching
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: 'https://example.com/image.jpg',
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
  style={{ width: 150, height: 100 }}
/>

// Lazy load images that are not immediately visible
const LazyImage = ({ uri, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <View>
      {!loaded && <ActivityIndicator />}
      <Image
        source={{ uri }}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </View>
  );
};`}
        </code>
      </pre>

      <h3>4. Avoid Anonymous Functions in Render</h3>
      <p>Define functions outside the render method to prevent unnecessary re-creations:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Bad practice
const MyComponent = ({ onPress, item }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      style={{ opacity: item.disabled ? 0.5 : 1 }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
};

// Good practice
const MyComponent = ({ onPress, item }) => {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [onPress, item.id]);

  const opacityStyle = useMemo(() => ({
    opacity: item.disabled ? 0.5 : 1
  }), [item.disabled]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={opacityStyle}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
};`}
        </code>
      </pre>

      <h2>State Management</h2>
      <p>
        Choosing the right state management solution is crucial for building maintainable React Native applications.
      </p>

      <h3>Local State with useState and useReducer</h3>
      <p>For simple components, local state is often sufficient:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
};

// For more complex state logic, use useReducer
const initialState = { count: 0, lastUpdated: null };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, lastUpdated: new Date() };
    case 'decrement':
      return { ...state, count: state.count - 1, lastUpdated: new Date() };
    default:
      throw new Error();
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <View>
      <Text>{state.count}</Text>
      <Text>Last updated: {state.lastUpdated?.toLocaleString()}</Text>
      <Button title="Increment" onPress={() => dispatch({ type: 'increment' })} />
      <Button title="Decrement" onPress={() => dispatch({ type: 'decrement' })} />
    </View>
  );
};`}
        </code>
      </pre>

      <h3>Global State Management</h3>
      <p>For global state, consider modern alternatives to Redux:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Zustand - Simple, fast state management
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

const Counter = () => {
  const { count, increment, decrement } = useStore();
  
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={increment} />
      <Button title="Decrement" onPress={decrement} />
    </View>
  );
};

// Jotai - Atomic state management
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);

const Counter = () => {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} />
    </View>
  );
};`}
        </code>
      </pre>

      <h2>Navigation Best Practices</h2>
      <p>React Navigation is the standard for navigation in React Native apps. Here are some best practices:</p>

      <h3>Typed Navigation</h3>
      <p>Use TypeScript to ensure type safety in your navigation:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/navigation/types.ts
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string; username: string };
  Settings: undefined;
  ProductDetails: { productId: string };
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

// Usage in a screen component
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackRouteProp } from '../navigation/types';

const ProfileScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Profile'>>();
  const route = useRoute<RootStackRouteProp<'Profile'>>();
  
  const { userId, username } = route.params;
  
  return (
    <View>
      <Text>Profile of {username}</Text>
      <Button 
        title="Go to Settings" 
        onPress={() => navigation.navigate('Settings')} 
      />
    </View>
  );
};`}
        </code>
      </pre>

      <h3>Navigation Structure</h3>
      <p>Organize your navigation structure for clarity and maintainability:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/navigation/index.tsx
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAuth } from '../hooks/useAuth';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// src/navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} />
    </Tab.Navigator>
  );
};

// src/navigation/HomeStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};`}
        </code>
      </pre>

      <h2>Testing Strategies</h2>
      <p>A comprehensive testing strategy is essential for maintaining a high-quality React Native application.</p>

      <h3>Unit Testing with Jest</h3>
      <p>Test individual functions and components:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/utils/formatCurrency.test.ts
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });
  
  it('formats EUR correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });
  
  it('handles zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});

// src/components/Button/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Press me" onPress={jest.fn()} />);
    expect(getByText('Press me')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Press me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  
  it('applies disabled styling when disabled', () => {
    const { getByText } = render(<Button title="Press me" onPress={jest.fn()} disabled />);
    const buttonElement = getByText('Press me');
    
    // Check that the opacity style is applied
    expect(buttonElement.parent.props.style).toMatchObject({ opacity: 0.5 });
  });
});`}
        </code>
      </pre>

      <h3>Component Testing with React Native Testing Library</h3>
      <p>Test component behavior and interactions:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// src/components/Counter/Counter.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    const { getByText } = render(<Counter />);
    expect(getByText('0')).toBeTruthy();
  });
  
  it('increments count when increment button is pressed', () => {
    const { getByText } = render(<Counter />);
    
    fireEvent.press(getByText('Increment'));
    expect(getByText('1')).toBeTruthy();
  });
  
  it('decrements count when decrement button is pressed', () => {
    const { getByText } = render(<Counter />);
    
    // First increment to 1
    fireEvent.press(getByText('Increment'));
    expect(getByText('1')).toBeTruthy();
    
    // Then decrement back to 0
    fireEvent.press(getByText('Decrement'));
    expect(getByText('0')).toBeTruthy();
  });
});`}
        </code>
      </pre>

      <h3>E2E Testing with Detox</h3>
      <p>Test the entire application flow:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// e2e/login.test.js
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    // Verify that we're on the home screen
    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();
    
    // Verify that error message is shown
    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});`}
        </code>
      </pre>

      <h2>Accessibility</h2>
      <p>
        Making your app accessible is not just a best practice—it's a responsibility. React Native provides several APIs
        to improve accessibility:
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Accessible button
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Tap to like this post"
  accessibilityHint="Marks this post as liked"
  accessibilityRole="button"
  onPress={handleLike}
>
  <Text>Like</Text>
</TouchableOpacity>

// Screen reader announcements
import { AccessibilityInfo } from 'react-native';

const announceSuccess = () => {
  AccessibilityInfo.announceForAccessibility('Form submitted successfully');
};

// Accessibility testing
import { axe } from 'jest-axe';
import { render } from '@testing-library/react-native';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`}
        </code>
      </pre>

      <h2>Handling Deep Linking</h2>
      <p>Deep linking allows users to navigate directly to specific content in your app from external sources:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// In your navigation container
import { NavigationContainer } from '@react-navigation/native';
import { linking } from './linking';

export const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      {/* ... */}
    </NavigationContainer>
  );
};

// linking.js
export const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: {
        path: 'profile/:userId',
        parse: {
          userId: (userId) => userId,
        },
      },
      ProductDetails: {
        path: 'product/:productId',
        parse: {
          productId: (productId) => productId,
        },
      },
    },
  },
};

// Testing deep links
import { Linking } from 'react-native';

// Open a URL
Linking.openURL('myapp://profile/123');

// Handle incoming links
Linking.addEventListener('url', ({ url }) => {
  // Parse the URL and navigate accordingly
});`}
        </code>
      </pre>

      <h2>Handling Offline Support</h2>
      <p>Mobile apps should work even when the user is offline:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Network status monitoring
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);
  
  return isConnected;
};

// Offline-first data fetching with React Query and AsyncStorage
import { useQuery, useMutation, useQueryClient } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts, createProduct } from '../api/products';

// Custom hook for offline-first data fetching
export const useProducts = () => {
  const queryClient = useQueryClient();
  const isConnected = useNetworkStatus();
  
  // Fetch products with offline support
  const { data: products, isLoading, error } = useQuery(
    'products',
    async () => {
      if (isConnected) {
        // Online: fetch from API and cache
        const products = await fetchProducts();
        await AsyncStorage.setItem('products', JSON.stringify(products));
        return products;
      } else {
        // Offline: load from cache
        const cachedProducts = await AsyncStorage.getItem('products');
        return cachedProducts ? JSON.parse(cachedProducts) : [];
      }
    },
    {
      // Keep cached data when offline
      staleTime: isConnected ? 60000 : Infinity,
    }
  );
  
  // Create product with offline support
  const mutation = useMutation(
    async (newProduct) => {
      if (isConnected) {
        // Online: send to API
        return await createProduct(newProduct);
      } else {
        // Offline: store in pending queue
        const pendingProducts = JSON.parse(
          await AsyncStorage.getItem('pendingProducts') || '[]'
        );
        pendingProducts.push(newProduct);
        await AsyncStorage.setItem('pendingProducts', JSON.stringify(pendingProducts));
        throw new Error('Offline mode: Product will be created when online');
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries('products');
      },
    }
  );
  
  return {
    products,
    isLoading,
    error,
    createProduct: mutation.mutate,
    isCreating: mutation.isLoading,
    createError: mutation.error,
  };
};`}
        </code>
      </pre>

      <h2>Conclusion</h2>
      <p>
        React Native continues to evolve as a powerful platform for building cross-platform mobile applications. By
        following these best practices, you can create maintainable, performant, and user-friendly apps that provide a
        great experience across different devices.
      </p>
      <p>
        Remember that best practices are guidelines, not rules. Always consider your specific use case and requirements
        when making architectural decisions. Stay up-to-date with the React Native ecosystem, as new tools and patterns
        emerge regularly that can help you build better apps.
      </p>
      <p>Happy coding!</p>
    </div>
  )
}

export default { MobileDevTipsContent }
