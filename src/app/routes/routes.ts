import { LayoutComponent } from '../layout/layout.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'connectors', pathMatch: 'full' },
            { path: 'connectors', loadChildren: './connectors/connectors.module#ConnectorsModule' },
            { path: 'integration-details', loadChildren: './integration-details/integration.details.module#IntegrationDetailsModule' },
            { path: 'integration-details/:id', loadChildren: './integration-details/integration.details.module#IntegrationDetailsModule' }
        ]
    },

    // Not found
    { path: '**', redirectTo: 'connectors' }

];
