import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'editorise';
  public highlighList = ["Highlight (3-8min)", "Feature film (10-15min)", "Full length (30-60min)"]
  public userForm!: FormGroup;
  public successMessage!: string;
  public errorMessage!: string;
  public placeholderText!: string;
  constructor(private _fb: FormBuilder,
    private _userService: UserService) {
    this.initializeForm()
  }

  initializeForm() {
    this.userForm = this._fb.group({
      "studio_name": ['', Validators.required],
      "email": ['', Validators.required],
      "contact_number": ['', Validators.required],
      "couple_name": ['', Validators.required],
      "wedding_date": ['', Validators.required],
      "source_link": ['', Validators.required],
      "file_size": ['', Validators.required],
      "highlight": ['', Validators.required],
      "music_option": this._fb.array([this._fb.control(null)]),
      "order_date": ['', Validators.required],
      "description": ['', Validators.required]
    })
  }
  ngOnInit(): void {
    console.log('app initialized!!')
  }

  getMusicOptionformControls(): AbstractControl[] {
    return (<FormArray>this.userForm.get('music_option')).controls
  }

  addMusic() {
    (this.userForm.get("music_option") as FormArray).push(
      this._fb.control(null)
    )
  }

  removeMusic(index: any) {
    (this.userForm.get("music_option") as FormArray).removeAt(index)
  }

  removePlaceholder(value:string) {
    this.placeholderText = '';
  }

  setPlaceholder(value:string) {
    if (!this.userForm.get(value)?.value) {
      if (value === 'wedding_date') {
        this.placeholderText = 'Wedding date';
      } else {
        this.placeholderText = 'Order date'
      }
      
    }
  }

  onSubmit() {
    console.log(this.userForm.value)
    if (this.userForm.invalid) {
      return
    } else {
      this._userService.addUser(this.userForm.value).subscribe({
        next: (response: any) => {
          this.successMessage = 'Submitted successfully'
          setTimeout(() => {
            this.successMessage = ''
          }, 3000);
          
        },
        error: (error: any) => {
          console.log(error)
          this.errorMessage = 'Something went wrong. Please try again.'
          setTimeout(() => {
            this.errorMessage = ''
          }, 3000);

        }
      })
    }
  }

}
