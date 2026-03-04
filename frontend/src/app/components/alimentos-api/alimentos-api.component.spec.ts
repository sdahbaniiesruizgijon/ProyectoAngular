import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentosApiComponent } from './alimentos-api.component';

describe('AlimentosApiComponent', () => {
  let component: AlimentosApiComponent;
  let fixture: ComponentFixture<AlimentosApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlimentosApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlimentosApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
