import { parse } from '@typescript-eslint/typescript-estree';
import { Node } from '@typescript-eslint/types';

interface CodeChunk {
  content: string;
  startLine: number;
  endLine: number;
  type: string;
}

class CodeChunker {
  private static MAX_CHUNK_TOKENS = 200;
  private static MIN_CHUNK_TOKENS = 50;

  static chunkTypeScriptCode(code: string): CodeChunk[] {
    try {
      const ast = parse(code, {
        loc: true,
        range: true,
        comment: true,
        jsx: true,
      });

      const chunks: CodeChunk[] = [];
      const lines = code.split('\n');

      // Traverse AST and extract meaningful chunks
      const extractChunks = (node: Node) => {
        // Focus on function declarations, class methods, interfaces, type definitions
        const interestingNodeTypes = [
          'FunctionDeclaration', 
          'MethodDefinition', 
          'ClassDeclaration', 
          'InterfaceDeclaration', 
          'TypeAlias'
        ];

        if (interestingNodeTypes.includes(node.type) && node.loc) {
          const content = lines.slice(node.loc.start.line - 1, node.loc.end.line).join('\n');
          chunks.push({
            content,
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
            type: node.type
          });
        }
      };

      // Recursive AST traversal
      const traverse = (node: Node) => {
        extractChunks(node);
        for (const key in node) {
          if (node[key] && typeof node[key] === 'object') {
            if (Array.isArray(node[key])) {
              node[key].forEach((child: Node) => {
                if (child && typeof child === 'object') {
                  traverse(child);
                }
              });
            } else {
              traverse(node[key]);
            }
          }
        }
      };

      traverse(ast);

      return chunks.length > 0 ? chunks : this.fallbackChunking(code);
    } catch (error) {
      console.warn('AST parsing failed, falling back to simple chunking:', error);
      return this.fallbackChunking(code);
    }
  }

  private static fallbackChunking(code: string): CodeChunk[] {
    const lines = code.split('\n');
    const chunks: CodeChunk[] = [];
    
    for (let i = 0; i < lines.length; i += this.MAX_CHUNK_TOKENS) {
      const chunkLines = lines.slice(i, i + this.MAX_CHUNK_TOKENS);
      chunks.push({
        content: chunkLines.join('\n'),
        startLine: i + 1,
        endLine: i + chunkLines.length,
        type: 'fallback'
      });
    }

    return chunks;
  }

  static async generateChunks(code: string, language: string = 'typescript'): Promise<CodeChunk[]> {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'ts':
      case 'tsx':
        return this.chunkTypeScriptCode(code);
      default:
        return this.fallbackChunking(code);
    }
  }
}

export { CodeChunker, CodeChunk }; 