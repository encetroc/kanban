import { Component, OnInit, OnDestroy  } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { Board } from '../board.model';
import { BoardService } from '../board.service';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../dialogs/board-dialog.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[]
  sub: Subscription

  constructor(private boardService: BoardService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sub = this.boardService.getUserBoards().subscribe(boards => this.boards = boards)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex)
    this.boardService.sortBoards(this.boards)
  }

  openBoardDialog() {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '400px',
      data: {}
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.boardService.createBoard({
          title: result,
          priority: this.boards.length
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
