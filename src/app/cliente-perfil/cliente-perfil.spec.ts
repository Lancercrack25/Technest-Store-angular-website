import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePerfil } from './cliente-perfil';

describe('ClientePerfil', () => {
  let component: ClientePerfil;
  let fixture: ComponentFixture<ClientePerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientePerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientePerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
