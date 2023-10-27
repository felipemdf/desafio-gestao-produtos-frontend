import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Produto } from 'src/app/models/produto.model';
import { ProdutoLoja } from 'src/app/models/produtoLoja.model';
import { LojaService } from 'src/app/services/loja.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { PrecoLojaDialogComponent } from 'src/app/shared/dialogs/preco-loja-dialog/preco-loja-dialog.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

const DATA: ProdutoLoja[] = [
  { idLoja: 1, descricao: '1-LOJA 1', precoVenda: 5.5 },
  { idLoja: 2, descricao: '2-LOJA 2', precoVenda: 8.0 },
  { idLoja: 3, descricao: '3-LOJA 3', precoVenda: 3.55 },
];

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css'],
  providers: [ProdutoService],
})
export class CadastroProdutoComponent implements OnInit {
  displayedColumns: string[] = ['descricao', 'precoVenda', 'acoes'];
  dataSource = new MatTableDataSource<ProdutoLoja>();

  formControl!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.configForm();

    this.dataSource.data = this.formControl.get('produtoLojas')?.value || [];
  }

  configForm() {
    this.formControl = this.formBuilder.group({
      id: null,
      descricao: [null, Validators.required],
      custo: [null],
      imagem: new FormControl(null),
      produtoLojas: this.formBuilder.array<ProdutoLoja>([]),
    });
  }

  updateTable(produtoLojas?: ProdutoLoja[]) {
    if (!produtoLojas) {
      const produtoLojasForm = this.formControl.get(
        'produtoLojas'
      ) as FormArray;
      produtoLojas = produtoLojasForm.value;
    }

    this.dataSource.data = produtoLojas!;
  }

  validatePrecoLojas(
    produtoLojasForm: ProdutoLoja[],
    novoPrecoLoja: ProdutoLoja
  ): boolean {
    const isValido = !produtoLojasForm.some(
      (produtoLoja) => produtoLoja.idLoja == novoPrecoLoja.idLoja
    );

    if (!isValido) {
      this.snackbar.showSnackbar(
        'Não é permitido mais que um preço de venda para a mesma loja.',
        5
      );
      return false;
    }

    return true;
  }

  openDialog(data?: ProdutoLoja): void {
    const dialogRef = this.dialog.open(PrecoLojaDialogComponent, {
      data: data,
      width: '60%',
      height: '50%',
    });

    dialogRef.afterClosed().subscribe((response: ProdutoLoja) => {
      if (!response.idLoja) return;

      this.removePrecoLoja(response.idLoja);
      this.addPrecoLoja(response);
    });
  }

  addPrecoLoja(produtoLoja: ProdutoLoja) {
    const produtoLojasForm = this.formControl.get('produtoLojas') as FormArray;

    if (this.validatePrecoLojas(produtoLojasForm.value, produtoLoja)) {
      produtoLojasForm.push(this.formBuilder.group(produtoLoja));
      this.formControl.patchValue({ produtosLoja: produtoLojasForm.value });

      this.updateTable(produtoLojasForm.value);
    }
  }

  removePrecoLoja(idLoja: number) {
    const produtoLojasForm = this.formControl.get('produtoLojas') as FormArray;
    const index = produtoLojasForm.controls.findIndex(
      (control) => control.value.idLoja === idLoja
    );

    if (index !== -1) {
      produtoLojasForm.removeAt(index);
      this.formControl.patchValue({ produtosLoja: produtoLojasForm.value });

      this.updateTable(this.formControl.value.produtoLojas);
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files![0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.formControl.patchValue({ imagem: e.target?.result });
      };

      reader.readAsDataURL(file);
    }
  }

  onRemoveImage() {
    this.formControl.patchValue({ imagem: null });
  }

  submit() {
    if (!this.formControl.valid) {
      this.snackbar.showSnackbar(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        5
      );
      return;
    }

    console.log(this.formControl.value);

    this.produtoService.create(this.formControl.value).subscribe(
      () => {
        this.router.navigate(['/produto']);
      },
      (error) => {
        this.snackbar.showSnackbar(error.error.message[0], 5);
        console.error(error.error)
      }
    );
  }

  // getImagemURL(): SafeUrl {
  //   if (this.imagem) {
  //     const blob = new Blob([this.imagem]);
  //     const url = URL.createObjectURL(blob);

  //     return url;
  //   }
  //   return '';
  //
}
