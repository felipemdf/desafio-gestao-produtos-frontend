import { ProdutoLojaTable } from "./produtoLojaTable.model";

export interface Produto {
  id?: number;
  descricao: string;
  custo?: number;
  imagem?: string;

  produtoLojas: ProdutoLojaTable[];
}
