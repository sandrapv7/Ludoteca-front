import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { LoanService } from '../loan.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { ClientService } from 'src/app/client/client.service';
import { GameService } from 'src/app/game/game.service';
import { Client } from 'src/app/client/model/Client';
import { Game } from 'src/app/game/model/Game';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { PageEvent } from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import { LoanSearchDto } from '../model/LoanSearchDto';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})

export class LoanListComponent implements OnInit{
    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'game', 'client', 'dateStart', 'dateEnd', 'action'];
    clients: Client[];
    games: Game[];
    filterClient: Client;
    filterGame: Game;
    filterDate: Date;
    loans: Loan[];

    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    serializedDate = new FormControl((new Date()).toISOString());
    loanSearchDto: LoanSearchDto;

    constructor(
        private loanService: LoanService,
        public dialog: MatDialog,
        private gameService: GameService,
        private clientService: ClientService
    ) { }

    ngOnInit(): void {
      this.clientService.getClients().subscribe(clients => this.clients = clients);
      this.gameService.getGames().subscribe(games => this.games = games);
      this.loadPage(); 
    }

    loadPage(event?: PageEvent) {

      let pageable : Pageable =  {

          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: [{
              property: 'id',
              direction: 'ASC'
          }]
      }

      if (event != null) {
          pageable.pageSize = event.pageSize
          pageable.pageNumber = event.pageIndex;
      }

      this.loanSearchDto = this.loanSearchDto || { pageable: pageable };  
      this.loanSearchDto.pageable = pageable

      let gameId = this.filterGame != null ? this.filterGame.id : null;
      let clientId = this.filterClient != null ? this.filterClient.id : null;
      let date = this.filterDate;

      this.loanService.findLoans(this.loanSearchDto, gameId, clientId, date)
             .subscribe(data => {
               this.dataSource.data = data.content;
               this.pageNumber = data.pageable.pageNumber;
               this.pageSize = data.pageable.pageSize;
               this.totalElements = data.totalElements;
             });

    }  

    createLoan() {    
      const dialogRef = this.dialog.open(LoanEditComponent, {
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadPage();
      });    
    } 

    deleteLoan(loan: Loan) {    
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { title: "Eliminar préstamo", description: "Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(loan.id);
          this.loanService.deleteLoan(loan.id).subscribe(result => {
            this.ngOnInit();
          }); 
        }
      });
    } 

    onCleanFilter(): void {
        this.filterClient = null;
        this.filterGame = null;
        this.filterDate = null;
        this.onSearch();
        
    }
    
    onSearch(): void {
        this.loadPage();
    }

}
