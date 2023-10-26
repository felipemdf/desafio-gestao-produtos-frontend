import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css'],
})
export class CadastroProdutoComponent implements OnInit {
  formControl!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formControl = this.formBuilder.group({
      codigo: null,
      descricao: [null, Validators.required],
      custo: null,
    });
  }

  submit() {
    console.log('TESTANDO');

    if (!this.formControl.valid) {
      return;
    }

    console.log(this.formControl.value);
  }
}
