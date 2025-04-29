"use client"

export const ReactPerformanceContent = () => {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <p className="lead">
        A otimização de performance é crucial para oferecer uma experiência de usuário fluida em aplicações React. Neste
        artigo, explorarei técnicas avançadas para identificar e resolver gargalos de performance.
      </p>

      <h2>Entendendo o Processo de Renderização do React</h2>
      <p>
        Antes de mergulhar nas técnicas de otimização, é essencial entender como funciona o processo de renderização do
        React. O React utiliza um DOM virtual para atualizar eficientemente o DOM real. Quando o estado ou as props de
        um componente mudam, o React cria uma nova árvore de DOM virtual, compara-a com a anterior (um processo chamado
        "diffing") e, em seguida, atualiza apenas as partes do DOM real que foram alteradas.
      </p>
      <p>Este processo ocorre em várias fases:</p>
      <ul>
        <li>
          <strong>Fase de Renderização:</strong> O React chama as funções dos seus componentes e cria uma nova árvore de
          DOM virtual.
        </li>
        <li>
          <strong>Fase de Reconciliação:</strong> O React compara o novo DOM virtual com o anterior.
        </li>
        <li>
          <strong>Fase de Commit:</strong> O React aplica as mudanças necessárias ao DOM real.
        </li>
      </ul>

      <h2>Problemas Comuns de Performance em Aplicações React</h2>
      <p>Vários problemas comuns podem levar a problemas de performance em aplicações React:</p>
      <ul>
        <li>Re-renderizações desnecessárias</li>
        <li>Cálculos caros em funções de renderização</li>
        <li>Árvores de componentes grandes</li>
        <li>Gerenciamento de estado ineficiente</li>
        <li>Uso não otimizado de contexto</li>
      </ul>

      <h2>Identificando Gargalos de Performance</h2>
      <p>
        Antes de otimizar, você precisa identificar onde estão os problemas de performance. O React fornece várias
        ferramentas para ajudar nisso:
      </p>

      <h3>React DevTools Profiler</h3>
      <p>
        O React DevTools Profiler é uma ferramenta essencial para identificar problemas de performance. Ele permite que
        você grave uma sessão da sua aplicação e veja quais componentes estão renderizando e quanto tempo eles levam.
      </p>
      <p>Para usar o Profiler:</p>
      <ol>
        <li>Instale o React DevTools no seu navegador</li>
        <li>Abra o DevTools e navegue até a aba "Profiler"</li>
        <li>Clique no botão de gravação e interaja com sua aplicação</li>
        <li>Pare a gravação e analise os resultados</li>
      </ol>

      <h3>
        Monitoramento de Performance com <code>why-did-you-render</code>
      </h3>
      <p>
        A biblioteca <code>why-did-you-render</code> ajuda a identificar re-renderizações desnecessárias em sua
        aplicação. Ela modifica o React para notificá-lo quando um componente re-renderiza quando as props ou o estado
        são os mesmos.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Configuração no ponto de entrada da sua aplicação
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Então no seu componente
class ExampleComponent extends React.Component {
  static whyDidYouRender = true;
  render() {
    return <div>{this.props.value}</div>;
  }
}`}
        </code>
      </pre>

      <h2>Técnicas de Otimização</h2>

      <h3>1. Memoização com React.memo</h3>
      <p>
        <code>React.memo</code> é um componente de ordem superior que memoriza o resultado da renderização de um
        componente. Se as props de um componente não mudaram, o React irá pular a renderização do componente e
        reutilizar o último resultado renderizado.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React from 'react';

// Sem memoização
function ExpensiveComponent({ data }) {
  console.log('Renderizando ExpensiveComponent');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// Com memoização
const MemoizedExpensiveComponent = React.memo(
  function ExpensiveComponent({ data }) {
    console.log('Renderizando MemoizedExpensiveComponent');
    return (
      <div>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
);

// Função de comparação personalizada
const areEqual = (prevProps, nextProps) => {
  return prevProps.data.length === nextProps.data.length;
};

const OptimizedComponent = React.memo(ExpensiveComponent, areEqual);`}
        </code>
      </pre>

      <h3>2. Otimizando Hooks com useMemo e useCallback</h3>
      <p>
        <code>useMemo</code> e <code>useCallback</code> são hooks que ajudam a prevenir cálculos desnecessários e
        recriações de funções.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { useState, useMemo, useCallback } from 'react';

