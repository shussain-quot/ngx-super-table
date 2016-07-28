import { Component, Input, ComponentResolver, ComponentRef, Injector, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ColumnState } from './SuperTableState';

@Component({
  selector: '[table-cell]',
  template: `
    <span *ngIf="!column.def.component" [attr.title]="getValue()">{{ getValue() }}</span>
    <span *ngIf="column.def.component" #cmpContainer></span>
  `,
  styles: [`
    :host {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  `]
})
export class TableCell implements OnInit {
  @Input() row: any;
  @Input() column: ColumnState;
  @ViewChild('cmpContainer', { read: ViewContainerRef }) cmpContainer: ViewContainerRef;
  getValue () : any {
    return this.row[this.column.def.key];
  }
  constructor(private viewContainer: ViewContainerRef, private resolver: ComponentResolver) {}

  ngOnInit () : void {
    if (this.column.def.component) {
      this.resolver.resolveComponent(this.column.def.component)
        .then(cmpFactory => {
          const ctxInjector: Injector = this.cmpContainer.injector;
          const cmpRef: ComponentRef<any> = this.cmpContainer.createComponent(cmpFactory, 0, ctxInjector);
          const instance: ComponentRef<any> = cmpRef.instance;
          instance['row'] = this.row;
          instance['column'] = this.column;
          instance['key'] = this.column.def.key;
          instance['value'] = this.getValue();
          return cmpRef;
        });
    }
  }
}