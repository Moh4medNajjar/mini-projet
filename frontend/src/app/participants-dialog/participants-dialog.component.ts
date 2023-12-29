import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule ,FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { User } from '../user.model';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { WebRequestService } from './../web-request.service';
import { HttpClientModule } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './participants-dialog.component.html',
  styleUrl: './participants-dialog.component.scss',
  providers: [WebRequestService]
})
export class ParticipantsDialogComponent {

  addParticipantForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public allusers: string[] = [];
  participantCtrl = new FormControl('');
  filteredparticipants: Observable<string[]>;
  participants: string[] = [];
  private participantsNamesSet: Set<string> = new Set<string>();


  @ViewChild('participantInput') participantInput!: ElementRef<HTMLInputElement>;
  
  announcer = inject(LiveAnnouncer);
  constructor(public WebReqService : WebRequestService,
    private dialogRef: MatDialogRef<ParticipantsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { participantsNames: string[], ownerName: string },
    private fb: FormBuilder,
  ) {
    this.participantsNamesSet = new Set<string>(this.data.participantsNames);
    this.getAllUsers();

    this.addParticipantForm = this.fb.group({
      participant: [],
    });

    this.filteredparticipants = this.participantCtrl.valueChanges.pipe(
      startWith(null),
      map((participant: string | null) => (participant ? this._filter(participant) : this.allusers.slice())),
    );


  }


  getAllUsers() :void{
    
    this.WebReqService.getAllUsers().subscribe(
      (users: User[]) => {
        this.participants = this.data.participantsNames;
        this.allusers = users.map(user => user.username); 
        const ownerIndex = this.allusers.indexOf(this.data.ownerName);
        if (ownerIndex !== -1) {
          this.allusers.splice(ownerIndex, 1);
        }
      },
      (error) => {
        console.error('Error fetching all users:', error);
      }
    );
  }


  


   

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.allusers.includes(value)) {
      this.participants.push(value);
    }


    event.chipInput!.clear();

    this.participantCtrl.setValue(null);
  }

  remove(participant: string): void {
    const index = this.participants.indexOf(participant);

    if (index >= 0) {
      this.participants.splice(index, 1);
      console.log(this.data.participantsNames)
      this.announcer.announce(`Removed ${participant}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.participantsNamesSet.has(event.option.viewValue)) {
      this.participantsNamesSet.add(event.option.viewValue);
      this.participants.push(event.option.viewValue);
      this.participantInput.nativeElement.value = '';
      this.participantCtrl.setValue(null);}
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allusers.filter(participant => participant.toLowerCase().includes(filterValue));
  }



  save() {
    if (this.addParticipantForm.valid) {
      this.dialogRef.close(this.addParticipantForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