function DataProcessor({ data, filter }) {
  // Memoizar cálculo caro
  const processedData = useMemo(() => {
    console.log('Processando dados...');
    return data.filter(item => item.name.includes(filter))
               .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, filter]); // Só recalcula quando data ou filter mudam

  // Memoizar função de callback
  const handleItemClick = useCallback((id) => {
    console.log('Item clicado:', id);
    // Fazer algo com o id
  }, []); // Array de dependências vazio significa que esta função nunca muda

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

      <h3>3. Virtualização para Listas Longas</h3>
      <p>
        Ao renderizar listas longas, a virtualização pode melhorar significativamente o desempenho, renderizando apenas
        os itens que estão atualmente visíveis na viewport.
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

      <h3>4. Code Splitting e Lazy Loading</h3>
      <p>
        O code splitting permite que você divida seu código em pedaços menores que podem ser carregados sob demanda,
        reduzindo o tempo de carregamento inicial da sua aplicação.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { Suspense, lazy } from 'react';

// Em vez de importar diretamente
// import ExpensiveComponent from './ExpensiveComponent';

// Use lazy loading
const ExpensiveComponent = lazy(() => import('./ExpensiveComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Carregando...</div>}>
        <ExpensiveComponent />
      </Suspense>
    </div>
  );
}`}
        </code>
      </pre>

      <h3>5. Otimização do Gerenciamento de Estado</h3>
      <p>Como você estrutura seu estado pode impactar significativamente o desempenho. Considere estas estratégias:</p>
      <ul>
        <li>Mantenha o estado o mais local possível</li>
        <li>Use o contexto seletivamente e evite colocar tudo em um único contexto</li>
        <li>Considere usar bibliotecas de gerenciamento de estado com otimizações integradas como Zustand ou Jotai</li>
      </ul>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Usando Zustand para gerenciamento de estado eficiente
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}));

function Counter() {
  // Só re-renderiza quando count muda
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

      <h2>Exemplo de Otimização do Mundo Real</h2>
      <p>
        Vamos olhar para um exemplo do mundo real de otimização de um componente de dashboard que exibe múltiplas
        visualizações de dados.
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';

// Lazy load de componentes pesados
const DataTable = lazy(() => import('./DataTable'));
const ChartComponent = lazy(() => import('./ChartComponent'));
const FilterPanel = lazy(() => import('./FilterPanel'));

function Dashboard({ data }) {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: 'all',
  });

  // Memoizar dados filtrados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      // Mais lógica de filtro...
      return true;
    });
  }, [data, filters]);

  // Memoizar dados agregados para gráficos
  const chartData = useMemo(() => {
    return {
      categories: getCategoryCounts(filteredData),
      timeline: getTimelineData(filteredData),
      // Mais agregações...
    };
  }, [filteredData]);

  // Callbacks para mudanças de filtro
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className="dashboard">
      <Suspense fallback={<div>Carregando filtros...</div>}>
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </Suspense>
      
      <div className="dashboard-content">
        <Suspense fallback={<div>Carregando gráfico...</div>}>
          <ChartComponent data={chartData} />
        </Suspense>
        
        <Suspense fallback={<div>Carregando tabela...</div>}>
          <DataTable 
            data={filteredData} 
            // Usar virtualização para grandes conjuntos de dados
            virtualized={filteredData.length > 100}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Funções auxiliares
function getCategoryCounts(data) {
  // Implementação...
}

function getTimelineData(data) {
  // Implementação...
}`}
        </code>
      </pre>

      <h2>Medindo Melhorias</h2>
      <p>
        Após implementar otimizações, é importante medir o impacto. Use as seguintes métricas para quantificar
        melhorias:
      </p>
      <ul>
        <li>
          <strong>Time to Interactive (TTI):</strong> Quanto tempo leva para a página se tornar totalmente interativa.
        </li>
        <li>
          <strong>First Contentful Paint (FCP):</strong> Quando o primeiro conteúdo é pintado na tela.
        </li>
        <li>
          <strong>Largest Contentful Paint (LCP):</strong> Quando o maior elemento de conteúdo é pintado.
        </li>
        <li>
          <strong>Total Blocking Time (TBT):</strong> O tempo total que a thread principal está bloqueada.
        </li>
        <li>
          <strong>Cumulative Layout Shift (CLS):</strong> Mede a estabilidade visual.
        </li>
      </ul>

      <h2>Conclusão</h2>
      <p>Otimizar aplicações React requer uma abordagem sistemática:</p>
      <ol>
        <li>Identifique gargalos de performance usando ferramentas de criação de perfil</li>
        <li>Aplique otimizações direcionadas como memoização, code splitting e virtualização</li>
        <li>Meça o impacto das suas otimizações</li>
        <li>Itere e refine</li>
      </ol>
      <p>
        Lembre-se que a otimização prematura pode levar a uma complexidade desnecessária. Sempre meça primeiro, depois
        otimize onde mais importa. Aplicando essas técnicas estrategicamente, você pode criar aplicações React que são
        ricas em recursos e performáticas.
      </p>
    </div>
  )
}

export default { ReactPerformanceContent }
