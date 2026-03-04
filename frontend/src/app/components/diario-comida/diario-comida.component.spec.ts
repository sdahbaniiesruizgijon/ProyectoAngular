import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioComidaComponent } from './diario-comida.component';

describe('DiarioComidaComponent', () => {
  let component: DiarioComidaComponent;
  let fixture: ComponentFixture<DiarioComidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiarioComidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarioComidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
