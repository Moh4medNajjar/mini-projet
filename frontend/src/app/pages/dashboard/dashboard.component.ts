import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { WebRequestService } from '../../web-request.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [WebRequestService]
})
export class DashboardComponent {
  constructor(public WebReqService: WebRequestService){}
  searchedEmail: string = ""
  collaborators = [
  { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },

];
todo = [
  { title: 'Get to work', priority: 'medium' },
  { title: 'Pick up groceries', priority: 'low' },
  { title: 'Go home', priority: 'high' },
  { title: 'Fall asleep', priority: 'low' },
];

inProgress = [
  { title: 'Get up', priority: 'medium' },
  { title: 'Brush teeth', priority: 'low' },
  { title: 'Take a shower', priority: 'high' },
  { title: 'Check e-mail', priority: 'medium' },
  { title: 'Walk dog', priority: 'high' },
];

done = [
  { title: 'Get up', priority: 'low' },
  { title: 'Brush teeth', priority: 'medium' },
  { title: 'Take a shower', priority: 'high' },
  { title: 'Check e-mail', priority: 'medium' },
  { title: 'Walk dog', priority: 'low' },
];


  drop(event: CdkDragDrop<{ title: string; priority: string; }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#FF7575';
      case 'medium':
        return '#FFD166';
      case 'low':
        return '#A3D9A5';
      default:
        return '#CCCCCC';
    }
  }

  addCollaborator() {
    this.WebReqService.findCollab(this.searchedEmail).subscribe(
      (foundCollaborator) => {
        this.collaborators.push(foundCollaborator);
        console.log(foundCollaborator.username);
      },
      (error) => {
        console.error("Error finding collaborator:", error);
      }
    );
  }


}
