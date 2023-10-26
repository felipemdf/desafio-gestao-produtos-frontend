import { ProdutoLoja } from './ProdutoLoja.model';

export interface Produto {
  id: number;
  descricao: string;
  custo?: number;
  imagem?: string;

  produtoLojas: ProdutoLoja[];
}
