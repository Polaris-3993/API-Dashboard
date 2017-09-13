import { Component, OnInit } from '@angular/core';

import { ConnectorsService } from "app/core/connectors/connectors.service";
import { Connector } from "app/core/connectors/connector";
import { Observable } from "rxjs/Observable";
import { TriggersService } from "app/core/triggers/triggers.service";
import { ActionsService } from "app/core/actions/actions.service";
import { TriggerSetupComponent } from "app/routes/integration-details/trigger-setup/trigger-setup.component";

const swal = require('sweetalert');

@Component({
    selector: 'app-connectors',
    templateUrl: './connectors.component.html',
    styleUrls: ['./connectors.component.scss'],
    providers: [ConnectorsService, TriggersService, ActionsService]
})

export class ConnectorsComponent implements OnInit {
    public connectorItems: Array<Connector> = [];

    constructor(private connectorService: ConnectorsService) { }

    ngOnInit() {
        this.getListOfConnectors();
    }

    public getListOfConnectors() {
        console.log('LOAD_INTEGRATIONS_START.')
        this.connectorService
            .getAll()
            .subscribe(
            (result: Connector[]) => {
                this.connectorItems = result;
            },
            error => console.log('Error: ' + error),
            () => console.log('LOAD_INTEGRATIONS_SUCCESS.')
            );
    }

    public deleteConnector(connector: Connector) {
        connector.IsRemoving = true;
        this.connectorService.delete(connector.Id).subscribe(
            () => { },
            error => {
                connector.IsRemoving = false;
                console.error(`Error occured when delete connector by Id = ${connector.Id}`);
            },
            () => { connector.IsRemoving = false }
        );
    }

    public runIntegration(connector: Connector) {
        connector.IsRunning = true;
        this.connectorService.run(connector.Id).subscribe(
            () => { },
            error => {
                connector.IsRunning = false;
                console.error(`Error occured when run integration by Id = ${connector.Id}.`);
                console.error(error);
            },
            () => { connector.IsRunning = false; }
        );
    }

    public addIntegration() {

    }
    public deleteIntegration(connector: Connector, index) {
      var _this = this;
      swal({
          title: "Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
          _this.connectorService.delete(connector.Id).subscribe(
            () => { },
            error => {
              console.error(`Error occured when delete connector by Id = ${connector.Id}`);
            },
            () => {
              _this.connectorItems.splice(index, 1);
              swal("Deleted!", "The integration has been deleted.", "success");
            }
          );
        });
    }
}
