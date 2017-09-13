import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { IntegrationDetailsService } from "app/core/integration-details/integration-details.service";
import { ActionSetupComponent } from "app/routes/integration-details/action-setup/action-setup.component";
import { IntegrationDetailsComponent } from "app/routes/integration-details/integration-details.component";
import { TriggerSetupComponent } from "app/routes/integration-details/trigger-setup/trigger-setup.component";
import { BusyModule } from 'angular2-busy';

import { CodemirrorModule } from 'ng2-codemirror';

const routes: Routes = [
    { path: '', component: IntegrationDetailsComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        CodemirrorModule,
        BusyModule
    ],
    declarations: [
        IntegrationDetailsComponent,
        TriggerSetupComponent,
        ActionSetupComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [TriggerSetupComponent, ActionSetupComponent],
    providers: [IntegrationDetailsService]
})
export class IntegrationDetailsModule { }