import { NgModule } from '@angular/core';
import { ConnectorsComponent } from './connectors/connectors.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { FormatTriggerNamePipe } from './pipes/format-trigger-name.pipe';

const routes: Routes = [
    { path: '', component: ConnectorsComponent }
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes)
    ],
    declarations: [ ConnectorsComponent, FormatTriggerNamePipe ],
    exports: [
        RouterModule
    ]
})
export class ConnectorsModule { }