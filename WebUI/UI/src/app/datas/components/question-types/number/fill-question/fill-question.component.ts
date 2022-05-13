import { Component, OnInit } from '@angular/core';
import { Question } from '@datas/models/base/question';
import { NumberQuestion } from '@datas/models/question-types/number-question';
import { NumberQuestionService } from '@datas/services/question-types/number/number-question.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageService } from '@shared/services/local-storage/local-storage.service';
import { SubmitService } from '@datas/services/submit/submit.service';
import { PrevNextService } from '@shared/services/prev-next/prev-next.service';

@Component({
  selector: 'app-fill-number-question',
  templateUrl: './fill-question.component.html',
  styleUrls: ['./fill-question.component.scss'],
})
export class FillQuestionComponent implements OnInit {
  formGroup: FormGroup;
  filledQuestion: Question;
  filledQuestionSettings: NumberQuestion;
  response: any;
  responses: any = [];

  constructor(private localStorageService: LocalStorageService, private submitService: SubmitService, public prevNextService: PrevNextService) {}

  ngOnInit(): void {
    this.responses = this.localStorageService.getResponses();
    this.filledQuestion = this.localStorageService.getFilledQuestion();
    this.filledQuestionSettings =
      this.localStorageService.getFilledQuestionSettings();
    this.response = this.getResponse();

    if (this.response) {
      this.createFormToFill();
      this.setResponse(this.response.value);
    } else {
      this.setResponse(null);
      this.createFormToFill();
    }
  }

  createFormToFill() {
    this.filledQuestionSettings =
      this.localStorageService.getFilledQuestionSettings();

    if (this.filledQuestionSettings.isRequired) {
      if (this.filledQuestionSettings.isMinNumber) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(this.getMinNumber()),
            Validators.max(2147483646),
            Validators.required,
          ]),
        });
      } else if (this.filledQuestionSettings.isMaxNumber) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(-2147483646),
            Validators.max(this.getMaxNumber()),
            Validators.required,
          ]),
        });
      } else if (
        this.filledQuestionSettings.isMinNumber &&
        this.filledQuestionSettings.isMaxNumber
      ) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(this.getMinNumber()),
            Validators.max(this.getMaxNumber()),
            Validators.required,
          ]),
        });
      } else {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(-2147483646),
            Validators.max(2147483646),
            Validators.required,
          ]),
        });
      }
    } else {
      if (this.filledQuestionSettings.isMinNumber) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(this.getMinNumber()),
            Validators.max(2147483646),
          ]),
        });
      } else if (this.filledQuestionSettings.isMaxNumber) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(-2147483646),
            Validators.max(this.getMaxNumber()),
          ]),
        });
      } else if (
        this.filledQuestionSettings.isMinNumber &&
        this.filledQuestionSettings.isMaxNumber
      ) {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(this.getMinNumber()),
            Validators.max(this.getMaxNumber()),
          ]),
        });
      } else {
        this.formGroup = new FormGroup({
          number: new FormControl(this.response.value, [
            Validators.min(-2147483646),
            Validators.max(2147483646),
          ]),
        });
      }
    }
  }

  setNumber(number) {
    this.setResponse(number.target.value);
  }

  setResponse(value) {
    let isComplete = false;
    let isThere = false;
    if (value) {
      if (this.formGroup.valid) {
        isComplete = true;
      }
    } else {
      if (!this.filledQuestionSettings.isRequired) {
        isComplete = true;
      }
    }

    for (let i = 0; i < this.responses.length; i++) {
      if (this.filledQuestion.id == this.responses[i].question.id) {
        this.responses[i].value = value;
        this.responses[i].isComplete = isComplete;
        isThere = true;
        break;
      }
    }
    if (!isThere) {
      this.response = {
        question: this.filledQuestion,
        questionSettings: this.filledQuestionSettings,
        value: value,
        isComplete: isComplete,
      };
      this.responses.push(this.response);
    }

    this.localStorageService.setResponses(this.responses);
  }

  getResponse() {
    for (let i = 0; i < this.responses.length; i++) {
      if (this.filledQuestion.id == this.responses[i].question.id) {
        this.response = this.responses[i];
        return this.response;
      }
    }

    this.response = null;
    return this.response;
  }

  isRequired() {
    return this.localStorageService.getFilledQuestionSettings().isRequired;
  }

  isSameQuestion() {
    if (
      this.filledQuestionSettings.questionId !=
      this.localStorageService.getFilledQuestionSettings().questionId
    ) {
      this.ngOnInit();
    }

    return true;
  }

  getMinNumber() {
    return this.localStorageService.getFilledQuestionSettings().minNumber;
  }

  getMaxNumber() {
    return this.localStorageService.getFilledQuestionSettings().maxNumber;
  }

  getIsMinNumber() {
    return this.localStorageService.getFilledQuestionSettings().isMinNumber;
  }

  getIsMaxNumber() {
    return this.localStorageService.getFilledQuestionSettings().isMaxNumber;
  }

  isLastQuestion() {
    return (
      this.filledQuestion.questionOrder ==
      this.localStorageService.getFilledForm().questions.length
    );
  }

  submit() {
    this.submitService.submitResponse(this.responses)
   }
}
