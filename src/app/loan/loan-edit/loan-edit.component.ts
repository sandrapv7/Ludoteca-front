import { Component, OnInit} from '@angular/core';
import { Loan } from '../model/Loan'
import { LoanService } from '../loan.service'
import { MatDialogRef } from '@angular/material/dialog';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { GameService } from 'src/app/game/game.service';

@Component({
  selector: 'app-loan-edit',
  templateUrl: './loan-edit.component.html',
  styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

  loan : Loan;
  games: Game[];
  clients: Client[];
  errorMessage: string | null = null;

  constructor (
    public dialogRef : MatDialogRef<LoanEditComponent>,
    private loanService : LoanService,
    private gameService : GameService,
    private clientService : ClientService,

  ) {}

  ngOnInit(): void {
    this.loan = new Loan();

    this.clientService.getClients().subscribe(
      clients => {
          this.clients = clients;
      });

    this.gameService.getGames().subscribe(
      games => {
          this.games = games;
      });
  }
  onSave() {
    this.loanService.saveLoan(this.loan).subscribe({
      next: (result) => { 
        this.errorMessage = null; 
        this.dialogRef.close(result); 
      },
      error: (error) => {
        this.errorMessage = error.message; //Sino dará un mensaje de error.
      }});

  }   

  onClose() {
    this.dialogRef.close();
  }

  


}
