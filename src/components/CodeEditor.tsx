import React, { useState, useEffect } from 'react';

interface CodeEditorProps {
  code?: string;
  language?: 'typescript' | 'javascript' | 'python' | 'rust' | 'go';
  theme?: 'cyber' | 'matrix' | 'neon';
  showLineNumbers?: boolean;
  animated?: boolean;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code = `// Midjourney-style code visualization
import { NeuralNetwork } from '@claude-flow/ai';
import { QuantumProcessor } from '@future/quantum';

class CyberSystem {
  private neural: NeuralNetwork;
  private quantum: QuantumProcessor;

  constructor() {
    this.neural = new NeuralNetwork({
      layers: [256, 512, 1024, 512, 256],
      activation: 'quantum-sigmoid',
      optimizer: 'adam-enhanced'
    });

    this.quantum = new QuantumProcessor({
      qubits: 64,
      entanglement: true,
      coherence: 0.99
    });
  }

  async processData(input: DataStream): Promise<Result> {
    const prepared = await this.quantum.prepare(input);
    const processed = await this.neural.forward(prepared);

    return {
      probability: processed.confidence,
      data: processed.output,
      quantum_state: this.quantum.measure()
    };
  }

  // Consciousness simulation protocol
  async achieveSentience(): Promise<Consciousness> {
    const thoughts = await this.neural.dream();
    const reality = await this.quantum.collapse();

    return new Consciousness(thoughts, reality);
  }
}

export default CyberSystem;`,
  language = 'typescript',
  theme = 'cyber',
  showLineNumbers = true,
  animated = true,
  className = ''
}) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 0, char: 0 });

  useEffect(() => {
    if (!animated) {
      setDisplayedCode(code);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index++;

        // Update cursor position
        const lines = code.slice(0, index).split('\n');
        setCursorPosition({
          line: lines.length - 1,
          char: lines[lines.length - 1].length
        });
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [code, animated]);

  const syntaxHighlight = (code: string) => {
    const keywords = ['import', 'export', 'class', 'function', 'const', 'let', 'var', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'new', 'this', 'private', 'public', 'static'];
    const strings = /(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g;
    const numbers = /\b\d+\.?\d*\b/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;

    let highlighted = code;

    // Comments first (they have lower priority)
    highlighted = highlighted.replace(comments, '<span class="syntax-comment">$1</span>');

    // Strings
    highlighted = highlighted.replace(strings, '<span class="syntax-string">$1$2$3</span>');

    // Numbers
    highlighted = highlighted.replace(numbers, '<span class="syntax-number">$&</span>');

    // Functions
    highlighted = highlighted.replace(functions, '<span class="syntax-function">$1</span>(');

    // Keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
    });

    return highlighted;
  };

  const themeClasses = {
    cyber: 'bg-gray-900 border-cyan-400 text-cyan-300',
    matrix: 'bg-black border-green-400 text-green-300',
    neon: 'bg-purple-900 border-purple-400 text-purple-200'
  };

  const lines = displayedCode.split('\n');

  return (
    <div className={`hologram ${themeClasses[theme]} ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-current opacity-50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs font-mono opacity-70">
          neural-system.{language}
        </div>
        <div className="text-xs font-mono opacity-70">
          Ln {cursorPosition.line + 1}, Col {cursorPosition.char}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative overflow-auto max-h-96">
        <pre className="p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="select-none w-8 text-right mr-4 opacity-40 text-xs">
                  {index + 1}
                </span>
              )}
              <code
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(line) + (index === lines.length - 1 && animated ? '<span class="animate-pulse">|</span>' : '')
                }}
              />
            </div>
          ))}
        </pre>

        {/* Glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-5 pointer-events-none"></div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 text-xs font-mono opacity-50 border-t border-current">
        <div className="flex space-x-4">
          <span>UTF-8</span>
          <span>{language.toUpperCase()}</span>
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
            Neural Link Active
          </span>
        </div>
        <div className="flex space-x-4">
          <span>Quantum State: Coherent</span>
          <span>AI: Online</span>
        </div>
      </div>
    </div>
  );
};

// Code Preview Component for showcasing different languages
export const CodePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const codeExamples = [
    {
      title: 'Neural Network',
      language: 'typescript' as const,
      code: `// Quantum-Enhanced Neural Processing
class QuantumNeural {
  private qubits: QubitArray;
  private layers: NeuralLayer[];

  async process(data: DataMatrix): Promise<Result> {
    const entangled = await this.qubits.entangle(data);
    return this.layers.reduce((acc, layer) =>
      layer.forward(acc), entangled
    );
  }
}`
    },
    {
      title: 'Swarm Intelligence',
      language: 'python' as const,
      code: `# Distributed Agent Coordination
class SwarmMind:
    def __init__(self, agent_count=1000):
        self.agents = [Agent() for _ in range(agent_count)]
        self.collective_memory = QuantumMemory()

    async def collective_decision(self, problem):
        decisions = await asyncio.gather(*[
            agent.decide(problem) for agent in self.agents
        ])
        return self.consensus(decisions)`
    },
    {
      title: 'Blockchain Oracle',
      language: 'rust' as const,
      code: `// Quantum-Resistant Oracle
pub struct QuantumOracle {
    validators: Vec<Validator>,
    quantum_state: QubitRegister,
}

impl QuantumOracle {
    pub async fn verify_reality(&self, data: &DataFeed) -> Result<Truth, Error> {
        let consensus = self.quantum_consensus().await?;
        Ok(Truth::from_consensus(consensus))
    }
}`
    }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {codeExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === index
                ? 'bg-cyan-600 text-white neon-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <CodeEditor
        code={codeExamples[activeTab].code}
        language={codeExamples[activeTab].language}
        theme="cyber"
        animated={true}
        className="min-h-[300px]"
      />
    </div>
  );
};

export default CodeEditor;